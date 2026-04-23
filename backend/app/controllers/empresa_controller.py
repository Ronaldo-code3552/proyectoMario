from fastapi import APIRouter, HTTPException, Query, Body

from app.schemas.empresa import (
    EmpresaJsonResponse,
    EmpresaCreateRequest,
    EmpresaUpdateRequest,
    EmpresaMutationResponse,
)
from app.schemas.relacion import AsignarGerenteGeneralRequest, RelacionMutationResponse
from app.schemas.empresa_reportes import (
    SunatDeudaCreateRequest,
    SunatOmisionCreateRequest,
    RepresentanteLegalCreateRequest,
    EmpresaReporteExpedienteCreateRequest,
    EmpresaReporteListaSimpleCreateRequest,
    EmpresaReporteMinisterioViviendaCreateRequest,
    EmpresaReporteMutationResponse,
)
from app.schemas.accionista import (
    AccionistaCreateRequest,
    AccionistaInternoCreateRequest,
    AccionistaMutationResponse,
)

from app.services.empresa_service import EmpresaService
from app.services.relacion_service import RelacionService
from app.services.empresa_reportes_service import EmpresaReportesService
from app.services.accionista_service import AccionistaService


router = APIRouter(prefix="/empresas", tags=["Empresa"])


def _ensure_ok(result, status_code: int, default_message: str):
    if not result or not result.get("ok", False):
        raise HTTPException(
            status_code=status_code,
            detail=(result or {}).get("message", default_message),
        )
    return result


@router.get(
    "",
    response_model=EmpresaJsonResponse,
    summary="Obtener empresas paginadas",
    description="Lista paginada de empresas con búsqueda y estructura JSON."
)
def get_empresas(
    page_number: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(20, ge=1, le=200, description="Tamaño de página"),
    search_term: str | None = Query(None, description="Texto de búsqueda"),
):
    try:
        result = EmpresaService.get_all(
            page_number=page_number,
            page_size=page_size,
            search_term=search_term,
        )
        return EmpresaJsonResponse(ok=True, data=result)
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener empresas.")


@router.get(
    "/{empresa_id}",
    response_model=EmpresaJsonResponse,
    summary="Obtener empresa por ID",
    description="Devuelve el detalle JSON completo de una empresa."
)
def get_empresa_by_id(empresa_id: int):
    try:
        result = EmpresaService.get_by_id(empresa_id)

        if result is None:
            raise HTTPException(status_code=404, detail="Empresa no encontrada.")

        return EmpresaJsonResponse(ok=True, data=result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener empresa.")


@router.post(
    "",
    response_model=EmpresaMutationResponse,
    summary="Crear empresa",
    description="Inserta una empresa llamando a fn_empresa_insert_json."
)
def create_empresa(
    request: EmpresaCreateRequest = Body(
        ...,
        examples={
            "minimo": {
                "summary": "Ejemplo mínimo",
                "description": "Solo los campos obligatorios.",
                "value": {
                    "empresa": {
                        "razonSocial": "L OREAL PERU S.A.",
                        "rucEmpresa": "20100070970"
                    }
                }
            },
            "completo": {
                "summary": "Ejemplo completo",
                "description": "Ejemplo con sujeto y empresa.",
                "value": {
                    "sujeto": {
                        "jsonPathOrigen": "$.empresa",
                        "hashNegocio": "20100070970",
                        "scoreValor": "780",
                        "nivelRiesgo": "BAJO",
                        "cantidadRiesgosNum": "2",
                        "riesgosEstadoCalificacion": "NORMAL",
                        "riesgosComportamientoPago": "PUNTUAL",
                        "comportamiento13m": "BUENO",
                        "deudaTotalTexto": "SIN OBSERVACIONES",
                        "deudaTotalMonto": "10000",
                        "deudaTotalCredito": "5000",
                        "deudaTotalBanco": "BCP",
                        "descripcionOtrasDeudas": "NINGUNA"
                    },
                    "empresa": {
                        "nombreEmpresa": "L OREAL",
                        "razonSocial": "L OREAL PERU S.A.",
                        "rucEmpresa": "20100070970",
                        "partidaPersonasJuridicas": "123456",
                        "partidaPersonasJuridicasDireccion": "AV. EJEMPLO 123",
                        "domicilioFiscal": "LIMA",
                        "fechaConstitucion": "2001-01-01",
                        "objetoSocialCodigo": "A1",
                        "objetoSocial": "COMERCIALIZACION",
                        "sumaNumero": "1000",
                        "sumaNumeroLetra": "MIL",
                        "valorNominal": "10",
                        "valorNominalNumero": "10",
                        "capitalMonto": "10000",
                        "capitalMontoLetras": "DIEZ MIL",
                        "capitalNumAcciones": "1000",
                        "capitalValorNominal": "10",
                        "capitalValorNominalLetras": "DIEZ",
                        "sunatEstadoEmpresa": "ACTIVO",
                        "sunatCondicionEmpresa": "HABIDO",
                        "sunatDeudaCoactiva": "NO",
                        "sunatDeudaMontoTotal": "0",
                        "sunatOmisiones": "NO",
                        "sunatOmisionesMonto": "0",
                        "sunatTrabajadoresMesFecha": "2026-03",
                        "sunatTrabajadoresAnioFecha": "2026",
                        "sunatTrabajadores": "150",
                        "sunatPrestadores": "20",
                        "representantesLegalesResumen": "2 REPRESENTANTES",
                        "infoEstablecimientosAnexosSunat": True,
                        "cantidadEstablecimientos": "3",
                        "nombresEstablecimientos": "SEDE LIMA, SEDE SUR"
                    }
                }
            }
        }
    )
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaService.create(payload)
        result = _ensure_ok(result, 400, "No se pudo crear la empresa.")

        return EmpresaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data")
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al crear empresa.")


@router.put(
    "/{empresa_id}",
    response_model=EmpresaMutationResponse,
    summary="Actualizar empresa",
    description="Actualiza una empresa llamando a fn_empresa_update_json.",
    responses={
        400: {"description": "No se pudo actualizar la empresa."}
    }
)
def update_empresa(
    empresa_id: int,
    request: EmpresaUpdateRequest = Body(
        ...,
        examples={
            "parcial": {
                "summary": "Actualización parcial",
                "description": "Actualiza solo algunos campos.",
                "value": {
                    "sujeto": {
                        "scoreValor": "820",
                        "nivelRiesgo": "MUY BAJO"
                    },
                    "empresa": {
                        "nombreEmpresa": "L OREAL ACTUALIZADO",
                        "domicilioFiscal": "SAN ISIDRO",
                        "sunatEstadoEmpresa": "ACTIVO"
                    }
                }
            }
        }
    )
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaService.update(empresa_id, payload)
        result = _ensure_ok(result, 400, "No se pudo actualizar la empresa.")

        return EmpresaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data")
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al actualizar empresa.")


@router.delete(
    "/{empresa_id}",
    response_model=EmpresaMutationResponse,
    summary="Eliminar empresa",
    description="Elimina una empresa llamando a fn_empresa_delete_json. Usa force=true si deseas forzar eliminación cuando existan dependencias."
)
def delete_empresa(
    empresa_id: int,
    force: bool = Query(False, description="Forzar eliminación en cascada cuando existan dependencias")
):
    try:
        result = EmpresaService.delete(empresa_id, force)
        result = _ensure_ok(result, 400, "No se pudo eliminar la empresa.")

        return EmpresaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data")
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al eliminar empresa.")


@router.post(
    "/{empresa_sujeto_id}/gerente-general",
    response_model=RelacionMutationResponse,
    summary="Asignar gerente general a una empresa",
    description="Crea una relación GERENTE_GENERAL entre una empresa y una persona."
)
def asignar_gerente_general(
    empresa_sujeto_id: int,
    request: AsignarGerenteGeneralRequest = Body(
        ...,
        examples={
            "basico": {
                "summary": "Asignar gerente general",
                "value": {
                    "personaSujetoId": 2,
                    "proyectoId": 1,
                    "observacion": "Gerente principal"
                }
            }
        }
    )
):
    try:
        result = RelacionService.asignar_gerente_general(
            empresa_sujeto_id=empresa_sujeto_id,
            persona_sujeto_id=request.personaSujetoId,
            proyecto_id=request.proyectoId,
            observacion=request.observacion,
        )
        result = _ensure_ok(result, 409, "No se pudo asignar el gerente general.")

        return RelacionMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al asignar gerente general.")


@router.post(
    "/{sujeto_id}/sunat-deudas",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar deuda SUNAT de empresa"
)
def create_sunat_deuda(
    sujeto_id: int,
    request: SunatDeudaCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_sunat_deuda(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar la deuda SUNAT.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar deuda SUNAT.")


@router.post(
    "/{sujeto_id}/sunat-omisiones",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar omisión SUNAT de empresa"
)
def create_sunat_omision(
    sujeto_id: int,
    request: SunatOmisionCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_sunat_omision(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar la omisión SUNAT.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar omisión SUNAT.")


@router.post(
    "/{empresa_sujeto_id}/representantes-legales",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar representante legal de empresa"
)
def create_representante_legal(
    empresa_sujeto_id: int,
    request: RepresentanteLegalCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_representante_legal(empresa_sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el representante legal.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar representante legal.")


@router.post(
    "/{sujeto_id}/reportes-expediente",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar reporte expediente de empresa"
)
def create_reporte_expediente(
    sujeto_id: int,
    request: EmpresaReporteExpedienteCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_reporte_expediente(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte expediente.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte expediente.")


@router.post(
    "/{sujeto_id}/reportes-lista-simple",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar reporte lista simple de empresa"
)
def create_reporte_lista_simple(
    sujeto_id: int,
    request: EmpresaReporteListaSimpleCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_reporte_lista_simple(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte lista simple.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte lista simple.")


@router.post(
    "/{sujeto_id}/reportes-ministerio-vivienda",
    response_model=EmpresaReporteMutationResponse,
    summary="Registrar reporte ministerio vivienda de empresa"
)
def create_reporte_ministerio_vivienda(
    sujeto_id: int,
    request: EmpresaReporteMinisterioViviendaCreateRequest = Body(...)
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = EmpresaReportesService.create_reporte_ministerio_vivienda(sujeto_id, payload)
        result = _ensure_ok(result, 400, "No se pudo registrar el reporte ministerio vivienda.")

        return EmpresaReporteMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar reporte ministerio vivienda.")


@router.post(
    "/{empresa_sujeto_id}/accionistas",
    response_model=AccionistaMutationResponse,
    summary="Registrar accionista de empresa"
)
def create_accionista(
    empresa_sujeto_id: int,
    request: AccionistaCreateRequest = Body(...)
):
    try:
        result = AccionistaService.create_accionista(
            empresa_sujeto_id=empresa_sujeto_id,
            accionista_sujeto_id=request.accionistaSujetoId,
            proyecto_id=request.proyectoId,
            orden_lista=request.ordenLista,
            observacion=request.observacion,
            payload_contexto=request.payloadContexto,
        )
        result = _ensure_ok(result, 400, "No se pudo registrar el accionista.")

        return AccionistaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar accionista.")


@router.post(
    "/{empresa_sujeto_id}/accionistas-internos",
    response_model=AccionistaMutationResponse,
    summary="Registrar accionista interno de empresa accionista"
)
def create_accionista_interno(
    empresa_sujeto_id: int,
    request: AccionistaInternoCreateRequest = Body(...)
):
    try:
        result = AccionistaService.create_accionista_interno(
            empresa_accionista_sujeto_id=empresa_sujeto_id,
            persona_sujeto_id=request.personaSujetoId,
            proyecto_id=request.proyectoId,
            orden_lista=request.ordenLista,
            observacion=request.observacion,
            payload_contexto=request.payloadContexto,
        )
        result = _ensure_ok(result, 400, "No se pudo registrar el accionista interno.")

        return AccionistaMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data"),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al registrar accionista interno.")