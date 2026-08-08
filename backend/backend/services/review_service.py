import os
import joblib
from abc import ABC, abstractmethod
from typing import Dict, Any
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from config import settings
from schemas.review_schemas import ReviewAnalysisRequest, ReviewAnalysisResponse
from utils.exception_handlers import ModelNotFoundError
from utils.logger import logger

class BaseReviewModerator(ABC):
    @abstractmethod
    def analyze_review(self, request: ReviewAnalysisRequest) -> ReviewAnalysisResponse:
        pass

class TFIDFReviewModerator(BaseReviewModerator):
    """
    TF-IDF + Logistic Regression implementation of Agent 2 Review Moderation.
    Designed behind BaseReviewModerator so a DistilBERT model can be swapped in seamlessly.
    """
    def __init__(self):
        self.pipeline = None
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.model_path = settings.get_absolute_path(settings.REVIEW_MODEL_PATH)
        self.load_model()

    def load_model(self):
        if not self.model_path.exists():
            logger.warning(f"Review moderation model missing at {self.model_path}")
            return
        
        try:
            self.pipeline = joblib.load(self.model_path)
            logger.info(f"Loaded TF-IDF Review Moderation Model from {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading review model: {e}")
            self.pipeline = None

    def is_ready(self) -> bool:
        return self.pipeline is not None

    def analyze_review(self, request: ReviewAnalysisRequest) -> ReviewAnalysisResponse:
        if not self.is_ready():
            raise ModelNotFoundError(
                model_name="Review Moderation (Agent 2)",
                model_path=str(self.model_path),
                training_command="python -m training.train_review"
            )

        text = request.reviewText.strip()

        # Run model inference (predict probability of fake review)
        try:
            probabilities = self.pipeline.predict_proba([text])[0]
            fake_prob = float(probabilities[1]) * 100.0
        except Exception as e:
            logger.warning(f"TF-IDF model probability estimation error: {e}")
            fake_prob = 50.0

        fake_probability = round(fake_prob, 1)
        is_spam = fake_probability >= 50.0

        # Sentiment Analysis using VADER
        vs = self.sentiment_analyzer.polarity_scores(text)
        compound = vs['compound']
        if compound >= 0.05:
            sentiment = "Positive"
        elif compound <= -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        return ReviewAnalysisResponse(
            fakeProbability=fake_probability,
            spam=is_spam,
            sentiment=sentiment
        )

# Instantiate singleton service instance
review_service = TFIDFReviewModerator()
