from pathlib import Path
from uuid import uuid4

from docxtpl import DocxTemplate

from app.mappers.proyecto_document_mapper import ProyectoDocumentMapper
from app.mappers.proyecto_document_mapper_v2 import ProyectoDocumentMapperV2
from app.repositories.proyecto_repository import ProyectoRepository


class DocumentGenerationService:
    @staticmethod
    def generate_proyecto_docx(proyecto_id: int) -> dict:
        data = ProyectoRepository.get_by_id_json(proyecto_id)

        if not data:
            return {
                "ok": False,
                "message": f"No se encontró información para el proyecto {proyecto_id}.",
                "data": None,
                "statusCode": 404,
            }

        context = ProyectoDocumentMapper.to_context(data)

        base_dir = Path(__file__).resolve().parents[1]
        template_path = base_dir / "template" / "ProyectoCorto.docx"
        output_dir = base_dir / "generated"
        output_dir.mkdir(parents=True, exist_ok=True)

        nombre_empresa = context.get("RAZON_SOCIAL") or context.get("NOMBRE_EMPRESA") or f"proyecto_{proyecto_id}"
        safe_name = "".join(c if c.isalnum() or c in ("_", "-") else "_" for c in nombre_empresa)
        output_path = output_dir / f"{safe_name}_{proyecto_id}_{uuid4().hex[:8]}.docx"

        doc = DocxTemplate(str(template_path))
        doc.render(context)
        doc.save(str(output_path))

        return {
            "ok": True,
            "message": "Documento generado correctamente.",
            "data": {
                "version": "v1",
                "proyectoId": proyecto_id,
                "fileName": output_path.name,
                "filePath": str(output_path),
                "context": context,
            },
        }

    @staticmethod
    def _build_proyecto_docx_v2(proyecto_id: int) -> dict:
        data = ProyectoRepository.get_by_id_json_v2(proyecto_id)

        if not data:
            return {
                "ok": False,
                "message": f"No se encontró información para el proyecto {proyecto_id}.",
                "data": None,
                "statusCode": 404,
            }

        context = ProyectoDocumentMapperV2.to_context(data)

        base_dir = Path(__file__).resolve().parents[1]
        template_path = base_dir / "template" / "ProyectoCorto.docx"

        if not template_path.exists() or not template_path.is_file():
            return {
                "ok": False,
                "message": "No se encontró la plantilla DOCX configurada.",
                "data": None,
                "statusCode": 500,
            }

        output_dir = base_dir / "generated"
        output_dir.mkdir(parents=True, exist_ok=True)

        nombre_empresa = context.get("RAZON_SOCIAL") or context.get("NOMBRE_EMPRESA") or f"proyecto_{proyecto_id}"
        safe_name = "".join(c if c.isalnum() or c in ("_", "-") else "_" for c in nombre_empresa)
        output_path = output_dir / f"{safe_name}_{proyecto_id}_v2_{uuid4().hex[:8]}.docx"

        doc = DocxTemplate(str(template_path))
        doc.render(context)
        doc.save(str(output_path))

        if not output_path.exists() or not output_path.is_file():
            return {
                "ok": False,
                "message": "El archivo DOCX V2 no pudo ser generado correctamente.",
                "data": {
                    "version": "v2",
                    "proyectoId": proyecto_id,
                    "fileName": output_path.name,
                    "filePath": str(output_path),
                    "context": context,
                },
                "statusCode": 500,
            }

        return {
            "ok": True,
            "message": "Documento V2 generado correctamente.",
            "data": {
                "version": "v2",
                "proyectoId": proyecto_id,
                "fileName": output_path.name,
                "filePath": str(output_path),
                "context": context,
            },
        }

    @staticmethod
    def generate_proyecto_docx_v2(proyecto_id: int) -> dict:
        return DocumentGenerationService._build_proyecto_docx_v2(proyecto_id)

    @staticmethod
    def generate_proyecto_docx_v2_file(proyecto_id: int) -> dict:
        result = DocumentGenerationService._build_proyecto_docx_v2(proyecto_id)

        if not result.get("ok", False):
            return result

        data = result.get("data") or {}
        file_path = data.get("filePath")

        if not file_path:
            return {
                "ok": False,
                "message": "La generación del documento no devolvió una ruta de archivo válida.",
                "data": data,
                "statusCode": 500,
            }

        path = Path(file_path)

        if not path.exists() or not path.is_file():
            return {
                "ok": False,
                "message": "El archivo DOCX generado no existe o no está disponible para descarga.",
                "data": data,
                "statusCode": 500,
            }

        return result