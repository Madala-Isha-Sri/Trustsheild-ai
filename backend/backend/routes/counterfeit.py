import time
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Body, status, HTTPException
from schemas.counterfeit_schemas import CounterfeitDetectResponse, CounterfeitTabularRequest
from services.counterfeit_service import counterfeit_service
from services.audit_service import audit_service
from utils.logger import logger

router = APIRouter(tags=["Agent 3 - Counterfeit Detection"])

@router.post(
    "/counterfeit-detect",
    response_model=CounterfeitDetectResponse,
    status_code=status.HTTP_200_OK,
    summary="Detect counterfeit luxury goods using Agent 3 (EfficientNet-B0 / LightGBM)",
    description="Accepts product image upload or tabular metadata parameters to classify item as 'Counterfeit' or 'Authentic'."
)
async def detect_counterfeit(
    file: Optional[UploadFile] = File(None),
    tabular_data: Optional[CounterfeitTabularRequest] = Body(None)
) -> CounterfeitDetectResponse:
    start_time = time.time()
    logger.info("POST /counterfeit-detect received")

    if file is not None:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        response = counterfeit_service.detect_from_image(content)
        input_info = {"filename": file.filename, "content_type": file.content_type, "input_type": "image"}
    elif tabular_data is not None:
        response = counterfeit_service.detect_from_tabular(tabular_data)
        input_info = tabular_data.model_dump()
        input_info["input_type"] = "tabular"
    else:
        # Default fallback to tabular defaults if no payload provided
        response = counterfeit_service.detect_from_tabular(CounterfeitTabularRequest())
        input_info = {"input_type": "default_tabular"}

    exec_time_ms = (time.time() - start_time) * 1000.0

    audit_service.log_event(
        agent_name="Counterfeit Detection",
        endpoint="/counterfeit-detect",
        input_summary=input_info,
        output_summary=response.model_dump(),
        execution_time_ms=exec_time_ms
    )

    return response
