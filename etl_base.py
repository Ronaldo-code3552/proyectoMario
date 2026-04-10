from pathlib import Path
import os
from dotenv import load_dotenv
import psycopg

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

conn = psycopg.connect(
    host=os.getenv("PGHOST"),
    port=os.getenv("PGPORT"),
    dbname=os.getenv("PGDATABASE"),
    user=os.getenv("PGUSER"),
    password=os.getenv("PGPASSWORD"),
)

def crear_carga_lote(cur):
    cur.execute("""
        INSERT INTO carga_lote (nombre_archivo, observacion)
        VALUES (%s, %s)
        RETURNING id
    """, ("carga_inicial_csv", "Primera carga desde staging"))
    return cur.fetchone()[0]

def cargar_empresas(cur):
    cur.execute("""
        INSERT INTO sujeto (
            tipo_sujeto,
            hash_negocio
        )
        SELECT
            'JURIDICA'::tipo_sujeto_enum,
            TRIM(ruc_empresa)
        FROM stg.personas_juridicas
        WHERE COALESCE(TRIM(ruc_empresa), '') <> ''
        ON CONFLICT (hash_negocio) DO NOTHING
    """)

    cur.execute("""
        INSERT INTO empresa (
            sujeto_id,
            nombre_empresa,
            razon_social,
            ruc_empresa,
            partida_personas_juridicas,
            partida_personas_juridicas_direccion,
            domicilio_fiscal,
            fecha_constitucion,
            objeto_social_codigo,
            objeto_social,
            suma_numero,
            suma_numero_letra,
            valor_nominal,
            valor_nominal_numero,
            capital_monto,
            capital_monto_letras,
            capital_num_acciones,
            capital_valor_nominal,
            capital_valor_nominal_letras,
            sunat_estado_empresa,
            sunat_condicion_empresa,
            sunat_deuda_coactiva,
            sunat_deuda_monto_total,
            sunat_omisiones,
            sunat_omisiones_monto,
            sunat_trabajadores_mes_fecha,
            sunat_trabajadores_anio_fecha,
            sunat_trabajadores,
            sunat_prestadores,
            representantes_legales_resumen,
            info_establecimientos_anexos_sunat,
            cantidad_establecimientos,
            nombres_establecimientos
        )
        SELECT
            s.id,
            pj.razon_social,
            pj.razon_social,
            TRIM(pj.ruc_empresa),
            pj.partida_personas_juridicas,
            pj.partida_personas_juridicas_direccion,
            pj.domicilio_fiscal,
            pj.fecha_constitucion,
            pj.objeto_social_codigo,
            pj.objeto_social,
            pj.suma_numero,
            pj.suma_numero_letra,
            pj.valor_nominal,
            pj.valor_nominal_numero,
            pj.capital_monto,
            pj.capital_monto_letras,
            pj.capital_num_acciones,
            pj.capital_valor_nominal,
            pj.capital_valor_nominal_letras,
            pj.sunat_estado_empresa,
            pj.sunat_condicion_empresa,
            pj.sunat_deuda_coactiva,
            pj.monto_total,
            pj.sunat_omisiones,
            pj.monto,
            pj.sunat_trabajadores_mes_fecha,
            pj.sunat_trabajadores_anio_fecha,
            pj.sunat_trabajadores,
            pj.sunat_prestadores,
            pj.representantes_legales_resumen,
            CASE
                WHEN UPPER(COALESCE(TRIM(pj.info_establecimientos_anexos_sunat), '')) IN ('SI', 'SÍ', 'TRUE', '1')
                    THEN TRUE
                ELSE FALSE
            END,
            pj.cantidad_establecimientos,
            pj.nombres_establecimientos
        FROM stg.personas_juridicas pj
        JOIN sujeto s
          ON s.hash_negocio = TRIM(pj.ruc_empresa)
        ON CONFLICT (sujeto_id) DO NOTHING
    """)

def cargar_personas(cur):
    cur.execute("""
        INSERT INTO sujeto (
            tipo_sujeto,
            hash_negocio
        )
        SELECT
            'NATURAL'::tipo_sujeto_enum,
            CONCAT(COALESCE(TRIM(tipo_doc), 'NO_APLICA'), '|', TRIM(num_doc))
        FROM stg.personas_naturales
        WHERE COALESCE(TRIM(num_doc), '') <> ''
        ON CONFLICT (hash_negocio) DO NOTHING
    """)

    cur.execute("""
        INSERT INTO persona (
            sujeto_id,
            nombre_completo,
            tipo_documento,
            tipo_documento_raw,
            numero_documento,
            ruc_personal,
            domicilio_fiscal_personal,
            estado_contribuyente,
            condicion_contribuyente,
            deuda_publica_sunat,
            omisiones_tributarias_sunat
        )
        SELECT
            s.id,
            pn.nombre_completo,
            CASE UPPER(COALESCE(TRIM(pn.tipo_doc), ''))
                WHEN 'DNI' THEN 'DNI'::tipo_documento_enum
                WHEN 'CE' THEN 'CE'::tipo_documento_enum
                WHEN 'PASAPORTE' THEN 'PASAPORTE'::tipo_documento_enum
                WHEN 'RUC' THEN 'RUC'::tipo_documento_enum
                ELSE 'NO_APLICA'::tipo_documento_enum
            END,
            pn.tipo_doc,
            TRIM(pn.num_doc),
            pn.ruc_gerente,
            pn.dominio_fiscal_gerente,
            pn.estado_contribuyente,
            pn.condicion_contribuyente,
            pn.deuda_publica_sunat,
            pn.omisiones_tributarias_sunat
        FROM stg.personas_naturales pn
        JOIN sujeto s
          ON s.hash_negocio = CONCAT(COALESCE(TRIM(pn.tipo_doc), 'NO_APLICA'), '|', TRIM(pn.num_doc))
        ON CONFLICT (sujeto_id) DO NOTHING
    """)

def cargar_proyectos(cur, carga_lote_id):
    cur.execute("""
        INSERT INTO proyecto (
            carga_lote_id,
            fecha_1,
            texto_proyectos_natural,
            empresa_principal_sujeto_id
        )
        SELECT
            %s,
            p.fecha_1,
            p.texto_proyectos_natural,
            e.sujeto_id
        FROM stg.proyecto p
        JOIN empresa e
          ON e.ruc_empresa = TRIM(p.ruc_empresa_principal)
    """, (carga_lote_id,))

with conn:
    with conn.cursor() as cur:
        carga_lote_id = crear_carga_lote(cur)
        cargar_empresas(cur)
        cargar_personas(cur)
        cargar_proyectos(cur, carga_lote_id)

print("Carga base completada.")
conn.close()