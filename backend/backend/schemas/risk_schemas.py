from typing import List, Optional
from pydantic import BaseModel, Field

class RiskScoreRequest(BaseModel):
    transactionAmount: float = Field(..., description="Transaction amount in USD", example=1450.50)
    cardType: Optional[str] = Field(default="visa", description="Credit card brand/type")
    deviceMismatch: Optional[bool] = Field(default=False, description="Flag if device location/IP does not match card billing location")
    countryMismatch: Optional[bool] = Field(default=False, description="Flag if transaction country differs from account origin")
    refundRate: Optional[float] = Field(default=0.05, description="Historical refund rate (0.0 to 1.0)", example=0.45)
    accountAgeDays: Optional[int] = Field(default=30, description="Age of the buyer account in days", example=2)
    transactionHour: Optional[int] = Field(default=14, description="Hour of the transaction (0-23)")
    isNewDevice: Optional[bool] = Field(default=False, description="Flag if new unrecognized device used")
    velocityCount24h: Optional[int] = Field(default=1, description="Number of transactions initiated in past 24 hours")

    model_config = {
        "json_schema_extra": {
            "example": {
                "transactionAmount": 1250.00,
                "cardType": "mastercard",
                "deviceMismatch": True,
                "countryMismatch": True,
                "refundRate": 0.55,
                "accountAgeDays": 3,
                "transactionHour": 3,
                "isNewDevice": True,
                "velocityCount24h": 12
            }
        }
    }

class RiskScoreResponse(BaseModel):
    riskScore: int = Field(..., description="Calculated risk score from 0 (Safe) to 100 (Severe Fraud risk)")
    riskLevel: str = Field(..., description="Categorical risk level: Low, Medium, High")
    confidence: float = Field(..., description="Model confidence percentage (0-100%)")
    reason: List[str] = Field(..., description="Top explanation factors driving the risk score")
