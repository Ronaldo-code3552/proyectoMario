DROP TABLE IF EXISTS sujeto_relacion_contexto CASCADE;
DROP TABLE IF EXISTS sujeto_reporte_ministerio_vivienda CASCADE;
DROP TABLE IF EXISTS sujeto_reporte_lista_simple CASCADE;
DROP TABLE IF EXISTS sujeto_reporte_expediente CASCADE;
DROP TABLE IF EXISTS sujeto_reporte_resumen CASCADE;
DROP TABLE IF EXISTS sujeto_representante_legal CASCADE;
DROP TABLE IF EXISTS sujeto_sunat_omision CASCADE;
DROP TABLE IF EXISTS sujeto_sunat_deuda CASCADE;
DROP TABLE IF EXISTS sujeto_relacion CASCADE;
DROP TABLE IF EXISTS proyecto CASCADE;
DROP TABLE IF EXISTS empresa CASCADE;
DROP TABLE IF EXISTS persona CASCADE;
DROP TABLE IF EXISTS sujeto CASCADE;
DROP TABLE IF EXISTS carga_lote CASCADE;

DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

DROP TYPE IF EXISTS tipo_reporte_lista_simple_enum CASCADE;
DROP TYPE IF EXISTS tipo_reporte_expediente_enum CASCADE;
DROP TYPE IF EXISTS tipo_relacion_sujeto_enum CASCADE;
DROP TYPE IF EXISTS tipo_documento_enum CASCADE;
DROP TYPE IF EXISTS tipo_sujeto_enum CASCADE;

CREATE TYPE tipo_sujeto_enum AS ENUM (
    'JURIDICA',
    'NATURAL'
);

CREATE TYPE tipo_documento_enum AS ENUM (
    'DNI',
    'CE',
    'PASAPORTE',
    'RUC',
    'OTRO',
    'NO_APLICA'
);

CREATE TYPE tipo_relacion_sujeto_enum AS ENUM (
    'GERENTE_GENERAL',
    'ACCIONISTA',
    'ACCIONISTA_INTERNO'
);

CREATE TYPE tipo_reporte_expediente_enum AS ENUM (
    'COMISION_REPRESION',
    'SALA_DEFENSA',
    'SALA_CONCURSAL',
    'COMISION',
    'JUZGADO_CIVIL',
    'JUZGADO_LABORAL',
    'JUZGADO_FAMILIAR'
);

CREATE TYPE tipo_reporte_lista_simple_enum AS ENUM (
    'RANKING_CONSTRUCTORAS',
    'PROTECCION',
    'SALA_PROTECCION',
    'COMISION_SIGNOS',
    'COMISION_INVENTOS'
);

CREATE TABLE carga_lote (
    id BIGSERIAL PRIMARY KEY,
    nombre_archivo TEXT,
    hash_archivo TEXT,
    observacion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto (
    id BIGSERIAL PRIMARY KEY,
    tipo_sujeto tipo_sujeto_enum NOT NULL,
    json_path_origen TEXT,
    hash_negocio TEXT,
    score_valor TEXT,
    nivel_riesgo TEXT,
    cantidad_riesgos_num TEXT,
    riesgos_estado_calificacion TEXT,
    riesgos_comportamiento_pago TEXT,
    comportamiento_13m TEXT,
    deuda_total_texto TEXT,
    deuda_total_monto TEXT,
    deuda_total_credito TEXT,
    deuda_total_banco TEXT,
    descripcion_otras_deudas TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empresa (
    sujeto_id BIGINT PRIMARY KEY REFERENCES sujeto(id) ON DELETE CASCADE,
    nombre_empresa TEXT,
    razon_social TEXT NOT NULL,
    ruc_empresa TEXT NOT NULL UNIQUE,
    partida_personas_juridicas TEXT,
    partida_personas_juridicas_direccion TEXT,
    domicilio_fiscal TEXT,
    fecha_constitucion TEXT,
    objeto_social_codigo TEXT,
    objeto_social TEXT,
    suma_numero TEXT,
    suma_numero_letra TEXT,
    valor_nominal TEXT,
    valor_nominal_numero TEXT,
    capital_monto TEXT,
    capital_monto_letras TEXT,
    capital_num_acciones TEXT,
    capital_valor_nominal TEXT,
    capital_valor_nominal_letras TEXT,
    sunat_estado_empresa TEXT,
    sunat_condicion_empresa TEXT,
    sunat_deuda_coactiva TEXT,
    sunat_deuda_monto_total TEXT,
    sunat_omisiones TEXT,
    sunat_omisiones_monto TEXT,
    sunat_trabajadores_mes_fecha TEXT,
    sunat_trabajadores_anio_fecha TEXT,
    sunat_trabajadores TEXT,
    sunat_prestadores TEXT,
    representantes_legales_resumen TEXT,
    info_establecimientos_anexos_sunat BOOLEAN,
    cantidad_establecimientos TEXT,
    nombres_establecimientos TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE persona (
    sujeto_id BIGINT PRIMARY KEY REFERENCES sujeto(id) ON DELETE CASCADE,
    nombre_completo TEXT NOT NULL,
    tipo_documento tipo_documento_enum NOT NULL DEFAULT 'NO_APLICA',
    tipo_documento_raw TEXT,
    numero_documento TEXT,
    ruc_personal TEXT,
    domicilio_fiscal_personal TEXT,
    estado_contribuyente TEXT,
    condicion_contribuyente TEXT,
    deuda_publica_sunat TEXT,
    omisiones_tributarias_sunat TEXT,
    nombre_json_raw TEXT,
    gerente_nombre_json_raw TEXT,
    gerente_numero_documento_raw TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proyecto (
    id BIGSERIAL PRIMARY KEY,
    carga_lote_id BIGINT REFERENCES carga_lote(id) ON DELETE SET NULL,
    fecha_1 TEXT,
    texto_proyectos_natural TEXT,
    empresa_principal_sujeto_id BIGINT NOT NULL REFERENCES empresa(sujeto_id) ON DELETE RESTRICT,
    payload_original JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_relacion (
    id BIGSERIAL PRIMARY KEY,
    proyecto_id BIGINT REFERENCES proyecto(id) ON DELETE CASCADE,
    sujeto_origen_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    sujeto_destino_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    tipo_relacion tipo_relacion_sujeto_enum NOT NULL,
    orden_lista INTEGER,
    observacion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_sujeto_relacion_distinta CHECK (sujeto_origen_id <> sujeto_destino_id),
    CONSTRAINT uq_sujeto_relacion UNIQUE (sujeto_origen_id, sujeto_destino_id, tipo_relacion, orden_lista)
);

CREATE TABLE sujeto_relacion_contexto (
    id BIGSERIAL PRIMARY KEY,
    sujeto_relacion_id BIGINT NOT NULL REFERENCES sujeto_relacion(id) ON DELETE CASCADE,
    nombre_json TEXT,
    tipo_documento_raw TEXT,
    numero_documento_raw TEXT,
    gerente_nombre_json TEXT,
    gerente_tipo_documento_raw TEXT,
    gerente_numero_documento_raw TEXT,
    payload_fragment JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_sunat_deuda (
    id BIGSERIAL PRIMARY KEY,
    sujeto_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    hash_item TEXT,
    monto TEXT,
    periodo TEXT,
    fecha_texto TEXT,
    entidad TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_sunat_omision (
    id BIGSERIAL PRIMARY KEY,
    sujeto_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    hash_item TEXT,
    monto TEXT,
    periodo TEXT,
    fecha_texto TEXT,
    entidad TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_representante_legal (
    id BIGSERIAL PRIMARY KEY,
    empresa_sujeto_id BIGINT NOT NULL REFERENCES empresa(sujeto_id) ON DELETE CASCADE,
    hash_item TEXT,
    puesto_representante_legal TEXT,
    fecha_desde_representante_legal TEXT,
    nombre_representante_legal TEXT NOT NULL,
    documento_representante_legal TEXT,
    documento_numero_representante_legal TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_reporte_resumen (
    sujeto_id BIGINT PRIMARY KEY REFERENCES sujeto(id) ON DELETE CASCADE,
    reporte_comision_represion_denuncias TEXT,
    reporte_sala_defensa_denuncias TEXT,
    reporte_sala_concursal_denuncias TEXT,
    reporte_comision_denuncias TEXT,
    info_reporte_reclamos BOOLEAN,
    reporte_infrecciones_reclamos TEXT,
    info_reporte_infracciones BOOLEAN,
    reporte_infracciones TEXT,
    reporte_ranking_constructoras_fechas TEXT,
    reporte_proteccion_fechas TEXT,
    reporte_sala_proteccion_fechas TEXT,
    reporte_comision_signos_fechas TEXT,
    reporte_comision_inventos_fechas TEXT,
    reporte_ministerio_vivienda_si_o_no TEXT,
    reporte_ministerio_vivienda_cantidad TEXT,
    reporte_juzgados_civiles_si_o_no TEXT,
    reporte_juzgados_civiles_cantidad TEXT,
    reporte_juzgados_laboral_si_o_no TEXT,
    reporte_juzgados_laboral_cantidad TEXT,
    reporte_juzgados_familiares_cantidad TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_reporte_expediente (
    id BIGSERIAL PRIMARY KEY,
    sujeto_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    hash_item TEXT,
    tipo_reporte tipo_reporte_expediente_enum NOT NULL,
    expediente TEXT,
    organo TEXT,
    partes TEXT,
    estatus TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_reporte_lista_simple (
    id BIGSERIAL PRIMARY KEY,
    sujeto_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    hash_item TEXT,
    tipo_reporte tipo_reporte_lista_simple_enum NOT NULL,
    razon_social TEXT,
    cantidad TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sujeto_reporte_ministerio_vivienda (
    id BIGSERIAL PRIMARY KEY,
    sujeto_id BIGINT NOT NULL REFERENCES sujeto(id) ON DELETE CASCADE,
    hash_item TEXT,
    organo TEXT,
    sancion TEXT,
    orden_lista INTEGER,
    payload_item JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sujeto_updated_at
BEFORE UPDATE ON sujeto
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_empresa_updated_at
BEFORE UPDATE ON empresa
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_persona_updated_at
BEFORE UPDATE ON persona
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_proyecto_updated_at
BEFORE UPDATE ON proyecto
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_sujeto_reporte_resumen_updated_at
BEFORE UPDATE ON sujeto_reporte_resumen
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX uq_sujeto_hash_negocio
ON sujeto (hash_negocio)
WHERE hash_negocio IS NOT NULL;

CREATE UNIQUE INDEX uq_persona_tipo_numero_documento
ON persona (tipo_documento, numero_documento);

CREATE UNIQUE INDEX uq_persona_ruc_personal
ON persona (ruc_personal);

CREATE UNIQUE INDEX uq_sujeto_sunat_deuda_hash
ON sujeto_sunat_deuda (hash_item)
WHERE hash_item IS NOT NULL;

CREATE UNIQUE INDEX uq_sujeto_sunat_omision_hash
ON sujeto_sunat_omision (hash_item)
WHERE hash_item IS NOT NULL;

CREATE UNIQUE INDEX uq_sujeto_representante_legal_hash
ON sujeto_representante_legal (hash_item)
WHERE hash_item IS NOT NULL;

CREATE UNIQUE INDEX uq_sujeto_reporte_expediente_hash
ON sujeto_reporte_expediente (hash_item)
WHERE hash_item IS NOT NULL;

CREATE UNIQUE INDEX uq_sujeto_reporte_lista_simple_hash
ON sujeto_reporte_lista_simple (hash_item)
WHERE hash_item IS NOT NULL;

CREATE UNIQUE INDEX uq_sujeto_reporte_ministerio_vivienda_hash
ON sujeto_reporte_ministerio_vivienda (hash_item)
WHERE hash_item IS NOT NULL;

CREATE INDEX ix_carga_lote_hash_archivo
ON carga_lote (hash_archivo);

CREATE INDEX ix_sujeto_tipo
ON sujeto (tipo_sujeto);

CREATE INDEX ix_sujeto_json_path_origen
ON sujeto (json_path_origen);

CREATE INDEX ix_empresa_ruc
ON empresa (ruc_empresa);

CREATE INDEX ix_persona_numero_documento
ON persona (numero_documento);

CREATE INDEX ix_proyecto_empresa_principal
ON proyecto (empresa_principal_sujeto_id);

CREATE INDEX ix_proyecto_carga_lote
ON proyecto (carga_lote_id);

CREATE INDEX ix_sujeto_relacion_origen
ON sujeto_relacion (sujeto_origen_id, tipo_relacion);

CREATE INDEX ix_sujeto_relacion_destino
ON sujeto_relacion (sujeto_destino_id, tipo_relacion);

CREATE INDEX ix_sujeto_relacion_proyecto
ON sujeto_relacion (proyecto_id);

CREATE INDEX ix_sujeto_relacion_contexto_relacion
ON sujeto_relacion_contexto (sujeto_relacion_id);

CREATE INDEX ix_sunat_deuda_sujeto
ON sujeto_sunat_deuda (sujeto_id);

CREATE INDEX ix_sunat_omision_sujeto
ON sujeto_sunat_omision (sujeto_id);

CREATE INDEX ix_representante_legal_empresa
ON sujeto_representante_legal (empresa_sujeto_id);

CREATE INDEX ix_reporte_expediente_sujeto_tipo
ON sujeto_reporte_expediente (sujeto_id, tipo_reporte);

CREATE INDEX ix_reporte_lista_simple_sujeto_tipo
ON sujeto_reporte_lista_simple (sujeto_id, tipo_reporte);

CREATE INDEX ix_reporte_ministerio_vivienda_sujeto
ON sujeto_reporte_ministerio_vivienda (sujeto_id);


--CRUD DE EMPRESA
-- GET ALL 
	CREATE OR REPLACE FUNCTION fn_empresa_get_all_json(
	    p_page_number INTEGER DEFAULT 1,
	    p_page_size   INTEGER DEFAULT 20,
	    p_search_term TEXT DEFAULT NULL
	)
	RETURNS JSONB
	LANGUAGE sql
	AS $$
	WITH base AS (
	    SELECT
	        e.*,
	        s.tipo_sujeto,
	        s.json_path_origen,
	        s.hash_negocio,
	        s.score_valor,
	        s.nivel_riesgo,
	        s.cantidad_riesgos_num,
	        s.riesgos_estado_calificacion,
	        s.riesgos_comportamiento_pago,
	        s.comportamiento_13m,
	        s.deuda_total_texto,
	        s.deuda_total_monto,
	        s.deuda_total_credito,
	        s.deuda_total_banco,
	        s.descripcion_otras_deudas,
	        s.created_at AS sujeto_created_at,
	        s.updated_at AS sujeto_updated_at
	    FROM empresa e
	    INNER JOIN sujeto s
	        ON s.id = e.sujeto_id
	    WHERE
	        COALESCE(BTRIM(p_search_term), '') = ''
	        OR (
	            e.ruc_empresa ILIKE '%' || p_search_term || '%'
	            OR e.razon_social ILIKE '%' || p_search_term || '%'
	            OR COALESCE(e.nombre_empresa, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(e.objeto_social, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(e.domicilio_fiscal, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(e.sunat_estado_empresa, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(e.sunat_condicion_empresa, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(s.score_valor, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(s.nivel_riesgo, '') ILIKE '%' || p_search_term || '%'
	
	            OR EXISTS (
	                SELECT 1
	                FROM proyecto pr
	                WHERE pr.empresa_principal_sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(pr.fecha_1, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(pr.texto_proyectos_natural, '') ILIKE '%' || p_search_term || '%'
	                      OR CAST(pr.id AS TEXT) ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_representante_legal rl
	                WHERE rl.empresa_sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(rl.nombre_representante_legal, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rl.puesto_representante_legal, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rl.documento_numero_representante_legal, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_sunat_deuda sd
	                WHERE sd.sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(sd.monto, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(sd.periodo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(sd.entidad, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_sunat_omision so
	                WHERE so.sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(so.monto, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(so.periodo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(so.entidad, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_expediente re
	                WHERE re.sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(re.expediente, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.organo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.partes, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.estatus, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_lista_simple rls
	                WHERE rls.sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(rls.razon_social, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rls.cantidad, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rls.tipo_reporte::TEXT, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_ministerio_vivienda rmv
	                WHERE rmv.sujeto_id = e.sujeto_id
	                  AND (
	                      COALESCE(rmv.organo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rmv.sancion, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_relacion sr
	                INNER JOIN persona p ON p.sujeto_id = sr.sujeto_destino_id
	                WHERE sr.sujeto_origen_id = e.sujeto_id
	                  AND sr.tipo_relacion = 'GERENTE_GENERAL'
	                  AND (
	                      COALESCE(p.nombre_completo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(p.numero_documento, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(p.ruc_personal, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_relacion sr
	                INNER JOIN sujeto sx ON sx.id = sr.sujeto_destino_id
	                LEFT JOIN empresa ex ON ex.sujeto_id = sx.id
	                LEFT JOIN persona px ON px.sujeto_id = sx.id
	                WHERE sr.sujeto_origen_id = e.sujeto_id
	                  AND sr.tipo_relacion = 'ACCIONISTA'
	                  AND (
	                      COALESCE(ex.razon_social, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(ex.ruc_empresa, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(px.nombre_completo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(px.numero_documento, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	        )
	),
	total AS (
	    SELECT COUNT(*) AS total_records
	    FROM base
	),
	paged AS (
	    SELECT *
	    FROM base
	    ORDER BY sujeto_id DESC
	    OFFSET GREATEST((COALESCE(p_page_number, 1) - 1) * COALESCE(p_page_size, 20), 0)
	    LIMIT COALESCE(p_page_size, 20)
	)
	SELECT jsonb_build_object(
	    'data',
	    COALESCE(jsonb_agg(item), '[]'::jsonb),
	    'totalRecords',
	    COALESCE((SELECT total_records FROM total), 0),
	    'pageNumber',
	    COALESCE(p_page_number, 1),
	    'pageSize',
	    COALESCE(p_page_size, 20)
	)
	FROM (
	    SELECT jsonb_build_object(
	        'id', p.sujeto_id,
	        'sujeto', jsonb_build_object(
	            'id', p.sujeto_id,
	            'tipoSujeto', p.tipo_sujeto,
	            'jsonPathOrigen', p.json_path_origen,
	            'hashNegocio', p.hash_negocio,
	            'scoreValor', p.score_valor,
	            'nivelRiesgo', p.nivel_riesgo,
	            'cantidadRiesgosNum', p.cantidad_riesgos_num,
	            'riesgosEstadoCalificacion', p.riesgos_estado_calificacion,
	            'riesgosComportamientoPago', p.riesgos_comportamiento_pago,
	            'comportamiento13m', p.comportamiento_13m,
	            'deudaTotalTexto', p.deuda_total_texto,
	            'deudaTotalMonto', p.deuda_total_monto,
	            'deudaTotalCredito', p.deuda_total_credito,
	            'deudaTotalBanco', p.deuda_total_banco,
	            'descripcionOtrasDeudas', p.descripcion_otras_deudas,
	            'createdAt', p.sujeto_created_at,
	            'updatedAt', p.sujeto_updated_at
	        ),
	        'empresa', jsonb_build_object(
	            'sujetoId', p.sujeto_id,
	            'nombreEmpresa', p.nombre_empresa,
	            'razonSocial', p.razon_social,
	            'rucEmpresa', p.ruc_empresa,
	            'partidaPersonasJuridicas', p.partida_personas_juridicas,
	            'partidaPersonasJuridicasDireccion', p.partida_personas_juridicas_direccion,
	            'domicilioFiscal', p.domicilio_fiscal,
	            'fechaConstitucion', p.fecha_constitucion,
	            'objetoSocialCodigo', p.objeto_social_codigo,
	            'objetoSocial', p.objeto_social,
	            'sumaNumero', p.suma_numero,
	            'sumaNumeroLetra', p.suma_numero_letra,
	            'valorNominal', p.valor_nominal,
	            'valorNominalNumero', p.valor_nominal_numero,
	            'capitalMonto', p.capital_monto,
	            'capitalMontoLetras', p.capital_monto_letras,
	            'capitalNumAcciones', p.capital_num_acciones,
	            'capitalValorNominal', p.capital_valor_nominal,
	            'capitalValorNominalLetras', p.capital_valor_nominal_letras,
	            'sunatEstadoEmpresa', p.sunat_estado_empresa,
	            'sunatCondicionEmpresa', p.sunat_condicion_empresa,
	            'sunatDeudaCoactiva', p.sunat_deuda_coactiva,
	            'sunatDeudaMontoTotal', p.sunat_deuda_monto_total,
	            'sunatOmisiones', p.sunat_omisiones,
	            'sunatOmisionesMonto', p.sunat_omisiones_monto,
	            'sunatTrabajadoresMesFecha', p.sunat_trabajadores_mes_fecha,
	            'sunatTrabajadoresAnioFecha', p.sunat_trabajadores_anio_fecha,
	            'sunatTrabajadores', p.sunat_trabajadores,
	            'sunatPrestadores', p.sunat_prestadores,
	            'representantesLegalesResumen', p.representantes_legales_resumen,
	            'infoEstablecimientosAnexosSunat', p.info_establecimientos_anexos_sunat,
	            'cantidadEstablecimientos', p.cantidad_establecimientos,
	            'nombresEstablecimientos', p.nombres_establecimientos
	        ),
	        'reporteResumen', rr.data,
	        'gerenteGeneral', gg.data,
	        'accionistas', COALESCE(ac.data, '[]'::jsonb),
	        'proyectos', COALESCE(pr.data, '[]'::jsonb),
	        'representantesLegales', COALESCE(rl.data, '[]'::jsonb),
	        'conteos', jsonb_build_object(
	            'sunatDeudas', COALESCE(cnt.sunat_deudas, 0),
	            'sunatOmisiones', COALESCE(cnt.sunat_omisiones, 0),
	            'reportesExpediente', COALESCE(cnt.reportes_expediente, 0),
	            'reportesListaSimple', COALESCE(cnt.reportes_lista_simple, 0),
	            'reportesMinisterioVivienda', COALESCE(cnt.reportes_ministerio_vivienda, 0)
	        )
	    ) AS item
	    FROM paged p
	
	    LEFT JOIN LATERAL (
	        SELECT to_jsonb(rr) - 'sujeto_id' AS data
	        FROM sujeto_reporte_resumen rr
	        WHERE rr.sujeto_id = p.sujeto_id
	    ) rr ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT jsonb_build_object(
	            'relacionId', sr.id,
	            'tipoRelacion', sr.tipo_relacion,
	            'ordenLista', sr.orden_lista,
	            'observacion', sr.observacion,
	            'contexto', CASE
	                WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
	                ELSE NULL
	            END,
	            'sujeto', jsonb_build_object(
	                'id', sg.id,
	                'tipoSujeto', sg.tipo_sujeto,
	                'scoreValor', sg.score_valor,
	                'nivelRiesgo', sg.nivel_riesgo
	            ),
	            'persona', CASE
	                WHEN pg.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                    'sujetoId', pg.sujeto_id,
	                    'nombreCompleto', pg.nombre_completo,
	                    'tipoDocumento', pg.tipo_documento,
	                    'numeroDocumento', pg.numero_documento,
	                    'rucPersonal', pg.ruc_personal
	                )
	                ELSE NULL
	            END
	        ) AS data
	        FROM sujeto_relacion sr
	        INNER JOIN sujeto sg
	            ON sg.id = sr.sujeto_destino_id
	        LEFT JOIN persona pg
	            ON pg.sujeto_id = sg.id
	        LEFT JOIN sujeto_relacion_contexto src
	            ON src.sujeto_relacion_id = sr.id
	        WHERE sr.sujeto_origen_id = p.sujeto_id
	          AND sr.tipo_relacion = 'GERENTE_GENERAL'
	        ORDER BY sr.orden_lista NULLS LAST, sr.id
	        LIMIT 1
	    ) gg ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT jsonb_agg(
	            jsonb_build_object(
	                'relacionId', sr.id,
	                'tipoRelacion', sr.tipo_relacion,
	                'ordenLista', sr.orden_lista,
	                'contexto', CASE
	                    WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
	                    ELSE NULL
	                END,
	                'sujeto', jsonb_build_object(
	                    'id', sa.id,
	                    'tipoSujeto', sa.tipo_sujeto,
	                    'scoreValor', sa.score_valor,
	                    'nivelRiesgo', sa.nivel_riesgo
	                ),
	                'empresa', CASE
	                    WHEN ae.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                        'sujetoId', ae.sujeto_id,
	                        'razonSocial', ae.razon_social,
	                        'rucEmpresa', ae.ruc_empresa
	                    )
	                    ELSE NULL
	                END,
	                'persona', CASE
	                    WHEN ap.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                        'sujetoId', ap.sujeto_id,
	                        'nombreCompleto', ap.nombre_completo,
	                        'tipoDocumento', ap.tipo_documento,
	                        'numeroDocumento', ap.numero_documento
	                    )
	                    ELSE NULL
	                END
	            )
	            ORDER BY sr.orden_lista NULLS LAST, sr.id
	        ) AS data
	        FROM sujeto_relacion sr
	        INNER JOIN sujeto sa
	            ON sa.id = sr.sujeto_destino_id
	        LEFT JOIN empresa ae
	            ON ae.sujeto_id = sa.id
	        LEFT JOIN persona ap
	            ON ap.sujeto_id = sa.id
	        LEFT JOIN sujeto_relacion_contexto src
	            ON src.sujeto_relacion_id = sr.id
	        WHERE sr.sujeto_origen_id = p.sujeto_id
	          AND sr.tipo_relacion = 'ACCIONISTA'
	    ) ac ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT jsonb_agg(
	            jsonb_build_object(
	                'id', pr.id,
	                'fecha1', pr.fecha_1,
	                'textoProyectosNatural', pr.texto_proyectos_natural,
	                'cargaLote', CASE
	                    WHEN cl.id IS NOT NULL THEN jsonb_build_object(
	                        'id', cl.id,
	                        'nombreArchivo', cl.nombre_archivo,
	                        'hashArchivo', cl.hash_archivo,
	                        'observacion', cl.observacion,
	                        'createdAt', cl.created_at
	                    )
	                    ELSE NULL
	                END,
	                'createdAt', pr.created_at,
	                'updatedAt', pr.updated_at
	            )
	            ORDER BY pr.id DESC
	        ) AS data
	        FROM proyecto pr
	        LEFT JOIN carga_lote cl
	            ON cl.id = pr.carga_lote_id
	        WHERE pr.empresa_principal_sujeto_id = p.sujeto_id
	    ) pr ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT jsonb_agg(
	            jsonb_build_object(
	                'id', rl.id,
	                'puestoRepresentanteLegal', rl.puesto_representante_legal,
	                'fechaDesdeRepresentanteLegal', rl.fecha_desde_representante_legal,
	                'nombreRepresentanteLegal', rl.nombre_representante_legal,
	                'documentoRepresentanteLegal', rl.documento_representante_legal,
	                'documentoNumeroRepresentanteLegal', rl.documento_numero_representante_legal,
	                'ordenLista', rl.orden_lista
	            )
	            ORDER BY rl.orden_lista NULLS LAST, rl.id
	        ) AS data
	        FROM sujeto_representante_legal rl
	        WHERE rl.empresa_sujeto_id = p.sujeto_id
	    ) rl ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT
	            COUNT(*) FILTER (WHERE t = 'D') AS sunat_deudas,
	            COUNT(*) FILTER (WHERE t = 'O') AS sunat_omisiones,
	            COUNT(*) FILTER (WHERE t = 'RE') AS reportes_expediente,
	            COUNT(*) FILTER (WHERE t = 'RLS') AS reportes_lista_simple,
	            COUNT(*) FILTER (WHERE t = 'RMV') AS reportes_ministerio_vivienda
	        FROM (
	            SELECT 'D' AS t FROM sujeto_sunat_deuda d WHERE d.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'O' AS t FROM sujeto_sunat_omision o WHERE o.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RE' AS t FROM sujeto_reporte_expediente re WHERE re.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RLS' AS t FROM sujeto_reporte_lista_simple rls WHERE rls.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RMV' AS t FROM sujeto_reporte_ministerio_vivienda rmv WHERE rmv.sujeto_id = p.sujeto_id
	        ) q
	    ) cnt ON TRUE
	) z;
	$$;


--GET ID
	CREATE OR REPLACE FUNCTION fn_empresa_get_by_id_json(
	    p_sujeto_id BIGINT
	)
	RETURNS JSONB
	LANGUAGE sql
	AS $$
	SELECT jsonb_build_object(
	    'id', e.sujeto_id,
	
	    'sujeto', jsonb_build_object(
	        'id', s.id,
	        'tipoSujeto', s.tipo_sujeto,
	        'jsonPathOrigen', s.json_path_origen,
	        'hashNegocio', s.hash_negocio,
	        'scoreValor', s.score_valor,
	        'nivelRiesgo', s.nivel_riesgo,
	        'cantidadRiesgosNum', s.cantidad_riesgos_num,
	        'riesgosEstadoCalificacion', s.riesgos_estado_calificacion,
	        'riesgosComportamientoPago', s.riesgos_comportamiento_pago,
	        'comportamiento13m', s.comportamiento_13m,
	        'deudaTotalTexto', s.deuda_total_texto,
	        'deudaTotalMonto', s.deuda_total_monto,
	        'deudaTotalCredito', s.deuda_total_credito,
	        'deudaTotalBanco', s.deuda_total_banco,
	        'descripcionOtrasDeudas', s.descripcion_otras_deudas,
	        'createdAt', s.created_at,
	        'updatedAt', s.updated_at
	    ),
	
	    'empresa', jsonb_build_object(
	        'sujetoId', e.sujeto_id,
	        'nombreEmpresa', e.nombre_empresa,
	        'razonSocial', e.razon_social,
	        'rucEmpresa', e.ruc_empresa,
	        'partidaPersonasJuridicas', e.partida_personas_juridicas,
	        'partidaPersonasJuridicasDireccion', e.partida_personas_juridicas_direccion,
	        'domicilioFiscal', e.domicilio_fiscal,
	        'fechaConstitucion', e.fecha_constitucion,
	        'objetoSocialCodigo', e.objeto_social_codigo,
	        'objetoSocial', e.objeto_social,
	        'sumaNumero', e.suma_numero,
	        'sumaNumeroLetra', e.suma_numero_letra,
	        'valorNominal', e.valor_nominal,
	        'valorNominalNumero', e.valor_nominal_numero,
	        'capitalMonto', e.capital_monto,
	        'capitalMontoLetras', e.capital_monto_letras,
	        'capitalNumAcciones', e.capital_num_acciones,
	        'capitalValorNominal', e.capital_valor_nominal,
	        'capitalValorNominalLetras', e.capital_valor_nominal_letras,
	        'sunatEstadoEmpresa', e.sunat_estado_empresa,
	        'sunatCondicionEmpresa', e.sunat_condicion_empresa,
	        'sunatDeudaCoactiva', e.sunat_deuda_coactiva,
	        'sunatDeudaMontoTotal', e.sunat_deuda_monto_total,
	        'sunatOmisiones', e.sunat_omisiones,
	        'sunatOmisionesMonto', e.sunat_omisiones_monto,
	        'sunatTrabajadoresMesFecha', e.sunat_trabajadores_mes_fecha,
	        'sunatTrabajadoresAnioFecha', e.sunat_trabajadores_anio_fecha,
	        'sunatTrabajadores', e.sunat_trabajadores,
	        'sunatPrestadores', e.sunat_prestadores,
	        'representantesLegalesResumen', e.representantes_legales_resumen,
	        'infoEstablecimientosAnexosSunat', e.info_establecimientos_anexos_sunat,
	        'cantidadEstablecimientos', e.cantidad_establecimientos,
	        'nombresEstablecimientos', e.nombres_establecimientos,
	        'createdAt', e.created_at,
	        'updatedAt', e.updated_at
	    ),
	
	    'reporteResumen', rr.data,
	    'proyectos', COALESCE(pr.data, '[]'::jsonb),
	    'deudasSunat', COALESCE(sd.data, '[]'::jsonb),
	    'omisionesSunat', COALESCE(so.data, '[]'::jsonb),
	    'representantesLegales', COALESCE(rl.data, '[]'::jsonb),
	    'reportesExpediente', COALESCE(re.data, '[]'::jsonb),
	    'reportesListaSimple', COALESCE(rls.data, '[]'::jsonb),
	    'reportesMinisterioVivienda', COALESCE(rmv.data, '[]'::jsonb),
	    'gerenteGeneral', gg.data,
	    'accionistas', COALESCE(ac.data, '[]'::jsonb)
	)
	FROM empresa e
	INNER JOIN sujeto s
	    ON s.id = e.sujeto_id
	
	LEFT JOIN LATERAL (
	    SELECT to_jsonb(rr) - 'sujeto_id' AS data
	    FROM sujeto_reporte_resumen rr
	    WHERE rr.sujeto_id = e.sujeto_id
	) rr ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', pr.id,
	            'fecha1', pr.fecha_1,
	            'textoProyectosNatural', pr.texto_proyectos_natural,
	            'payloadOriginal', pr.payload_original,
	            'cargaLote', CASE
	                WHEN cl.id IS NOT NULL THEN jsonb_build_object(
	                    'id', cl.id,
	                    'nombreArchivo', cl.nombre_archivo,
	                    'hashArchivo', cl.hash_archivo,
	                    'observacion', cl.observacion,
	                    'createdAt', cl.created_at
	                )
	                ELSE NULL
	            END,
	            'createdAt', pr.created_at,
	            'updatedAt', pr.updated_at
	        )
	        ORDER BY pr.id DESC
	    ) AS data
	    FROM proyecto pr
	    LEFT JOIN carga_lote cl
	        ON cl.id = pr.carga_lote_id
	    WHERE pr.empresa_principal_sujeto_id = e.sujeto_id
	) pr ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', sd.id,
	            'monto', sd.monto,
	            'periodo', sd.periodo,
	            'fecha', sd.fecha_texto,
	            'entidad', sd.entidad,
	            'ordenLista', sd.orden_lista,
	            'payloadItem', sd.payload_item
	        )
	        ORDER BY sd.orden_lista NULLS LAST, sd.id
	    ) AS data
	    FROM sujeto_sunat_deuda sd
	    WHERE sd.sujeto_id = e.sujeto_id
	) sd ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', so.id,
	            'monto', so.monto,
	            'periodo', so.periodo,
	            'fecha', so.fecha_texto,
	            'entidad', so.entidad,
	            'ordenLista', so.orden_lista,
	            'payloadItem', so.payload_item
	        )
	        ORDER BY so.orden_lista NULLS LAST, so.id
	    ) AS data
	    FROM sujeto_sunat_omision so
	    WHERE so.sujeto_id = e.sujeto_id
	) so ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rl.id,
	            'puestoRepresentanteLegal', rl.puesto_representante_legal,
	            'fechaDesdeRepresentanteLegal', rl.fecha_desde_representante_legal,
	            'nombreRepresentanteLegal', rl.nombre_representante_legal,
	            'documentoRepresentanteLegal', rl.documento_representante_legal,
	            'documentoNumeroRepresentanteLegal', rl.documento_numero_representante_legal,
	            'ordenLista', rl.orden_lista,
	            'payloadItem', rl.payload_item
	        )
	        ORDER BY rl.orden_lista NULLS LAST, rl.id
	    ) AS data
	    FROM sujeto_representante_legal rl
	    WHERE rl.empresa_sujeto_id = e.sujeto_id
	) rl ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', re.id,
	            'tipoReporte', re.tipo_reporte,
	            'expediente', re.expediente,
	            'organo', re.organo,
	            'partes', re.partes,
	            'estatus', re.estatus,
	            'ordenLista', re.orden_lista,
	            'payloadItem', re.payload_item
	        )
	        ORDER BY re.orden_lista NULLS LAST, re.id
	    ) AS data
	    FROM sujeto_reporte_expediente re
	    WHERE re.sujeto_id = e.sujeto_id
	) re ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rls.id,
	            'tipoReporte', rls.tipo_reporte,
	            'razonSocial', rls.razon_social,
	            'cantidad', rls.cantidad,
	            'ordenLista', rls.orden_lista,
	            'payloadItem', rls.payload_item
	        )
	        ORDER BY rls.orden_lista NULLS LAST, rls.id
	    ) AS data
	    FROM sujeto_reporte_lista_simple rls
	    WHERE rls.sujeto_id = e.sujeto_id
	) rls ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rmv.id,
	            'organo', rmv.organo,
	            'sancion', rmv.sancion,
	            'ordenLista', rmv.orden_lista,
	            'payloadItem', rmv.payload_item
	        )
	        ORDER BY rmv.orden_lista NULLS LAST, rmv.id
	    ) AS data
	    FROM sujeto_reporte_ministerio_vivienda rmv
	    WHERE rmv.sujeto_id = e.sujeto_id
	) rmv ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_build_object(
	        'relacionId', sr.id,
	        'tipoRelacion', sr.tipo_relacion,
	        'ordenLista', sr.orden_lista,
	        'observacion', sr.observacion,
	        'contexto', CASE
	            WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
	            ELSE NULL
	        END,
	        'sujeto', jsonb_build_object(
	            'id', sg.id,
	            'tipoSujeto', sg.tipo_sujeto,
	            'jsonPathOrigen', sg.json_path_origen,
	            'hashNegocio', sg.hash_negocio,
	            'scoreValor', sg.score_valor,
	            'nivelRiesgo', sg.nivel_riesgo
	        ),
	        'persona', CASE
	            WHEN pg.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                'sujetoId', pg.sujeto_id,
	                'nombreCompleto', pg.nombre_completo,
	                'tipoDocumento', pg.tipo_documento,
	                'tipoDocumentoRaw', pg.tipo_documento_raw,
	                'numeroDocumento', pg.numero_documento,
	                'rucPersonal', pg.ruc_personal,
	                'domicilioFiscalPersonal', pg.domicilio_fiscal_personal,
	                'estadoContribuyente', pg.estado_contribuyente,
	                'condicionContribuyente', pg.condicion_contribuyente
	            )
	            ELSE NULL
	        END
	    ) AS data
	    FROM sujeto_relacion sr
	    INNER JOIN sujeto sg
	        ON sg.id = sr.sujeto_destino_id
	    LEFT JOIN persona pg
	        ON pg.sujeto_id = sg.id
	    LEFT JOIN sujeto_relacion_contexto src
	        ON src.sujeto_relacion_id = sr.id
	    WHERE sr.sujeto_origen_id = e.sujeto_id
	      AND sr.tipo_relacion = 'GERENTE_GENERAL'
	    ORDER BY sr.orden_lista NULLS LAST, sr.id
	    LIMIT 1
	) gg ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'relacionId', sr.id,
	            'tipoRelacion', sr.tipo_relacion,
	            'ordenLista', sr.orden_lista,
	            'observacion', sr.observacion,
	            'contexto', CASE
	                WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
	                ELSE NULL
	            END,
	            'sujeto', jsonb_build_object(
	                'id', sa.id,
	                'tipoSujeto', sa.tipo_sujeto,
	                'jsonPathOrigen', sa.json_path_origen,
	                'hashNegocio', sa.hash_negocio,
	                'scoreValor', sa.score_valor,
	                'nivelRiesgo', sa.nivel_riesgo
	            ),
	            'empresa', CASE
	                WHEN ae.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                    'sujetoId', ae.sujeto_id,
	                    'nombreEmpresa', ae.nombre_empresa,
	                    'razonSocial', ae.razon_social,
	                    'rucEmpresa', ae.ruc_empresa,
	                    'objetoSocial', ae.objeto_social,
	                    'sunatEstadoEmpresa', ae.sunat_estado_empresa,
	                    'sunatCondicionEmpresa', ae.sunat_condicion_empresa
	                )
	                ELSE NULL
	            END,
	            'persona', CASE
	                WHEN ap.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                    'sujetoId', ap.sujeto_id,
	                    'nombreCompleto', ap.nombre_completo,
	                    'tipoDocumento', ap.tipo_documento,
	                    'numeroDocumento', ap.numero_documento,
	                    'rucPersonal', ap.ruc_personal
	                )
	                ELSE NULL
	            END,
	            'accionistasInternos', COALESCE((
	                SELECT jsonb_agg(
	                    jsonb_build_object(
	                        'relacionId', sri.id,
	                        'tipoRelacion', sri.tipo_relacion,
	                        'ordenLista', sri.orden_lista,
	                        'contexto', CASE
	                            WHEN srci.id IS NOT NULL THEN to_jsonb(srci) - 'id' - 'sujeto_relacion_id' - 'created_at'
	                            ELSE NULL
	                        END,
	                        'sujeto', jsonb_build_object(
	                            'id', si.id,
	                            'tipoSujeto', si.tipo_sujeto,
	                            'scoreValor', si.score_valor,
	                            'nivelRiesgo', si.nivel_riesgo
	                        ),
	                        'persona', CASE
	                            WHEN pi.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                                'sujetoId', pi.sujeto_id,
	                                'nombreCompleto', pi.nombre_completo,
	                                'tipoDocumento', pi.tipo_documento,
	                                'numeroDocumento', pi.numero_documento,
	                                'rucPersonal', pi.ruc_personal
	                            )
	                            ELSE NULL
	                        END
	                    )
	                    ORDER BY sri.orden_lista NULLS LAST, sri.id
	                )
	                FROM sujeto_relacion sri
	                INNER JOIN sujeto si
	                    ON si.id = sri.sujeto_destino_id
	                LEFT JOIN persona pi
	                    ON pi.sujeto_id = si.id
	                LEFT JOIN sujeto_relacion_contexto srci
	                    ON srci.sujeto_relacion_id = sri.id
	                WHERE sri.sujeto_origen_id = sa.id
	                  AND sri.tipo_relacion = 'ACCIONISTA_INTERNO'
	            ), '[]'::jsonb)
	        )
	        ORDER BY sr.orden_lista NULLS LAST, sr.id
	    ) AS data
	    FROM sujeto_relacion sr
	    INNER JOIN sujeto sa
	        ON sa.id = sr.sujeto_destino_id
	    LEFT JOIN empresa ae
	        ON ae.sujeto_id = sa.id
	    LEFT JOIN persona ap
	        ON ap.sujeto_id = sa.id
	    LEFT JOIN sujeto_relacion_contexto src
	        ON src.sujeto_relacion_id = sr.id
	    WHERE sr.sujeto_origen_id = e.sujeto_id
	      AND sr.tipo_relacion = 'ACCIONISTA'
	) ac ON TRUE
	
	WHERE e.sujeto_id = p_sujeto_id;
	$$;

-- PERSONA
--GETALL
	CREATE OR REPLACE FUNCTION fn_persona_get_all_json(
	    p_page_number INTEGER DEFAULT 1,
	    p_page_size   INTEGER DEFAULT 20,
	    p_search_term TEXT DEFAULT NULL
	)
	RETURNS JSONB
	LANGUAGE sql
	AS $$
	WITH base AS (
	    SELECT
	        p.*,
	        s.tipo_sujeto,
	        s.json_path_origen,
	        s.hash_negocio,
	        s.score_valor,
	        s.nivel_riesgo,
	        s.cantidad_riesgos_num,
	        s.riesgos_estado_calificacion,
	        s.riesgos_comportamiento_pago,
	        s.comportamiento_13m,
	        s.deuda_total_texto,
	        s.deuda_total_monto,
	        s.deuda_total_credito,
	        s.deuda_total_banco,
	        s.descripcion_otras_deudas,
	        s.created_at AS sujeto_created_at,
	        s.updated_at AS sujeto_updated_at
	    FROM persona p
	    INNER JOIN sujeto s
	        ON s.id = p.sujeto_id
	    WHERE
	        COALESCE(BTRIM(p_search_term), '') = ''
	        OR (
	            COALESCE(p.nombre_completo, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.numero_documento, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.ruc_personal, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.tipo_documento::TEXT, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.tipo_documento_raw, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.estado_contribuyente, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.condicion_contribuyente, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(p.domicilio_fiscal_personal, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(s.score_valor, '') ILIKE '%' || p_search_term || '%'
	            OR COALESCE(s.nivel_riesgo, '') ILIKE '%' || p_search_term || '%'
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_sunat_deuda sd
	                WHERE sd.sujeto_id = p.sujeto_id
	                  AND (
	                      COALESCE(sd.monto, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(sd.periodo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(sd.entidad, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_sunat_omision so
	                WHERE so.sujeto_id = p.sujeto_id
	                  AND (
	                      COALESCE(so.monto, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(so.periodo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(so.entidad, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_expediente re
	                WHERE re.sujeto_id = p.sujeto_id
	                  AND (
	                      COALESCE(re.expediente, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.organo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.partes, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(re.estatus, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_lista_simple rls
	                WHERE rls.sujeto_id = p.sujeto_id
	                  AND (
	                      COALESCE(rls.razon_social, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rls.cantidad, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rls.tipo_reporte::TEXT, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_reporte_ministerio_vivienda rmv
	                WHERE rmv.sujeto_id = p.sujeto_id
	                  AND (
	                      COALESCE(rmv.organo, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(rmv.sancion, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	
	            OR EXISTS (
	                SELECT 1
	                FROM sujeto_relacion sr
	                INNER JOIN empresa e ON e.sujeto_id = sr.sujeto_origen_id
	                WHERE sr.sujeto_destino_id = p.sujeto_id
	                  AND (
	                      COALESCE(e.razon_social, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(e.ruc_empresa, '') ILIKE '%' || p_search_term || '%'
	                      OR COALESCE(sr.tipo_relacion::TEXT, '') ILIKE '%' || p_search_term || '%'
	                  )
	            )
	        )
	),
	total AS (
	    SELECT COUNT(*) AS total_records
	    FROM base
	),
	paged AS (
	    SELECT *
	    FROM base
	    ORDER BY sujeto_id DESC
	    OFFSET GREATEST((COALESCE(p_page_number, 1) - 1) * COALESCE(p_page_size, 20), 0)
	    LIMIT COALESCE(p_page_size, 20)
	)
	SELECT jsonb_build_object(
	    'data',
	    COALESCE(jsonb_agg(item), '[]'::jsonb),
	    'totalRecords',
	    COALESCE((SELECT total_records FROM total), 0),
	    'pageNumber',
	    COALESCE(p_page_number, 1),
	    'pageSize',
	    COALESCE(p_page_size, 20)
	)
	FROM (
	    SELECT jsonb_build_object(
	        'id', p.sujeto_id,
	        'sujeto', jsonb_build_object(
	            'id', p.sujeto_id,
	            'tipoSujeto', p.tipo_sujeto,
	            'jsonPathOrigen', p.json_path_origen,
	            'hashNegocio', p.hash_negocio,
	            'scoreValor', p.score_valor,
	            'nivelRiesgo', p.nivel_riesgo,
	            'cantidadRiesgosNum', p.cantidad_riesgos_num,
	            'riesgosEstadoCalificacion', p.riesgos_estado_calificacion,
	            'riesgosComportamientoPago', p.riesgos_comportamiento_pago,
	            'comportamiento13m', p.comportamiento_13m,
	            'deudaTotalTexto', p.deuda_total_texto,
	            'deudaTotalMonto', p.deuda_total_monto,
	            'deudaTotalCredito', p.deuda_total_credito,
	            'deudaTotalBanco', p.deuda_total_banco,
	            'descripcionOtrasDeudas', p.descripcion_otras_deudas,
	            'createdAt', p.sujeto_created_at,
	            'updatedAt', p.sujeto_updated_at
	        ),
	        'persona', jsonb_build_object(
	            'sujetoId', p.sujeto_id,
	            'nombreCompleto', p.nombre_completo,
	            'tipoDocumento', p.tipo_documento,
	            'tipoDocumentoRaw', p.tipo_documento_raw,
	            'numeroDocumento', p.numero_documento,
	            'rucPersonal', p.ruc_personal,
	            'domicilioFiscalPersonal', p.domicilio_fiscal_personal,
	            'estadoContribuyente', p.estado_contribuyente,
	            'condicionContribuyente', p.condicion_contribuyente,
	            'deudaPublicaSunat', p.deuda_publica_sunat,
	            'omisionesTributariasSunat', p.omisiones_tributarias_sunat,
	            'nombreJsonRaw', p.nombre_json_raw,
	            'gerenteNombreJsonRaw', p.gerente_nombre_json_raw,
	            'gerenteNumeroDocumentoRaw', p.gerente_numero_documento_raw,
	            'createdAt', p.created_at,
	            'updatedAt', p.updated_at
	        ),
	        'reporteResumen', rr.data,
	        'relacionesEmpresa', COALESCE(rel.data, '[]'::jsonb),
	        'conteos', jsonb_build_object(
	            'sunatDeudas', COALESCE(cnt.sunat_deudas, 0),
	            'sunatOmisiones', COALESCE(cnt.sunat_omisiones, 0),
	            'reportesExpediente', COALESCE(cnt.reportes_expediente, 0),
	            'reportesListaSimple', COALESCE(cnt.reportes_lista_simple, 0),
	            'reportesMinisterioVivienda', COALESCE(cnt.reportes_ministerio_vivienda, 0),
	            'relacionesEmpresa', COALESCE(cnt.relaciones_empresa, 0)
	        )
	    ) AS item
	    FROM paged p
	
	    LEFT JOIN LATERAL (
	        SELECT to_jsonb(rr) - 'sujeto_id' AS data
	        FROM sujeto_reporte_resumen rr
	        WHERE rr.sujeto_id = p.sujeto_id
	    ) rr ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT jsonb_agg(
	            jsonb_build_object(
	                'relacionId', sr.id,
	                'tipoRelacion', sr.tipo_relacion,
	                'ordenLista', sr.orden_lista,
	                'observacion', sr.observacion,
	                'contexto', CASE
	                    WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
	                    ELSE NULL
	                END,
	                'empresa', jsonb_build_object(
	                    'sujetoId', e.sujeto_id,
	                    'razonSocial', e.razon_social,
	                    'nombreEmpresa', e.nombre_empresa,
	                    'rucEmpresa', e.ruc_empresa,
	                    'sunatEstadoEmpresa', e.sunat_estado_empresa,
	                    'sunatCondicionEmpresa', e.sunat_condicion_empresa
	                ),
	                'proyectos', COALESCE((
	                    SELECT jsonb_agg(
	                        jsonb_build_object(
	                            'id', pr.id,
	                            'fecha1', pr.fecha_1,
	                            'textoProyectosNatural', pr.texto_proyectos_natural
	                        )
	                        ORDER BY pr.id DESC
	                    )
	                    FROM proyecto pr
	                    WHERE pr.empresa_principal_sujeto_id = e.sujeto_id
	                ), '[]'::jsonb)
	            )
	            ORDER BY sr.tipo_relacion, sr.orden_lista NULLS LAST, sr.id
	        ) AS data
	        FROM sujeto_relacion sr
	        INNER JOIN empresa e
	            ON e.sujeto_id = sr.sujeto_origen_id
	        LEFT JOIN sujeto_relacion_contexto src
	            ON src.sujeto_relacion_id = sr.id
	        WHERE sr.sujeto_destino_id = p.sujeto_id
	    ) rel ON TRUE
	
	    LEFT JOIN LATERAL (
	        SELECT
	            COUNT(*) FILTER (WHERE t = 'D') AS sunat_deudas,
	            COUNT(*) FILTER (WHERE t = 'O') AS sunat_omisiones,
	            COUNT(*) FILTER (WHERE t = 'RE') AS reportes_expediente,
	            COUNT(*) FILTER (WHERE t = 'RLS') AS reportes_lista_simple,
	            COUNT(*) FILTER (WHERE t = 'RMV') AS reportes_ministerio_vivienda,
	            COUNT(*) FILTER (WHERE t = 'REL') AS relaciones_empresa
	        FROM (
	            SELECT 'D' AS t FROM sujeto_sunat_deuda d WHERE d.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'O' AS t FROM sujeto_sunat_omision o WHERE o.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RE' AS t FROM sujeto_reporte_expediente re WHERE re.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RLS' AS t FROM sujeto_reporte_lista_simple rls WHERE rls.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'RMV' AS t FROM sujeto_reporte_ministerio_vivienda rmv WHERE rmv.sujeto_id = p.sujeto_id
	            UNION ALL
	            SELECT 'REL' AS t FROM sujeto_relacion sr WHERE sr.sujeto_destino_id = p.sujeto_id
	        ) q
	    ) cnt ON TRUE
	) z;
	$$;
-- GetById
	CREATE OR REPLACE FUNCTION fn_persona_get_by_id_json(
	    p_sujeto_id BIGINT
	)
	RETURNS JSONB
	LANGUAGE sql
	AS $$
	SELECT jsonb_build_object(
	    'id', p.sujeto_id,
	
	    'sujeto', jsonb_build_object(
	        'id', s.id,
	        'tipoSujeto', s.tipo_sujeto,
	        'jsonPathOrigen', s.json_path_origen,
	        'hashNegocio', s.hash_negocio,
	        'scoreValor', s.score_valor,
	        'nivelRiesgo', s.nivel_riesgo,
	        'cantidadRiesgosNum', s.cantidad_riesgos_num,
	        'riesgosEstadoCalificacion', s.riesgos_estado_calificacion,
	        'riesgosComportamientoPago', s.riesgos_comportamiento_pago,
	        'comportamiento13m', s.comportamiento_13m,
	        'deudaTotalTexto', s.deuda_total_texto,
	        'deudaTotalMonto', s.deuda_total_monto,
	        'deudaTotalCredito', s.deuda_total_credito,
	        'deudaTotalBanco', s.deuda_total_banco,
	        'descripcionOtrasDeudas', s.descripcion_otras_deudas,
	        'createdAt', s.created_at,
	        'updatedAt', s.updated_at
	    ),
	
	    'persona', jsonb_build_object(
	        'sujetoId', p.sujeto_id,
	        'nombreCompleto', p.nombre_completo,
	        'tipoDocumento', p.tipo_documento,
	        'tipoDocumentoRaw', p.tipo_documento_raw,
	        'numeroDocumento', p.numero_documento,
	        'rucPersonal', p.ruc_personal,
	        'domicilioFiscalPersonal', p.domicilio_fiscal_personal,
	        'estadoContribuyente', p.estado_contribuyente,
	        'condicionContribuyente', p.condicion_contribuyente,
	        'deudaPublicaSunat', p.deuda_publica_sunat,
	        'omisionesTributariasSunat', p.omisiones_tributarias_sunat,
	        'nombreJsonRaw', p.nombre_json_raw,
	        'gerenteNombreJsonRaw', p.gerente_nombre_json_raw,
	        'gerenteNumeroDocumentoRaw', p.gerente_numero_documento_raw,
	        'createdAt', p.created_at,
	        'updatedAt', p.updated_at
	    ),
	
	    'reporteResumen', rr.data,
	    'deudasSunat', COALESCE(sd.data, '[]'::jsonb),
	    'omisionesSunat', COALESCE(so.data, '[]'::jsonb),
	    'reportesExpediente', COALESCE(re.data, '[]'::jsonb),
	    'reportesListaSimple', COALESCE(rls.data, '[]'::jsonb),
	    'reportesMinisterioVivienda', COALESCE(rmv.data, '[]'::jsonb),
	    'relacionesEmpresa', COALESCE(rel.data, '[]'::jsonb)
	)
	FROM persona p
	INNER JOIN sujeto s
	    ON s.id = p.sujeto_id
	
	LEFT JOIN LATERAL (
	    SELECT to_jsonb(rr) - 'sujeto_id' AS data
	    FROM sujeto_reporte_resumen rr
	    WHERE rr.sujeto_id = p.sujeto_id
	) rr ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', sd.id,
	            'monto', sd.monto,
	            'periodo', sd.periodo,
	            'fecha', sd.fecha_texto,
	            'entidad', sd.entidad,
	            'ordenLista', sd.orden_lista,
	            'payloadItem', sd.payload_item
	        )
	        ORDER BY sd.orden_lista NULLS LAST, sd.id
	    ) AS data
	    FROM sujeto_sunat_deuda sd
	    WHERE sd.sujeto_id = p.sujeto_id
	) sd ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', so.id,
	            'monto', so.monto,
	            'periodo', so.periodo,
	            'fecha', so.fecha_texto,
	            'entidad', so.entidad,
	            'ordenLista', so.orden_lista,
	            'payloadItem', so.payload_item
	        )
	        ORDER BY so.orden_lista NULLS LAST, so.id
	    ) AS data
	    FROM sujeto_sunat_omision so
	    WHERE so.sujeto_id = p.sujeto_id
	) so ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', re.id,
	            'tipoReporte', re.tipo_reporte,
	            'expediente', re.expediente,
	            'organo', re.organo,
	            'partes', re.partes,
	            'estatus', re.estatus,
	            'ordenLista', re.orden_lista,
	            'payloadItem', re.payload_item
	        )
	        ORDER BY re.orden_lista NULLS LAST, re.id
	    ) AS data
	    FROM sujeto_reporte_expediente re
	    WHERE re.sujeto_id = p.sujeto_id
	) re ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rls.id,
	            'tipoReporte', rls.tipo_reporte,
	            'razonSocial', rls.razon_social,
	            'cantidad', rls.cantidad,
	            'ordenLista', rls.orden_lista,
	            'payloadItem', rls.payload_item
	        )
	        ORDER BY rls.orden_lista NULLS LAST, rls.id
	    ) AS data
	    FROM sujeto_reporte_lista_simple rls
	    WHERE rls.sujeto_id = p.sujeto_id
	) rls ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rmv.id,
	            'organo', rmv.organo,
	            'sancion', rmv.sancion,
	            'ordenLista', rmv.orden_lista,
	            'payloadItem', rmv.payload_item
	        )
	        ORDER BY rmv.orden_lista NULLS LAST, rmv.id
	    ) AS data
	    FROM sujeto_reporte_ministerio_vivienda rmv
	    WHERE rmv.sujeto_id = p.sujeto_id
	) rmv ON TRUE
	
    LEFT JOIN LATERAL (
      SELECT jsonb_build_object(
          'relacionId', sr.id,
          'tipoRelacion', sr.tipo_relacion,
          'ordenLista', sr.orden_lista,
          'observacion', sr.observacion,

          'scoreValor', sg.score_valor,
          'nivelRiesgo', sg.nivel_riesgo,
          'cantidadRiesgosNum', sg.cantidad_riesgos_num,
          'riesgosEstadoCalificacion', sg.riesgos_estado_calificacion,
          'riesgosComportamientoPago', sg.riesgos_comportamiento_pago,
          'comportamiento13m', sg.comportamiento_13m,
          'deudaTotalTexto', sg.deuda_total_texto,
          'deudaTotalMonto', sg.deuda_total_monto,
          'deudaTotalCredito', sg.deuda_total_credito,
          'deudaTotalBanco', sg.deuda_total_banco,
          'descripcionOtrasDeudas', sg.descripcion_otras_deudas,

          'persona', jsonb_build_object(
              'sujetoId', pg.sujeto_id,
              'nombreCompleto', pg.nombre_completo,
              'tipoDocumento', pg.tipo_documento,
              'tipoDocumentoRaw', pg.tipo_documento_raw,
              'numeroDocumento', pg.numero_documento,
              'rucPersonal', pg.ruc_personal,
              'domicilioFiscalPersonal', pg.domicilio_fiscal_personal,
              'estadoContribuyente', pg.estado_contribuyente,
              'condicionContribuyente', pg.condicion_contribuyente,
              'deudaPublicaSunat', pg.deuda_publica_sunat,
              'omisionesTributariasSunat', pg.omisiones_tributarias_sunat,
              'nombreJsonRaw', pg.nombre_json_raw,
              'gerenteNombreJsonRaw', pg.gerente_nombre_json_raw,
              'gerenteNumeroDocumentoRaw', pg.gerente_numero_documento_raw
          ),

          'lista_reporte_comision_represion', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'denunciantes', re.partes,
                      'estatus', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'COMISION_REPRESION'
          ), '[]'::jsonb),

          'lista_reporte_sala_concursal', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'denunciantes', re.partes,
                      'estatus', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'SALA_CONCURSAL'
          ), '[]'::jsonb),

          'lista_reporte_comision', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'denunciantes', re.partes,
                      'estatus', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'COMISION'
          ), '[]'::jsonb),

          'lista_reporte_proteccion', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'razon_social', rls.razon_social,
                      'cantidad', rls.cantidad,
                      'ordenLista', rls.orden_lista
                  )
                  ORDER BY rls.orden_lista NULLS LAST, rls.id
              )
              FROM sujeto_reporte_lista_simple rls
              WHERE rls.sujeto_id = pg.sujeto_id
                AND rls.tipo_reporte = 'PROTECCION'
          ), '[]'::jsonb),

          'lista_reporte_juzgado_civil', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'demandantes', re.partes,
                      'status', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'JUZGADO_CIVIL'
          ), '[]'::jsonb),

          'lista_reporte_juzgado_familiar', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'demandantes', re.partes,
                      'status', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'JUZGADO_FAMILIAR'
          ), '[]'::jsonb),

          'lista_reporte_juzgado_laboral', COALESCE((
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'expediente', re.expediente,
                      'organo', re.organo,
                      'demandantes', re.partes,
                      'status', re.estatus,
                      'ordenLista', re.orden_lista
                  )
                  ORDER BY re.orden_lista NULLS LAST, re.id
              )
              FROM sujeto_reporte_expediente re
              WHERE re.sujeto_id = pg.sujeto_id
                AND re.tipo_reporte = 'JUZGADO_LABORAL'
          ), '[]'::jsonb)
      ) AS data
      FROM sujeto_relacion sr
      INNER JOIN persona pg
          ON pg.sujeto_id = sr.sujeto_destino_id
      INNER JOIN sujeto sg
          ON sg.id = pg.sujeto_id
      WHERE sr.sujeto_origen_id = e.sujeto_id
        AND sr.tipo_relacion = 'GERENTE_GENERAL'
      ORDER BY sr.orden_lista NULLS LAST, sr.id
      LIMIT 1
  ) gg ON TRUE
	
	WHERE p.sujeto_id = p_sujeto_id;
	$$;

-- PROYECTO
--GETALL
CREATE OR REPLACE FUNCTION fn_proyecto_get_all_json(
    p_page_number INTEGER DEFAULT 1,
    p_page_size   INTEGER DEFAULT 20,
    p_search_term TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE sql
AS $$
WITH base AS (
    SELECT
        pr.*,
        e.nombre_empresa,
        e.razon_social,
        e.ruc_empresa,
        e.sunat_estado_empresa,
        e.sunat_condicion_empresa,
        s.score_valor,
        s.nivel_riesgo
    FROM proyecto pr
    INNER JOIN empresa e
        ON e.sujeto_id = pr.empresa_principal_sujeto_id
    INNER JOIN sujeto s
        ON s.id = e.sujeto_id
    WHERE
        COALESCE(BTRIM(p_search_term), '') = ''
        OR (
            CAST(pr.id AS TEXT) ILIKE '%' || p_search_term || '%'
            OR COALESCE(pr.fecha_1, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(pr.texto_proyectos_natural, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(e.razon_social, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(e.ruc_empresa, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(e.nombre_empresa, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(e.objeto_social, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(s.score_valor, '') ILIKE '%' || p_search_term || '%'
            OR COALESCE(s.nivel_riesgo, '') ILIKE '%' || p_search_term || '%'

            OR EXISTS (
                SELECT 1
                FROM sujeto_relacion sr
                INNER JOIN persona p ON p.sujeto_id = sr.sujeto_destino_id
                WHERE sr.sujeto_origen_id = e.sujeto_id
                  AND sr.tipo_relacion = 'GERENTE_GENERAL'
                  AND (
                      COALESCE(p.nombre_completo, '') ILIKE '%' || p_search_term || '%'
                      OR COALESCE(p.numero_documento, '') ILIKE '%' || p_search_term || '%'
                  )
            )

            OR EXISTS (
                SELECT 1
                FROM sujeto_relacion sr
                INNER JOIN sujeto sx ON sx.id = sr.sujeto_destino_id
                LEFT JOIN empresa ex ON ex.sujeto_id = sx.id
                LEFT JOIN persona px ON px.sujeto_id = sx.id
                WHERE sr.sujeto_origen_id = e.sujeto_id
                  AND sr.tipo_relacion = 'ACCIONISTA'
                  AND (
                      COALESCE(ex.razon_social, '') ILIKE '%' || p_search_term || '%'
                      OR COALESCE(ex.ruc_empresa, '') ILIKE '%' || p_search_term || '%'
                      OR COALESCE(px.nombre_completo, '') ILIKE '%' || p_search_term || '%'
                      OR COALESCE(px.numero_documento, '') ILIKE '%' || p_search_term || '%'
                  )
            )
        )
),
total AS (
    SELECT COUNT(*) AS total_records
    FROM base
),
paged AS (
    SELECT *
    FROM base
    ORDER BY id DESC
    OFFSET GREATEST((COALESCE(p_page_number, 1) - 1) * COALESCE(p_page_size, 20), 0)
    LIMIT COALESCE(p_page_size, 20)
)
SELECT jsonb_build_object(
    'data',
    COALESCE(jsonb_agg(item), '[]'::jsonb),
    'totalRecords',
    COALESCE((SELECT total_records FROM total), 0),
    'pageNumber',
    COALESCE(p_page_number, 1),
    'pageSize',
    COALESCE(p_page_size, 20)
)
FROM (
    SELECT jsonb_build_object(
        'id', p.id,
        'proyecto', jsonb_build_object(
            'id', p.id,
            'cargaLoteId', p.carga_lote_id,
            'fecha1', p.fecha_1,
            'textoProyectosNatural', p.texto_proyectos_natural,
            'empresaPrincipalSujetoId', p.empresa_principal_sujeto_id,
            'createdAt', p.created_at,
            'updatedAt', p.updated_at
        ),
        'empresaPrincipal', jsonb_build_object(
            'sujetoId', p.empresa_principal_sujeto_id,
            'nombreEmpresa', p.nombre_empresa,
            'razonSocial', p.razon_social,
            'rucEmpresa', p.ruc_empresa,
            'sunatEstadoEmpresa', p.sunat_estado_empresa,
            'sunatCondicionEmpresa', p.sunat_condicion_empresa,
            'scoreValor', p.score_valor,
            'nivelRiesgo', p.nivel_riesgo
        ),
        'cargaLote', cl.data,
        'gerenteGeneral', gg.data,
        'conteos', cnt.data
    ) AS item
    FROM paged p

    LEFT JOIN LATERAL (
        SELECT jsonb_build_object(
            'id', cl.id,
            'nombreArchivo', cl.nombre_archivo,
            'hashArchivo', cl.hash_archivo,
            'observacion', cl.observacion,
            'createdAt', cl.created_at
        ) AS data
        FROM carga_lote cl
        WHERE cl.id = p.carga_lote_id
    ) cl ON TRUE

    LEFT JOIN LATERAL (
        SELECT jsonb_build_object(
            'relacionId', sr.id,
            'tipoRelacion', sr.tipo_relacion,
            'ordenLista', sr.orden_lista,
            'persona', jsonb_build_object(
                'sujetoId', pg.sujeto_id,
                'nombreCompleto', pg.nombre_completo,
                'tipoDocumento', pg.tipo_documento,
                'numeroDocumento', pg.numero_documento,
                'rucPersonal', pg.ruc_personal
            )
        ) AS data
        FROM sujeto_relacion sr
        INNER JOIN persona pg
            ON pg.sujeto_id = sr.sujeto_destino_id
        WHERE sr.sujeto_origen_id = p.empresa_principal_sujeto_id
          AND sr.tipo_relacion = 'GERENTE_GENERAL'
        ORDER BY sr.orden_lista NULLS LAST, sr.id
        LIMIT 1
    ) gg ON TRUE

    LEFT JOIN LATERAL (
        SELECT jsonb_build_object(
            'accionistas', (
                SELECT COUNT(*)
                FROM sujeto_relacion sr
                WHERE sr.sujeto_origen_id = p.empresa_principal_sujeto_id
                  AND sr.tipo_relacion = 'ACCIONISTA'
            ),
            'representantesLegales', (
                SELECT COUNT(*)
                FROM sujeto_representante_legal rl
                WHERE rl.empresa_sujeto_id = p.empresa_principal_sujeto_id
            ),
            'sunatDeudas', (
                SELECT COUNT(*)
                FROM sujeto_sunat_deuda sd
                WHERE sd.sujeto_id = p.empresa_principal_sujeto_id
            ),
            'sunatOmisiones', (
                SELECT COUNT(*)
                FROM sujeto_sunat_omision so
                WHERE so.sujeto_id = p.empresa_principal_sujeto_id
            ),
            'reportesExpediente', (
                SELECT COUNT(*)
                FROM sujeto_reporte_expediente re
                WHERE re.sujeto_id = p.empresa_principal_sujeto_id
            ),
            'reportesListaSimple', (
                SELECT COUNT(*)
                FROM sujeto_reporte_lista_simple rls
                WHERE rls.sujeto_id = p.empresa_principal_sujeto_id
            ),
            'reportesMinisterioVivienda', (
                SELECT COUNT(*)
                FROM sujeto_reporte_ministerio_vivienda rmv
                WHERE rmv.sujeto_id = p.empresa_principal_sujeto_id
            )
        ) AS data
    ) cnt ON TRUE
) z;
$$;


-- GetById
select fn_persona_get_by_id_json(14)
	CREATE OR REPLACE FUNCTION fn_persona_get_by_id_json(
	    p_sujeto_id BIGINT
	)
	RETURNS JSONB
	LANGUAGE sql
	AS $$
	SELECT jsonb_build_object(
	    'id', p.sujeto_id,
	
	    'sujeto', jsonb_build_object(
	        'id', s.id,
	        'tipoSujeto', s.tipo_sujeto,
	        'jsonPathOrigen', s.json_path_origen,
	        'hashNegocio', s.hash_negocio,
	        'scoreValor', s.score_valor,
	        'nivelRiesgo', s.nivel_riesgo,
	        'cantidadRiesgosNum', s.cantidad_riesgos_num,
	        'riesgosEstadoCalificacion', s.riesgos_estado_calificacion,
	        'riesgosComportamientoPago', s.riesgos_comportamiento_pago,
	        'comportamiento13m', s.comportamiento_13m,
	        'deudaTotalTexto', s.deuda_total_texto,
	        'deudaTotalMonto', s.deuda_total_monto,
	        'deudaTotalCredito', s.deuda_total_credito,
	        'deudaTotalBanco', s.deuda_total_banco,
	        'descripcionOtrasDeudas', s.descripcion_otras_deudas,
	        'createdAt', s.created_at,
	        'updatedAt', s.updated_at
	    ),
	
	    'persona', jsonb_build_object(
	        'sujetoId', p.sujeto_id,
	        'nombreCompleto', p.nombre_completo,
	        'tipoDocumento', p.tipo_documento,
	        'tipoDocumentoRaw', p.tipo_documento_raw,
	        'numeroDocumento', p.numero_documento,
	        'rucPersonal', p.ruc_personal,
	        'domicilioFiscalPersonal', p.domicilio_fiscal_personal,
	        'estadoContribuyente', p.estado_contribuyente,
	        'condicionContribuyente', p.condicion_contribuyente,
	        'deudaPublicaSunat', p.deuda_publica_sunat,
	        'omisionesTributariasSunat', p.omisiones_tributarias_sunat,
	        'nombreJsonRaw', p.nombre_json_raw,
	        'gerenteNombreJsonRaw', p.gerente_nombre_json_raw,
	        'gerenteNumeroDocumentoRaw', p.gerente_numero_documento_raw,
	        'createdAt', p.created_at,
	        'updatedAt', p.updated_at
	    ),
	
	    'reporteResumen', rr.data,
	    'deudasSunat', COALESCE(sd.data, '[]'::jsonb),
	    'omisionesSunat', COALESCE(so.data, '[]'::jsonb),
	    'reportesExpediente', COALESCE(re.data, '[]'::jsonb),
	    'reportesListaSimple', COALESCE(rls.data, '[]'::jsonb),
	    'reportesMinisterioVivienda', COALESCE(rmv.data, '[]'::jsonb),
	    'relacionesEmpresa', COALESCE(rel.data, '[]'::jsonb)
	)
	FROM persona p
	INNER JOIN sujeto s
	    ON s.id = p.sujeto_id
	
	LEFT JOIN LATERAL (
	    SELECT to_jsonb(rr) - 'sujeto_id' AS data
	    FROM sujeto_reporte_resumen rr
	    WHERE rr.sujeto_id = p.sujeto_id
	) rr ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', sd.id,
	            'monto', sd.monto,
	            'periodo', sd.periodo,
	            'fecha', sd.fecha_texto,
	            'entidad', sd.entidad,
	            'ordenLista', sd.orden_lista,
	            'payloadItem', sd.payload_item
	        )
	        ORDER BY sd.orden_lista NULLS LAST, sd.id
	    ) AS data
	    FROM sujeto_sunat_deuda sd
	    WHERE sd.sujeto_id = p.sujeto_id
	) sd ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', so.id,
	            'monto', so.monto,
	            'periodo', so.periodo,
	            'fecha', so.fecha_texto,
	            'entidad', so.entidad,
	            'ordenLista', so.orden_lista,
	            'payloadItem', so.payload_item
	        )
	        ORDER BY so.orden_lista NULLS LAST, so.id
	    ) AS data
	    FROM sujeto_sunat_omision so
	    WHERE so.sujeto_id = p.sujeto_id
	) so ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', re.id,
	            'tipoReporte', re.tipo_reporte,
	            'expediente', re.expediente,
	            'organo', re.organo,
	            'partes', re.partes,
	            'estatus', re.estatus,
	            'ordenLista', re.orden_lista,
	            'payloadItem', re.payload_item
	        )
	        ORDER BY re.orden_lista NULLS LAST, re.id
	    ) AS data
	    FROM sujeto_reporte_expediente re
	    WHERE re.sujeto_id = p.sujeto_id
	) re ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rls.id,
	            'tipoReporte', rls.tipo_reporte,
	            'razonSocial', rls.razon_social,
	            'cantidad', rls.cantidad,
	            'ordenLista', rls.orden_lista,
	            'payloadItem', rls.payload_item
	        )
	        ORDER BY rls.orden_lista NULLS LAST, rls.id
	    ) AS data
	    FROM sujeto_reporte_lista_simple rls
	    WHERE rls.sujeto_id = p.sujeto_id
	) rls ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'id', rmv.id,
	            'organo', rmv.organo,
	            'sancion', rmv.sancion,
	            'ordenLista', rmv.orden_lista,
	            'payloadItem', rmv.payload_item
	        )
	        ORDER BY rmv.orden_lista NULLS LAST, rmv.id
	    ) AS data
	    FROM sujeto_reporte_ministerio_vivienda rmv
	    WHERE rmv.sujeto_id = p.sujeto_id
	) rmv ON TRUE
	
	LEFT JOIN LATERAL (
	    SELECT jsonb_agg(
	        jsonb_build_object(
	            'relacionId', sr.id,
	            'proyectoId', sr.proyecto_id,
	            'sujetoOrigenId', sr.sujeto_origen_id,
	            'sujetoDestinoId', sr.sujeto_destino_id,
	            'tipoRelacion', sr.tipo_relacion,
	            'ordenLista', sr.orden_lista,
	            'observacion', sr.observacion,
	            'createdAt', sr.created_at,
	            'empresa', CASE
	                WHEN e.sujeto_id IS NOT NULL THEN jsonb_build_object(
	                    'sujetoId', e.sujeto_id,
	                    'nombreEmpresa', e.nombre_empresa,
	                    'razonSocial', e.razon_social,
	                    'rucEmpresa', e.ruc_empresa
	                )
	                ELSE NULL
	            END
	        )
	        ORDER BY sr.orden_lista NULLS LAST, sr.id
	    ) AS data
	    FROM sujeto_relacion sr
	    LEFT JOIN empresa e
	        ON e.sujeto_id = sr.sujeto_origen_id
	    WHERE sr.sujeto_destino_id = p.sujeto_id
	) rel ON TRUE
	
	WHERE p.sujeto_id = p_sujeto_id;
	$$;

------------------INSERTS


CREATE OR REPLACE FUNCTION fn_blank_to_null(p_text TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT NULLIF(BTRIM(p_text), '')
$$;

CREATE OR REPLACE FUNCTION fn_text_to_bool(p_text TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN UPPER(BTRIM(COALESCE(p_text, ''))) IN ('SI', 'SÍ', 'TRUE', '1', 'YES', 'Y') THEN TRUE
        WHEN UPPER(BTRIM(COALESCE(p_text, ''))) IN ('NO', 'FALSE', '0', 'N') THEN FALSE
        ELSE NULL
    END
$$;

CREATE OR REPLACE FUNCTION fn_map_tipo_documento(p_text TEXT)
RETURNS tipo_documento_enum
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE UPPER(BTRIM(COALESCE(p_text, '')))
        WHEN 'DNI' THEN 'DNI'::tipo_documento_enum
        WHEN 'CE' THEN 'CE'::tipo_documento_enum
        WHEN 'PASAPORTE' THEN 'PASAPORTE'::tipo_documento_enum
        WHEN 'RUC' THEN 'RUC'::tipo_documento_enum
        WHEN 'OTRO' THEN 'OTRO'::tipo_documento_enum
        ELSE 'NO_APLICA'::tipo_documento_enum
    END
$$;


CREATE OR REPLACE FUNCTION fn_empresa_insert_json(
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_sujeto_id BIGINT;
    v_ruc TEXT;
    v_razon_social TEXT;
    v_hash_negocio TEXT;
BEGIN
    v_ruc := fn_blank_to_null(p_payload #>> '{empresa,rucEmpresa}');
    v_razon_social := fn_blank_to_null(p_payload #>> '{empresa,razonSocial}');
    v_hash_negocio := COALESCE(
        fn_blank_to_null(p_payload #>> '{sujeto,hashNegocio}'),
        v_ruc
    );

    IF v_ruc IS NULL THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'rucEmpresa es obligatorio.'
        );
    END IF;

    IF v_razon_social IS NULL THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'razonSocial es obligatorio.'
        );
    END IF;

    IF EXISTS (
        SELECT 1
        FROM empresa
        WHERE ruc_empresa = v_ruc
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe una empresa con ese RUC.'
        );
    END IF;

    IF v_hash_negocio IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM sujeto
           WHERE hash_negocio = v_hash_negocio
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe un sujeto con ese hashNegocio.'
        );
    END IF;

    INSERT INTO sujeto (
        tipo_sujeto,
        json_path_origen,
        hash_negocio,
        score_valor,
        nivel_riesgo,
        cantidad_riesgos_num,
        riesgos_estado_calificacion,
        riesgos_comportamiento_pago,
        comportamiento_13m,
        deuda_total_texto,
        deuda_total_monto,
        deuda_total_credito,
        deuda_total_banco,
        descripcion_otras_deudas
    )
    VALUES (
        'JURIDICA',
        fn_blank_to_null(p_payload #>> '{sujeto,jsonPathOrigen}'),
        v_hash_negocio,
        fn_blank_to_null(p_payload #>> '{sujeto,scoreValor}'),
        fn_blank_to_null(p_payload #>> '{sujeto,nivelRiesgo}'),
        fn_blank_to_null(p_payload #>> '{sujeto,cantidadRiesgosNum}'),
        fn_blank_to_null(p_payload #>> '{sujeto,riesgosEstadoCalificacion}'),
        fn_blank_to_null(p_payload #>> '{sujeto,riesgosComportamientoPago}'),
        fn_blank_to_null(p_payload #>> '{sujeto,comportamiento13m}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalTexto}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalMonto}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalCredito}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalBanco}'),
        fn_blank_to_null(p_payload #>> '{sujeto,descripcionOtrasDeudas}')
    )
    RETURNING id INTO v_sujeto_id;

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
    VALUES (
        v_sujeto_id,
        fn_blank_to_null(p_payload #>> '{empresa,nombreEmpresa}'),
        v_razon_social,
        v_ruc,
        fn_blank_to_null(p_payload #>> '{empresa,partidaPersonasJuridicas}'),
        fn_blank_to_null(p_payload #>> '{empresa,partidaPersonasJuridicasDireccion}'),
        fn_blank_to_null(p_payload #>> '{empresa,domicilioFiscal}'),
        fn_blank_to_null(p_payload #>> '{empresa,fechaConstitucion}'),
        fn_blank_to_null(p_payload #>> '{empresa,objetoSocialCodigo}'),
        fn_blank_to_null(p_payload #>> '{empresa,objetoSocial}'),
        fn_blank_to_null(p_payload #>> '{empresa,sumaNumero}'),
        fn_blank_to_null(p_payload #>> '{empresa,sumaNumeroLetra}'),
        fn_blank_to_null(p_payload #>> '{empresa,valorNominal}'),
        fn_blank_to_null(p_payload #>> '{empresa,valorNominalNumero}'),
        fn_blank_to_null(p_payload #>> '{empresa,capitalMonto}'),
        fn_blank_to_null(p_payload #>> '{empresa,capitalMontoLetras}'),
        fn_blank_to_null(p_payload #>> '{empresa,capitalNumAcciones}'),
        fn_blank_to_null(p_payload #>> '{empresa,capitalValorNominal}'),
        fn_blank_to_null(p_payload #>> '{empresa,capitalValorNominalLetras}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatEstadoEmpresa}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatCondicionEmpresa}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatDeudaCoactiva}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatDeudaMontoTotal}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatOmisiones}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatOmisionesMonto}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadoresMesFecha}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadoresAnioFecha}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadores}'),
        fn_blank_to_null(p_payload #>> '{empresa,sunatPrestadores}'),
        fn_blank_to_null(p_payload #>> '{empresa,representantesLegalesResumen}'),
        fn_text_to_bool(p_payload #>> '{empresa,infoEstablecimientosAnexosSunat}'),
        fn_blank_to_null(p_payload #>> '{empresa,cantidadEstablecimientos}'),
        fn_blank_to_null(p_payload #>> '{empresa,nombresEstablecimientos}')
    );

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Empresa insertada correctamente.',
        'data', fn_empresa_get_by_id_json(v_sujeto_id)
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_persona_insert_json(
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_sujeto_id BIGINT;
    v_nombre_completo TEXT;
    v_numero_documento TEXT;
    v_tipo_documento_raw TEXT;
    v_tipo_documento tipo_documento_enum;
    v_hash_negocio TEXT;
BEGIN
    v_nombre_completo := fn_blank_to_null(p_payload #>> '{persona,nombreCompleto}');
    v_numero_documento := fn_blank_to_null(p_payload #>> '{persona,numeroDocumento}');
    v_tipo_documento_raw := COALESCE(
        fn_blank_to_null(p_payload #>> '{persona,tipoDocumentoRaw}'),
        fn_blank_to_null(p_payload #>> '{persona,tipoDocumento}')
    );
    v_tipo_documento := fn_map_tipo_documento(v_tipo_documento_raw);

    v_hash_negocio := COALESCE(
        fn_blank_to_null(p_payload #>> '{sujeto,hashNegocio}'),
        CASE
            WHEN v_numero_documento IS NOT NULL
                THEN v_tipo_documento::TEXT || '|' || v_numero_documento
            ELSE NULL
        END
    );

    IF v_nombre_completo IS NULL THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'nombreCompleto es obligatorio.'
        );
    END IF;

    IF v_numero_documento IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM persona
           WHERE tipo_documento = v_tipo_documento
             AND numero_documento = v_numero_documento
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe una persona con ese tipo y número de documento.'
        );
    END IF;

    IF v_hash_negocio IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM sujeto
           WHERE hash_negocio = v_hash_negocio
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe un sujeto con ese hashNegocio.'
        );
    END IF;

    INSERT INTO sujeto (
        tipo_sujeto,
        json_path_origen,
        hash_negocio,
        score_valor,
        nivel_riesgo,
        cantidad_riesgos_num,
        riesgos_estado_calificacion,
        riesgos_comportamiento_pago,
        comportamiento_13m,
        deuda_total_texto,
        deuda_total_monto,
        deuda_total_credito,
        deuda_total_banco,
        descripcion_otras_deudas
    )
    VALUES (
        'NATURAL',
        fn_blank_to_null(p_payload #>> '{sujeto,jsonPathOrigen}'),
        v_hash_negocio,
        fn_blank_to_null(p_payload #>> '{sujeto,scoreValor}'),
        fn_blank_to_null(p_payload #>> '{sujeto,nivelRiesgo}'),
        fn_blank_to_null(p_payload #>> '{sujeto,cantidadRiesgosNum}'),
        fn_blank_to_null(p_payload #>> '{sujeto,riesgosEstadoCalificacion}'),
        fn_blank_to_null(p_payload #>> '{sujeto,riesgosComportamientoPago}'),
        fn_blank_to_null(p_payload #>> '{sujeto,comportamiento13m}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalTexto}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalMonto}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalCredito}'),
        fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalBanco}'),
        fn_blank_to_null(p_payload #>> '{sujeto,descripcionOtrasDeudas}')
    )
    RETURNING id INTO v_sujeto_id;

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
        omisiones_tributarias_sunat,
        nombre_json_raw,
        gerente_nombre_json_raw,
        gerente_numero_documento_raw
    )
    VALUES (
        v_sujeto_id,
        v_nombre_completo,
        v_tipo_documento,
        v_tipo_documento_raw,
        v_numero_documento,
        fn_blank_to_null(p_payload #>> '{persona,rucPersonal}'),
        fn_blank_to_null(p_payload #>> '{persona,domicilioFiscalPersonal}'),
        fn_blank_to_null(p_payload #>> '{persona,estadoContribuyente}'),
        fn_blank_to_null(p_payload #>> '{persona,condicionContribuyente}'),
        fn_blank_to_null(p_payload #>> '{persona,deudaPublicaSunat}'),
        fn_blank_to_null(p_payload #>> '{persona,omisionesTributariasSunat}'),
        fn_blank_to_null(p_payload #>> '{persona,nombreJsonRaw}'),
        fn_blank_to_null(p_payload #>> '{persona,gerenteNombreJsonRaw}'),
        fn_blank_to_null(p_payload #>> '{persona,gerenteNumeroDocumentoRaw}')
    );

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Persona insertada correctamente.',
        'data', fn_persona_get_by_id_json(v_sujeto_id)
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_proyecto_insert_json(
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_proyecto_id BIGINT;
    v_empresa_principal_sujeto_id BIGINT;
    v_carga_lote_id BIGINT;
BEGIN
    v_empresa_principal_sujeto_id := NULLIF(p_payload #>> '{proyecto,empresaPrincipalSujetoId}', '')::BIGINT;
    v_carga_lote_id := NULLIF(p_payload #>> '{proyecto,cargaLoteId}', '')::BIGINT;

    IF v_empresa_principal_sujeto_id IS NULL THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'empresaPrincipalSujetoId es obligatorio.'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM empresa
        WHERE sujeto_id = v_empresa_principal_sujeto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La empresa principal no existe.'
        );
    END IF;

    IF v_carga_lote_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM carga_lote
           WHERE id = v_carga_lote_id
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'El cargaLoteId no existe.'
        );
    END IF;

    INSERT INTO proyecto (
        carga_lote_id,
        fecha_1,
        texto_proyectos_natural,
        empresa_principal_sujeto_id,
        payload_original
    )
    VALUES (
        v_carga_lote_id,
        fn_blank_to_null(p_payload #>> '{proyecto,fecha1}'),
        fn_blank_to_null(p_payload #>> '{proyecto,textoProyectosNatural}'),
        v_empresa_principal_sujeto_id,
        p_payload #> '{proyecto,payloadOriginal}'
    )
    RETURNING id INTO v_proyecto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Proyecto insertado correctamente.',
        'data', fn_proyecto_get_by_id_json(v_proyecto_id)
    );
END;
$$;

--------------------UPDATES


CREATE OR REPLACE FUNCTION fn_empresa_update_json(
    p_sujeto_id BIGINT,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_ruc_actual TEXT;
    v_ruc_nuevo TEXT;
    v_hash_nuevo TEXT;
BEGIN
    SELECT e.ruc_empresa
    INTO v_ruc_actual
    FROM empresa e
    WHERE e.sujeto_id = p_sujeto_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La empresa no existe.'
        );
    END IF;

    v_ruc_nuevo := COALESCE(
        fn_blank_to_null(p_payload #>> '{empresa,rucEmpresa}'),
        v_ruc_actual
    );

    IF EXISTS (
        SELECT 1
        FROM empresa
        WHERE ruc_empresa = v_ruc_nuevo
          AND sujeto_id <> p_sujeto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe otra empresa con ese RUC.'
        );
    END IF;

    v_hash_nuevo := COALESCE(
        fn_blank_to_null(p_payload #>> '{sujeto,hashNegocio}'),
        v_ruc_nuevo
    );

    IF v_hash_nuevo IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM sujeto
           WHERE hash_negocio = v_hash_nuevo
             AND id <> p_sujeto_id
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe otro sujeto con ese hashNegocio.'
        );
    END IF;

    UPDATE sujeto
    SET
        json_path_origen = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,jsonPathOrigen}'), json_path_origen),
        hash_negocio = v_hash_nuevo,
        score_valor = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,scoreValor}'), score_valor),
        nivel_riesgo = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,nivelRiesgo}'), nivel_riesgo),
        cantidad_riesgos_num = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,cantidadRiesgosNum}'), cantidad_riesgos_num),
        riesgos_estado_calificacion = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,riesgosEstadoCalificacion}'), riesgos_estado_calificacion),
        riesgos_comportamiento_pago = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,riesgosComportamientoPago}'), riesgos_comportamiento_pago),
        comportamiento_13m = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,comportamiento13m}'), comportamiento_13m),
        deuda_total_texto = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalTexto}'), deuda_total_texto),
        deuda_total_monto = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalMonto}'), deuda_total_monto),
        deuda_total_credito = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalCredito}'), deuda_total_credito),
        deuda_total_banco = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalBanco}'), deuda_total_banco),
        descripcion_otras_deudas = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,descripcionOtrasDeudas}'), descripcion_otras_deudas)
    WHERE id = p_sujeto_id;

    UPDATE empresa
    SET
        nombre_empresa = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,nombreEmpresa}'), nombre_empresa),
        razon_social = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,razonSocial}'), razon_social),
        ruc_empresa = v_ruc_nuevo,
        partida_personas_juridicas = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,partidaPersonasJuridicas}'), partida_personas_juridicas),
        partida_personas_juridicas_direccion = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,partidaPersonasJuridicasDireccion}'), partida_personas_juridicas_direccion),
        domicilio_fiscal = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,domicilioFiscal}'), domicilio_fiscal),
        fecha_constitucion = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,fechaConstitucion}'), fecha_constitucion),
        objeto_social_codigo = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,objetoSocialCodigo}'), objeto_social_codigo),
        objeto_social = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,objetoSocial}'), objeto_social),
        suma_numero = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sumaNumero}'), suma_numero),
        suma_numero_letra = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sumaNumeroLetra}'), suma_numero_letra),
        valor_nominal = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,valorNominal}'), valor_nominal),
        valor_nominal_numero = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,valorNominalNumero}'), valor_nominal_numero),
        capital_monto = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,capitalMonto}'), capital_monto),
        capital_monto_letras = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,capitalMontoLetras}'), capital_monto_letras),
        capital_num_acciones = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,capitalNumAcciones}'), capital_num_acciones),
        capital_valor_nominal = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,capitalValorNominal}'), capital_valor_nominal),
        capital_valor_nominal_letras = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,capitalValorNominalLetras}'), capital_valor_nominal_letras),
        sunat_estado_empresa = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatEstadoEmpresa}'), sunat_estado_empresa),
        sunat_condicion_empresa = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatCondicionEmpresa}'), sunat_condicion_empresa),
        sunat_deuda_coactiva = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatDeudaCoactiva}'), sunat_deuda_coactiva),
        sunat_deuda_monto_total = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatDeudaMontoTotal}'), sunat_deuda_monto_total),
        sunat_omisiones = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatOmisiones}'), sunat_omisiones),
        sunat_omisiones_monto = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatOmisionesMonto}'), sunat_omisiones_monto),
        sunat_trabajadores_mes_fecha = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadoresMesFecha}'), sunat_trabajadores_mes_fecha),
        sunat_trabajadores_anio_fecha = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadoresAnioFecha}'), sunat_trabajadores_anio_fecha),
        sunat_trabajadores = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatTrabajadores}'), sunat_trabajadores),
        sunat_prestadores = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,sunatPrestadores}'), sunat_prestadores),
        representantes_legales_resumen = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,representantesLegalesResumen}'), representantes_legales_resumen),
        info_establecimientos_anexos_sunat = COALESCE(fn_text_to_bool(p_payload #>> '{empresa,infoEstablecimientosAnexosSunat}'), info_establecimientos_anexos_sunat),
        cantidad_establecimientos = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,cantidadEstablecimientos}'), cantidad_establecimientos),
        nombres_establecimientos = COALESCE(fn_blank_to_null(p_payload #>> '{empresa,nombresEstablecimientos}'), nombres_establecimientos)
    WHERE sujeto_id = p_sujeto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Empresa actualizada correctamente.',
        'data', fn_empresa_get_by_id_json(p_sujeto_id)
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_persona_update_json(
    p_sujeto_id BIGINT,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_num_doc_actual TEXT;
    v_tipo_doc_actual tipo_documento_enum;
    v_num_doc_nuevo TEXT;
    v_tipo_doc_raw_nuevo TEXT;
    v_tipo_doc_nuevo tipo_documento_enum;
    v_hash_nuevo TEXT;
BEGIN
    SELECT p.numero_documento, p.tipo_documento
    INTO v_num_doc_actual, v_tipo_doc_actual
    FROM persona p
    WHERE p.sujeto_id = p_sujeto_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La persona no existe.'
        );
    END IF;

    v_num_doc_nuevo := COALESCE(
        fn_blank_to_null(p_payload #>> '{persona,numeroDocumento}'),
        v_num_doc_actual
    );

    v_tipo_doc_raw_nuevo := COALESCE(
        fn_blank_to_null(p_payload #>> '{persona,tipoDocumentoRaw}'),
        fn_blank_to_null(p_payload #>> '{persona,tipoDocumento}'),
        v_tipo_doc_actual::TEXT
    );

    v_tipo_doc_nuevo := fn_map_tipo_documento(v_tipo_doc_raw_nuevo);

    IF v_num_doc_nuevo IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM persona
           WHERE tipo_documento = v_tipo_doc_nuevo
             AND numero_documento = v_num_doc_nuevo
             AND sujeto_id <> p_sujeto_id
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe otra persona con ese tipo y número de documento.'
        );
    END IF;

    v_hash_nuevo := COALESCE(
        fn_blank_to_null(p_payload #>> '{sujeto,hashNegocio}'),
        CASE
            WHEN v_num_doc_nuevo IS NOT NULL
                THEN v_tipo_doc_nuevo::TEXT || '|' || v_num_doc_nuevo
            ELSE NULL
        END
    );

    IF v_hash_nuevo IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM sujeto
           WHERE hash_negocio = v_hash_nuevo
             AND id <> p_sujeto_id
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'Ya existe otro sujeto con ese hashNegocio.'
        );
    END IF;

    UPDATE sujeto
    SET
        json_path_origen = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,jsonPathOrigen}'), json_path_origen),
        hash_negocio = COALESCE(v_hash_nuevo, hash_negocio),
        score_valor = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,scoreValor}'), score_valor),
        nivel_riesgo = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,nivelRiesgo}'), nivel_riesgo),
        cantidad_riesgos_num = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,cantidadRiesgosNum}'), cantidad_riesgos_num),
        riesgos_estado_calificacion = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,riesgosEstadoCalificacion}'), riesgos_estado_calificacion),
        riesgos_comportamiento_pago = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,riesgosComportamientoPago}'), riesgos_comportamiento_pago),
        comportamiento_13m = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,comportamiento13m}'), comportamiento_13m),
        deuda_total_texto = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalTexto}'), deuda_total_texto),
        deuda_total_monto = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalMonto}'), deuda_total_monto),
        deuda_total_credito = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalCredito}'), deuda_total_credito),
        deuda_total_banco = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,deudaTotalBanco}'), deuda_total_banco),
        descripcion_otras_deudas = COALESCE(fn_blank_to_null(p_payload #>> '{sujeto,descripcionOtrasDeudas}'), descripcion_otras_deudas)
    WHERE id = p_sujeto_id;

    UPDATE persona
    SET
        nombre_completo = COALESCE(fn_blank_to_null(p_payload #>> '{persona,nombreCompleto}'), nombre_completo),
        tipo_documento = v_tipo_doc_nuevo,
        tipo_documento_raw = COALESCE(v_tipo_doc_raw_nuevo, tipo_documento_raw),
        numero_documento = COALESCE(v_num_doc_nuevo, numero_documento),
        ruc_personal = COALESCE(fn_blank_to_null(p_payload #>> '{persona,rucPersonal}'), ruc_personal),
        domicilio_fiscal_personal = COALESCE(fn_blank_to_null(p_payload #>> '{persona,domicilioFiscalPersonal}'), domicilio_fiscal_personal),
        estado_contribuyente = COALESCE(fn_blank_to_null(p_payload #>> '{persona,estadoContribuyente}'), estado_contribuyente),
        condicion_contribuyente = COALESCE(fn_blank_to_null(p_payload #>> '{persona,condicionContribuyente}'), condicion_contribuyente),
        deuda_publica_sunat = COALESCE(fn_blank_to_null(p_payload #>> '{persona,deudaPublicaSunat}'), deuda_publica_sunat),
        omisiones_tributarias_sunat = COALESCE(fn_blank_to_null(p_payload #>> '{persona,omisionesTributariasSunat}'), omisiones_tributarias_sunat),
        nombre_json_raw = COALESCE(fn_blank_to_null(p_payload #>> '{persona,nombreJsonRaw}'), nombre_json_raw),
        gerente_nombre_json_raw = COALESCE(fn_blank_to_null(p_payload #>> '{persona,gerenteNombreJsonRaw}'), gerente_nombre_json_raw),
        gerente_numero_documento_raw = COALESCE(fn_blank_to_null(p_payload #>> '{persona,gerenteNumeroDocumentoRaw}'), gerente_numero_documento_raw)
    WHERE sujeto_id = p_sujeto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Persona actualizada correctamente.',
        'data', fn_persona_get_by_id_json(p_sujeto_id)
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_proyecto_update_json(
    p_proyecto_id BIGINT,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_empresa_principal_sujeto_id BIGINT;
    v_carga_lote_id BIGINT;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM proyecto
        WHERE id = p_proyecto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'El proyecto no existe.'
        );
    END IF;

    v_empresa_principal_sujeto_id := COALESCE(
        NULLIF(p_payload #>> '{proyecto,empresaPrincipalSujetoId}', '')::BIGINT,
        (
            SELECT empresa_principal_sujeto_id
            FROM proyecto
            WHERE id = p_proyecto_id
        )
    );

    v_carga_lote_id := COALESCE(
        NULLIF(p_payload #>> '{proyecto,cargaLoteId}', '')::BIGINT,
        (
            SELECT carga_lote_id
            FROM proyecto
            WHERE id = p_proyecto_id
        )
    );

    IF NOT EXISTS (
        SELECT 1
        FROM empresa
        WHERE sujeto_id = v_empresa_principal_sujeto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La empresa principal no existe.'
        );
    END IF;

    IF v_carga_lote_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM carga_lote
           WHERE id = v_carga_lote_id
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'El cargaLoteId no existe.'
        );
    END IF;

    UPDATE proyecto
    SET
        carga_lote_id = v_carga_lote_id,
        fecha_1 = COALESCE(fn_blank_to_null(p_payload #>> '{proyecto,fecha1}'), fecha_1),
        texto_proyectos_natural = COALESCE(fn_blank_to_null(p_payload #>> '{proyecto,textoProyectosNatural}'), texto_proyectos_natural),
        empresa_principal_sujeto_id = v_empresa_principal_sujeto_id,
        payload_original = CASE
            WHEN p_payload #> '{proyecto,payloadOriginal}' IS NOT NULL
                THEN p_payload #> '{proyecto,payloadOriginal}'
            ELSE payload_original
        END
    WHERE id = p_proyecto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Proyecto actualizado correctamente.',
        'data', fn_proyecto_get_by_id_json(p_proyecto_id)
    );
END;
$$;

-------------------DELETES



CREATE OR REPLACE FUNCTION fn_persona_delete_json(
    p_sujeto_id BIGINT,
    p_force BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_relaciones_origen INTEGER;
    v_relaciones_destino INTEGER;
    v_sunat_deudas INTEGER;
    v_sunat_omisiones INTEGER;
    v_reportes_expediente INTEGER;
    v_reportes_lista_simple INTEGER;
    v_reportes_ministerio INTEGER;
    v_reporte_resumen INTEGER;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM persona
        WHERE sujeto_id = p_sujeto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La persona no existe.'
        );
    END IF;

    SELECT COUNT(*) INTO v_relaciones_origen
    FROM sujeto_relacion
    WHERE sujeto_origen_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_relaciones_destino
    FROM sujeto_relacion
    WHERE sujeto_destino_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_sunat_deudas
    FROM sujeto_sunat_deuda
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_sunat_omisiones
    FROM sujeto_sunat_omision
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_expediente
    FROM sujeto_reporte_expediente
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_lista_simple
    FROM sujeto_reporte_lista_simple
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_ministerio
    FROM sujeto_reporte_ministerio_vivienda
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reporte_resumen
    FROM sujeto_reporte_resumen
    WHERE sujeto_id = p_sujeto_id;

    IF NOT p_force
       AND (
            v_relaciones_origen > 0
            OR v_relaciones_destino > 0
            OR v_sunat_deudas > 0
            OR v_sunat_omisiones > 0
            OR v_reportes_expediente > 0
            OR v_reportes_lista_simple > 0
            OR v_reportes_ministerio > 0
            OR v_reporte_resumen > 0
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La persona tiene relaciones o detalles asociados. Usa p_force = true si deseas eliminar en cascada.',
            'dependencias', jsonb_build_object(
                'relacionesOrigen', v_relaciones_origen,
                'relacionesDestino', v_relaciones_destino,
                'sunatDeudas', v_sunat_deudas,
                'sunatOmisiones', v_sunat_omisiones,
                'reportesExpediente', v_reportes_expediente,
                'reportesListaSimple', v_reportes_lista_simple,
                'reportesMinisterioVivienda', v_reportes_ministerio,
                'reporteResumen', v_reporte_resumen
            )
        );
    END IF;

    DELETE FROM sujeto
    WHERE id = p_sujeto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Persona eliminada correctamente.',
        'deletedId', p_sujeto_id
    );
END;
$$;
CREATE OR REPLACE FUNCTION fn_proyecto_delete_json(
    p_proyecto_id BIGINT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM proyecto
        WHERE id = p_proyecto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'El proyecto no existe.'
        );
    END IF;

    DELETE FROM proyecto
    WHERE id = p_proyecto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Proyecto eliminado correctamente.',
        'deletedId', p_proyecto_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_empresa_delete_json(
    p_sujeto_id BIGINT,
    p_force BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_proyectos INTEGER;
    v_relaciones_origen INTEGER;
    v_relaciones_destino INTEGER;
    v_representantes INTEGER;
    v_sunat_deudas INTEGER;
    v_sunat_omisiones INTEGER;
    v_reportes_expediente INTEGER;
    v_reportes_lista_simple INTEGER;
    v_reportes_ministerio INTEGER;
    v_reporte_resumen INTEGER;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM empresa
        WHERE sujeto_id = p_sujeto_id
    ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La empresa no existe.'
        );
    END IF;

    SELECT COUNT(*) INTO v_proyectos
    FROM proyecto
    WHERE empresa_principal_sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_relaciones_origen
    FROM sujeto_relacion
    WHERE sujeto_origen_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_relaciones_destino
    FROM sujeto_relacion
    WHERE sujeto_destino_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_representantes
    FROM sujeto_representante_legal
    WHERE empresa_sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_sunat_deudas
    FROM sujeto_sunat_deuda
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_sunat_omisiones
    FROM sujeto_sunat_omision
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_expediente
    FROM sujeto_reporte_expediente
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_lista_simple
    FROM sujeto_reporte_lista_simple
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reportes_ministerio
    FROM sujeto_reporte_ministerio_vivienda
    WHERE sujeto_id = p_sujeto_id;

    SELECT COUNT(*) INTO v_reporte_resumen
    FROM sujeto_reporte_resumen
    WHERE sujeto_id = p_sujeto_id;

    IF NOT p_force
       AND (
            v_proyectos > 0
            OR v_relaciones_origen > 0
            OR v_relaciones_destino > 0
            OR v_representantes > 0
            OR v_sunat_deudas > 0
            OR v_sunat_omisiones > 0
            OR v_reportes_expediente > 0
            OR v_reportes_lista_simple > 0
            OR v_reportes_ministerio > 0
            OR v_reporte_resumen > 0
       ) THEN
        RETURN jsonb_build_object(
            'ok', FALSE,
            'message', 'La empresa tiene relaciones o detalles asociados. Usa p_force = true si deseas eliminar en cascada.',
            'dependencias', jsonb_build_object(
                'proyectos', v_proyectos,
                'relacionesOrigen', v_relaciones_origen,
                'relacionesDestino', v_relaciones_destino,
                'representantesLegales', v_representantes,
                'sunatDeudas', v_sunat_deudas,
                'sunatOmisiones', v_sunat_omisiones,
                'reportesExpediente', v_reportes_expediente,
                'reportesListaSimple', v_reportes_lista_simple,
                'reportesMinisterioVivienda', v_reportes_ministerio,
                'reporteResumen', v_reporte_resumen
            )
        );
    END IF;

    IF p_force THEN
        DELETE FROM proyecto
        WHERE empresa_principal_sujeto_id = p_sujeto_id;
    END IF;

    DELETE FROM sujeto
    WHERE id = p_sujeto_id;

    RETURN jsonb_build_object(
        'ok', TRUE,
        'message', 'Empresa eliminada correctamente.',
        'deletedId', p_sujeto_id
    );
END;
$$;


--select * from proyecto;
--select fn_proyecto_get_by_id_json(1);
/*
SELECT p.id AS proyecto_id,
       pr.empresa_principal_sujeto_id,
       sr.id AS sujeto_relacion_id,
       sr.sujeto_origen_id,
       sr.sujeto_destino_id,
       sr.tipo_relacion,
       per.sujeto_id AS gerente_sujeto_id
FROM proyecto pr
JOIN sujeto_relacion sr
  ON sr.sujeto_origen_id = pr.empresa_principal_sujeto_id
 AND sr.tipo_relacion = 'GERENTE_GENERAL'
LEFT JOIN persona per
  ON per.sujeto_id = sr.sujeto_destino_id
JOIN proyecto p
  ON p.id = pr.id
WHERE pr.id = 1;

SELECT pr.id AS proyecto_id,
       sr.id,
       sr.sujeto_origen_id,
       sr.sujeto_destino_id,
       sr.tipo_relacion,
       sr.orden_lista
FROM proyecto pr
JOIN sujeto_relacion sr
  ON sr.sujeto_origen_id = pr.empresa_principal_sujeto_id
WHERE pr.id = 1
  AND sr.tipo_relacion = 'ACCIONISTA'
ORDER BY sr.orden_lista, sr.id;

SELECT sr.id,
       sr.sujeto_origen_id,
       sr.sujeto_destino_id,
       sr.tipo_relacion,
       sr.orden_lista
FROM sujeto_relacion sr
WHERE sr.tipo_relacion = 'ACCIONISTA_INTERNO'
ORDER BY sr.sujeto_origen_id, sr.orden_lista, sr.id;

SELECT *
FROM sujeto_sunat_deuda
WHERE sujeto_id = 1;
SELECT *
FROM sujeto_sunat_omision
WHERE sujeto_id = 1;

SELECT *
FROM sujeto_representante_legal
WHERE empresa_sujeto_id = 1;



SELECT *
FROM sujeto_reporte_expediente
WHERE sujeto_id = 1;

SELECT *
FROM sujeto_reporte_lista_simple
WHERE sujeto_id = 1;

SELECT *
FROM sujeto_reporte_ministerio_vivienda
WHERE sujeto_id = 1;
*/


-- FUNCTION: public.fn_proyecto_get_by_id_json(bigint)

-- DROP FUNCTION IF EXISTS public.fn_proyecto_get_by_id_json(bigint);

CREATE OR REPLACE FUNCTION public.fn_proyecto_get_by_id_json(
	p_proyecto_id bigint)
    RETURNS jsonb
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
SELECT jsonb_build_object(
    'id', pr.id,

    'proyecto', jsonb_build_object(
        'id', pr.id,
        'cargaLoteId', pr.carga_lote_id,
        'fecha1', pr.fecha_1,
        'textoProyectosNatural', pr.texto_proyectos_natural,
        'empresaPrincipalSujetoId', pr.empresa_principal_sujeto_id,
        'payloadOriginal', pr.payload_original,
        'createdAt', pr.created_at,
        'updatedAt', pr.updated_at
    ),

    'cargaLote', cl.data,

    'empresaPrincipal', jsonb_build_object(
        'sujetoId', e.sujeto_id,
        'nombreEmpresa', e.nombre_empresa,
        'razonSocial', e.razon_social,
        'rucEmpresa', e.ruc_empresa,
        'partidaPersonasJuridicas', e.partida_personas_juridicas,
        'partidaPersonasJuridicasDireccion', e.partida_personas_juridicas_direccion,
        'domicilioFiscal', e.domicilio_fiscal,
        'fechaConstitucion', e.fecha_constitucion,
        'objetoSocialCodigo', e.objeto_social_codigo,
        'objetoSocial', e.objeto_social,
        'sumaNumero', e.suma_numero,
        'sumaNumeroLetra', e.suma_numero_letra,
        'valorNominal', e.valor_nominal,
        'valorNominalNumero', e.valor_nominal_numero,
        'capitalMonto', e.capital_monto,
        'capitalMontoLetras', e.capital_monto_letras,
        'capitalNumAcciones', e.capital_num_acciones,
        'capitalValorNominal', e.capital_valor_nominal,
        'capitalValorNominalLetras', e.capital_valor_nominal_letras,
        'sunatEstadoEmpresa', e.sunat_estado_empresa,
        'sunatCondicionEmpresa', e.sunat_condicion_empresa,
        'sunatDeudaCoactiva', e.sunat_deuda_coactiva,
        'sunatDeudaMontoTotal', e.sunat_deuda_monto_total,
        'sunatOmisiones', e.sunat_omisiones,
        'sunatOmisionesMonto', e.sunat_omisiones_monto,
        'sunatTrabajadoresMesFecha', e.sunat_trabajadores_mes_fecha,
        'sunatTrabajadoresAnioFecha', e.sunat_trabajadores_anio_fecha,
        'sunatTrabajadores', e.sunat_trabajadores,
        'sunatPrestadores', e.sunat_prestadores,
        'representantesLegalesResumen', e.representantes_legales_resumen,
        'infoEstablecimientosAnexosSunat', e.info_establecimientos_anexos_sunat,
        'cantidadEstablecimientos', e.cantidad_establecimientos,
        'nombresEstablecimientos', e.nombres_establecimientos
    ),

    'sujetoEmpresa', jsonb_build_object(
        'id', s.id,
        'tipoSujeto', s.tipo_sujeto,
        'jsonPathOrigen', s.json_path_origen,
        'hashNegocio', s.hash_negocio,
        'scoreValor', s.score_valor,
        'nivelRiesgo', s.nivel_riesgo,
        'cantidadRiesgosNum', s.cantidad_riesgos_num,
        'riesgosEstadoCalificacion', s.riesgos_estado_calificacion,
        'riesgosComportamientoPago', s.riesgos_comportamiento_pago,
        'comportamiento13m', s.comportamiento_13m,
        'deudaTotalTexto', s.deuda_total_texto,
        'deudaTotalMonto', s.deuda_total_monto,
        'deudaTotalCredito', s.deuda_total_credito,
        'deudaTotalBanco', s.deuda_total_banco,
        'descripcionOtrasDeudas', s.descripcion_otras_deudas,
        'createdAt', s.created_at,
        'updatedAt', s.updated_at
    ),

    'reporteResumen', rr.data,
    'deudasSunat', COALESCE(sd.data, '[]'::jsonb),
    'omisionesSunat', COALESCE(so.data, '[]'::jsonb),
    'representantesLegales', COALESCE(rl.data, '[]'::jsonb),
    'reportesExpediente', COALESCE(re.data, '[]'::jsonb),
    'reportesListaSimple', COALESCE(rls.data, '[]'::jsonb),
    'reportesMinisterioVivienda', COALESCE(rmv.data, '[]'::jsonb),
    'gerenteGeneral', gg.data,
    'accionistas', COALESCE(ac.data, '[]'::jsonb)
)
FROM proyecto pr
INNER JOIN empresa e
    ON e.sujeto_id = pr.empresa_principal_sujeto_id
INNER JOIN sujeto s
    ON s.id = e.sujeto_id

LEFT JOIN LATERAL (
    SELECT jsonb_build_object(
        'id', cl.id,
        'nombreArchivo', cl.nombre_archivo,
        'hashArchivo', cl.hash_archivo,
        'observacion', cl.observacion,
        'createdAt', cl.created_at
    ) AS data
    FROM carga_lote cl
    WHERE cl.id = pr.carga_lote_id
) cl ON TRUE

LEFT JOIN LATERAL (
    SELECT to_jsonb(rr) - 'sujeto_id' AS data
    FROM sujeto_reporte_resumen rr
    WHERE rr.sujeto_id = e.sujeto_id
) rr ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', sd.id,
            'monto', sd.monto,
            'periodo', sd.periodo,
            'fecha', sd.fecha_texto,
            'entidad', sd.entidad,
            'ordenLista', sd.orden_lista,
            'payloadItem', sd.payload_item
        )
        ORDER BY sd.orden_lista NULLS LAST, sd.id
    ) AS data
    FROM sujeto_sunat_deuda sd
    WHERE sd.sujeto_id = e.sujeto_id
) sd ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', so.id,
            'monto', so.monto,
            'periodo', so.periodo,
            'fecha', so.fecha_texto,
            'entidad', so.entidad,
            'ordenLista', so.orden_lista,
            'payloadItem', so.payload_item
        )
        ORDER BY so.orden_lista NULLS LAST, so.id
    ) AS data
    FROM sujeto_sunat_omision so
    WHERE so.sujeto_id = e.sujeto_id
) so ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rl.id,
            'puestoRepresentanteLegal', rl.puesto_representante_legal,
            'fechaDesdeRepresentanteLegal', rl.fecha_desde_representante_legal,
            'nombreRepresentanteLegal', rl.nombre_representante_legal,
            'documentoRepresentanteLegal', rl.documento_representante_legal,
            'documentoNumeroRepresentanteLegal', rl.documento_numero_representante_legal,
            'ordenLista', rl.orden_lista,
            'payloadItem', rl.payload_item
        )
        ORDER BY rl.orden_lista NULLS LAST, rl.id
    ) AS data
    FROM sujeto_representante_legal rl
    WHERE rl.empresa_sujeto_id = e.sujeto_id
) rl ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', re.id,
            'tipoReporte', re.tipo_reporte,
            'expediente', re.expediente,
            'organo', re.organo,
            'partes', re.partes,
            'estatus', re.estatus,
            'ordenLista', re.orden_lista,
            'payloadItem', re.payload_item
        )
        ORDER BY re.orden_lista NULLS LAST, re.id
    ) AS data
    FROM sujeto_reporte_expediente re
    WHERE re.sujeto_id = e.sujeto_id
) re ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rls.id,
            'tipoReporte', rls.tipo_reporte,
            'razonSocial', rls.razon_social,
            'cantidad', rls.cantidad,
            'ordenLista', rls.orden_lista,
            'payloadItem', rls.payload_item
        )
        ORDER BY rls.orden_lista NULLS LAST, rls.id
    ) AS data
    FROM sujeto_reporte_lista_simple rls
    WHERE rls.sujeto_id = e.sujeto_id
) rls ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rmv.id,
            'organo', rmv.organo,
            'sancion', rmv.sancion,
            'ordenLista', rmv.orden_lista,
            'payloadItem', rmv.payload_item
        )
        ORDER BY rmv.orden_lista NULLS LAST, rmv.id
    ) AS data
    FROM sujeto_reporte_ministerio_vivienda rmv
    WHERE rmv.sujeto_id = e.sujeto_id
) rmv ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_build_object(

        'relacionId', sr.id,
        'tipoRelacion', sr.tipo_relacion,
        'ordenLista', sr.orden_lista,
        'observacion', sr.observacion,

        'scoreValor', sg.score_valor,
        'nivelRiesgo', sg.nivel_riesgo,
        'cantidadRiesgosNum', sg.cantidad_riesgos_num,
        'riesgosEstadoCalificacion', sg.riesgos_estado_calificacion,
        'riesgosComportamientoPago', sg.riesgos_comportamiento_pago,
        'comportamiento13m', sg.comportamiento_13m,
        'deudaTotalTexto', sg.deuda_total_texto,
        'deudaTotalMonto', sg.deuda_total_monto,
        'deudaTotalCredito', sg.deuda_total_credito,
        'deudaTotalBanco', sg.deuda_total_banco,
        'descripcionOtrasDeudas', sg.descripcion_otras_deudas,

        'persona', jsonb_build_object(
            'sujetoId', pg.sujeto_id,
            'nombreCompleto', pg.nombre_completo,
            'tipoDocumento', pg.tipo_documento,
            'tipoDocumentoRaw', pg.tipo_documento_raw,
            'numeroDocumento', pg.numero_documento,
            'rucPersonal', pg.ruc_personal,
            'domicilioFiscalPersonal', pg.domicilio_fiscal_personal,
            'estadoContribuyente', pg.estado_contribuyente,
            'condicionContribuyente', pg.condicion_contribuyente,
            'deudaPublicaSunat', pg.deuda_publica_sunat,
            'omisionesTributariasSunat', pg.omisiones_tributarias_sunat,
            'nombreJsonRaw', pg.nombre_json_raw,
            'gerenteNombreJsonRaw', pg.gerente_nombre_json_raw,
            'gerenteNumeroDocumentoRaw', pg.gerente_numero_documento_raw
        ),

        'lista_reporte_comision_represion', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'denunciantes', re.partes,
                    'estatus', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'COMISION_REPRESION'
        ), '[]'::jsonb),

        'reporte_comision_represion_denuncias', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'COMISION_REPRESION'
        ),

        'lista_reporte_sala_concursal', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'denunciantes', re.partes,
                    'estatus', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'SALA_CONCURSAL'
        ), '[]'::jsonb),

        'reporte_sala_concursal_denuncias', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'SALA_CONCURSAL'
        ),

        'lista_reporte_comision', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'denunciantes', re.partes,
                    'estatus', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'COMISION'
        ), '[]'::jsonb),

        'reporte_comision_denuncias', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'COMISION'
        ),

        'lista_reporte_proteccion', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'razon_social', rls.razon_social,
                    'cantidad', rls.cantidad,
                    'ordenLista', rls.orden_lista
                )
                ORDER BY rls.orden_lista NULLS LAST, rls.id
            )
            FROM sujeto_reporte_lista_simple rls
            WHERE rls.sujeto_id = pg.sujeto_id
              AND rls.tipo_reporte = 'PROTECCION'
        ), '[]'::jsonb),

        'REPORTE_PROTECCION_FECHAS', '',

        'lista_reporte_juzgado_civil', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'demandantes', re.partes,
                    'status', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_CIVIL'
        ), '[]'::jsonb),

        'REPORTE_JUZGADOS_CIVILES_CANTIDAD', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_CIVIL'
        ),

        'lista_reporte_juzgado_familiar', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'demandantes', re.partes,
                    'status', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_FAMILIAR'
        ), '[]'::jsonb),

        'REPORTE_JUZGADOS_FAMILIARES_CANTIDAD', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_FAMILIAR'
        ),

        'lista_reporte_juzgado_laboral', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'expediente', re.expediente,
                    'organo', re.organo,
                    'demandantes', re.partes,
                    'status', re.estatus,
                    'ordenLista', re.orden_lista
                )
                ORDER BY re.orden_lista NULLS LAST, re.id
            )
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_LABORAL'
        ), '[]'::jsonb),

        'REPORTE_JUZGADOS_LABORAL_CANTIDAD', (
            SELECT COUNT(*)
            FROM sujeto_reporte_expediente re
            WHERE re.sujeto_id = pg.sujeto_id
              AND re.tipo_reporte = 'JUZGADO_LABORAL'
        ),

        'lista_reporte_ministerio_vivienda', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'organo', rmv.organo,
                    'sancion', rmv.sancion,
                    'ordenLista', rmv.orden_lista
                )
                ORDER BY rmv.orden_lista NULLS LAST, rmv.id
            )
            FROM sujeto_reporte_ministerio_vivienda rmv
            WHERE rmv.sujeto_id = pg.sujeto_id
        ), '[]'::jsonb)

    ) AS data
    FROM sujeto_relacion sr
    INNER JOIN persona pg
        ON pg.sujeto_id = sr.sujeto_destino_id
    INNER JOIN sujeto sg
        ON sg.id = pg.sujeto_id
    WHERE sr.sujeto_origen_id = e.sujeto_id
      AND sr.tipo_relacion = 'GERENTE_GENERAL'
    ORDER BY sr.orden_lista NULLS LAST, sr.id
    LIMIT 1
) gg ON TRUE

LEFT JOIN LATERAL (
    SELECT jsonb_agg(
        jsonb_build_object(
            'relacionId', sr.id,
            'tipoRelacion', sr.tipo_relacion,
            'ordenLista', sr.orden_lista,
            'observacion', sr.observacion,
            'contexto', CASE
                WHEN src.id IS NOT NULL THEN to_jsonb(src) - 'id' - 'sujeto_relacion_id' - 'created_at'
                ELSE NULL
            END,
            'sujeto', jsonb_build_object(
                'id', sa.id,
                'tipoSujeto', sa.tipo_sujeto,
                'scoreValor', sa.score_valor,
                'nivelRiesgo', sa.nivel_riesgo
            ),
            'empresa', CASE
                WHEN ae.sujeto_id IS NOT NULL THEN jsonb_build_object(
                    'sujetoId', ae.sujeto_id,
                    'nombreEmpresa', ae.nombre_empresa,
                    'razonSocial', ae.razon_social,
                    'rucEmpresa', ae.ruc_empresa
                )
                ELSE NULL
            END,
            'persona', CASE
                WHEN ap.sujeto_id IS NOT NULL THEN jsonb_build_object(
                    'sujetoId', ap.sujeto_id,
                    'nombreCompleto', ap.nombre_completo,
                    'tipoDocumento', ap.tipo_documento,
                    'numeroDocumento', ap.numero_documento
                )
                ELSE NULL
            END
        )
        ORDER BY sr.orden_lista NULLS LAST, sr.id
    ) AS data
    FROM sujeto_relacion sr
    INNER JOIN sujeto sa
        ON sa.id = sr.sujeto_destino_id
    LEFT JOIN empresa ae
        ON ae.sujeto_id = sa.id
    LEFT JOIN persona ap
        ON ap.sujeto_id = sa.id
    LEFT JOIN sujeto_relacion_contexto src
        ON src.sujeto_relacion_id = sr.id
    WHERE sr.sujeto_origen_id = e.sujeto_id
      AND sr.tipo_relacion = 'ACCIONISTA'
) ac ON TRUE

WHERE pr.id = p_proyecto_id;
$BODY$;

ALTER FUNCTION public.fn_proyecto_get_by_id_json(bigint)
    OWNER TO postgres;
select * from Cargalote