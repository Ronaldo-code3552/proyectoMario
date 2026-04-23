from typing import Any, Optional
from psycopg.types.json import Jsonb
from app.core.database import get_connection


class EmpresaRepository:
    @staticmethod
    def get_all_json(page_number: int = 1, page_size: int = 20, search_term: Optional[str] = None) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT fn_empresa_get_all_json(%s, %s, %s) AS result",
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
    def get_by_id_json(empresa_id: int) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT fn_empresa_get_by_id_json(%s) AS result",
                    (empresa_id,),
                )
                row = cur.fetchone()
                return row["result"] if row else None

    @staticmethod
    def insert_json(payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT fn_empresa_insert_json(%s::jsonb) AS result",
                    (Jsonb(payload),),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al insertar empresa."
                }

    @staticmethod
    def update_json(empresa_id: int, payload: dict) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT fn_empresa_update_json(%s, %s::jsonb) AS result",
                    (empresa_id, Jsonb(payload)),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al actualizar empresa."
                }

    @staticmethod
    def delete_json(empresa_id: int, force: bool = False) -> Any:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT fn_empresa_delete_json(%s, %s) AS result",
                    (empresa_id, force),
                )
                row = cur.fetchone()
                return row["result"] if row else {
                    "ok": False,
                    "message": "No se obtuvo respuesta al eliminar empresa."
                }