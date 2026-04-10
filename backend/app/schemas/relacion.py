from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class AsignarGerenteGeneralRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    personaSujetoId: int = Field(..., gt=0, description="ID del sujeto de la persona")
    proyectoId: Optional[int] = Field(default=None, gt=0, description="ID del proyecto si aplica")
    observacion: Optional[str] = Field(default=None, description="Observación de la relación")


class RelacionMutationResponse(BaseModel):
    ok: bool
    message: str
    data: dict | None = None