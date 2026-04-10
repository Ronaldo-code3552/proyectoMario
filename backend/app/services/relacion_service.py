from typing import Any

from app.core.database import get_connection


class RelacionService:
    @staticmethod
    def asignar_gerente_general(
        empresa_sujeto_id: int,
        persona_sujeto_id: int,
        proyecto_id: int | None = None,
        observacion: str | None = None,
    ) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id
                    FROM sujeto_relacion
                    WHERE sujeto_origen_id = %s
                      AND tipo_relacion = 'GERENTE_GENERAL'
                    LIMIT 1
                    """,
                    (empresa_sujeto_id,),
                )
                existente = cur.fetchone()
                if existente:
                    return {
                        "ok": False,
                        "message": "La empresa ya tiene un gerente general asignado."
                    }

                cur.execute(
                    """
                    INSERT INTO sujeto_relacion (
                        proyecto_id,
                        sujeto_origen_id,
                        sujeto_destino_id,
                        tipo_relacion,
                        orden_lista,
                        observacion
                    )
                    VALUES (%s, %s, %s, 'GERENTE_GENERAL', NULL, %s)
                    RETURNING id, proyecto_id, sujeto_origen_id, sujeto_destino_id, tipo_relacion, observacion, created_at
                    """,
                    (proyecto_id, empresa_sujeto_id, persona_sujeto_id, observacion),
                )
                row = cur.fetchone()

                return {
                    "ok": True,
                    "message": "Gerente general asignado correctamente.",
                    "data": row,
                }