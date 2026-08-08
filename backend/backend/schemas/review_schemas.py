from typing import Optional
from pydantic import BaseModel, Field

class ReviewAnalysisRequest(BaseModel):
    reviewText: str = Field(..., description="Review text content to analyze", example="AMAZING PRODUCT!!! BEST PURCHASE EVER MUST BUY RIGHT NOW 10/10!!!!!")
    rating: Optional[float] = Field(default=5.0, description="Star rating given by reviewer (1.0 - 5.0)")
    userVerified: Optional[bool] = Field(default=False, description="Whether reviewer is a verified purchaser")
    userTotalReviews: Optional[int] = Field(default=1, description="Total reviews submitted by this user account")

    model_config = {
        "json_schema_extra": {
            "example": {
                "reviewText": "This is completely fake and automated text generated for spamming sellers.",
                "rating": 5.0,
                "userVerified": False,
                "userTotalReviews": 45
            }
        }
    }

class ReviewAnalysisResponse(BaseModel):
    fakeProbability: float = Field(..., description="Probability of review being fake/manipulated (0-100%)")
    spam: bool = Field(..., description="Boolean flag indicating if review is classified as spam")
    sentiment: str = Field(..., description="Sentiment classification: Positive, Negative, or Neutral")
