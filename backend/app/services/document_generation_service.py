from pathlib import Path
from uuid import uuid4

from docxtpl import DocxTemplate

from app.mappers.proyecto_document_mapper import ProyectoDocumentMapper
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
                "proyectoId": proyecto_id,
                "fileName": output_path.name,
                "filePath": str(output_path),
                "context": context,
            },
        }