from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProyectoGetAllQuery(BaseModel):
    page_number: int = Field(default=1, ge=1, description="Número de página")
    page_size: int = Field(default=20, ge=1, le=200, description="Tamaño de página")
    search_term: Optional[str] = Field(default=None, description="Texto de búsqueda")


class ProyectoCreateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    empresaPrincipalSujetoId: int = Field(..., description="ID del sujeto empresa principal")
    fecha1: Optional[str] = Field(default=None, description="Valor de fecha_1")
    textoProyectosNatural: Optional[str] = Field(default=None, description="Texto descriptivo del proyecto")
    cargaLoteId: Optional[int] = Field(default=None, description="ID de la carga de lote, si aplica")
    payloadOriginal: Optional[dict[str, Any]] = Field(default=None, description="Payload original asociado al proyecto")


class ProyectoCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    proyecto: ProyectoCreateDto = Field(
        ...,
        description="Datos propios del proyecto."
    )


class ProyectoUpdateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    empresaPrincipalSujetoId: Optional[int] = None
    fecha1: Optional[str] = None
    textoProyectosNatural: Optional[str] = None
    cargaLoteId: Optional[int] = None
    payloadOriginal: Optional[dict[str, Any]] = None


class ProyectoUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    proyecto: Optional[ProyectoUpdateDto] = None


class ProyectoJsonResponse(BaseModel):
    ok: bool = True
    data: Any


class ProyectoMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None


class ProyectoErrorResponse(BaseModel):
    ok: bool = False
    message: str