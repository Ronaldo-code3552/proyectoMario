from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class ReporteExpedienteCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tipoReporte: str = Field(..., min_length=1)
    expediente: str = Field(..., min_length=1)
    organo: Optional[str] = None
    partes: Optional[str] = None
    estatus: Optional[str] = None
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class ReporteListaSimpleCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tipoReporte: str = Field(..., min_length=1)
    razonSocial: str = Field(..., min_length=1)
    cantidad: str = Field(..., min_length=1)
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class ReporteMinisterioViviendaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    organo: str = Field(..., min_length=1)
    sancion: str = Field(..., min_length=1)
    ordenLista: Optional[int] = None
    payloadItem: Optional[dict[str, Any]] = None


class ReporteMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None