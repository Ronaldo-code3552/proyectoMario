from fastapi import APIRouter, Body, HTTPException, Query

from app.schemas.persona import (
    PersonaGetAllQuery,
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


@router.get("", response_model=PersonaJsonResponse)
def get_personas(
    page_number: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    search_term: str | None = Query(None),
):
    try:
        result = PersonaService.get_all(page_number, page_size, search_term)
        return PersonaJsonResponse(ok=True, data=result)
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al consultar personas: {str(ex)}")


@router.get("/{persona_id}", response_model=PersonaJsonResponse)
def get_persona_by_id(persona_id: int):
    try:
        result = PersonaService.get_by_id(persona_id)
        if not result:
            raise HTTPException(status_code=404, detail="Persona no encontrada.")
        return PersonaJsonResponse(ok=True, data=result)
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al consultar persona: {str(ex)}")


@router.post("", response_model=PersonaMutationResponse)
def create_persona(request: PersonaCreateRequest = Body(...)):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaService.create(payload)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo crear la persona.")
            )

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al crear persona: {str(ex)}")


@router.put("/{persona_id}", response_model=PersonaMutationResponse)
def update_persona(persona_id: int, request: PersonaUpdateRequest = Body(...)):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaService.update(persona_id, payload)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo actualizar la persona.")
            )

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al actualizar persona: {str(ex)}")


@router.delete("/{persona_id}", response_model=PersonaMutationResponse)
def delete_persona(persona_id: int, force: bool = Query(False)):
    try:
        result = PersonaService.delete(persona_id, force)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo eliminar la persona.")
            )

        return PersonaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al eliminar persona: {str(ex)}")


@router.post("/{sujeto_id}/reportes-expediente", response_model=ReporteMutationResponse)
def create_reporte_expediente(
    sujeto_id: int,
    request: ReporteExpedienteCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_expediente(sujeto_id, payload)
        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al registrar reporte expediente: {str(ex)}")


@router.post("/{sujeto_id}/reportes-lista-simple", response_model=ReporteMutationResponse)
def create_reporte_lista_simple(
    sujeto_id: int,
    request: ReporteListaSimpleCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_lista_simple(sujeto_id, payload)
        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al registrar reporte lista simple: {str(ex)}")


@router.post("/{sujeto_id}/reportes-ministerio-vivienda", response_model=ReporteMutationResponse)
def create_reporte_ministerio_vivienda(
    sujeto_id: int,
    request: ReporteMinisterioViviendaCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = PersonaReportesService.create_reporte_ministerio_vivienda(sujeto_id, payload)
        return ReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al registrar reporte ministerio vivienda: {str(ex)}")