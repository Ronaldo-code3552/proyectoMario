from contextlib import contextmanager
import psycopg
from psycopg.rows import dict_row

from app.core.config import settings


def build_conn_info() -> str:
    return (
        f"host={settings.PGHOST} "
        f"port={settings.PGPORT} "
        f"dbname={settings.PGDATABASE} "
        f"user={settings.PGUSER} "
        f"password={settings.PGPASSWORD}"
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
    with get_connection() as conn:
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