import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routes import risk, review, counterfeit, analytics, audit
from services.risk_service import risk_service
from services.review_service import review_service
from services.counterfeit_service import counterfeit_service
from utils.exception_handlers import ModelNotFoundError, model_not_found_exception_handler
from utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Marketplace Fraud Detection Multi-Agent API...")
    logger.info(f"Environment: {settings.ENV}")
    logger.info(f"Allowed CORS Origins: {settings.get_cors_origins()}")
    
    # Verify Model Readiness at Startup
    models_status = {
        "Agent 1 (Risk Scoring)": risk_service.is_ready(),
        "Agent 2 (Review Moderation)": review_service.is_ready(),
        "Agent 3 (Counterfeit Detection)": counterfeit_service.is_ready()
    }
    logger.info("Model Readiness Status:")
    for name, is_ready in models_status.items():
        status_str = "READY" if is_ready else "NOT TRAINED (Missing Artifact)"
        logger.info(f"  - {name}: {status_str}")
        
    yield
    logger.info("Shutting down Marketplace Fraud Detection API...")

app = FastAPI(
    title="Marketplace Fraud Detection Multi-Agent AI API",
    description=(
        "Production FastAPI backend for Marketplace Fraud Detection using 3 specialized AI Agents:\n\n"
        "- **Agent 1 (Risk Scoring)**: Predicts transaction fraud risk using LightGBM.\n"
        "- **Agent 2 (Review Moderation)**: Detects fake reviews using TF-IDF + Logistic Regression.\n"
        "- **Agent 3 (Counterfeit Detection)**: Classifies luxury product authenticity using EfficientNet-B0 / LightGBM."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS Middleware for React Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers
app.add_exception_handler(ModelNotFoundError, model_not_found_exception_handler)

# Request Timing & Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start_time) * 1000.0
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - {duration_ms:.2f}ms")
    return response

# Register API Router Modules
app.include_router(risk.router)
app.include_router(review.router)
app.include_router(counterfeit.router)
app.include_router(analytics.router)
app.include_router(audit.router)

@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Root API Endpoint",
    description="Returns API metadata and documentation links."
)
async def root():
    return {
        "service": "Marketplace Fraud Detection Multi-Agent AI Backend",
        "version": "1.0.0",
        "status": "Online",
        "documentation": "/docs",
        "agents": [
            "Agent 1: Risk Scoring (IEEE Fraud Dataset / LightGBM)",
            "Agent 2: Review Moderation (Fake Reviews Dataset / TF-IDF + Logistic Regression)",
            "Agent 3: Counterfeit Detection (Luxury Fashion Dataset / EfficientNet-B0 PyTorch)"
        ]
    }

@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Service Health & Model Status Check",
    description="Inspects availability and readiness of all 3 AI models and backend storage."
)
async def health_check():
    models_ready = {
        "risk_scoring": risk_service.is_ready(),
        "review_moderation": review_service.is_ready(),
        "counterfeit_detection": counterfeit_service.is_ready()
    }
    all_ready = all(models_ready.values())
    
    return {
        "status": "healthy" if all_ready else "degraded",
        "models_status": models_ready,
        "environment": settings.ENV,
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=True)
