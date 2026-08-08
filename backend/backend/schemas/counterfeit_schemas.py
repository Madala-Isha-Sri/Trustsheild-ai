from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class CounterfeitTabularRequest(BaseModel):
    brand: Optional[str] = Field(default="Gucci", description="Brand name of the fashion item")
    priceUSD: Optional[float] = Field(default=120.0, description="Listing price in USD")
    originalMSRP: Optional[float] = Field(default=1800.0, description="Official original retail MSRP")
    sellerRating: Optional[float] = Field(default=3.2, description="Seller feedback rating (0-5)")
    serialNumberProvided: Optional[bool] = Field(default=False, description="Whether authenticity serial number is verified")
    materialQualityScore: Optional[float] = Field(default=0.3, description="Evaluated material score (0-1.0)")

class CounterfeitDetectResponse(BaseModel):
    prediction: str = Field(..., description="Classification output: 'Counterfeit' or 'Authentic'")
    confidence: float = Field(..., description="Model confidence score (0-100%)")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Optional metadata or visual feature breakdown")
