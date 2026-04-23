from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.services.document_generation_service import DocumentGenerationService

router = APIRouter(prefix="/documents", tags=["Documents"])

DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


@router.post("/proyectos/{proyecto_id}/docx")
def generate_proyecto_docx(proyecto_id: int):
    result = DocumentGenerationService.generate_proyecto_docx(proyecto_id)

    if not result.get("ok", False):
        raise HTTPException(status_code=404, detail=result.get("message", "No se pudo generar el documento."))

    return result


@router.post("/proyectos/{proyecto_id}/docx/v2")
def generate_proyecto_docx_v2(proyecto_id: int):
    result = DocumentGenerationService.generate_proyecto_docx_v2(proyecto_id)

    if not result.get("ok", False):
        raise HTTPException(status_code=404, detail=result.get("message", "No se pudo generar el documento V2."))

    return result


@router.post("/proyectos/{proyecto_id}/docx/v2/download")
def download_proyecto_docx_v2(proyecto_id: int):
    result = DocumentGenerationService.generate_proyecto_docx_v2_file(proyecto_id)

    if not result.get("ok", False):
        message = result.get("message", "No se pudo generar el documento V2 para descarga.")
        status_code = result.get("statusCode", 404)
        raise HTTPException(status_code=status_code, detail=message)

    data = result.get("data") or {}
    file_path = data.get("filePath")
    file_name = data.get("fileName") or f"proyecto_{proyecto_id}_v2.docx"

    if not file_path:
        raise HTTPException(
            status_code=500,
            detail="La generación del documento no devolvió una ruta de archivo válida.",
        )

    path = Path(file_path)

    if not path.exists() or not path.is_file():
        raise HTTPException(
            status_code=500,
            detail="El archivo DOCX generado no existe o no está disponible para descarga.",
        )

    return FileResponse(
        path=str(path),
        media_type=DOCX_MEDIA_TYPE,
        filename=file_name,
    )