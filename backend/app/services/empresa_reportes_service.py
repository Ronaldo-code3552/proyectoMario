from typing import Any
from psycopg.types.json import Jsonb

from app.core.database import get_connection


class EmpresaReportesService:
    @staticmethod
    def create_sunat_deuda(sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_sunat_deuda
                    (
                        sujeto_id,
                        monto,
                        periodo,
                        fecha_texto,
                        entidad,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        sujeto_id AS "sujetoId",
                        monto,
                        periodo,
                        fecha_texto AS "fechaTexto",
                        entidad,
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        sujeto_id,
                        payload.get("monto"),
                        payload.get("periodo"),
                        payload.get("fechaTexto"),
                        payload.get("entidad"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {"ok": True, "message": "Deuda SUNAT registrada correctamente.", "data": row}

    @staticmethod
    def create_sunat_omision(sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_sunat_omision
                    (
                        sujeto_id,
                        monto,
                        periodo,
                        fecha_texto,
                        entidad,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        sujeto_id AS "sujetoId",
                        monto,
                        periodo,
                        fecha_texto AS "fechaTexto",
                        entidad,
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        sujeto_id,
                        payload.get("monto"),
                        payload.get("periodo"),
                        payload.get("fechaTexto"),
                        payload.get("entidad"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {"ok": True, "message": "Omisión SUNAT registrada correctamente.", "data": row}

    @staticmethod
    def create_representante_legal(empresa_sujeto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_representante_legal
                    (
                        empresa_sujeto_id,
                        puesto_representante_legal,
                        fecha_desde_representante_legal,
                        nombre_representante_legal,
                        documento_representante_legal,
                        documento_numero_representante_legal,
                        orden_lista,
                        payload_item
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING
                        id,
                        empresa_sujeto_id AS "empresaSujetoId",
                        puesto_representante_legal AS "puestoRepresentanteLegal",
                        fecha_desde_representante_legal AS "fechaDesdeRepresentanteLegal",
                        nombre_representante_legal AS "nombreRepresentanteLegal",
                        documento_representante_legal AS "documentoRepresentanteLegal",
                        documento_numero_representante_legal AS "documentoNumeroRepresentanteLegal",
                        orden_lista AS "ordenLista",
                        payload_item AS "payloadItem"
                    """,
                    (
                        empresa_sujeto_id,
                        payload.get("puestoRepresentanteLegal"),
                        payload.get("fechaDesdeRepresentanteLegal"),
                        payload.get("nombreRepresentanteLegal"),
                        payload.get("documentoRepresentanteLegal"),
                        payload.get("documentoNumeroRepresentanteLegal"),
                        payload.get("ordenLista"),
                        Jsonb(payload.get("payloadItem")) if payload.get("payloadItem") is not None else None,
                    ),
                )
                row = cur.fetchone()
                return {"ok": True, "message": "Representante legal registrado correctamente.", "data": row}

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
                return {"ok": True, "message": "Reporte expediente registrado correctamente.", "data": row}

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
                return {"ok": True, "message": "Reporte lista simple registrado correctamente.", "data": row}

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
                return {"ok": True, "message": "Reporte ministerio vivienda registrado correctamente.", "data": row}