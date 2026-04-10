from pydantic import BaseModel


class HealthResponse(BaseModel):
    ok: bool
    message: str


class DatabaseHealthResponse(BaseModel):
    ok: bool
    database: str
    user: str
    server_time: str