from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class AccionistaCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    accionistaSujetoId: int = Field(..., gt=0)
    proyectoId: Optional[int] = Field(default=None, gt=0)
    ordenLista: Optional[int] = Field(default=None, ge=1)
    observacion: Optional[str] = None
    payloadContexto: Optional[dict[str, Any]] = None


class AccionistaInternoCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    personaSujetoId: int = Field(..., gt=0)
    proyectoId: Optional[int] = Field(default=None, gt=0)
    ordenLista: Optional[int] = Field(default=None, ge=1)
    observacion: Optional[str] = None
    payloadContexto: Optional[dict[str, Any]] = None


class AccionistaMutationResponse(BaseModel):
    ok: bool
    message: str
    data: Any | None = None