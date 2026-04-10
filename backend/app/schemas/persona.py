from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class PersonaGetAllQuery(BaseModel):
    page_number: int = Field(default=1, ge=1, description="Número de página")
    page_size: int = Field(default=20, ge=1, le=200, description="Tamaño de página")
    search_term: Optional[str] = Field(default=None, description="Texto de búsqueda")


class SujetoPersonaCreateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    jsonPathOrigen: Optional[str] = Field(default=None, description="Ruta u origen lógico del JSON")
    hashNegocio: Optional[str] = Field(default=None, description="Hash o identificador lógico del sujeto")
    scoreValor: Optional[str] = Field(default=None, description="Score crediticio")
    nivelRiesgo: Optional[str] = Field(default=None, description="Nivel de riesgo")
    cantidadRiesgosNum: Optional[str] = Field(default=None, description="Cantidad de riesgos")
    riesgosEstadoCalificacion: Optional[str] = Field(default=None, description="Estado de calificación")
    riesgosComportamientoPago: Optional[str] = Field(default=None, description="Comportamiento de pago")
    comportamiento13m: Optional[str] = Field(default=None, description="Comportamiento últimos 13 meses")
    deudaTotalTexto: Optional[str] = Field(default=None, description="Texto resumen de deuda total")
    deudaTotalMonto: Optional[str] = Field(default=None, description="Monto total de deuda")
    deudaTotalCredito: Optional[str] = Field(default=None, description="Crédito total")
    deudaTotalBanco: Optional[str] = Field(default=None, description="Banco asociado a deuda")
    descripcionOtrasDeudas: Optional[str] = Field(default=None, description="Descripción de otras deudas")


class PersonaCreateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombreCompleto: str = Field(..., min_length=1, description="Nombre completo de la persona")
    tipoDocumento: str = Field(..., min_length=1, description="Tipo de documento lógico, por ejemplo DNI o CE")
    tipoDocumentoRaw: Optional[str] = Field(default=None, description="Valor original del tipo de documento")
    numeroDocumento: str = Field(..., min_length=1, description="Número de documento")
    rucPersonal: Optional[str] = Field(default=None, description="RUC personal si aplica")
    domicilioFiscalPersonal: Optional[str] = Field(default=None, description="Domicilio fiscal personal")
    estadoContribuyente: Optional[str] = Field(default=None, description="Estado del contribuyente")
    condicionContribuyente: Optional[str] = Field(default=None, description="Condición del contribuyente")
    deudaPublicaSunat: Optional[str] = Field(default=None, description="Deuda pública SUNAT")
    omisionesTributariasSunat: Optional[str] = Field(default=None, description="Omisiones tributarias SUNAT")
    nombreJsonRaw: Optional[str] = Field(default=None, description="Valor raw del nombre en el JSON original")
    gerenteNombreJsonRaw: Optional[str] = Field(default=None, description="Nombre raw de gerente en el JSON original")
    gerenteNumeroDocumentoRaw: Optional[str] = Field(default=None, description="Número de documento raw del gerente en el JSON original")


class PersonaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sujeto: Optional[SujetoPersonaCreateDto] = Field(
        default=None,
        description="Datos comunes del sujeto. Todos son opcionales."
    )
    persona: PersonaCreateDto = Field(
        ...,
        description="Datos propios de la persona."
    )


class SujetoPersonaUpdateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    jsonPathOrigen: Optional[str] = None
    hashNegocio: Optional[str] = None
    scoreValor: Optional[str] = None
    nivelRiesgo: Optional[str] = None
    cantidadRiesgosNum: Optional[str] = None
    riesgosEstadoCalificacion: Optional[str] = None
    riesgosComportamientoPago: Optional[str] = None
    comportamiento13m: Optional[str] = None
    deudaTotalTexto: Optional[str] = None
    deudaTotalMonto: Optional[str] = None
    deudaTotalCredito: Optional[str] = None
    deudaTotalBanco: Optional[str] = None
    descripcionOtrasDeudas: Optional[str] = None


class PersonaUpdateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombreCompleto: Optional[str] = None
    tipoDocumento: Optional[str] = None
    tipoDocumentoRaw: Optional[str] = None
    numeroDocumento: Optional[str] = None
    rucPersonal: Optional[str] = None
    domicilioFiscalPersonal: Optional[str] = None
    estadoContribuyente: Optional[str] = None
    condicionContribuyente: Optional[str] = None
    deudaPublicaSunat: Optional[str] = None
    omisionesTributariasSunat: Optional[str] = None
    nombreJsonRaw: Optional[str] = None
    gerenteNombreJsonRaw: Optional[str] = None
    gerenteNumeroDocumentoRaw: Optional[str] = None


class PersonaUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sujeto: Optional[SujetoPersonaUpdateDto] = None
    persona: Optional[PersonaUpdateDto] = None


class PersonaJsonResponse(BaseModel):
    ok: bool = True
    data: Any


class PersonaMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None


class PersonaErrorResponse(BaseModel):
    ok: bool = False
    message: str