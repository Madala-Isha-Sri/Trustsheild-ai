from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class AuditLogEntry(BaseModel):
    id: str = Field(..., description="Unique audit record identifier")
    timestamp: str = Field(..., description="ISO 8601 timestamp")
    agentName: str = Field(..., description="Agent responsible (Risk Scoring, Review Moderation, Counterfeit Detection)")
    endpoint: str = Field(..., description="API endpoint called")
    inputSummary: Dict[str, Any] = Field(..., description="Summary of request inputs")
    outputSummary: Dict[str, Any] = Field(..., description="Agent prediction result")
    executionTimeMs: float = Field(..., description="Model inference latency in milliseconds")
    status: str = Field(default="SUCCESS", description="Execution status")

class AuditLogsResponse(BaseModel):
    totalLogs: int
    logs: List[AuditLogEntry]
