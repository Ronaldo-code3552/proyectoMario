from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from app.core.config import settings


def build_conn_info() -> str:
    kwargs = settings.database_kwargs
    return (
        f"host={kwargs['host']} "
        f"port={kwargs['port']} "
        f"dbname={kwargs['dbname']} "
        f"user={kwargs['user']} "
        f"password={kwargs['password']}"
    )


@contextmanager
def get_connection():
    conn = psycopg.connect(build_conn_info(), row_factory=dict_row)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def test_database_connection() -> dict:
    conn = psycopg.connect(build_conn_info(), row_factory=dict_row)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    current_database() AS database_name,
                    current_user AS user_name,
                    now() AS server_time
                """
            )
            row = cur.fetchone()
            return {
                "ok": True,
                "database": row["database_name"],
                "user": row["user_name"],
                "server_time": str(row["server_time"]),
            }
    finally:
        conn.close()