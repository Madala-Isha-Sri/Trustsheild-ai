import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from config import settings
from schemas.risk_schemas import RiskScoreRequest, RiskScoreResponse
from utils.exception_handlers import ModelNotFoundError
from utils.logger import logger

class RiskScoringService:
    def __init__(self):
        self.model = None
        self.feature_names: List[str] = []
        self.model_path = settings.get_absolute_path(settings.RISK_MODEL_PATH)
        self.load_model()

    def load_model(self):
        if not self.model_path.exists():
            logger.warning(f"Risk model not found at {self.model_path}")
            return
        
        try:
            artifact = joblib.load(self.model_path)
            if isinstance(artifact, dict):
                self.model = artifact.get("model")
                self.feature_names = artifact.get("feature_names", [])
            else:
                self.model = artifact
            logger.info(f"Successfully loaded Risk Scoring Model from {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading risk model artifact: {e}")
            self.model = None

    def is_ready(self) -> bool:
        return self.model is not None

    def predict_risk(self, request: RiskScoreRequest) -> RiskScoreResponse:
        if not self.is_ready():
            raise ModelNotFoundError(
                model_name="Risk Scoring (Agent 1)",
                model_path=str(self.model_path),
                training_command="python -m training.train_risk"
            )

        # Map request attributes to tabular feature dictionary matching IEEE dataset preprocessor
        feature_dict = {
            "TransactionAmt": request.transactionAmount,
            "refund_rate": request.refundRate or 0.0,
            "device_mismatch": 1 if request.deviceMismatch else 0,
            "country_mismatch": 1 if request.countryMismatch else 0,
            "account_age_days": request.accountAgeDays or 30,
            "transaction_hour": request.transactionHour or 12,
            "is_new_device": 1 if request.isNewDevice else 0,
            "velocity_24h": request.velocityCount24h or 1
        }

        # Build pandas DataFrame for model input
        df = pd.DataFrame([feature_dict])
        
        # Reindex features to match trained model if feature names exist
        if self.feature_names:
            for col in self.feature_names:
                if col not in df.columns:
                    df[col] = 0
            df = df[self.feature_names]

        # Calculate prediction probability using LightGBM / sklearn model
        try:
            probabilities = self.model.predict_proba(df)[0]
            fraud_prob = float(probabilities[1])
        except Exception as e:
            logger.warning(f"predict_proba unavailable or failed: {e}. Falling back to predict.")
            fraud_prob = float(self.model.predict(df)[0])

        risk_score = int(round(fraud_prob * 100.0))
        risk_score = max(0, min(100, risk_score))

        # Risk Level mapping
        if risk_score >= 70:
            risk_level = "High"
        elif risk_score >= 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Confidence calculation
        confidence = round(float(np.max(probabilities) * 100.0), 1) if 'probabilities' in locals() else 90.0

        # Feature explanation reasoning generator
        reasons: List[str] = []
        if (request.refundRate or 0.0) >= 0.3:
            reasons.append("High refund rate")
        if request.deviceMismatch:
            reasons.append("Device mismatch")
        if request.countryMismatch:
            reasons.append("Country origin mismatch")
        if (request.transactionAmount or 0.0) > 1000.0:
            reasons.append("Unusual transaction amount")
        if (request.accountAgeDays or 99) <= 5:
            reasons.append("Newly created buyer account")
        if (request.velocityCount24h or 0) >= 8:
            reasons.append("High 24h transaction velocity")

        if not reasons:
            if risk_score >= 70:
                reasons.append("High anomaly risk pattern detected in IEEE fraud features")
            else:
                reasons.append("Transaction behavior consistent with historical normal activity")

        return RiskScoreResponse(
            riskScore=risk_score,
            riskLevel=risk_level,
            confidence=confidence,
            reason=reasons
        )

risk_service = RiskScoringService()
