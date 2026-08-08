import time
from fastapi import APIRouter, HTTPException, status
from schemas.risk_schemas import RiskScoreRequest, RiskScoreResponse
from services.risk_service import risk_service
from services.audit_service import audit_service
from utils.logger import logger

router = APIRouter(tags=["Agent 1 - Risk Scoring"])

@router.post(
    "/risk-score",
    response_model=RiskScoreResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate transaction risk score using Agent 1 (LightGBM)",
    description="Predicts fraud probability score (0-100), categorical risk level, confidence, and primary explanation reasons."
)
async def evaluate_risk_score(request: RiskScoreRequest) -> RiskScoreResponse:
    start_time = time.time()
    logger.info(f"POST /risk-score received for amount: ${request.transactionAmount}")
    
    response = risk_service.predict_risk(request)
    exec_time_ms = (time.time() - start_time) * 1000.0

    # Audit logging
    audit_service.log_event(
        agent_name="Risk Scoring",
        endpoint="/risk-score",
        input_summary=request.model_dump(),
        output_summary=response.model_dump(),
        execution_time_ms=exec_time_ms
    )

    return response
