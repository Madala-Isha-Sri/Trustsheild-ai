from fastapi import APIRouter, status
from schemas.analytics_schemas import AnalyticsResponse
from services.analytics_service import analytics_service

router = APIRouter(tags=["Analytics & Reporting"])

@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get marketplace fraud analytics summary",
    description="Returns aggregated metrics, agent performance breakdowns, and risk distribution metrics."
)
async def get_analytics() -> AnalyticsResponse:
    return analytics_service.get_analytics()
