export type EmpresaSujetoReadModel = {
  id?: number
  createdAt?: string
  updatedAt?: string
  tipoSujeto?: string
  jsonPathOrigen?: string
  hashNegocio?: string
  scoreValor?: string
  nivelRiesgo?: string
  cantidadRiesgosNum?: string
  riesgosEstadoCalificacion?: string
  riesgosComportamientoPago?: string
  comportamiento13m?: string
  deudaTotalTexto?: string
  deudaTotalMonto?: string
  deudaTotalCredito?: string
  deudaTotalBanco?: string
  descripcionOtrasDeudas?: string
}

export type EmpresaCoreReadModel = {
  sujetoId?: number
  createdAt?: string
  updatedAt?: string
  nombreEmpresa?: string
  razonSocial?: string
  rucEmpresa?: string
  partidaPersonasJuridicas?: string
  partidaPersonasJuridicasDireccion?: string
  domicilioFiscal?: string
  fechaConstitucion?: string
  objetoSocialCodigo?: string
  objetoSocial?: string
  sumaNumero?: string
  sumaNumeroLetra?: string
  valorNominal?: string
  valorNominalNumero?: string
  capitalMonto?: string
  capitalMontoLetras?: string
  capitalNumAcciones?: string
  capitalValorNominal?: string
  capitalValorNominalLetras?: string
  sunatEstadoEmpresa?: string
  sunatCondicionEmpresa?: string
  sunatDeudaCoactiva?: string
  sunatDeudaMontoTotal?: string
  sunatOmisiones?: string
  sunatOmisionesMonto?: string
  sunatTrabajadoresMesFecha?: string
  sunatTrabajadoresAnioFecha?: string
  sunatTrabajadores?: string
  sunatPrestadores?: string
  representantesLegalesResumen?: string
  infoEstablecimientosAnexosSunat?: boolean
  cantidadEstablecimientos?: string
  nombresEstablecimientos?: string
}

export type PersonaBasicReadModel = {
  sujetoId?: number
  rucPersonal?: string
  tipoDocumento?: string
  tipoDocumentoRaw?: string
  numeroDocumento?: string
  nombreCompleto?: string
  estadoContribuyente?: string
  condicionContribuyente?: string
  domicilioFiscalPersonal?: string
}

export type ProyectoResumenReadModel = {
  id?: number
  fecha1?: string
  textoProyectosNatural?: string
  createdAt?: string
  updatedAt?: string
  payloadOriginal?: {
    fuente?: string
    origen?: string
  }
  cargaLote?: {
    id?: number
    createdAt?: string
    hashArchivo?: string | null
    observacion?: string
    nombreArchivo?: string
  }
}

export type RelacionContextoReadModel = {
  nombre_json?: string | null
  payload_fragment?: Record<string, unknown> | null
  tipo_documento_raw?: string | null
  numero_documento_raw?: string | null
  gerente_nombre_json?: string | null
  gerente_tipo_documento_raw?: string | null
  gerente_numero_documento_raw?: string | null
}

export type EmpresaRelacionPersonaReadModel = {
  sujeto?: EmpresaSujetoReadModel
  persona?: PersonaBasicReadModel | null
  contexto?: RelacionContextoReadModel | null
  ordenLista?: number | null
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
}

export type EmpresaAccionistaReadModel = {
  sujeto?: EmpresaSujetoReadModel
  empresa?: EmpresaCoreReadModel | null
  persona?: PersonaBasicReadModel | null
  contexto?: RelacionContextoReadModel | null
  ordenLista?: number | null
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
  accionistasInternos?: EmpresaRelacionPersonaReadModel[]
}

export type EmpresaConteosReadModel = {
  sunatDeudas?: number
  sunatOmisiones?: number
  reportesExpediente?: number
  reportesListaSimple?: number
  reportesMinisterioVivienda?: number
}

export type EmpresaDeudaReadModel = {
  id?: number
  monto?: string
  entidad?: string
  periodo?: string
  fechaTexto?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaRepresentanteLegalReadModel = {
  id?: number
  puestoRepresentanteLegal?: string
  fechaDesdeRepresentanteLegal?: string
  nombreRepresentanteLegal?: string
  documentoRepresentanteLegal?: string
  documentoNumeroRepresentanteLegal?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaReporteExpedienteReadModel = {
  id?: number
  tipoReporte?: string
  expediente?: string
  organo?: string
  partes?: string
  estatus?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaReporteListaSimpleReadModel = {
  id?: number
  tipoReporte?: string
  razonSocial?: string
  cantidad?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaReporteMinisterioViviendaReadModel = {
  id?: number
  organo?: string
  sancion?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaListItem = {
  id: number
  sujeto?: EmpresaSujetoReadModel
  empresa?: EmpresaCoreReadModel
  gerenteGeneral?: EmpresaRelacionPersonaReadModel | null
  accionistas?: EmpresaAccionistaReadModel[]
  proyectos?: ProyectoResumenReadModel[]
  conteos?: EmpresaConteosReadModel
}

export type EmpresaDetail = EmpresaListItem & {
  reporteResumen?: unknown | null
  deudasSunat?: EmpresaDeudaReadModel[]
  omisionesSunat?: EmpresaDeudaReadModel[]
  representantesLegales?: EmpresaRepresentanteLegalReadModel[]
  reportesExpediente?: EmpresaReporteExpedienteReadModel[]
  reportesListaSimple?: EmpresaReporteListaSimpleReadModel[]
  reportesMinisterioVivienda?: EmpresaReporteMinisterioViviendaReadModel[]
}

export type EmpresaListResponse = {
  data: EmpresaListItem[]
  totalRecords: number
  pageNumber: number
  pageSize: number
}