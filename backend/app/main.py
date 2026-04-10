from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import test_database_connection
from app.schemas.common import HealthResponse, DatabaseHealthResponse

from app.controllers.empresa_controller import router as empresa_router
from app.controllers.persona_controller import router as persona_router
from app.controllers.proyecto_controller import router as proyecto_router
from app.controllers.document_controller import router as document_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Microservicio para consumir funciones PostgreSQL de Empresa, Persona y Proyecto.",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=HealthResponse, tags=["Health"])
def root():
    return HealthResponse(ok=True, message="Mario API operativa")

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(ok=True, message="Servicio activo")

@app.get("/health/db", response_model=DatabaseHealthResponse, tags=["Health"])
def health_db():
    try:
        db_result = test_database_connection()
        return DatabaseHealthResponse(**db_result)
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error de conexión a BD: {str(ex)}")

app.include_router(empresa_router)
app.include_router(persona_router)
app.include_router(proyecto_router)
app.include_router(document_router)