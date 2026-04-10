from typing import Any
from psycopg.types.json import Jsonb

from app.core.database import get_connection


class AccionistaService:
    @staticmethod
    def create_accionista(
        empresa_sujeto_id: int,
        accionista_sujeto_id: int,
        proyecto_id: int | None = None,
        orden_lista: int | None = None,
        observacion: str | None = None,
        payload_contexto: dict | None = None,
    ) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_relacion
                    (
                        proyecto_id,
                        sujeto_origen_id,
                        sujeto_destino_id,
                        tipo_relacion,
                        orden_lista,
                        observacion
                    )
                    VALUES (%s, %s, %s, 'ACCIONISTA', %s, %s)
                    RETURNING
                        id,
                        proyecto_id AS "proyectoId",
                        sujeto_origen_id AS "sujetoOrigenId",
                        sujeto_destino_id AS "sujetoDestinoId",
                        tipo_relacion AS "tipoRelacion",
                        orden_lista AS "ordenLista",
                        observacion,
                        created_at AS "createdAt"
                    """,
                    (
                        proyecto_id,
                        empresa_sujeto_id,
                        accionista_sujeto_id,
                        orden_lista,
                        observacion,
                    ),
                )
                relacion = cur.fetchone()

                contexto = None
                if payload_contexto is not None:
                    cur.execute(
                        """
                        INSERT INTO sujeto_relacion_contexto
                        (
                            sujeto_relacion_id,
                            nombre_json,
                            tipo_documento_raw,
                            numero_documento_raw,
                            gerente_nombre_json,
                            gerente_tipo_documento_raw,
                            gerente_numero_documento_raw,
                            payload_fragment
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING
                            id,
                            sujeto_relacion_id AS "sujetoRelacionId",
                            nombre_json AS "nombreJson",
                            tipo_documento_raw AS "tipoDocumentoRaw",
                            numero_documento_raw AS "numeroDocumentoRaw",
                            gerente_nombre_json AS "gerenteNombreJson",
                            gerente_tipo_documento_raw AS "gerenteTipoDocumentoRaw",
                            gerente_numero_documento_raw AS "gerenteNumeroDocumentoRaw",
                            payload_fragment AS "payloadFragment"
                        """,
                        (
                            relacion["id"],
                            payload_contexto.get("nombreJson"),
                            payload_contexto.get("tipoDocumentoRaw"),
                            payload_contexto.get("numeroDocumentoRaw"),
                            payload_contexto.get("gerenteNombreJson"),
                            payload_contexto.get("gerenteTipoDocumentoRaw"),
                            payload_contexto.get("gerenteNumeroDocumentoRaw"),
                            Jsonb(payload_contexto),
                        ),
                    )
                    contexto = cur.fetchone()

                return {
                    "ok": True,
                    "message": "Accionista registrado correctamente.",
                    "data": {
                        "relacion": relacion,
                        "contexto": contexto,
                    },
                }

    @staticmethod
    def create_accionista_interno(
        empresa_accionista_sujeto_id: int,
        persona_sujeto_id: int,
        proyecto_id: int | None = None,
        orden_lista: int | None = None,
        observacion: str | None = None,
        payload_contexto: dict | None = None,
    ) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sujeto_relacion
                    (
                        proyecto_id,
                        sujeto_origen_id,
                        sujeto_destino_id,
                        tipo_relacion,
                        orden_lista,
                        observacion
                    )
                    VALUES (%s, %s, %s, 'ACCIONISTA_INTERNO', %s, %s)
                    RETURNING
                        id,
                        proyecto_id AS "proyectoId",
                        sujeto_origen_id AS "sujetoOrigenId",
                        sujeto_destino_id AS "sujetoDestinoId",
                        tipo_relacion AS "tipoRelacion",
                        orden_lista AS "ordenLista",
                        observacion,
                        created_at AS "createdAt"
                    """,
                    (
                        proyecto_id,
                        empresa_accionista_sujeto_id,
                        persona_sujeto_id,
                        orden_lista,
                        observacion,
                    ),
                )
                relacion = cur.fetchone()

                contexto = None
                if payload_contexto is not None:
                    cur.execute(
                        """
                        INSERT INTO sujeto_relacion_contexto
                        (
                            sujeto_relacion_id,
                            nombre_json,
                            tipo_documento_raw,
                            numero_documento_raw,
                            gerente_nombre_json,
                            gerente_tipo_documento_raw,
                            gerente_numero_documento_raw,
                            payload_fragment
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING
                            id,
                            sujeto_relacion_id AS "sujetoRelacionId",
                            nombre_json AS "nombreJson",
                            tipo_documento_raw AS "tipoDocumentoRaw",
                            numero_documento_raw AS "numeroDocumentoRaw",
                            gerente_nombre_json AS "gerenteNombreJson",
                            gerente_tipo_documento_raw AS "gerenteTipoDocumentoRaw",
                            gerente_numero_documento_raw AS "gerenteNumeroDocumentoRaw",
                            payload_fragment AS "payloadFragment"
                        """,
                        (
                            relacion["id"],
                            payload_contexto.get("nombreJson"),
                            payload_contexto.get("tipoDocumentoRaw"),
                            payload_contexto.get("numeroDocumentoRaw"),
                            payload_contexto.get("gerenteNombreJson"),
                            payload_contexto.get("gerenteTipoDocumentoRaw"),
                            payload_contexto.get("gerenteNumeroDocumentoRaw"),
                            Jsonb(payload_contexto),
                        ),
                    )
                    contexto = cur.fetchone()

                return {
                    "ok": True,
                    "message": "Accionista interno registrado correctamente.",
                    "data": {
                        "relacion": relacion,
                        "contexto": contexto,
                    },
                }