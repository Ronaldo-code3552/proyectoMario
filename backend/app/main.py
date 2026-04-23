from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import test_database_connection
from app.schemas.common import HealthResponse, DatabaseHealthResponse

from app.controllers.empresa_controller import router as empresa_router
from app.controllers.persona_controller import router as persona_router
from app.controllers.proyecto_controller import router as proyecto_router
from app.controllers.document_controller import router as document_router


def build_allowed_origins() -> list[str]:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://proyectomario-4zc8.onrender.com",
        settings.FRONTEND_URL,
    ]
    return list(dict.fromkeys([o for o in origins if o]))


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Backend para gestión de expedientes empresariales, consumo de funciones PostgreSQL JSON y generación documental.",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=build_allowed_origins(),
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
        except Exception:
            raise HTTPException(status_code=500, detail="Error de conexión a BD")

    app.include_router(empresa_router)
    app.include_router(persona_router)
    app.include_router(proyecto_router)
    app.include_router(document_router)

    return app


app = create_app()