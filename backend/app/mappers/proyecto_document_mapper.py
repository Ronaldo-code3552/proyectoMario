from typing import Any


def _safe_str(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _safe_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def _safe_dict(value: Any) -> dict:
    return value if isinstance(value, dict) else {}


def _si_o_no(items: list) -> str:
    return "Si presenta" if items else "No presenta"


def _cantidad(items: list) -> str:
    return str(len(items))

def _filter_by_tipo(items: list, tipo: str) -> list:
    return [item for item in items if _safe_str(item.get("tipoReporte")).upper() == tipo.upper()]


def _payload_fechas(items: list) -> str:
    for item in items:
        payload = _safe_dict(item.get("payloadItem"))
        fechas = _safe_str(payload.get("fechas"))
        if fechas:
            return fechas
    return ""
def _normalizar_expediente(item: dict, rol_partes: str = "partes") -> dict:
    data = _safe_dict(item)
    partes_valor = _safe_str(data.get("partes"))

    result = {
        **data,
        "expediente": _safe_str(data.get("expediente")),
        "organo": _safe_str(data.get("organo")),
        "estatus": _safe_str(data.get("estatus")),
        "status": _safe_str(data.get("estatus")),
        "partes": partes_valor,
        "denunciantes": partes_valor if rol_partes == "denunciantes" else "",
        "demandantes": partes_valor if rol_partes == "demandantes" else "",
    }

    return result

class ProyectoDocumentMapper:
    @staticmethod
    def to_context(data: dict) -> dict:
        proyecto = _safe_dict(data.get("proyecto"))
        empresa = _safe_dict(data.get("empresaPrincipal"))
        sujeto_empresa = _safe_dict(data.get("sujetoEmpresa"))
        gerente = _safe_dict(data.get("gerenteGeneral"))

        accionistas = _safe_list(data.get("accionistas"))
        deudas_sunat = _safe_list(data.get("deudasSunat"))
        omisiones_sunat = _safe_list(data.get("omisionesSunat"))
        representantes_legales = _safe_list(data.get("representantesLegales"))
        reportes_expediente = _safe_list(data.get("reportesExpediente"))
        reportes_lista_simple = _safe_list(data.get("reportesListaSimple"))
        reportes_ministerio_vivienda = _safe_list(data.get("reportesMinisterioVivienda"))

        gerente_context = {}
        if gerente:
            gerente_context = {
                k: _safe_str(v) if not isinstance(v, (list, dict)) else v
                for k, v in gerente.items()
            }

        gerente_persona = _safe_dict(gerente.get("persona"))

        lista_accionistas = []
        for item in accionistas:
            acc = _safe_dict(item)
            sujeto_acc = _safe_dict(acc.get("sujeto"))
            empresa_acc = _safe_dict(acc.get("empresa"))
            persona_acc = _safe_dict(acc.get("persona"))
            contexto_acc = _safe_dict(acc.get("contexto"))

            internos = _safe_list(
                acc.get("ACCIONISTAS_INTERNOS")
                or acc.get("accionistasInternos")
                or []
            )

            tipo_acc = _safe_str(
                sujeto_acc.get("tipoSujeto")
                or contexto_acc.get("tipo")
                or acc.get("TIPO")
                or acc.get("tipo")
            ).upper()

            acc_context = {
                k: _safe_str(v) if not isinstance(v, (list, dict)) else v
                for k, v in acc.items()
            }

            acc_context["TIPO"] = tipo_acc
            acc_context["ACCIONISTAS_INTERNOS"] = []

            if tipo_acc == "JURIDICA":
                razon_juridica = _safe_str(
                    empresa_acc.get("razonSocial")
                    or empresa_acc.get("nombreEmpresa")
                )
                ruc_juridica = _safe_str(empresa_acc.get("rucEmpresa"))

                acc_context["RUC_EMPRESA"] = ruc_juridica
                acc_context["RUC"] = ruc_juridica
                acc_context["NOMBRE_COMPLETO"] = razon_juridica
                acc_context["NOMBRE"] = razon_juridica
                acc_context["RAZON"] = razon_juridica
                acc_context["RAZON_SOCIAL"] = razon_juridica
                acc_context["documento"] = "RUC"
                acc_context["documento_numero"] = ruc_juridica
                acc_context["PARTIDA_PERSONAS_JURIDICAS"] = _safe_str(
                    empresa_acc.get("partidaPersonasJuridicas")
                )
                acc_context["PARTIDA_PERSONAS_JURIDICAS_DIRECCION"] = _safe_str(
                    empresa_acc.get("partidaPersonasJuridicasDireccion")
                )
                acc_context["DOMICILIO_FISCAL"] = _safe_str(
                    empresa_acc.get("domicilioFiscal")
                )
                acc_context["FECHA_CONSTITUCION"] = _safe_str(
                    empresa_acc.get("fechaConstitucion")
                )
                acc_context["OBJETO_SOCIAL_CODIGO"] = _safe_str(
                    empresa_acc.get("objetoSocialCodigo")
                )
                acc_context["OBJETO_SOCIAL"] = _safe_str(
                    empresa_acc.get("objetoSocial")
                )

                acc_context["SCORE_VALOR"] = _safe_str(
                    sujeto_acc.get("scoreValor")
                )
                acc_context["NIVEL_RIESGO"] = _safe_str(
                    sujeto_acc.get("nivelRiesgo")
                )
                acc_context["EMPRESAS_RIESGO_NUM"] = _safe_str(
                    sujeto_acc.get("cantidadRiesgosNum")
                )
                acc_context["RIESGOS_ESTADO_CALIFICACION"] = _safe_str(
                    sujeto_acc.get("riesgosEstadoCalificacion")
                )
                acc_context["RIESGOS_COMPORTAMIENTO_PAGO"] = _safe_str(
                    sujeto_acc.get("riesgosComportamientoPago")
                )
                acc_context["DEUDA_TOTAL_TEXTO"] = _safe_str(
                    sujeto_acc.get("deudaTotalTexto")
                )
                acc_context["DEUDA_TOTAL_MONTO"] = _safe_str(
                    sujeto_acc.get("deudaTotalMonto")
                )
                acc_context["DEUDA_TOTAL_CREDITO"] = _safe_str(
                    sujeto_acc.get("deudaTotalCredito")
                )
                acc_context["DEUDA_TOTAL_BANCO"] = _safe_str(
                    sujeto_acc.get("deudaTotalBanco")
                )
                acc_context["DESCRIPCION_OTRAS_DEUDAS"] = _safe_str(
                    sujeto_acc.get("descripcionOtrasDeudas")
                )
                acc_context["COMPORTAMIENTO_13M"] = _safe_str(
                    sujeto_acc.get("comportamiento13m")
                )
                acc_context["SUNAT_ESTADO_EMPRESA"] = _safe_str(
                    empresa_acc.get("sunatEstadoEmpresa")
                )
                acc_context["SUNAT_CONDICION_EMPRESA"] = _safe_str(
                    empresa_acc.get("sunatCondicionEmpresa")
                )
                acc_context["SUNAT_DEUDA_COACTIVA"] = _safe_str(
                    empresa_acc.get("sunatDeudaCoactiva")
                )
                acc_context["SUNAT_DEUDA_MONTO_TOTAL"] = _safe_str(
                    empresa_acc.get("sunatDeudaMontoTotal")
                )
                acc_context["SUNAT_OMISIONES"] = _safe_str(
                    empresa_acc.get("sunatOmisiones")
                )
                acc_context["SUNAT_OMISIONES_MONTO"] = _safe_str(
                    empresa_acc.get("sunatOmisionesMonto")
                )
                acc_context["INFO_ESTABLECIMIENTOS_ANEXOS_SUNAT"] = (
                    empresa_acc.get("infoEstablecimientosAnexosSunat", False)
                )
                acc_context["CANTIDAD_ESTABLECIMIENTOS"] = _safe_str(
                    empresa_acc.get("cantidadEstablecimientos")
                )
                acc_context["NOMBRES_ESTABLECIMIENTOS"] = _safe_str(
                    empresa_acc.get("nombresEstablecimientos")
                )
                acc_context["SUNAT_TRABAJADORES_MES_FECHA"] = _safe_str(
                    empresa_acc.get("sunatTrabajadoresMesFecha")
                )
                acc_context["SUNAT_TRABAJADORES_ANIO_FECHA"] = _safe_str(
                    empresa_acc.get("sunatTrabajadoresAnioFecha")
                )
                acc_context["SUNAT_TRABAJADORES"] = _safe_str(
                    empresa_acc.get("sunatTrabajadores")
                )
                acc_context["SUNAT_PRESTADORES"] = _safe_str(
                    empresa_acc.get("sunatPrestadores")
                )
                acc_context["REPRESENTANTES_LEGALES_RESUMEN"] = _safe_str(
                    empresa_acc.get("representantesLegalesResumen")
                )
                acc_context["SUMA_NUMERO"] = _safe_str(
                    empresa_acc.get("sumaNumero")
                )
                acc_context["SUMA_NUMERO_LETRA"] = _safe_str(
                    empresa_acc.get("sumaNumeroLetra")
                )
                acc_context["VALOR_NOMINAL"] = _safe_str(
                    empresa_acc.get("valorNominal")
                )
                acc_context["VALOR_NOMINAL_NUMERO"] = _safe_str(
                    empresa_acc.get("valorNominalNumero")
                )

                acc_context["score_valor"] = _safe_str(
                    sujeto_acc.get("scoreValor")
                )
                acc_context["nivel_riesgo"] = _safe_str(
                    sujeto_acc.get("nivelRiesgo")
                )
                acc_context["deuda_total_monto"] = _safe_str(
                    sujeto_acc.get("deudaTotalMonto")
                )
                acc_context["deuda_total_credito"] = _safe_str(
                    sujeto_acc.get("deudaTotalCredito")
                )
                acc_context["deuda_total_banco"] = _safe_str(
                    sujeto_acc.get("deudaTotalBanco")
                )
                acc_context["comportamiento_13m"] = _safe_str(
                    sujeto_acc.get("comportamiento13m")
                )

                acc_context["monto_total"] = _safe_str(
                    empresa_acc.get("sunatDeudaMontoTotal")
                )
                acc_context["monto"] = _safe_str(
                    empresa_acc.get("sunatOmisionesMonto")
                )
                reportes_exp_acc = _safe_list(acc.get("reportesExpediente"))
                reportes_ls_acc = _safe_list(acc.get("reportesListaSimple"))
                reportes_miv_acc = _safe_list(acc.get("reportesMinisterioVivienda"))
                lista_sunat_deuda_acc = _safe_list(acc.get("LISTA_SUNAT_DEUDA"))
                lista_sunat_omisiones_acc = _safe_list(acc.get("LISTA_SUNAT_OMISIONES"))
                reps_legales_acc = _safe_list(acc.get("lista_representantes_legales"))

                lista_reporte_comision_represion_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "COMISION_REPRESION")
                ]
                lista_reporte_sala_defensa_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "SALA_DEFENSA")
                ]
                lista_reporte_sala_concursal_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "SALA_CONCURSAL")
                ]
                lista_reporte_comision_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "COMISION")
                ]
                lista_reporte_juzgado_civil_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_CIVIL")
                ]
                lista_reporte_juzgado_familiar_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_FAMILIAR")
                ]
                lista_reporte_juzgado_laboral_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_LABORAL")
                ]
                lista_reporte_reclamos_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "RECLAMOS")
                ]
                lista_reporte_infracciones_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "INFRACCIONES")
                ]
                lista_reporte_ranking_acc = _filter_by_tipo(reportes_ls_acc, "RANKING_CONSTRUCTORAS")
                lista_reporte_proteccion_acc = _filter_by_tipo(reportes_ls_acc, "PROTECCION")
                lista_reporte_sala_proteccion_acc = _filter_by_tipo(reportes_ls_acc, "SALA_PROTECCION")
                lista_reporte_comision_signos_acc = _filter_by_tipo(reportes_ls_acc, "COMISION_SIGNOS")
                lista_reporte_comision_inventos_acc = _filter_by_tipo(reportes_ls_acc, "COMISION_INVENTOS")

                acc_context["LISTA_SUNAT_DEUDA"] = lista_sunat_deuda_acc
                acc_context["LISTA_SUNAT_OMISIONES"] = lista_sunat_omisiones_acc
                acc_context["lista_representantes_legales"] = reps_legales_acc

                acc_context["lista_reporte_comision_represion"] = lista_reporte_comision_represion_acc
                acc_context["reporte_comision_represion_denuncias"] = _cantidad(lista_reporte_comision_represion_acc)

                acc_context["lista_reporte_sala_defensa"] = lista_reporte_sala_defensa_acc
                acc_context["reporte_sala_defensa_denuncias"] = _cantidad(lista_reporte_sala_defensa_acc)

                acc_context["lista_reporte_sala_concursal"] = lista_reporte_sala_concursal_acc
                acc_context["reporte_sala_concursal_denuncias"] = _cantidad(lista_reporte_sala_concursal_acc)

                acc_context["lista_reporte_comision"] = lista_reporte_comision_acc
                acc_context["reporte_comision_denuncias"] = _cantidad(lista_reporte_comision_acc)

                acc_context["lista_reporte_ranking"] = lista_reporte_ranking_acc
                acc_context["REPORTE_RANKING_CONSTRUCTORAS_FECHAS"] = _payload_fechas(lista_reporte_ranking_acc)

                acc_context["lista_reporte_proteccion"] = lista_reporte_proteccion_acc
                acc_context["REPORTE_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_proteccion_acc)

                acc_context["lista_reporte_sala_proteccion"] = lista_reporte_sala_proteccion_acc
                acc_context["REPORTE_SALA_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_sala_proteccion_acc)

                acc_context["lista_reporte_comision_signos"] = lista_reporte_comision_signos_acc
                acc_context["REPORTE_COMISION_SIGNOS_FECHAS"] = _payload_fechas(lista_reporte_comision_signos_acc)

                acc_context["lista_reporte_comision_inventos"] = lista_reporte_comision_inventos_acc
                acc_context["REPORTE_COMISION_INVENTOS_FECHAS"] = _payload_fechas(lista_reporte_comision_inventos_acc)

                acc_context["lista_ministerio_vivienda"] = reportes_miv_acc
                acc_context["REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"] = _si_o_no(reportes_miv_acc)
                acc_context["REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"] = _cantidad(reportes_miv_acc)

                acc_context["lista_reporte_juzgado_civil"] = lista_reporte_juzgado_civil_acc
                acc_context["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_civil_acc)
                acc_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_civil_acc)

                acc_context["lista_reporte_juzgado_familiar"] = lista_reporte_juzgado_familiar_acc
                acc_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_familiar_acc)

                acc_context["lista_reporte_juzgado_laboral"] = lista_reporte_juzgado_laboral_acc
                acc_context["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_laboral_acc)
                acc_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _cantidad(lista_reporte_juzgado_laboral_acc)

                acc_context["monto_total"] = _safe_str(empresa_acc.get("sunatDeudaMontoTotal"))
                acc_context["monto"] = _safe_str(empresa_acc.get("sunatOmisionesMonto"))

                acc_context["lista_reporte_reclamos"] = lista_reporte_reclamos_acc
                acc_context["reporte_reclamos_ciudadano"] = _cantidad(lista_reporte_reclamos_acc)

                acc_context["lista_reporte_infracciones"] = lista_reporte_infracciones_acc
                acc_context["reporte_infracciones"] = _cantidad(lista_reporte_infracciones_acc)

            elif tipo_acc == "NATURAL":
                nombre_natural = _safe_str(persona_acc.get("nombreCompleto"))
                tipo_doc_natural = _safe_str(
                    persona_acc.get("tipoDocumento") or persona_acc.get("tipoDocumentoRaw")
                )
                num_doc_natural = _safe_str(persona_acc.get("numeroDocumento"))

                acc_context["NOMBRE_COMPLETO"] = nombre_natural
                acc_context["NOMBRE"] = nombre_natural
                acc_context["RAZON"] = nombre_natural
                acc_context["RAZON_SOCIAL"] = nombre_natural
                acc_context["documento"] = tipo_doc_natural
                acc_context["documento_numero"] = num_doc_natural

                acc_context["GERENTE_GENERAL_NOMBRE"] = nombre_natural
                acc_context["GERENTE_GENERAL_TIPO_DOC"] = tipo_doc_natural
                acc_context["GERENTE_GENERAL_NUM_DOC"] = num_doc_natural
                acc_context["RUC_GERENTE"] = _safe_str(persona_acc.get("rucPersonal"))
                acc_context["DOMINIO_FISCAL_GERENTE"] = _safe_str(
                    persona_acc.get("domicilioFiscalPersonal")
                )
                acc_context["ESTADO_CONTRIBUYENTE"] = _safe_str(
                    persona_acc.get("estadoContribuyente")
                )
                acc_context["CONDICION_CONTRIBUYENTE"] = _safe_str(
                    persona_acc.get("condicionContribuyente")
                )
                acc_context["DEUDA_PUBLICA_SUNAT"] = _safe_str(
                    persona_acc.get("deudaPublicaSunat")
                )
                acc_context["OMISIONES_TRIBUTARIAS_SUNAT"] = _safe_str(
                    persona_acc.get("omisionesTributariasSunat")
                )

                acc_context["score_valor_gerente"] = _safe_str(sujeto_acc.get("scoreValor"))
                acc_context["nivel_riesgo_gerente"] = _safe_str(sujeto_acc.get("nivelRiesgo"))
                acc_context["PERSONAS_RIESGO_NUM"] = _safe_str(sujeto_acc.get("cantidadRiesgosNum"))
                acc_context["RIESGOS_ESTADO_CALIFICACION"] = _safe_str(
                    sujeto_acc.get("riesgosEstadoCalificacion")
                )
                acc_context["RIESGOS_COMPORTAMIENTO_PAGO"] = _safe_str(
                    sujeto_acc.get("riesgosComportamientoPago")
                )
                acc_context["deuda_total_monto"] = _safe_str(sujeto_acc.get("deudaTotalMonto"))
                acc_context["deuda_total_credito"] = _safe_str(sujeto_acc.get("deudaTotalCredito"))
                acc_context["deuda_total_banco"] = _safe_str(sujeto_acc.get("deudaTotalBanco"))
                acc_context["DESCRIPCION_OTRAS_DEUDAS"] = _safe_str(
                    sujeto_acc.get("descripcionOtrasDeudas")
                )
                acc_context["comportamiento_13m"] = _safe_str(sujeto_acc.get("comportamiento13m"))

                reportes_exp_acc = _safe_list(acc.get("reportesExpediente"))
                reportes_ls_acc = _safe_list(acc.get("reportesListaSimple"))
                reportes_miv_acc = _safe_list(acc.get("reportesMinisterioVivienda"))

                lista_reporte_comision_represion_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "COMISION_REPRESION")
                ]
                lista_reporte_sala_concursal_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "SALA_CONCURSAL")
                ]
                lista_reporte_comision_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "COMISION")
                ]
                lista_reporte_reclamos_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "RECLAMOS")
                ]
                lista_reporte_infracciones_acc = [
                    _normalizar_expediente(x, "denunciantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "INFRACCIONES")
                ]
                lista_reporte_juzgado_civil_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_CIVIL")
                ]
                lista_reporte_juzgado_familiar_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_FAMILIAR")
                ]
                lista_reporte_juzgado_laboral_acc = [
                    _normalizar_expediente(x, "demandantes")
                    for x in _filter_by_tipo(reportes_exp_acc, "JUZGADO_LABORAL")
                ]

                lista_reporte_proteccion_acc = _filter_by_tipo(reportes_ls_acc, "PROTECCION")
                lista_reporte_ranking_acc = _filter_by_tipo(reportes_ls_acc, "RANKING_CONSTRUCTORAS")
                lista_reporte_sala_proteccion_acc = _filter_by_tipo(reportes_ls_acc, "SALA_PROTECCION")
                lista_reporte_comision_signos_acc = _filter_by_tipo(reportes_ls_acc, "COMISION_SIGNOS")
                lista_reporte_comision_inventos_acc = _filter_by_tipo(reportes_ls_acc, "COMISION_INVENTOS")

                acc_context["lista_reporte_comision_represion"] = lista_reporte_comision_represion_acc
                acc_context["reporte_comision_represion_denuncias"] = _cantidad(lista_reporte_comision_represion_acc)

                acc_context["lista_reporte_sala_concursal"] = lista_reporte_sala_concursal_acc
                acc_context["reporte_sala_concursal_denuncias"] = _cantidad(lista_reporte_sala_concursal_acc)

                acc_context["lista_reporte_comision"] = lista_reporte_comision_acc
                acc_context["reporte_comision_denuncias"] = _cantidad(lista_reporte_comision_acc)

                acc_context["lista_reporte_reclamos"] = lista_reporte_reclamos_acc
                acc_context["reporte_reclamos_ciudadano"] = _cantidad(lista_reporte_reclamos_acc)

                acc_context["lista_reporte_infracciones"] = lista_reporte_infracciones_acc
                acc_context["reporte_infracciones"] = _cantidad(lista_reporte_infracciones_acc)

                acc_context["lista_reporte_proteccion"] = lista_reporte_proteccion_acc
                acc_context["REPORTE_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_proteccion_acc)

                acc_context["lista_reporte_ranking"] = lista_reporte_ranking_acc
                acc_context["REPORTE_RANKING_CONSTRUCTORAS_FECHAS"] = _payload_fechas(lista_reporte_ranking_acc)

                acc_context["lista_reporte_sala_proteccion"] = lista_reporte_sala_proteccion_acc
                acc_context["REPORTE_SALA_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_sala_proteccion_acc)

                acc_context["lista_reporte_comision_signos"] = lista_reporte_comision_signos_acc
                acc_context["REPORTE_COMISION_SIGNOS_FECHAS"] = _payload_fechas(lista_reporte_comision_signos_acc)

                acc_context["lista_reporte_comision_inventos"] = lista_reporte_comision_inventos_acc
                acc_context["REPORTE_COMISION_INVENTOS_FECHAS"] = _payload_fechas(lista_reporte_comision_inventos_acc)

                acc_context["lista_reporte_juzgado_civil"] = lista_reporte_juzgado_civil_acc
                acc_context["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_civil_acc)
                acc_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_civil_acc)

                acc_context["lista_reporte_juzgado_familiar"] = lista_reporte_juzgado_familiar_acc
                acc_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_familiar_acc)

                acc_context["lista_reporte_juzgado_laboral"] = lista_reporte_juzgado_laboral_acc
                acc_context["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_laboral_acc)
                acc_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _cantidad(lista_reporte_juzgado_laboral_acc)

                acc_context["lista_reporte_ministerio_vivienda"] = reportes_miv_acc
                acc_context["REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"] = _si_o_no(reportes_miv_acc)
                acc_context["REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"] = _cantidad(reportes_miv_acc)

            for interno in internos:
                interno_dict = _safe_dict(interno)
                interno_persona = _safe_dict(interno_dict.get("persona"))
                interno_empresa = _safe_dict(interno_dict.get("empresa"))
                interno_sujeto = _safe_dict(interno_dict.get("sujeto"))

                interno_tipo = _safe_str(interno_sujeto.get("tipoSujeto")).upper()

                interno_context = {
                    k: _safe_str(v) if not isinstance(v, (list, dict)) else v
                    for k, v in interno_dict.items()
                }

                if interno_tipo == "NATURAL":
                    nombre_interno = _safe_str(interno_persona.get("nombreCompleto"))
                    tipo_doc_interno = _safe_str(
                        interno_persona.get("tipoDocumento")
                        or interno_persona.get("tipoDocumentoRaw")
                    )
                    num_doc_interno = _safe_str(interno_persona.get("numeroDocumento"))

                    interno_context["NOMBRE"] = nombre_interno
                    interno_context["documento"] = tipo_doc_interno
                    interno_context["documento_numero"] = num_doc_interno

                    interno_context["GERENTE_GENERAL_NOMBRE"] = nombre_interno
                    interno_context["GERENTE_GENERAL_TIPO_DOC"] = tipo_doc_interno
                    interno_context["GERENTE_GENERAL_NUM_DOC"] = num_doc_interno
                    interno_context["RUC_GERENTE"] = _safe_str(interno_persona.get("rucPersonal"))
                    interno_context["DOMINIO_FISCAL_GERENTE"] = _safe_str(
                        interno_persona.get("domicilioFiscalPersonal")
                    )
                    interno_context["ESTADO_CONTRIBUYENTE"] = _safe_str(
                        interno_persona.get("estadoContribuyente")
                    )
                    interno_context["CONDICION_CONTRIBUYENTE"] = _safe_str(
                        interno_persona.get("condicionContribuyente")
                    )
                    interno_context["DEUDA_PUBLICA_SUNAT"] = _safe_str(
                        interno_persona.get("deudaPublicaSunat")
                    )
                    interno_context["OMISIONES_TRIBUTARIAS_SUNAT"] = _safe_str(
                        interno_persona.get("omisionesTributariasSunat")
                    )

                    interno_context["score_valor_gerente"] = _safe_str(
                        interno_sujeto.get("scoreValor")
                    )
                    interno_context["nivel_riesgo_gerente"] = _safe_str(
                        interno_sujeto.get("nivelRiesgo")
                    )
                    interno_context["PERSONAS_RIESGO_NUM"] = _safe_str(
                        interno_sujeto.get("cantidadRiesgosNum")
                    )
                    interno_context["RIESGOS_ESTADO_CALIFICACION"] = _safe_str(
                        interno_sujeto.get("riesgosEstadoCalificacion")
                    )
                    interno_context["RIESGOS_COMPORTAMIENTO_PAGO"] = _safe_str(
                        interno_sujeto.get("riesgosComportamientoPago")
                    )
                    interno_context["deuda_total_monto"] = _safe_str(
                        interno_sujeto.get("deudaTotalMonto")
                    )
                    interno_context["deuda_total_credito"] = _safe_str(
                        interno_sujeto.get("deudaTotalCredito")
                    )
                    interno_context["deuda_total_banco"] = _safe_str(
                        interno_sujeto.get("deudaTotalBanco")
                    )
                    interno_context["DESCRIPCION_OTRAS_DEUDAS"] = _safe_str(
                        interno_sujeto.get("descripcionOtrasDeudas")
                    )
                    interno_context["comportamiento_13m"] = _safe_str(
                        interno_sujeto.get("comportamiento13m")
                    )

                    interno_context["reporte_comision_represion_denuncias"] = "0"
                    interno_context["reporte_sala_concursal_denuncias"] = "0"
                    interno_context["reporte_comision_denuncias"] = "0"
                    interno_context["REPORTE_PROTECCION_FECHAS"] = ""
                    interno_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = "0"
                    interno_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = "0"
                    interno_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = "0"
                    reportes_exp_interno = _safe_list(interno_dict.get("reportesExpediente"))
                    reportes_ls_interno = _safe_list(interno_dict.get("reportesListaSimple"))
                    reportes_miv_interno = _safe_list(interno_dict.get("reportesMinisterioVivienda"))

                    lista_reporte_comision_represion_int = [
                        _normalizar_expediente(x, "denunciantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "COMISION_REPRESION")
                    ]
                    lista_reporte_sala_concursal_int = [
                        _normalizar_expediente(x, "denunciantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "SALA_CONCURSAL")
                    ]
                    lista_reporte_comision_int = [
                        _normalizar_expediente(x, "denunciantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "COMISION")
                    ]
                    lista_reporte_reclamos_int = [
                        _normalizar_expediente(x, "denunciantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "RECLAMOS")
                    ]
                    lista_reporte_infracciones_int = [
                        _normalizar_expediente(x, "denunciantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "INFRACCIONES")
                    ]
                    lista_reporte_juzgado_civil_int = [
                        _normalizar_expediente(x, "demandantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "JUZGADO_CIVIL")
                    ]
                    lista_reporte_juzgado_familiar_int = [
                        _normalizar_expediente(x, "demandantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "JUZGADO_FAMILIAR")
                    ]
                    lista_reporte_juzgado_laboral_int = [
                        _normalizar_expediente(x, "demandantes")
                        for x in _filter_by_tipo(reportes_exp_interno, "JUZGADO_LABORAL")
                    ]
                    lista_reporte_ranking_int = _filter_by_tipo(reportes_ls_interno, "RANKING_CONSTRUCTORAS")
                    lista_reporte_sala_proteccion_int = _filter_by_tipo(reportes_ls_interno, "SALA_PROTECCION")
                    lista_reporte_comision_signos_int = _filter_by_tipo(reportes_ls_interno, "COMISION_SIGNOS")
                    lista_reporte_comision_inventos_int = _filter_by_tipo(reportes_ls_interno, "COMISION_INVENTOS")

                    lista_reporte_proteccion_int = _filter_by_tipo(reportes_ls_interno, "PROTECCION")

                    interno_context["lista_reporte_comision_represion"] = lista_reporte_comision_represion_int
                    interno_context["reporte_comision_represion_denuncias"] = _cantidad(lista_reporte_comision_represion_int)

                    interno_context["lista_reporte_sala_concursal"] = lista_reporte_sala_concursal_int
                    interno_context["reporte_sala_concursal_denuncias"] = _cantidad(lista_reporte_sala_concursal_int)

                    interno_context["lista_reporte_comision"] = lista_reporte_comision_int
                    interno_context["reporte_comision_denuncias"] = _cantidad(lista_reporte_comision_int)

                    interno_context["lista_reporte_reclamos"] = lista_reporte_reclamos_int
                    interno_context["reporte_reclamos_ciudadano"] = _cantidad(lista_reporte_reclamos_int)

                    interno_context["lista_reporte_infracciones"] = lista_reporte_infracciones_int
                    interno_context["reporte_infracciones"] = _cantidad(lista_reporte_infracciones_int)

                    interno_context["lista_reporte_proteccion"] = lista_reporte_proteccion_int
                    interno_context["REPORTE_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_proteccion_int)

                    interno_context["lista_reporte_juzgado_civil"] = lista_reporte_juzgado_civil_int
                    interno_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_civil_int)

                    interno_context["lista_reporte_juzgado_familiar"] = lista_reporte_juzgado_familiar_int
                    interno_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_familiar_int)

                    interno_context["lista_reporte_juzgado_laboral"] = lista_reporte_juzgado_laboral_int
                    interno_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _cantidad(lista_reporte_juzgado_laboral_int)

                    interno_context["lista_reporte_ministerio_vivienda"] = reportes_miv_interno
                    interno_context["REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"] = _si_o_no(reportes_miv_interno)
                    interno_context["REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"] = _cantidad(reportes_miv_interno)
                    interno_context["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_civil_int)
                    interno_context["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_laboral_int)
                
                    interno_context["lista_reporte_ranking"] = lista_reporte_ranking_int
                    interno_context["REPORTE_RANKING_CONSTRUCTORAS_FECHAS"] = _payload_fechas(lista_reporte_ranking_int)

                    interno_context["lista_reporte_sala_proteccion"] = lista_reporte_sala_proteccion_int
                    interno_context["REPORTE_SALA_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_sala_proteccion_int)

                    interno_context["lista_reporte_comision_signos"] = lista_reporte_comision_signos_int
                    interno_context["REPORTE_COMISION_SIGNOS_FECHAS"] = _payload_fechas(lista_reporte_comision_signos_int)

                    interno_context["lista_reporte_comision_inventos"] = lista_reporte_comision_inventos_int
                    interno_context["REPORTE_COMISION_INVENTOS_FECHAS"] = _payload_fechas(lista_reporte_comision_inventos_int)

                elif interno_tipo == "JURIDICA":
                    nombre_empresa_interna = _safe_str(
                        interno_empresa.get("razonSocial")
                        or interno_empresa.get("nombreEmpresa")
                    )
                    ruc_empresa_interna = _safe_str(interno_empresa.get("rucEmpresa"))

                    interno_context["NOMBRE"] = nombre_empresa_interna
                    interno_context["documento"] = "RUC"
                    interno_context["documento_numero"] = ruc_empresa_interna

                    interno_context["GERENTE_GENERAL_NOMBRE"] = nombre_empresa_interna
                    interno_context["GERENTE_GENERAL_TIPO_DOC"] = "RUC"
                    interno_context["GERENTE_GENERAL_NUM_DOC"] = ruc_empresa_interna
                    interno_context["RUC_GERENTE"] = ruc_empresa_interna
                    interno_context["DOMINIO_FISCAL_GERENTE"] = _safe_str(
                        interno_empresa.get("domicilioFiscal")
                    )
                    interno_context["ESTADO_CONTRIBUYENTE"] = _safe_str(
                        interno_empresa.get("sunatEstadoEmpresa")
                    )
                    interno_context["CONDICION_CONTRIBUYENTE"] = _safe_str(
                        interno_empresa.get("sunatCondicionEmpresa")
                    )
                    interno_context["DEUDA_PUBLICA_SUNAT"] = _safe_str(
                        interno_empresa.get("sunatDeudaCoactiva")
                    )
                    interno_context["OMISIONES_TRIBUTARIAS_SUNAT"] = _safe_str(
                        interno_empresa.get("sunatOmisiones")
                    )

                    interno_context["score_valor_gerente"] = _safe_str(
                        interno_sujeto.get("scoreValor")
                    )
                    interno_context["nivel_riesgo_gerente"] = _safe_str(
                        interno_sujeto.get("nivelRiesgo")
                    )
                    interno_context["PERSONAS_RIESGO_NUM"] = _safe_str(
                        interno_sujeto.get("cantidadRiesgosNum")
                    )
                    interno_context["RIESGOS_ESTADO_CALIFICACION"] = _safe_str(
                        interno_sujeto.get("riesgosEstadoCalificacion")
                    )
                    interno_context["RIESGOS_COMPORTAMIENTO_PAGO"] = _safe_str(
                        interno_sujeto.get("riesgosComportamientoPago")
                    )
                    interno_context["deuda_total_monto"] = _safe_str(
                        interno_sujeto.get("deudaTotalMonto")
                    )
                    interno_context["deuda_total_credito"] = _safe_str(
                        interno_sujeto.get("deudaTotalCredito")
                    )
                    interno_context["deuda_total_banco"] = _safe_str(
                        interno_sujeto.get("deudaTotalBanco")
                    )
                    interno_context["DESCRIPCION_OTRAS_DEUDAS"] = _safe_str(
                        interno_sujeto.get("descripcionOtrasDeudas")
                    )
                    interno_context["comportamiento_13m"] = _safe_str(
                        interno_sujeto.get("comportamiento13m")
                    )

                    interno_context["reporte_comision_represion_denuncias"] = "0"
                    interno_context["reporte_sala_concursal_denuncias"] = "0"
                    interno_context["reporte_comision_denuncias"] = "0"
                    interno_context["REPORTE_PROTECCION_FECHAS"] = ""
                    interno_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = "0"
                    interno_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = "0"
                    interno_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = "0"

                acc_context["ACCIONISTAS_INTERNOS"].append(interno_context)

            lista_accionistas.append(acc_context)

        lista_representantes_legales_normalizada = []
        for item in representantes_legales:
            rep = _safe_dict(item)
            lista_representantes_legales_normalizada.append({
                **rep,
                "PUESTO_REPRESENTANTE_LEGAL": _safe_str(rep.get("puestoRepresentanteLegal")),
                "FECHA_DESDE_REPRESENTANTE_LEGAL": _safe_str(rep.get("fechaDesdeRepresentanteLegal")),
                "NOMBRE_REPRESENTANTE_LEGAL": _safe_str(rep.get("nombreRepresentanteLegal")),
                "DOCUMENTO_REPRESENTANTE_LEGAL": _safe_str(rep.get("documentoRepresentanteLegal")),
                "DOCUMENTO_NUMERO_REPRESENTANTE_LEGAL": _safe_str(rep.get("documentoNumeroRepresentanteLegal")),
            })
        context = {
            "FECHA_1": _safe_str(proyecto.get("fecha1")),
            "TEXTO_PROYECTOS_NATURAL": _safe_str(proyecto.get("textoProyectosNatural")),
            "NOMBRE_EMPRESA": _safe_str(empresa.get("nombreEmpresa") or empresa.get("razonSocial")),
            "RAZON_SOCIAL": _safe_str(empresa.get("razonSocial")),
            "RUC_EMPRESA": _safe_str(empresa.get("rucEmpresa")),
            "gerente_general": gerente_context,
            "LISTA_ACCIONISTAS": lista_accionistas,
            "LISTA_SUNAT_DEUDA": deudas_sunat,
            "LISTA_SUNAT_OMISIONES": omisiones_sunat,
            "lista_representantes_legales": lista_representantes_legales_normalizada,
            "reportesExpediente": reportes_expediente,
            "reportesListaSimple": reportes_lista_simple,
            "reportesMinisterioVivienda": reportes_ministerio_vivienda,
            "TABLA_SUNAT_DEUDA": "",
        }

        for k, v in empresa.items():
            if k not in context and not isinstance(v, (list, dict)):
                context[k] = _safe_str(v)

        for k, v in sujeto_empresa.items():
            if k not in context and not isinstance(v, (list, dict)):
                context[k] = _safe_str(v)

        for k, v in proyecto.items():
            if k not in context and not isinstance(v, (list, dict)):
                context[k] = _safe_str(v)

        if gerente_context:
            for k, v in gerente_context.items():
                if k not in context and not isinstance(v, (list, dict)):
                    context[k] = _safe_str(v)

        context["DOMICILIO_FISCAL"] = _safe_str(empresa.get("domicilioFiscal"))
        context["FECHA_CONSTITUCION"] = _safe_str(empresa.get("fechaConstitucion"))
        context["OBJETO_SOCIAL"] = _safe_str(empresa.get("objetoSocial"))
        context["OBJETO_SOCIAL_CODIGO"] = _safe_str(empresa.get("objetoSocialCodigo"))
        context["CAPITAL_MONTO"] = _safe_str(empresa.get("capitalMonto"))
        context["CAPITAL_MONTO_LETRAS"] = _safe_str(empresa.get("capitalMontoLetras"))
        context["CAPITAL_NUM_ACCIONES"] = _safe_str(empresa.get("capitalNumAcciones"))
        context["VALOR_NOMINAL"] = _safe_str(empresa.get("valorNominal"))
        context["VALOR_NOMINAL_NUMERO"] = _safe_str(empresa.get("valorNominalNumero"))
        context["CAPITAL_VALOR_NOMINAL"] = _safe_str(empresa.get("capitalValorNominal"))
        context["CAPITAL_VALOR_NOMINAL_LETRAS"] = _safe_str(empresa.get("capitalValorNominalLetras"))
        context["SUMA_NUMERO"] = _safe_str(empresa.get("sumaNumero"))
        context["SUMA_NUMERO_LETRA"] = _safe_str(empresa.get("sumaNumeroLetra"))
        context["SUNAT_ESTADO_EMPRESA"] = _safe_str(empresa.get("sunatEstadoEmpresa"))
        context["SUNAT_CONDICION_EMPRESA"] = _safe_str(empresa.get("sunatCondicionEmpresa"))
        context["SUNAT_DEUDA_COACTIVA"] = _safe_str(empresa.get("sunatDeudaCoactiva"))
        context["MONTO_TOTAL"] = _safe_str(empresa.get("montoTotal"))
        context["SUNAT_DEUDA_MONTO_TOTAL"] = _safe_str(empresa.get("sunatDeudaMontoTotal"))
        context["SUNAT_OMISIONES"] = _safe_str(empresa.get("sunatOmisiones"))
        context["SUNAT_OMISIONES_MONTO"] = _safe_str(empresa.get("sunatOmisionesMonto"))
        context["SUNAT_TRABAJADORES"] = _safe_str(empresa.get("sunatTrabajadores"))
        context["SUNAT_PRESTADORES"] = _safe_str(empresa.get("sunatPrestadores"))
        context["SUNAT_TRABAJADORES_MES_FECHA"] = _safe_str(empresa.get("sunatTrabajadoresMesFecha"))
        context["SUNAT_TRABAJADORES_ANIO_FECHA"] = _safe_str(empresa.get("sunatTrabajadoresAnioFecha"))
        context["PARTIDA_PERSONAS_JURIDICAS"] = _safe_str(empresa.get("partidaPersonasJuridicas"))
        context["PARTIDA_PERSONAS_JURIDICAS_DIRECCION"] = _safe_str(empresa.get("partidaPersonasJuridicasDireccion"))
        context["NOMBRES_ESTABLECIMIENTOS"] = _safe_str(empresa.get("nombresEstablecimientos"))
        context["CANTIDAD_ESTABLECIMIENTOS"] = _safe_str(empresa.get("cantidadEstablecimientos"))
        context["REPRESENTANTES_LEGALES_RESUMEN"] = _safe_str(empresa.get("representantesLegalesResumen"))
        context["INFO_ESTABLECIMIENTOS_ANEXOS_SUNAT"] = empresa.get("infoEstablecimientosAnexosSunat", False)
        context["NOMBRE_COMERCIAL"] = _safe_str(empresa.get("nombreEmpresa"))
        context["RUC"] = _safe_str(empresa.get("rucEmpresa"))
        context["TIENE_ESTABLECIMIENTOS_ANEXOS"] = "Si presenta" if empresa.get("infoEstablecimientosAnexosSunat") else "No presenta"
        context["TEXTO_TRABAJADORES_PLAME"] = (
            f'Al mes de {context["SUNAT_TRABAJADORES_MES_FECHA"]} del {context["SUNAT_TRABAJADORES_ANIO_FECHA"]} '
            f'presenta {context["SUNAT_TRABAJADORES"]} trabajadores y {context["SUNAT_PRESTADORES"]} prestadores de servicio declarados.'
        )

        context["REPRESENTANTES_LEGALES_TEXTO"] = (
            "No se encontraron registros."
            if not representantes_legales
            else ", ".join(
                _safe_str(item.get("nombreRepresentanteLegal") or item.get("NOMBRE_REPRESENTANTE_LEGAL"))
                for item in representantes_legales
                if _safe_str(item.get("nombreRepresentanteLegal") or item.get("NOMBRE_REPRESENTANTE_LEGAL"))
            )
        )

        context["ACCIONISTAS_TEXTO"] = (
            "No se encontraron registros."
            if not lista_accionistas
            else ", ".join(
                _safe_str(item.get("NOMBRE") or item.get("NOMBRE_COMPLETO") or item.get("razonSocial") or item.get("RUC_EMPRESA"))
                for item in lista_accionistas
                if _safe_str(item.get("NOMBRE") or item.get("NOMBRE_COMPLETO") or item.get("razonSocial") or item.get("RUC_EMPRESA"))
            )
        )

        context["GERENTE_GENERAL_NOMBRE"] = _safe_str(
            gerente_persona.get("nombreCompleto")
            or gerente_persona.get("NOMBRE_COMPLETO")
            or gerente_context.get("GERENTE_GENERAL_NOMBRE")
        )
        context["GERENTE_GENERAL_TIPO_DOC"] = _safe_str(
            gerente_persona.get("tipoDocumento")
            or gerente_persona.get("TIPO_DOC")
            or gerente_persona.get("tipoDocumentoRaw")
        )
        context["GERENTE_GENERAL_NUM_DOC"] = _safe_str(
            gerente_persona.get("numeroDocumento")
            or gerente_persona.get("NUM_DOC")
            or gerente_persona.get("gerenteNumeroDocumentoRaw")
        )
        context["RUC_GERENTE"] = _safe_str(gerente_persona.get("rucPersonal"))
        context["DOMINIO_FISCAL_GERENTE"] = _safe_str(gerente_persona.get("domicilioFiscalPersonal"))
        context["ESTADO_CONTRIBUYENTE"] = _safe_str(gerente_persona.get("estadoContribuyente"))
        context["CONDICION_CONTRIBUYENTE"] = _safe_str(gerente_persona.get("condicionContribuyente"))
        context["DEUDA_PUBLICA_SUNAT"] = _safe_str(gerente_persona.get("deudaPublicaSunat"))
        context["OMISIONES_TRIBUTARIAS_SUNAT"] = _safe_str(gerente_persona.get("omisionesTributariasSunat"))

        context["score_valor_gerente"] = _safe_str(gerente_context.get("scoreValor"))
        context["nivel_riesgo_gerente"] = _safe_str(gerente_context.get("nivelRiesgo"))
        context["PERSONAS_RIESGO_NUM"] = _safe_str(gerente_context.get("cantidadRiesgosNum"))
        context["RIESGOS_ESTADO_CALIFICACION_GERENTE"] = _safe_str(gerente_context.get("riesgosEstadoCalificacion"))
        context["RIESGOS_COMPORTAMIENTO_PAGO_GERENTE"] = _safe_str(gerente_context.get("riesgosComportamientoPago"))
        context["deuda_total_monto"] = _safe_str(gerente_context.get("deudaTotalMonto"))
        context["deuda_total_credito"] = _safe_str(gerente_context.get("deudaTotalCredito"))
        context["deuda_total_banco"] = _safe_str(gerente_context.get("deudaTotalBanco"))
        context["DESCRIPCION_OTRAS_DEUDAS_GERENTE"] = _safe_str(gerente_context.get("descripcionOtrasDeudas"))
        context["comportamiento_13m"] = _safe_str(gerente_context.get("comportamiento13m"))

        gerente_context["GERENTE_GENERAL_NOMBRE"] = context["GERENTE_GENERAL_NOMBRE"]
        gerente_context["GERENTE_GENERAL_TIPO_DOC"] = context["GERENTE_GENERAL_TIPO_DOC"]
        gerente_context["GERENTE_GENERAL_NUM_DOC"] = context["GERENTE_GENERAL_NUM_DOC"]
        gerente_context["RUC_GERENTE"] = context["RUC_GERENTE"]
        gerente_context["DOMINIO_FISCAL_GERENTE"] = context["DOMINIO_FISCAL_GERENTE"]
        gerente_context["ESTADO_CONTRIBUYENTE"] = context["ESTADO_CONTRIBUYENTE"]
        gerente_context["CONDICION_CONTRIBUYENTE"] = context["CONDICION_CONTRIBUYENTE"]
        gerente_context["DEUDA_PUBLICA_SUNAT"] = context["DEUDA_PUBLICA_SUNAT"]
        gerente_context["OMISIONES_TRIBUTARIAS_SUNAT"] = context["OMISIONES_TRIBUTARIAS_SUNAT"]

        gerente_context["score_valor_gerente"] = context["score_valor_gerente"]
        gerente_context["nivel_riesgo_gerente"] = context["nivel_riesgo_gerente"]
        gerente_context["PERSONAS_RIESGO_NUM"] = context["PERSONAS_RIESGO_NUM"]
        gerente_context["RIESGOS_ESTADO_CALIFICACION_GERENTE"] = context["RIESGOS_ESTADO_CALIFICACION_GERENTE"]
        gerente_context["RIESGOS_COMPORTAMIENTO_PAGO_GERENTE"] = context["RIESGOS_COMPORTAMIENTO_PAGO_GERENTE"]
        gerente_context["deuda_total_monto"] = context["deuda_total_monto"]
        gerente_context["deuda_total_credito"] = context["deuda_total_credito"]
        gerente_context["deuda_total_banco"] = context["deuda_total_banco"]
        gerente_context["DESCRIPCION_OTRAS_DEUDAS_GERENTE"] = context["DESCRIPCION_OTRAS_DEUDAS_GERENTE"]
        gerente_context["comportamiento_13m"] = context["comportamiento_13m"]

        gerente_context["lista_reporte_comision_represion"] = _safe_list(
            gerente_context.get("lista_reporte_comision_represion") or []
        )
        gerente_context["reporte_comision_represion_denuncias"] = _cantidad(
            gerente_context["lista_reporte_comision_represion"]
        )

        gerente_context["lista_reporte_sala_concursal"] = _safe_list(
            gerente_context.get("lista_reporte_sala_concursal") or []
        )
        gerente_context["reporte_sala_concursal_denuncias"] = _cantidad(
            gerente_context["lista_reporte_sala_concursal"]
        )

        gerente_context["lista_reporte_comision"] = _safe_list(
            gerente_context.get("lista_reporte_comision") or []
        )
        gerente_context["reporte_comision_denuncias"] = _cantidad(
            gerente_context["lista_reporte_comision"]
        )

        gerente_context["lista_reporte_proteccion"] = _safe_list(
            gerente_context.get("lista_reporte_proteccion") or []
        )
        gerente_context["REPORTE_PROTECCION_FECHAS"] = _safe_str(
            gerente_context.get("REPORTE_PROTECCION_FECHAS")
        )

        gerente_context["lista_reporte_juzgado_civil"] = _safe_list(
            gerente_context.get("lista_reporte_juzgado_civil") or []
        )
        gerente_context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _cantidad(
            gerente_context["lista_reporte_juzgado_civil"]
        )

        gerente_context["lista_reporte_juzgado_familiar"] = _safe_list(
            gerente_context.get("lista_reporte_juzgado_familiar") or []
        )
        gerente_context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _cantidad(
            gerente_context["lista_reporte_juzgado_familiar"]
        )

        gerente_context["lista_reporte_juzgado_laboral"] = _safe_list(
            gerente_context.get("lista_reporte_juzgado_laboral") or []
        )
        gerente_context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _cantidad(
            gerente_context["lista_reporte_juzgado_laboral"]
        )
        gerente_context["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _si_o_no(
            gerente_context["lista_reporte_juzgado_civil"]
        )
        gerente_context["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _si_o_no(
            gerente_context["lista_reporte_juzgado_laboral"]
        )

        context["gerente_general"] = gerente_context

        context["SCORE_VALOR"] = _safe_str(sujeto_empresa.get("scoreValor"))
        context["NIVEL_RIESGO"] = _safe_str(sujeto_empresa.get("nivelRiesgo"))
        context["EMPRESAS_RIESGO_NUM"] = _safe_str(sujeto_empresa.get("cantidadRiesgosNum"))
        context["RIESGOS_ESTADO_CALIFICACION"] = _safe_str(sujeto_empresa.get("riesgosEstadoCalificacion"))
        context["RIESGOS_COMPORTAMIENTO_PAGO"] = _safe_str(sujeto_empresa.get("riesgosComportamientoPago"))
        context["DEUDA_TOTAL_TEXTO"] = _safe_str(sujeto_empresa.get("deudaTotalTexto"))
        context["DESCRIPCION_OTRAS_DEUDAS"] = _safe_str(sujeto_empresa.get("descripcionOtrasDeudas"))
        context["COMPORTAMIENTO_13M"] = _safe_str(sujeto_empresa.get("comportamiento13m"))

        context["GERENTE_GENERAL_TEXTO"] = (
            context["GERENTE_GENERAL_NOMBRE"]
            if context["GERENTE_GENERAL_NOMBRE"]
            else "No se encontró gerente general registrado."
        )

        context["SUNAT_DEUDA_TEXTO"] = (
            "No se encontraron deudas SUNAT registradas."
            if not deudas_sunat
            else f"Se encontraron {len(deudas_sunat)} registros de deuda SUNAT."
        )

        context["SUNAT_OMISIONES_TEXTO"] = (
            "No se encontraron omisiones SUNAT registradas."
            if not omisiones_sunat
            else f"Se encontraron {len(omisiones_sunat)} registros de omisiones SUNAT."
        )

        context["REPORTES_EXPEDIENTE_TEXTO"] = (
            "No se encontraron hallazgos."
            if not reportes_expediente
            else f"Se encontraron {len(reportes_expediente)} registros."
        )

        context["REPORTES_LISTA_SIMPLE_TEXTO"] = (
            "No se encontraron hallazgos."
            if not reportes_lista_simple
            else f"Se encontraron {len(reportes_lista_simple)} registros."
        )

        context["REPORTES_MINVIV_TEXTO"] = (
            "No se encontraron hallazgos."
            if not reportes_ministerio_vivienda
            else f"Se encontraron {len(reportes_ministerio_vivienda)} registros."
        )

        lista_reporte_comision_represion =[
            _normalizar_expediente(item, "denunciantes")
            for item in _filter_by_tipo(reportes_expediente, "COMISION_REPRESION")
        ] 
        lista_reporte_sala_defensa = [
            _normalizar_expediente(item, "denunciantes")
            for item in _filter_by_tipo(reportes_expediente, "SALA_DEFENSA")
        ]
        lista_reporte_sala_concursal = [
            _normalizar_expediente(item, "denunciantes")
            for item in _filter_by_tipo(reportes_expediente, "SALA_CONCURSAL")
        ]
        lista_reporte_comision = [
            _normalizar_expediente(item, "denunciantes")
            for item in _filter_by_tipo(reportes_expediente, "COMISION")
        ]
        lista_reporte_juzgado_civil = [
            _normalizar_expediente(item, "demandantes")
            for item in _filter_by_tipo(reportes_expediente, "JUZGADO_CIVIL")
        ]
        lista_reporte_reclamos = [
            _normalizar_expediente(x, "denunciantes")
            for x in _filter_by_tipo(reportes_expediente, "RECLAMOS")
        ]
        lista_reporte_infracciones = [
            _normalizar_expediente(x, "denunciantes")
            for x in _filter_by_tipo(reportes_expediente, "INFRACCIONES")
        ]
        lista_reporte_juzgado_familiar = [
            _normalizar_expediente(item, "denunciantes")
            for item in _filter_by_tipo(reportes_expediente, "JUZGADO_FAMILIAR")
        ]
        lista_reporte_juzgado_laboral = [
            _normalizar_expediente(item, "demandantes")
            for item in _filter_by_tipo(reportes_expediente, "JUZGADO_LABORAL")
        ]

        lista_reporte_ranking = _filter_by_tipo(reportes_lista_simple, "RANKING_CONSTRUCTORAS")
        lista_reporte_proteccion = _filter_by_tipo(reportes_lista_simple, "PROTECCION")
        lista_reporte_sala_proteccion = _filter_by_tipo(reportes_lista_simple, "SALA_PROTECCION")
        lista_reporte_comision_signos = _filter_by_tipo(reportes_lista_simple, "COMISION_SIGNOS")
        lista_reporte_comision_inventos = _filter_by_tipo(reportes_lista_simple, "COMISION_INVENTOS")

        context["lista_reporte_comision_represion"] = lista_reporte_comision_represion
        context["reporte_comision_represion_denuncias"] = _cantidad(lista_reporte_comision_represion)

        context["lista_reporte_sala_defensa"] = lista_reporte_sala_defensa
        context["reporte_sala_defensa_denuncias"] = _cantidad(lista_reporte_sala_defensa)

        context["lista_reporte_sala_concursal"] = lista_reporte_sala_concursal
        context["reporte_sala_concursal_denuncias"] = _cantidad(lista_reporte_sala_concursal)

        context["lista_reporte_comision"] = lista_reporte_comision
        context["reporte_comision_denuncias"] = _cantidad(lista_reporte_comision)

        context["lista_reporte_reclamos"] = lista_reporte_reclamos
        context["reporte_reclamos_ciudadano"] = _cantidad(lista_reporte_reclamos)

        context["lista_reporte_infracciones"] = lista_reporte_infracciones
        context["reporte_infracciones"] = _cantidad(lista_reporte_infracciones)

        context["lista_reporte_infracciones"] = lista_reporte_infracciones
        context["reporte_infracciones"] = _cantidad(lista_reporte_infracciones)

        context["lista_reporte_juzgado_civil"] = lista_reporte_juzgado_civil
        context["REPORTE_JUZGADOS_CIVILES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_civil)
        context["REPORTE_JUZGADOS_CIVILES_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_civil)

        context["lista_reporte_juzgado_familiar"] = lista_reporte_juzgado_familiar
        context["REPORTE_JUZGADOS_FAMILIARES_CANTIDAD"] = _cantidad(lista_reporte_juzgado_familiar)

        context["lista_reporte_juzgado_laboral"] = lista_reporte_juzgado_laboral
        context["REPORTE_JUZGADOS_LABORAL_CANTIDAD"] = _cantidad(lista_reporte_juzgado_laboral)
        context["REPORTE_JUZGADOS_LABORAL_SI_O_NO"] = _si_o_no(lista_reporte_juzgado_laboral)

        context["lista_reporte_ranking"] = lista_reporte_ranking
        context["REPORTE_RANKING_CONSTRUCTORAS_FECHAS"] = _payload_fechas(lista_reporte_ranking)

        context["lista_reporte_proteccion"] = lista_reporte_proteccion
        context["REPORTE_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_proteccion)

        context["lista_reporte_sala_proteccion"] = lista_reporte_sala_proteccion
        context["REPORTE_SALA_PROTECCION_FECHAS"] = _payload_fechas(lista_reporte_sala_proteccion)

        context["lista_reporte_comision_signos"] = lista_reporte_comision_signos
        context["REPORTE_COMISION_SIGNOS_FECHAS"] = _payload_fechas(lista_reporte_comision_signos)

        context["lista_reporte_comision_inventos"] = lista_reporte_comision_inventos
        context["REPORTE_COMISION_INVENTOS_FECHAS"] = _payload_fechas(lista_reporte_comision_inventos)

        context["lista_ministerio_vivienda"] = reportes_ministerio_vivienda
        context["REPORTE_MINISTERIO_VIVIENDA_SI_O_NO"] = _si_o_no(reportes_ministerio_vivienda)
        context["REPORTE_MINISTERIO_VIVIENDA_CANTIDAD"] = _cantidad(reportes_ministerio_vivienda)

        return context
