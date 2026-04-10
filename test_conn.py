import os
from dotenv import load_dotenv
import psycopg

load_dotenv()

conn = psycopg.connect(
    host=os.getenv("PGHOST"),
    port=os.getenv("PGPORT"),
    dbname=os.getenv("PGDATABASE"),
    user=os.getenv("PGUSER"),
    password=os.getenv("PGPASSWORD"),
)

with conn.cursor() as cur:
    cur.execute("SELECT current_database(), current_user, now();")
    print(cur.fetchone())

conn.close()