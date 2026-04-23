from fastapi import APIRouter, Body, HTTPException, Query

from app.schemas.persona import (
    PersonaCreateRequest,
    PersonaUpdateRequest,
    PersonaJsonResponse,
    PersonaMutationResponse,
)
from app.schemas.persona_reportes import (
    ReporteExpedienteCreateRequest,
    ReporteListaSimpleCreateRequest,
    ReporteMinisterioViviendaCreateRequest,
    ReporteMutationResponse,
)
from app.services.persona_service import PersonaService
from app.services.persona_reportes_service import PersonaReportesService

router = APIRouter(prefix="/personas", tags=["Personas"])


def _ensure_ok(result, status_code: int, default_message: str):
    if not result or not result.get("ok", False):
        raise HTTPException(
            status_code=status_code,
            detail=(result or {}).get("message", default_message),
        )
    return result


@router.get("", response_model=PersonaJsonResponse)
def get_personas(
    page_number: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    search_term: str | None = Query(None),
):
    try:
        result = PersonaService.get_all(page_number, page_size, search_term)
        return PersonaJsonResponse(ok=True, data=result)
    except Exception:
        raise HTTPException(status_code=500, detail="Error al consultar personas.")


@router.get("/{persona_id}", response_model=PersonaJsonResponse)
def get_persona_by_id(persona_id: int):
    try:
        result = PersonaService.get_by_id(persona_id)

        if not result:
            raise HTTPException(status_code=404, detail="Persona no encontrada.")

        return PersonaJsonResponse(ok=True, data=result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al consultar persona.")


@router.post("", response_model=PersonaMutationResponse)
def create_persona(request: PersonaCreateRequest = Body(...)):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaService.create(payload)
        result = _ensure_ok(result, 400, "No se pudo crear la persona.")

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al crear persona.")


@router.put("/{persona_id}", response_model=PersonaMutationResponse)
def update_persona(persona_id: int, request: PersonaUpdateRequest = Body(...)):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaService.update(persona_id, payload)
        result = _ensure_ok(result, 400, "No se pudo actualizar la persona.")

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al actualizar persona.")


@router.delete("/{persona_id}", response_model=PersonaMutationResponse)
def delete_persona(persona_id: int, force: bool = Query(False)):
    try:
        result = PersonaService.delete(persona_id, force)
        result = _ensure_ok(result, 400, "No se pudo eliminar la persona.")

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al eliminar persona.")


@router.post("/{sujeto_id}/reportes-expediente", response_model=ReporteMutationResponse)
def create_reporte_expediente(
    sujeto_id: int,
    request: ReporteExpedienteCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_expediente(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte expediente.")

        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte expediente.")


@router.post("/{sujeto_id}/reportes-lista-simple", response_model=ReporteMutationResponse)
def create_reporte_lista_simple(
    sujeto_id: int,
    request: ReporteListaSimpleCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_lista_simple(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte lista simple.")

        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte lista simple.")


@router.post("/{sujeto_id}/reportes-ministerio-vivienda", response_model=ReporteMutationResponse)
def create_reporte_ministerio_vivienda(
    sujeto_id: int,
    request: ReporteMinisterioViviendaCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_ministerio_vivienda(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte ministerio vivienda.")

        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte ministerio vivienda.")