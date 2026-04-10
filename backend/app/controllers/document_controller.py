from fastapi import APIRouter, HTTPException

from app.services.document_generation_service import DocumentGenerationService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/proyectos/{proyecto_id}/docx")
def generate_proyecto_docx(proyecto_id: int):
    result = DocumentGenerationService.generate_proyecto_docx(proyecto_id)

    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result["message"])

    return result