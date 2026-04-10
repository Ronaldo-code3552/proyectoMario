from typing import Any

from app.core.database import get_connection


class ProyectoRepository:
    @staticmethod
    def get_by_id_json(proyecto_id: int) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_get_by_id_json(%s) AS result
                    """,
                    (proyecto_id,),
                )
                row = cur.fetchone()
                return row["result"] if row else None