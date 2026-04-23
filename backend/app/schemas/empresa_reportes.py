from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class ReporteItemBaseRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class SunatDeudaCreateRequest(ReporteItemBaseRequest):
    monto: str = Field(...)
    periodo: Optional[str] = None
    fechaTexto: Optional[str] = None
    entidad: Optional[str] = None


class SunatOmisionCreateRequest(ReporteItemBaseRequest):
    monto: str = Field(...)
    periodo: Optional[str] = None
    fechaTexto: Optional[str] = None
    entidad: Optional[str] = None


class RepresentanteLegalCreateRequest(ReporteItemBaseRequest):
    puestoRepresentanteLegal: Optional[str] = None
    fechaDesdeRepresentanteLegal: Optional[str] = None
    nombreRepresentanteLegal: str = Field(...)
    documentoRepresentanteLegal: Optional[str] = None
    documentoNumeroRepresentanteLegal: Optional[str] = None


class EmpresaReporteExpedienteCreateRequest(ReporteItemBaseRequest):
    tipoReporte: str = Field(...)
    expediente: str = Field(...)
    organo: Optional[str] = None
    partes: Optional[str] = None
    estatus: Optional[str] = None


class EmpresaReporteListaSimpleCreateRequest(ReporteItemBaseRequest):
    tipoReporte: str = Field(...)
    razonSocial: str = Field(...)
    cantidad: str = Field(...)


class EmpresaReporteMinisterioViviendaCreateRequest(ReporteItemBaseRequest):
    organo: str = Field(...)
    sancion: str = Field(...)


class EmpresaReporteMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None