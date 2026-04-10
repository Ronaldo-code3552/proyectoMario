from fastapi import APIRouter, HTTPException, Query, Body

from app.schemas.proyecto import (
    ProyectoJsonResponse,
    ProyectoCreateRequest,
    ProyectoUpdateRequest,
    ProyectoMutationResponse,
)
from app.services.proyecto_service import ProyectoService

router = APIRouter(prefix="/proyectos", tags=["Proyecto"])


@router.get(
    "",
    response_model=ProyectoJsonResponse,
    summary="Obtener proyectos paginados",
    description="Lista paginada de proyectos con búsqueda y estructura JSON."
)
def get_proyectos(
    page_number: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(20, ge=1, le=200, description="Tamaño de página"),
    search_term: str | None = Query(None, description="Texto de búsqueda"),
):
    try:
        result = ProyectoService.get_all(
            page_number=page_number,
            page_size=page_size,
            search_term=search_term,
        )
        return ProyectoJsonResponse(ok=True, data=result)
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al obtener proyectos: {str(ex)}")


@router.get(
    "/{proyecto_id}",
    response_model=ProyectoJsonResponse,
    summary="Obtener proyecto por ID",
    description="Devuelve el detalle JSON completo de un proyecto."
)
def get_proyecto_by_id(proyecto_id: int):
    try:
        result = ProyectoService.get_by_id(proyecto_id)

        if result is None:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado.")

        return ProyectoJsonResponse(ok=True, data=result)
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al obtener proyecto: {str(ex)}")


@router.post(
    "",
    response_model=ProyectoMutationResponse,
    summary="Crear proyecto",
    description="Inserta un proyecto llamando a fn_proyecto_insert_json."
)
def create_proyecto(
    request: ProyectoCreateRequest = Body(
        ...,
        examples={
            "minimo": {
                "summary": "Ejemplo mínimo",
                "description": "Solo el campo obligatorio.",
                "value": {
                    "proyecto": {
                        "empresaPrincipalSujetoId": 1
                    }
                }
            },
            "completo": {
                "summary": "Ejemplo completo",
                "description": "Ejemplo completo de proyecto.",
                "value": {
                    "proyecto": {
                        "empresaPrincipalSujetoId": 1,
                        "fecha1": "2026-03-22",
                        "textoProyectosNatural": "Proyecto piloto",
                        "cargaLoteId": 1,
                        "payloadOriginal": {
                            "fuente": "manual",
                            "origen": "swagger"
                        }
                    }
                }
            }
        }
    )
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = ProyectoService.create(payload)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo crear el proyecto.")
            )

        return ProyectoMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data")
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al crear proyecto: {str(ex)}")


@router.put(
    "/{proyecto_id}",
    response_model=ProyectoMutationResponse,
    summary="Actualizar proyecto",
    description="Actualiza un proyecto llamando a fn_proyecto_update_json."
)
def update_proyecto(
    proyecto_id: int,
    request: ProyectoUpdateRequest = Body(
        ...,
        examples={
            "parcial": {
                "summary": "Actualización parcial",
                "description": "Actualiza solo algunos campos.",
                "value": {
                    "proyecto": {
                        "fecha1": "2026-04-01",
                        "textoProyectosNatural": "Proyecto actualizado",
                        "cargaLoteId": 2
                    }
                }
            }
        }
    )
):
    try:
        payload = request.model_dump(exclude_none=True)
        result = ProyectoService.update(proyecto_id, payload)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo actualizar el proyecto.")
            )

        return ProyectoMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result.get("data")
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al actualizar proyecto: {str(ex)}")
    
@router.delete(
    "/{proyecto_id}",
    response_model=ProyectoMutationResponse,
    summary="Eliminar proyecto",
    description="Elimina un proyecto llamando a fn_proyecto_delete_json."
)
def delete_proyecto(proyecto_id: int):
    try:
        result = ProyectoService.delete(proyecto_id)

        if not result or not result.get("ok", False):
            raise HTTPException(
                status_code=400,
                detail=(result or {}).get("message", "No se pudo eliminar el proyecto.")
            )

        return ProyectoMutationResponse(
            ok=result["ok"],
            message=result["message"],
            data=result
        )
    except HTTPException:
        raise
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error al eliminar proyecto: {str(ex)}")