from typing import Any

from app.repositories.empresa_reportes_repository import EmpresaReportesRepository


class EmpresaReportesService:
    @staticmethod
    def create_sunat_deuda(sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_sunat_deuda(sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar la deuda SUNAT.", "data": None}
        return {"ok": True, "message": "Deuda SUNAT registrada correctamente.", "data": row}

    @staticmethod
    def create_sunat_omision(sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_sunat_omision(sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar la omisión SUNAT.", "data": None}
        return {"ok": True, "message": "Omisión SUNAT registrada correctamente.", "data": row}

    @staticmethod
    def create_representante_legal(empresa_sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_representante_legal(empresa_sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar el representante legal.", "data": None}
        return {"ok": True, "message": "Representante legal registrado correctamente.", "data": row}

    @staticmethod
    def create_reporte_expediente(sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_reporte_expediente(sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar el reporte expediente.", "data": None}
        return {"ok": True, "message": "Reporte expediente registrado correctamente.", "data": row}

    @staticmethod
    def create_reporte_lista_simple(sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_reporte_lista_simple(sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar el reporte lista simple.", "data": None}
        return {"ok": True, "message": "Reporte lista simple registrado correctamente.", "data": row}

    @staticmethod
    def create_reporte_ministerio_vivienda(sujeto_id: int, payload: dict) -> Any:
        row = EmpresaReportesRepository.create_reporte_ministerio_vivienda(sujeto_id, payload)
        if not row:
            return {"ok": False, "message": "No se pudo registrar el reporte ministerio vivienda.", "data": None}
        return {"ok": True, "message": "Reporte ministerio vivienda registrado correctamente.", "data": row}