from typing import Any
from psycopg.types.json import Jsonb

from app.core.database import get_connection


class PersonaReportesService:
    @staticmethod
    def create_reporte_expediente(sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_reporte_expediente
                    (
                        sujeto_id,
                        tipo_reporte,
                        expediente,
                        organo,
                        partes,
                        estatus,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        sujeto_id AS "sujetoId",
                        tipo_reporte AS "tipoReporte",
                        expediente,
                        organo,
                        partes,
                        estatus,
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        sujeto_id,
                        payload.get("tipoReporte"),
                        payload.get("expediente"),
                        payload.get("organo"),
                        payload.get("partes"),
                        payload.get("estatus"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {
                    "ok": True,
                    "message": "Reporte expediente registrado correctamente.",
                    "data": row,
                }

    @staticmethod
    def create_reporte_lista_simple(sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_reporte_lista_simple
                    (
                        sujeto_id,
                        tipo_reporte,
                        razon_social,
                        cantidad,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        sujeto_id AS "sujetoId",
                        tipo_reporte AS "tipoReporte",
                        razon_social AS "razonSocial",
                        cantidad,
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        sujeto_id,
                        payload.get("tipoReporte"),
                        payload.get("razonSocial"),
                        payload.get("cantidad"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {
                    "ok": True,
                    "message": "Reporte de lista simple registrado correctamente.",
                    "data": row,
                }

    @staticmethod
    def create_reporte_ministerio_vivienda(sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_reporte_ministerio_vivienda
                    (
                        sujeto_id,
                        organo,
                        sancion,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        sujeto_id AS "sujetoId",
                        organo,
                        sancion,
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        sujeto_id,
                        payload.get("organo"),
                        payload.get("sancion"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {
                    "ok": True,
                    "message": "Reporte de ministerio vivienda registrado correctamente.",
                    "data": row,
                }