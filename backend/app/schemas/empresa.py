from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class EmpresaGetAllQuery(BaseModel):
    page_number: int = Field(default=1, ge=1, description="Número de página")
    page_size: int = Field(default=20, ge=1, le=200, description="Tamaño de página")
    search_term: Optional[str] = Field(default=None, description="Texto de búsqueda")


class SujetoEmpresaBaseDto(BaseModel):
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


class EmpresaBaseDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombreEmpresa: Optional[str] = None
    razonSocial: Optional[str] = Field(default=None, min_length=1)
    rucEmpresa: Optional[str] = Field(default=None, min_length=11, max_length=11)
    partidaPersonasJuridicas: Optional[str] = None
    partidaPersonasJuridicasDireccion: Optional[str] = None
    domicilioFiscal: Optional[str] = None
    fechaConstitucion: Optional[str] = None
    objetoSocialCodigo: Optional[str] = None
    objetoSocial: Optional[str] = None
    sumaNumero: Optional[str] = None
    sumaNumeroLetra: Optional[str] = None
    valorNominal: Optional[str] = None
    valorNominalNumero: Optional[str] = None
    capitalMonto: Optional[str] = None
    capitalMontoLetras: Optional[str] = None
    capitalNumAcciones: Optional[str] = None
    capitalValorNominal: Optional[str] = None
    capitalValorNominalLetras: Optional[str] = None
    sunatEstadoEmpresa: Optional[str] = None
    sunatCondicionEmpresa: Optional[str] = None
    sunatDeudaCoactiva: Optional[str] = None
    sunatDeudaMontoTotal: Optional[str] = None
    sunatOmisiones: Optional[str] = None
    sunatOmisionesMonto: Optional[str] = None
    sunatTrabajadoresMesFecha: Optional[str] = None
    sunatTrabajadoresAnioFecha: Optional[str] = None
    sunatTrabajadores: Optional[str] = None
    sunatPrestadores: Optional[str] = None
    representantesLegalesResumen: Optional[str] = None
    infoEstablecimientosAnexosSunat: Optional[bool] = None
    cantidadEstablecimientos: Optional[str] = None
    nombresEstablecimientos: Optional[str] = None


class SujetoEmpresaCreateDto(SujetoEmpresaBaseDto):
    pass


class EmpresaCreateDto(EmpresaBaseDto):
    razonSocial: str = Field(..., min_length=1, description="Razón social de la empresa")
    rucEmpresa: str = Field(..., min_length=11, max_length=11, description="RUC de la empresa")


class EmpresaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sujeto: Optional[SujetoEmpresaCreateDto] = Field(default=None)
    empresa: EmpresaCreateDto = Field(...)


class SujetoEmpresaUpdateDto(SujetoEmpresaBaseDto):
    pass


class EmpresaUpdateDto(EmpresaBaseDto):
    pass


class EmpresaUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sujeto: Optional[SujetoEmpresaUpdateDto] = None
    empresa: Optional[EmpresaUpdateDto] = None


class EmpresaJsonResponse(BaseModel):
    ok: bool = True
    data: Any


class EmpresaMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None


class EmpresaErrorResponse(BaseModel):
    ok: bool = False
    message: str