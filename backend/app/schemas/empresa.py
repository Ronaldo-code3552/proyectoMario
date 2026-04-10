from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class EmpresaGetAllQuery(BaseModel):
    page_number: int = Field(default=1, ge=1, description="Número de página")
    page_size: int = Field(default=20, ge=1, le=200, description="Tamaño de página")
    search_term: Optional[str] = Field(default=None, description="Texto de búsqueda")


class SujetoEmpresaCreateDto(BaseModel):
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


class EmpresaCreateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombreEmpresa: Optional[str] = Field(default=None, description="Nombre comercial o nombre visible de la empresa")
    razonSocial: str = Field(..., min_length=1, description="Razón social de la empresa")
    rucEmpresa: str = Field(..., min_length=11, max_length=11, description="RUC de la empresa")
    partidaPersonasJuridicas: Optional[str] = Field(default=None, description="Número de partida registral")
    partidaPersonasJuridicasDireccion: Optional[str] = Field(default=None, description="Dirección asociada a la partida")
    domicilioFiscal: Optional[str] = Field(default=None, description="Domicilio fiscal")
    fechaConstitucion: Optional[str] = Field(default=None, description="Fecha de constitución")
    objetoSocialCodigo: Optional[str] = Field(default=None, description="Código del objeto social")
    objetoSocial: Optional[str] = Field(default=None, description="Descripción del objeto social")
    sumaNumero: Optional[str] = Field(default=None, description="Suma número")
    sumaNumeroLetra: Optional[str] = Field(default=None, description="Suma número en letras")
    valorNominal: Optional[str] = Field(default=None, description="Valor nominal")
    valorNominalNumero: Optional[str] = Field(default=None, description="Valor nominal numérico")
    capitalMonto: Optional[str] = Field(default=None, description="Monto de capital")
    capitalMontoLetras: Optional[str] = Field(default=None, description="Monto de capital en letras")
    capitalNumAcciones: Optional[str] = Field(default=None, description="Número de acciones")
    capitalValorNominal: Optional[str] = Field(default=None, description="Capital valor nominal")
    capitalValorNominalLetras: Optional[str] = Field(default=None, description="Capital valor nominal en letras")
    sunatEstadoEmpresa: Optional[str] = Field(default=None, description="Estado SUNAT")
    sunatCondicionEmpresa: Optional[str] = Field(default=None, description="Condición SUNAT")
    sunatDeudaCoactiva: Optional[str] = Field(default=None, description="Deuda coactiva SUNAT")
    sunatDeudaMontoTotal: Optional[str] = Field(default=None, description="Monto total de deuda SUNAT")
    sunatOmisiones: Optional[str] = Field(default=None, description="Resumen de omisiones SUNAT")
    sunatOmisionesMonto: Optional[str] = Field(default=None, description="Monto de omisiones SUNAT")
    sunatTrabajadoresMesFecha: Optional[str] = Field(default=None, description="Fecha del mes de trabajadores")
    sunatTrabajadoresAnioFecha: Optional[str] = Field(default=None, description="Fecha anual de trabajadores")
    sunatTrabajadores: Optional[str] = Field(default=None, description="Cantidad de trabajadores")
    sunatPrestadores: Optional[str] = Field(default=None, description="Cantidad de prestadores")
    representantesLegalesResumen: Optional[str] = Field(default=None, description="Resumen de representantes legales")
    infoEstablecimientosAnexosSunat: Optional[bool] = Field(default=None, description="Tiene establecimientos anexos en SUNAT")
    cantidadEstablecimientos: Optional[str] = Field(default=None, description="Cantidad de establecimientos")
    nombresEstablecimientos: Optional[str] = Field(default=None, description="Nombres de establecimientos")


class EmpresaCreateRequest(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "sujeto": {
                    "jsonPathOrigen": "$.empresa",
                    "scoreValor": "780",
                    "nivelRiesgo": "BAJO"
                },
                "empresa": {
                    "nombreEmpresa": "L OREAL",
                    "razonSocial": "L OREAL PERU S.A.",
                    "rucEmpresa": "20100070970",
                    "domicilioFiscal": "LIMA",
                    "objetoSocial": "COMERCIALIZACION",
                    "sunatEstadoEmpresa": "ACTIVO",
                    "sunatCondicionEmpresa": "HABIDO",
                    "infoEstablecimientosAnexosSunat": True
                }
            }
        }
    )

    sujeto: Optional[SujetoEmpresaCreateDto] = Field(
        default=None,
        description="Datos comunes del sujeto. Todos son opcionales."
    )
    empresa: EmpresaCreateDto = Field(
        ...,
        description="Datos propios de la empresa."
    )


class SujetoEmpresaUpdateDto(BaseModel):
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


class EmpresaUpdateDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombreEmpresa: Optional[str] = None
    razonSocial: Optional[str] = None
    rucEmpresa: Optional[str] = None
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