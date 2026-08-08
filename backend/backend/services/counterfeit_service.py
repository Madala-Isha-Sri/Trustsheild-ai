import io
import os
import joblib
from typing import Optional, Dict, Any, Union
from PIL import Image

try:
    import torch
    import torch.nn as nn
    import torchvision.transforms as transforms
    import torchvision.models as models
    HAS_TORCHVISION = True
except ImportError:
    HAS_TORCHVISION = False

from config import settings
from schemas.counterfeit_schemas import CounterfeitDetectResponse, CounterfeitTabularRequest
from utils.exception_handlers import ModelNotFoundError
from utils.logger import logger

class CounterfeitDetectionService:
    """
    Agent 3 Counterfeit Detection Service.
    Supports PyTorch EfficientNet-B0 image model and LightGBM tabular model.
    """
    def __init__(self):
        self.image_model = None
        self.tabular_model = None
        self.mode = None  # 'image' or 'tabular'
        
        self.image_model_path = settings.get_absolute_path(settings.COUNTERFEIT_MODEL_PATH)
        self.tabular_model_path = settings.get_absolute_path(settings.COUNTERFEIT_TABULAR_MODEL_PATH)

        # Image Preprocessing transforms for EfficientNet-B0
        if HAS_TORCHVISION:
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
        else:
            self.transform = None

        self.load_model()

    def load_model(self):
        # 1. Try loading PyTorch EfficientNet Image Model
        if HAS_TORCHVISION and self.image_model_path.exists():
            try:
                # Initialize EfficientNet-B0 architecture
                model = models.efficientnet_b0(weights=None)
                num_features = model.classifier[1].in_features
                model.classifier[1] = nn.Linear(num_features, 2)  # Binary classification: Authentic vs Counterfeit
                
                device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                state_dict = torch.load(self.image_model_path, map_location=device)
                model.load_state_dict(state_dict)
                model.eval()
                
                self.image_model = model
                self.mode = "image"
                logger.info(f"Loaded EfficientNet-B0 Image Model from {self.image_model_path}")
                return
            except Exception as e:
                logger.error(f"Error loading PyTorch counterfeit image model: {e}")

        # 2. Try loading LightGBM Tabular Model
        if self.tabular_model_path.exists():
            try:
                self.tabular_model = joblib.load(self.tabular_model_path)
                self.mode = "tabular"
                logger.info(f"Loaded Tabular LightGBM Counterfeit Model from {self.tabular_model_path}")
                return
            except Exception as e:
                logger.error(f"Error loading tabular counterfeit model: {e}")

        logger.warning("No counterfeit model found (neither PyTorch .pth nor LightGBM .joblib).")

    def is_ready(self) -> bool:
        return self.image_model is not None or self.tabular_model is not None

    def detect_from_image(self, image_bytes: bytes) -> CounterfeitDetectResponse:
        if not self.is_ready() or self.image_model is None:
            # Fallback check if only tabular model is available
            if self.tabular_model is not None:
                # evaluate default tabular heuristics
                return self.detect_from_tabular(CounterfeitTabularRequest())

            raise ModelNotFoundError(
                model_name="Counterfeit Detection (Agent 3)",
                model_path=str(self.image_model_path),
                training_command="python -m training.train_counterfeit"
            )

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            tensor = self.transform(image).unsqueeze(0)

            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.image_model.to(device)
            tensor = tensor.to(device)

            with torch.no_grad():
                outputs = self.image_model(tensor)
                probabilities = torch.softmax(outputs, dim=1)[0]
                
                # Classes: 0 -> Authentic, 1 -> Counterfeit
                counterfeit_prob = float(probabilities[1].item())
                authentic_prob = float(probabilities[0].item())

            if counterfeit_prob >= 0.5:
                prediction = "Counterfeit"
                confidence = round(counterfeit_prob * 100.0, 1)
            else:
                prediction = "Authentic"
                confidence = round(authentic_prob * 100.0, 1)

            return CounterfeitDetectResponse(
                prediction=prediction,
                confidence=confidence,
                details={
                    "model_type": "EfficientNet-B0",
                    "counterfeit_probability": round(counterfeit_prob * 100.0, 2)
                }
            )
        except Exception as e:
            logger.error(f"Image evaluation failed: {e}")
            raise RuntimeError(f"Failed to process image for counterfeit detection: {e}")

    def detect_from_tabular(self, request: CounterfeitTabularRequest) -> CounterfeitDetectResponse:
        if not self.is_ready():
            raise ModelNotFoundError(
                model_name="Counterfeit Detection (Agent 3)",
                model_path=str(self.image_model_path if self.mode == "image" else self.tabular_model_path),
                training_command="python -m training.train_counterfeit"
            )

        import pandas as pd
        data = {
            "priceUSD": request.priceUSD or 100.0,
            "originalMSRP": request.originalMSRP or 1000.0,
            "discount_ratio": (request.priceUSD or 100.0) / max(1.0, request.originalMSRP or 1000.0),
            "sellerRating": request.sellerRating or 3.0,
            "serialNumberProvided": 1 if request.serialNumberProvided else 0,
            "materialQualityScore": request.materialQualityScore or 0.5
        }
        df = pd.DataFrame([data])

        if self.tabular_model is not None:
            try:
                probs = self.tabular_model.predict_proba(df)[0]
                counterfeit_prob = float(probs[1])
            except Exception:
                counterfeit_prob = float(self.tabular_model.predict(df)[0])
        else:
            # Fallback heuristic calculation if tabular model not explicit
            discount = data["discount_ratio"]
            serial = data["serialNumberProvided"]
            rating = data["sellerRating"]
            risk_val = (1.0 - discount) * 0.4 + (1 - serial) * 0.3 + (5.0 - rating)/5.0 * 0.3
            counterfeit_prob = min(0.99, max(0.01, risk_val))

        if counterfeit_prob >= 0.5:
            prediction = "Counterfeit"
            confidence = round(counterfeit_prob * 100.0, 1)
        else:
            prediction = "Authentic"
            confidence = round((1.0 - counterfeit_prob) * 100.0, 1)

        return CounterfeitDetectResponse(
            prediction=prediction,
            confidence=confidence,
            details={
                "model_type": "LightGBM Tabular",
                "counterfeit_probability": round(counterfeit_prob * 100.0, 2)
            }
        )

counterfeit_service = CounterfeitDetectionService()
