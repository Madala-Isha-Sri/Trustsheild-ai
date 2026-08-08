from fastapi import APIRouter, Query, status
from schemas.audit_schemas import AuditLogsResponse
from services.audit_service import audit_service

router = APIRouter(tags=["Audit & Compliance"])

@router.get(
    "/audit-logs",
    response_model=AuditLogsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get recent multi-agent evaluation audit logs",
    description="Returns full execution history of agent requests, inputs, outputs, and latencies."
)
async def get_audit_logs(
    limit: int = Query(default=50, ge=1, le=500, description="Max audit logs to return")
) -> AuditLogsResponse:
    return audit_service.get_logs(limit=limit)
