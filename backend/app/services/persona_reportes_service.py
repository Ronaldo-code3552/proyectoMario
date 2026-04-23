from typing import Any

from app.repositories.persona_reportes_repository import PersonaReportesRepository


class PersonaReportesService:
    @staticmethod
    def create_reporte_expediente(sujeto_id: int, payload: dict) -> Any:
        row = PersonaReportesRepository.create_reporte_expediente(sujeto_id, payload)
        if not row:
            return {
                "ok": False,
                "message": "No se pudo registrar el reporte expediente.",
                "data": None,
            }
        return {
            "ok": True,
            "message": "Reporte expediente registrado correctamente.",
            "data": row,
        }

    @staticmethod
    def create_reporte_lista_simple(sujeto_id: int, payload: dict) -> Any:
        row = PersonaReportesRepository.create_reporte_lista_simple(sujeto_id, payload)
        if not row:
            return {
                "ok": False,
                "message": "No se pudo registrar el reporte de lista simple.",
                "data": None,
            }
        return {
            "ok": True,
            "message": "Reporte de lista simple registrado correctamente.",
            "data": row,
        }

    @staticmethod
    def create_reporte_ministerio_vivienda(sujeto_id: int, payload: dict) -> Any:
        row = PersonaReportesRepository.create_reporte_ministerio_vivienda(sujeto_id, payload)
        if not row:
            return {
                "ok": False,
                "message": "No se pudo registrar el reporte de ministerio vivienda.",
                "data": None,
            }
        return {
            "ok": True,
            "message": "Reporte de ministerio vivienda registrado correctamente.",
            "data": row,
        }