from fastapi import Request, status
from fastapi.responses import JSONResponse
from utils.logger import logger

class ModelNotFoundError(Exception):
    def __init__(self, model_name: str, model_path: str, training_command: str):
        self.model_name = model_name
        self.model_path = model_path
        self.training_command = training_command
        self.message = (
            f"Trained model for '{model_name}' is missing at location '{model_path}'. "
            f"Please run the training script to generate the model artifact: `{training_command}`"
        )
        super().__init__(self.message)

async def model_not_found_exception_handler(request: Request, exc: ModelNotFoundError):
    logger.warning(f"503 Service Unavailable - {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Model Not Found",
            "message": exc.message,
            "details": {
                "model_name": exc.model_name,
                "model_path": exc.model_path,
                "training_command": exc.training_command,
            }
        }
    )
