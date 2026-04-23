from typing import Any


def _safe_str(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _safe_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def _safe_dict(value: Any) -> dict:
    return value if isinstance(value, dict) else {}


def _pick(*values: Any) -> str:
    for value in values:
        text = _safe_str(value)
        if text:
            return text
    return ""


def _pick_bool(*values: Any) -> bool:
    for value in values:
        if isinstance(value, bool):
            return value
        if value is not None:
            text = _safe_str(value).lower()
            if text in {"true", "1", "si", "sí", "yes"}:
                return True
            if text in {"false", "0", "no"}:
                return False
    return False


def _count_text(items: list) -> str:
    return str(len(_safe_list(items)))


def _si_o_no(items: list) -> str:
    return "Si presenta" if _safe_list(items) else "No presenta"


def _tipo_reporte(item: dict) -> str:
    return _safe_str(
        item.get("TIPO_REPORTE")
        or item.get("tipoReporte")
        or item.get("tipo_reporte")
        or _safe_dict(item.get("PAYLOAD_ITEM")).get("tipo")
        or _safe_dict(item.get("payloadItem")).get("tipo")
    ).upper()


def _payload_fechas(items: list) -> str:
    for item in _safe_list(items):
        payload = _safe_dict(item.get("PAYLOAD_ITEM") or item.get("payloadItem"))
        fechas = _safe_str(payload.get("fechas") or payload.get("FECHAS"))
        if fechas:
            return fechas
    return ""


def _normalize_deuda_item(item: dict) -> dict:
    data = _safe_dict(item)
    return {
        "ID": _safe_str(data.get("ID") or data.get("id")),
        "MONTO": _pick(data.get("MONTO"), data.get("monto")),
        "PERIODO": _pick(data.get("PERIODO"), data.get("periodo")),
        "FECHA": _pick(data.get("FECHA"), data.get("fecha"), data.get("fechaTexto")),
        "ENTIDAD": _pick(data.get("ENTIDAD"), data.get("entidad")),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "PAYLOAD_ITEM": data.get("PAYLOAD_ITEM") or data.get("payloadItem") or {},
    }


def _normalize_representante_item(item: dict) -> dict:
    data = _safe_dict(item)
    return {
        "ID": _safe_str(data.get("ID") or data.get("id")),
        "PUESTO_REPRESENTANTE_LEGAL": _pick(
            data.get("PUESTO_REPRESENTANTE_LEGAL"), data.get("puestoRepresentanteLegal")
        ),
        "FECHA_DESDE_REPRESENTANTE_LEGAL": _pick(
            data.get("FECHA_DESDE_REPRESENTANTE_LEGAL"), data.get("fechaDesdeRepresentanteLegal")
        ),
        "NOMBRE_REPRESENTANTE_LEGAL": _pick(
            data.get("NOMBRE_REPRESENTANTE_LEGAL"), data.get("nombreRepresentanteLegal")
        ),
        "DOCUMENTO_REPRESENTANTE_LEGAL": _pick(
            data.get("DOCUMENTO_REPRESENTANTE_LEGAL"), data.get("documentoRepresentanteLegal")
        ),
        "DOCUMENTO_NUMERO_REPRESENTANTE_LEGAL": _pick(
            data.get("DOCUMENTO_NUMERO_REPRESENTANTE_LEGAL"), data.get("documentoNumeroRepresentanteLegal")
        ),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "PAYLOAD_ITEM": data.get("PAYLOAD_ITEM") or data.get("payloadItem") or {},
    }


def _normalize_expediente_item(item: dict, partes_key: str) -> dict:
    data = _safe_dict(item)
    partes = _pick(
        data.get(partes_key),
        data.get(partes_key.lower()),
        data.get("PARTES"),
        data.get("partes"),
    )
    return {
        "ID": _safe_str(data.get("ID") or data.get("id")),
        "EXPEDIENTE": _pick(data.get("EXPEDIENTE"), data.get("expediente")),
        "ORGANO": _pick(data.get("ORGANO"), data.get("organo")),
        "DENUNCIANTES": partes if partes_key == "DENUNCIANTES" else "",
        "DEMANDANTES": partes if partes_key == "DEMANDANTES" else "",
        "ESTATUS": _pick(data.get("ESTATUS"), data.get("estatus"), data.get("status")),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "PAYLOAD_ITEM": data.get("PAYLOAD_ITEM") or data.get("payloadItem") or {},
    }


def _normalize_lista_simple_item(item: dict) -> dict:
    data = _safe_dict(item)
    return {
        "ID": _safe_str(data.get("ID") or data.get("id")),
        "RAZON_SOCIAL": _pick(data.get("RAZON_SOCIAL"), data.get("razonSocial"), data.get("razon_social")),
        "CANTIDAD": _pick(data.get("CANTIDAD"), data.get("cantidad")),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "PAYLOAD_ITEM": data.get("PAYLOAD_ITEM") or data.get("payloadItem") or {},
    }


def _normalize_ministerio_item(item: dict) -> dict:
    data = _safe_dict(item)
    return {
        "ID": _safe_str(data.get("ID") or data.get("id")),
        "ORGANO": _pick(data.get("ORGANO"), data.get("organo")),
        "SANCION": _pick(data.get("SANCION"), data.get("sancion")),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "PAYLOAD_ITEM": data.get("PAYLOAD_ITEM") or data.get("payloadItem") or {},
    }


def _relation_meta(source: dict) -> dict:
    data = _safe_dict(source)
    return {
        "RELACION_ID": _safe_str(data.get("RELACION_ID") or data.get("relacionId")),
        "TIPO_RELACION": _pick(data.get("TIPO_RELACION"), data.get("tipoRelacion")),
        "ORDEN_LISTA": _safe_str(data.get("ORDEN_LISTA") or data.get("ordenLista")),
        "OBSERVACION": _pick(data.get("OBSERVACION"), data.get("observacion")),
    }


def _build_deuda_list(source: dict, explicit_key: str, legacy_key: str = "") -> list:
    explicit = _safe_list(source.get(explicit_key))
    if explicit:
        return [_normalize_deuda_item(item) for item in explicit]

    if legacy_key:
        legacy = _safe_list(source.get(legacy_key))
        if legacy:
            return [_normalize_deuda_item(item) for item in legacy]

    return []


def _build_representantes_list(source: dict) -> list:
    explicit = _safe_list(source.get("LISTA_REPRESENTANTES_LEGALES"))
    if explicit:
        return [_normalize_representante_item(item) for item in explicit]

    legacy = _safe_list(source.get("lista_representantes_legales") or source.get("representantesLegales"))
    if legacy:
        return [_normalize_representante_item(item) for item in legacy]

    return []


def _build_expediente_list(source: dict, explicit_key: str, tipo: str, partes_key: str) -> list:
    explicit = _safe_list(source.get(explicit_key))
    if explicit:
        return [_normalize_expediente_item(item, partes_key) for item in explicit]

    raw = _safe_list(source.get("reportesExpediente"))
    if not raw:
        return []

    return [
        _normalize_expediente_item(item, partes_key)
        for item in raw
        if _tipo_reporte(item) == tipo
    ]


def _build_lista_simple(source: dict, explicit_key: str, tipo: str) -> list:
    explicit = _safe_list(source.get(explicit_key))
    if explicit:
        return [_normalize_lista_simple_item(item) for item in explicit]

    raw = _safe_list(source.get("reportesListaSimple"))
    if not raw:
        return []

    return [
        _normalize_lista_simple_item(item)
        for item in raw
        if _tipo_reporte(item) == tipo
    ]


def _build_ministerio_list(source: dict) -> list:
    explicit = _safe_list(source.get("LISTA_MINISTERIO_VIVIENDA"))
    if explicit:
        return [_normalize_ministerio_item(item) for item in explicit]

    legacy = _safe_list(
        source.get("lista_reporte_ministerio_vivienda")
        or source.get("lista_ministerio_vivienda")
        or source.get("reportesMinisterioVivienda")
    )
    if legacy:
        return [_normalize_ministerio_item(item) for item in legacy]

    return []


def _apply_common_report_lists(target: dict, source: dict) -> None:
    target["LISTA_REPORTE_COMISION_REPRESION"] = _build_expediente_list(
        source, "LISTA_REPORTE_COMISION_REPRESION", "COMISION_REPRESION", "DENUNCIANTES"
    )
    target["REPORTE_COMISION_REPRESION_DENUNCIAS"] = _count_text(target["LISTA_REPORTE_COMISION_REPRESION"])

    target["LISTA_REPORTE_SALA_DEFENSA"] = _build_expediente_list(
        source, "LISTA_REPORTE_SALA_DEFENSA", "SALA_DEFENSA", "DENUNCIANTES"
    )
    target["REPORTE_SALA_DEFENSA_DENUNCIAS"] = _count_text(target["LISTA_REPORTE_SALA_DEFENSA"])

    target["LISTA_REPORTE_SALA_CONCURSAL"] = _build_expediente_list(
        source, "LISTA_REPORTE_SALA_CONCURSAL", "SALA_CONCURSAL", "DENUNCIANTES"
    )
    target["REPORTE_SALA_CONCURSAL_DENUNCIAS"] = _count_text(target["LISTA_REPORTE_SALA_CONCURSAL"])

    target["LISTA_REPORTE_COMISION"] = _build_expediente_list(
        source, "LISTA_REPORTE_COMISION", "COMISION", "DENUNCIANTES"
    )
    target["REPORTE_COMISION_DENUNCIAS"] = _count_text(target["LISTA_REPORTE_COMISION"])

    target["LISTA_REPORTE_RECLAMOS"] = _build_expediente_list(
        source, "LISTA_REPORTE_RECLAMOS", "RECLAMOS", "DENUNCIANTES"
    )
    target["REPORTE_RECLAMOS_CIUDADANO"] = _count_text(target["LISTA_REPORTE_RECLAMOS"])

    target["LISTA_REPORTE_INFRACCIONES"] = _build_expediente_list(
        source, "LISTA_REPORTE_INFRACCIONES", "INFRACCIONES", "DENUNCIANTES"
    )
    target["REPORTE_INFRACCIONES"] = _count_text(target["LISTA_REPORTE_INFRACCIONES"])

    target["LISTA_REPORTE_RANKING"] = _build_lista_simple(
        source, "LISTA_REPORTE_RANKING", "RANKING_CONSTRUCTORAS"
    )
    target["REPORTE_RANKING_CONSTRUCTORAS_FECHAS"] = _pick(
        source.get("REPORTE_RANKING_CONSTRUCTORAS_FECHAS"), _payload_fechas(target["LISTA_REPORTE_RANKING"])
    )

    target["LISTA_REPORTE_PROTECCION"] = _build_lista_simple(
        source, "LISTA_REPORTE_PROTECCION", "PROTECCION"
    )
    target["REPORTE_PROTECCION_FECHAS"] = _pick(
        source.get("REPORTE_PROTECCION_FECHAS"), _payload_fechas(target["LISTA_REPORTE_PROTECCION"])
    )

    target["LISTA_REPORTE_SALA_PROTECCION"] = _build_lista_simple(
        source, "LISTA_REPORTE_SALA_PROTECCION", "SALA_PROTECCION"
    )
    target["REPORTE_SALA_PROTECCION_FECHAS"] = _pick(
        source.get("REPORTE_SALA_PROTECCION_FECHAS"), _payload_fechas(target["LISTA_REPORTE_SALA_PROTECCION"])
    )

    target["LISTA_REPORTE_COMISION_SIGNOS"] = _build_lista_simple(
        source, "LISTA_REPORTE_COMISION_SIGNOS", "COMISION_SIGNOS"
    )
    target["REPORTE_COMISION_SIGNOS_FECHAS"] = _pick(
        source.get("REPORTE_COMISION_SIGNOS_FECHAS"), _payload_fechas(target["LISTA_REPORTE_COMISION_SIGNOS"])
    )

    target["LISTA_REPORTE_COMISION_INVENTOS"] = _build_lista_simple(
        source, "LISTA_REPORTE_COMISION_INVENTOS", "COMISION_INVENTOS"
    )
    target["REPORTE_COMISION_INVENTOS_FECHAS"] = _pick(
        source.get("REPORTE_COMISION_INVENTOS_FECHAS"), _payload_fechas(target["LISTA_REPORTE_COMISION_INVENTOS"])
    )

    target["LISTA_MINISTERIO_VIVIENDA"] = _build_ministerio_list(source)
    target["REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"] = _pick(
        source.get("REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"),
        _count_text(target["LISTA_MINISTERIO_VIVIENDA"]),
    )
    target["REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"] = _pick(
        source.get("REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"),
        _si_o_no(target["LISTA_MINISTERIO_VIVIENDA"]),
    )

    target["LISTA_REPORTE_JUZGADO_CIVIL"] = _build_expediente_list(
        source, "LISTA_REPORTE_JUZGADO_CIVIL", "JUZGADO_CIVIL", "DEMANDANTES"
    )
    target["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _pick(
        source.get("REPORTE_JUZGADOS_CIVILES_CANTIDAD"),
        _count_text(target["LISTA_REPORTE_JUZGADO_CIVIL"]),
    )
    target["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _pick(
        source.get("REPORTE_JUZGADOS_CIVILES_SI_O_NO"),
        _si_o_no(target["LISTA_REPORTE_JUZGADO_CIVIL"]),
    )

    target["LISTA_REPORTE_JUZGADO_FAMILIAR"] = _build_expediente_list(
        source, "LISTA_REPORTE_JUZGADO_FAMILIAR", "JUZGADO_FAMILIAR", "DEMANDANTES"
    )
    target["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _pick(
        source.get("REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"),
        _count_text(target["LISTA_REPORTE_JUZGADO_FAMILIAR"]),
    )

    target["LISTA_REPORTE_JUZGADO_LABORAL"] = _build_expediente_list(
        source, "LISTA_REPORTE_JUZGADO_LABORAL", "JUZGADO_LABORAL", "DEMANDANTES"
    )
    target["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _pick(
        source.get("REPORTE_JUZGADOS_LABORAL_CANTIDAD"),
        _count_text(target["LISTA_REPORTE_JUZGADO_LABORAL"]),
    )
    target["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _pick(
        source.get("REPORTE_JUZGADOS_LABORAL_SI_O_NO"),
        _si_o_no(target["LISTA_REPORTE_JUZGADO_LABORAL"]),
    )


def _normalize_company(source: dict) -> dict:
    data = _safe_dict(source)
    result = {
        **_relation_meta(data),
        "TIPO": "JURIDICA",
        "SUJETO_ID": _safe_str(data.get("SUJETO_ID") or data.get("sujetoId") or data.get("id")),
        "DOCUMENTO": _pick(data.get("DOCUMENTO"), "RUC"),
        "NOMBRE": _pick(data.get("NOMBRE"), data.get("RAZON_SOCIAL"), data.get("razonSocial"), data.get("nombreEmpresa")),
        "NOMBRE_EMPRESA": _pick(data.get("NOMBRE_EMPRESA"), data.get("nombreEmpresa")),
        "RAZON_SOCIAL": _pick(data.get("RAZON_SOCIAL"), data.get("razonSocial")),
        "RUC": _pick(data.get("RUC"), data.get("RUC_EMPRESA"), data.get("rucEmpresa")),
        "RUC_EMPRESA": _pick(data.get("RUC_EMPRESA"), data.get("rucEmpresa")),
        "PARTIDA_PERSONAS_JURIDICAS": _pick(
            data.get("PARTIDA_PERSONAS_JURIDICAS"), data.get("partidaPersonasJuridicas")
        ),
        "PARTIDA_PERSONAS_JURIDICAS_DIRECCION": _pick(
            data.get("PARTIDA_PERSONAS_JURIDICAS_DIRECCION"),
            data.get("partidaPersonasJuridicasDireccion"),
        ),
        "DOMICILIO_FISCAL": _pick(data.get("DOMICILIO_FISCAL"), data.get("domicilioFiscal")),
        "FECHA_CONSTITUCION": _pick(data.get("FECHA_CONSTITUCION"), data.get("fechaConstitucion")),
        "OBJETO_SOCIAL_CODIGO": _pick(data.get("OBJETO_SOCIAL_CODIGO"), data.get("objetoSocialCodigo")),
        "OBJETO_SOCIAL": _pick(data.get("OBJETO_SOCIAL"), data.get("objetoSocial")),
        "SUMA_NUMERO": _pick(data.get("SUMA_NUMERO"), data.get("sumaNumero")),
        "SUMA_NUMERO_LETRA": _pick(data.get("SUMA_NUMERO_LETRA"), data.get("sumaNumeroLetra")),
        "VALOR_NOMINAL": _pick(data.get("VALOR_NOMINAL"), data.get("valorNominal")),
        "VALOR_NOMINAL_NUMERO": _pick(data.get("VALOR_NOMINAL_NUMERO"), data.get("valorNominalNumero")),
        "CAPITAL_MONTO": _pick(data.get("CAPITAL_MONTO"), data.get("capitalMonto")),
        "CAPITAL_MONTO_LETRAS": _pick(data.get("CAPITAL_MONTO_LETRAS"), data.get("capitalMontoLetras")),
        "CAPITAL_NUM_ACCIONES": _pick(data.get("CAPITAL_NUM_ACCIONES"), data.get("capitalNumAcciones")),
        "CAPITAL_VALOR_NOMINAL": _pick(data.get("CAPITAL_VALOR_NOMINAL"), data.get("capitalValorNominal")),
        "CAPITAL_VALOR_NOMINAL_LETRAS": _pick(
            data.get("CAPITAL_VALOR_NOMINAL_LETRAS"), data.get("capitalValorNominalLetras")
        ),
        "SUNAT_ESTADO_EMPRESA": _pick(data.get("SUNAT_ESTADO_EMPRESA"), data.get("sunatEstadoEmpresa")),
        "SUNAT_CONDICION_EMPRESA": _pick(data.get("SUNAT_CONDICION_EMPRESA"), data.get("sunatCondicionEmpresa")),
        "SUNAT_DEUDA_COACTIVA": _pick(data.get("SUNAT_DEUDA_COACTIVA"), data.get("sunatDeudaCoactiva")),
        "MONTO_TOTAL": _pick(data.get("MONTO_TOTAL"), data.get("sunatDeudaMontoTotal")),
        "SUNAT_OMISIONES": _pick(data.get("SUNAT_OMISIONES"), data.get("sunatOmisiones")),
        "SUNAT_OMISIONES_MONTO": _pick(data.get("SUNAT_OMISIONES_MONTO"), data.get("sunatOmisionesMonto")),
        "SUNAT_TRABAJADORES_MES_FECHA": _pick(
            data.get("SUNAT_TRABAJADORES_MES_FECHA"), data.get("sunatTrabajadoresMesFecha")
        ),
        "SUNAT_TRABAJADORES_ANIO_FECHA": _pick(
            data.get("SUNAT_TRABAJADORES_ANIO_FECHA"), data.get("sunatTrabajadoresAnioFecha")
        ),
        "SUNAT_TRABAJADORES": _pick(data.get("SUNAT_TRABAJADORES"), data.get("sunatTrabajadores")),
        "SUNAT_PRESTADORES": _pick(data.get("SUNAT_PRESTADORES"), data.get("sunatPrestadores")),
        "INFO_ESTABLECIMIENTOS_ANEXOS_SUNAT": _pick_bool(
            data.get("INFO_ESTABLECIMIENTOS_ANEXOS_SUNAT"), data.get("infoEstablecimientosAnexosSunat")
        ),
        "CANTIDAD_ESTABLECIMIENTOS": _pick(data.get("CANTIDAD_ESTABLECIMIENTOS"), data.get("cantidadEstablecimientos")),
        "NOMBRES_ESTABLECIMIENTOS": _pick(data.get("NOMBRES_ESTABLECIMIENTOS"), data.get("nombresEstablecimientos")),
        "SCORE_VALOR": _pick(data.get("SCORE_VALOR"), data.get("scoreValor")),
        "NIVEL_RIESGO": _pick(data.get("NIVEL_RIESGO"), data.get("nivelRiesgo")),
        "EMPRESAS_RIESGO_NUM": _pick(data.get("EMPRESAS_RIESGO_NUM"), data.get("cantidadRiesgosNum")),
        "RIESGOS_ESTADO_CALIFICACION": _pick(
            data.get("RIESGOS_ESTADO_CALIFICACION"), data.get("riesgosEstadoCalificacion")
        ),
        "RIESGOS_COMPORTAMIENTO_PAGO": _pick(
            data.get("RIESGOS_COMPORTAMIENTO_PAGO"), data.get("riesgosComportamientoPago")
        ),
        "DEUDA_TOTAL_TEXTO": _pick(data.get("DEUDA_TOTAL_TEXTO"), data.get("deudaTotalTexto")),
        "DEUDA_TOTAL_MONTO": _pick(data.get("DEUDA_TOTAL_MONTO"), data.get("deudaTotalMonto")),
        "DEUDA_TOTAL_CREDITO": _pick(data.get("DEUDA_TOTAL_CREDITO"), data.get("deudaTotalCredito")),
        "DEUDA_TOTAL_BANCO": _pick(data.get("DEUDA_TOTAL_BANCO"), data.get("deudaTotalBanco")),
        "DESCRIPCION_OTRAS_DEUDAS": _pick(
            data.get("DESCRIPCION_OTRAS_DEUDAS"), data.get("descripcionOtrasDeudas")
        ),
        "COMPORTAMIENTO_13M": _pick(data.get("COMPORTAMIENTO_13M"), data.get("comportamiento13m")),
    }

    result["LISTA_SUNAT_DEUDA"] = _build_deuda_list(data, "LISTA_SUNAT_DEUDA", "deudasSunat")
    result["LISTA_SUNAT_OMISIONES"] = _build_deuda_list(data, "LISTA_SUNAT_OMISIONES", "omisionesSunat")
    result["LISTA_REPRESENTANTES_LEGALES"] = _build_representantes_list(data)
    result["REPRESENTANTES_LEGALES_RESUMEN"] = _pick(
        data.get("REPRESENTANTES_LEGALES_RESUMEN"), _count_text(result["LISTA_REPRESENTANTES_LEGALES"])
    )

    _apply_common_report_lists(result, data)

    internos = _safe_list(data.get("ACCIONISTAS_INTERNOS"))
    result["ACCIONISTAS_INTERNOS"] = [_normalize_person_or_accionista(item) for item in internos]

    return result


def _normalize_person(source: dict) -> dict:
    data = _safe_dict(source)
    result = {
        **_relation_meta(data),
        "TIPO": "NATURAL",
        "SUJETO_ID": _safe_str(data.get("SUJETO_ID") or data.get("sujetoId") or data.get("id")),
        "NOMBRE": _pick(data.get("NOMBRE"), data.get("nombreCompleto"), data.get("nombreJsonRaw")),
        "TIPO_DOC": _pick(data.get("TIPO_DOC"), data.get("tipoDocumento"), data.get("tipoDocumentoRaw")),
        "NUM_DOC": _pick(data.get("NUM_DOC"), data.get("numeroDocumento"), data.get("gerenteNumeroDocumentoRaw")),
        "RUC": _pick(data.get("RUC"), data.get("rucPersonal")),
        "DOMICILIO_FISCAL": _pick(data.get("DOMICILIO_FISCAL"), data.get("domicilioFiscalPersonal")),
        "ESTADO_CONTRIBUYENTE": _pick(data.get("ESTADO_CONTRIBUYENTE"), data.get("estadoContribuyente")),
        "CONDICION_CONTRIBUYENTE": _pick(
            data.get("CONDICION_CONTRIBUYENTE"), data.get("condicionContribuyente")
        ),
        "DEUDA_PUBLICA_SUNAT": _pick(data.get("DEUDA_PUBLICA_SUNAT"), data.get("deudaPublicaSunat")),
        "OMISIONES_TRIBUTARIAS_SUNAT": _pick(
            data.get("OMISIONES_TRIBUTARIAS_SUNAT"), data.get("omisionesTributariasSunat")
        ),
        "SCORE_VALOR": _pick(data.get("SCORE_VALOR"), data.get("scoreValor")),
        "NIVEL_RIESGO": _pick(data.get("NIVEL_RIESGO"), data.get("nivelRiesgo")),
        "PERSONAS_RIESGO_NUM": _pick(data.get("PERSONAS_RIESGO_NUM"), data.get("cantidadRiesgosNum")),
        "RIESGOS_ESTADO_CALIFICACION": _pick(
            data.get("RIESGOS_ESTADO_CALIFICACION"), data.get("riesgosEstadoCalificacion")
        ),
        "RIESGOS_COMPORTAMIENTO_PAGO": _pick(
            data.get("RIESGOS_COMPORTAMIENTO_PAGO"), data.get("riesgosComportamientoPago")
        ),
        "DEUDA_TOTAL_TEXTO": _pick(data.get("DEUDA_TOTAL_TEXTO"), data.get("deudaTotalTexto")),
        "DEUDA_TOTAL_MONTO": _pick(data.get("DEUDA_TOTAL_MONTO"), data.get("deudaTotalMonto")),
        "DEUDA_TOTAL_CREDITO": _pick(data.get("DEUDA_TOTAL_CREDITO"), data.get("deudaTotalCredito")),
        "DEUDA_TOTAL_BANCO": _pick(data.get("DEUDA_TOTAL_BANCO"), data.get("deudaTotalBanco")),
        "DESCRIPCION_OTRAS_DEUDAS": _pick(
            data.get("DESCRIPCION_OTRAS_DEUDAS"), data.get("descripcionOtrasDeudas")
        ),
        "COMPORTAMIENTO_13M": _pick(data.get("COMPORTAMIENTO_13M"), data.get("comportamiento13m")),
    }

    _apply_common_report_lists(result, data)
    result["ACCIONISTAS_INTERNOS"] = []

    return result


def _normalize_person_or_accionista(source: dict) -> dict:
    data = _safe_dict(source)

    if data.get("TIPO") in {"JURIDICA", "NATURAL"}:
        tipo = _safe_str(data.get("TIPO")).upper()
        if tipo == "JURIDICA":
            return _normalize_company(data)
        return _normalize_person(data)

    sujeto = _safe_dict(data.get("sujeto"))
    empresa = _safe_dict(data.get("empresa"))
    persona = _safe_dict(data.get("persona"))

    tipo = _safe_str(
        sujeto.get("TIPO")
        or sujeto.get("tipoSujeto")
        or data.get("TIPO")
        or data.get("tipo")
        or _safe_dict(data.get("contexto")).get("tipo")
        or _safe_dict(_safe_dict(data.get("contexto")).get("payload_fragment")).get("tipo")
    ).upper()

    merged = {}
    merged.update(data)
    merged.update(sujeto)

    if tipo == "JURIDICA":
        merged.update(empresa)
        return _normalize_company(merged)

    merged.update(persona)
    return _normalize_person(merged)


class ProyectoDocumentMapperV2:
    @staticmethod
    def to_context(data: dict) -> dict:
        payload = _safe_dict(data)

        proyecto = _safe_dict(payload.get("proyecto"))
        empresa_source = {}
        empresa_source.update(_safe_dict(payload.get("empresaPrincipal")))
        empresa_source.update(_safe_dict(payload.get("sujetoEmpresa")))
        empresa_source["LISTA_SUNAT_DEUDA"] = payload.get("deudasSunat") or empresa_source.get("LISTA_SUNAT_DEUDA")
        empresa_source["LISTA_SUNAT_OMISIONES"] = payload.get("omisionesSunat") or empresa_source.get("LISTA_SUNAT_OMISIONES")
        empresa_source["LISTA_REPRESENTANTES_LEGALES"] = payload.get("representantesLegales") or empresa_source.get("LISTA_REPRESENTANTES_LEGALES")
        empresa_source["reportesExpediente"] = payload.get("reportesExpediente") or empresa_source.get("reportesExpediente")
        empresa_source["reportesListaSimple"] = payload.get("reportesListaSimple") or empresa_source.get("reportesListaSimple")
        empresa_source["reportesMinisterioVivienda"] = payload.get("reportesMinisterioVivienda") or empresa_source.get("reportesMinisterioVivienda")

        empresa = _normalize_company(empresa_source)

        gerente_raw = _safe_dict(payload.get("gerenteGeneral"))
        gerente_source = {}
        gerente_source.update(gerente_raw)
        gerente_source.update(_safe_dict(gerente_raw.get("persona")))
        gerente_general = _normalize_person(gerente_source)

        lista_accionistas = [
            _normalize_person_or_accionista(item)
            for item in _safe_list(payload.get("accionistas"))
        ]

        context = {
            "FECHA_1": _pick(proyecto.get("FECHA_1"), proyecto.get("fecha1")),
            "TEXTO_PROYECTOS_NATURAL": _pick(
                proyecto.get("TEXTO_PROYECTOS_NATURAL"),
                proyecto.get("textoProyectosNatural"),
            ),
            "gerente_general": gerente_general,
            "LISTA_ACCIONISTAS": lista_accionistas,
        }

        for key, value in empresa.items():
            context[key] = value

        return context