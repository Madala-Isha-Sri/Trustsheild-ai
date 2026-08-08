from typing import Dict, Any
from pydantic import BaseModel, Field

class AgentPerformanceMetric(BaseModel):
    totalScans: int
    flaggedFraud: int
    fraudPercentage: float
    avgConfidence: float

class AnalyticsResponse(BaseModel):
    totalRequests: int = Field(..., description="Total AI agent evaluation requests handled")
    highRiskTransactions: int = Field(..., description="Total transactions flagged as High Risk")
    fakeReviewsDetected: int = Field(..., description="Total fake reviews detected")
    counterfeitsFlagged: int = Field(..., description="Total counterfeit luxury goods detected")
    agentMetrics: Dict[str, AgentPerformanceMetric] = Field(..., description="Per-agent analytics breakdown")
    riskDistribution: Dict[str, int] = Field(..., description="Distribution of risk levels (Low, Medium, High)")
