import time
from fastapi import APIRouter, HTTPException, status
from schemas.review_schemas import ReviewAnalysisRequest, ReviewAnalysisResponse
from services.review_service import review_service
from services.audit_service import audit_service
from utils.logger import logger

router = APIRouter(tags=["Agent 2 - Review Moderation"])

@router.post(
    "/review-analysis",
    response_model=ReviewAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze review text using Agent 2 (TF-IDF + Logistic Regression)",
    description="Detects fake reviews, computes fake probability, evaluates spam status, and analyzes text sentiment."
)
async def analyze_review(request: ReviewAnalysisRequest) -> ReviewAnalysisResponse:
    start_time = time.time()
    logger.info("POST /review-analysis received")
    
    response = review_service.analyze_review(request)
    exec_time_ms = (time.time() - start_time) * 1000.0

    # Audit logging
    audit_service.log_event(
        agent_name="Review Moderation",
        endpoint="/review-analysis",
        input_summary=request.model_dump(),
        output_summary=response.model_dump(),
        execution_time_ms=exec_time_ms
    )

    return response
