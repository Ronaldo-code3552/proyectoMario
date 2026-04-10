from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class SunatDeudaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    monto: str = Field(...)
    periodo: Optional[str] = None
    fechaTexto: Optional[str] = None
    entidad: Optional[str] = None
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class SunatOmisionCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    monto: str = Field(...)
    periodo: Optional[str] = None
    fechaTexto: Optional[str] = None
    entidad: Optional[str] = None
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class RepresentanteLegalCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    puestoRepresentanteLegal: Optional[str] = None
    fechaDesdeRepresentanteLegal: Optional[str] = None
    nombreRepresentanteLegal: str = Field(...)
    documentoRepresentanteLegal: Optional[str] = None
    documentoNumeroRepresentanteLegal: Optional[str] = None
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class EmpresaReporteExpedienteCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tipoReporte: str = Field(...)
    expediente: str = Field(...)
    organo: Optional[str] = None
    partes: Optional[str] = None
    estatus: Optional[str] = None
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class EmpresaReporteListaSimpleCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tipoReporte: str = Field(...)
    razonSocial: str = Field(...)
    cantidad: str = Field(...)
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class EmpresaReporteMinisterioViviendaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    organo: str = Field(...)
    sancion: str = Field(...)
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class EmpresaReporteMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None