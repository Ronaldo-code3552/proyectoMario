from typing import Any, Optional
from psycopg.types.json import Jsonb
from app.core.database import get_connection


class PersonaService:
    @staticmethod
    def get_all(
        page_number: int = 1,
        page_size: int = 20,
        search_term: Optional[str] = None,
    ) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_persona_get_all_json(%s, %s, %s) AS result
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
    def get_by_id(persona_id: int) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_persona_get_by_id_json(%s) AS result
                    """,
                    (persona_id,),
                )
                row = cur.fetchone()
                return row["result"] if row else None

    @staticmethod
    def create(payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_persona_insert_json(%s::jsonb) AS result
                    """,
                    (Jsonb(payload),),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al insertar persona."
                }

    @staticmethod
    def update(persona_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_persona_update_json(%s, %s::jsonb) AS result
                    """,
                    (persona_id, payload),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al actualizar persona."
                }
    
    @staticmethod
    def delete(persona_id: int, force: bool = False) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT fn_persona_delete_json(%s, %s) AS result
                    """,
                    (persona_id, force),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al eliminar persona."
                }