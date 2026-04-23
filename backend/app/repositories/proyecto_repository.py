from typing import Any, Optional

from psycopg.types.json import Jsonb

from app.core.database import get_connection


class ProyectoRepository:
    @staticmethod
    def get_all_json(
        page_number: int = 1,
        page_size: int = 20,
        search_term: Optional[str] = None,
    ) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_get_all_json(%s, %s, %s) AS result
                    """,
                    (page_number, page_size, search_term),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "data": [],
                    "totalRecords": 0,
                    "pageNumber": page_number,
                    "pageSize": page_size,
                }

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
    @staticmethod
    def get_by_id_json_v2(proyecto_id: int) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_get_by_id_json_v2(%s) AS result
                    """,
                    (proyecto_id,),
                )
                row = cur.fetchone()
                return row["result"] if row else None

    @staticmethod
    def insert_json(payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_insert_json(%s::jsonb) AS result
                    """,
                    (Jsonb(payload),),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al insertar proyecto."
                }

    @staticmethod
    def update_json(proyecto_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_update_json(%s, %s::jsonb) AS result
                    """,
                    (proyecto_id, Jsonb(payload)),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al actualizar proyecto."
                }

    @staticmethod
    def delete_json(proyecto_id: int) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_proyecto_delete_json(%s) AS result
                    """,
                    (proyecto_id,),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al eliminar proyecto."
                }