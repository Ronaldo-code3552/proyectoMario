export type PersonaSujetoReadModel = {
  id?: number
  createdAt?: string
  updatedAt?: string
  tipoSujeto?: string
  jsonPathOrigen?: string
  hashNegocio?: string
  scoreValor?: string
  nivelRiesgo?: string
  cantidadRiesgosNum?: string | null
  riesgosEstadoCalificacion?: string | null
  riesgosComportamientoPago?: string | null
  comportamiento13m?: string | null
  deudaTotalTexto?: string | null
  deudaTotalMonto?: string | null
  deudaTotalCredito?: string | null
  deudaTotalBanco?: string | null
  descripcionOtrasDeudas?: string | null
}

export type PersonaCoreReadModel = {
  sujetoId?: number
  createdAt?: string
  updatedAt?: string
  nombreCompleto?: string
  tipoDocumento?: string
  tipoDocumentoRaw?: string
  numeroDocumento?: string
  rucPersonal?: string
  domicilioFiscalPersonal?: string | null
  estadoContribuyente?: string | null
  condicionContribuyente?: string | null
  deudaPublicaSunat?: string | null
  omisionesTributariasSunat?: string | null
  nombreJsonRaw?: string | null
  gerenteNombreJsonRaw?: string | null
  gerenteNumeroDocumentoRaw?: string | null
}

export type PersonaProyectoRelacionReadModel = {
  id?: number
  fecha1?: string
  textoProyectosNatural?: string
}

export type PersonaRelacionEmpresaReadModel = {
  empresa?: {
    sujetoId?: number
    rucEmpresa?: string
    razonSocial?: string
    nombreEmpresa?: string
    sunatEstadoEmpresa?: string | null
    sunatCondicionEmpresa?: string | null
  }
  contexto?: Record<string, unknown> | null
  proyectos?: PersonaProyectoRelacionReadModel[]
  ordenLista?: number | null
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
  createdAt?: string
  proyectoId?: number | null
  sujetoOrigenId?: number | null
  sujetoDestinoId?: number | null
}

export type PersonaConteosReadModel = {
  sunatDeudas?: number
  sunatOmisiones?: number
  relacionesEmpresa?: number
  reportesExpediente?: number
  reportesListaSimple?: number
  reportesMinisterioVivienda?: number
}

export type PersonaDeudaReadModel = {
  id?: number
  monto?: string
  entidad?: string
  periodo?: string
  fechaTexto?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown> | null
}

export type PersonaReporteExpedienteReadModel = {
  id?: number
  organo?: string
  partes?: string
  estatus?: string
  expediente?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown> | null
  tipoReporte?: string
}

export type PersonaReporteListaSimpleReadModel = {
  id?: number
  cantidad?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown> | null
  razonSocial?: string
  tipoReporte?: string
}

export type PersonaReporteMinisterioViviendaReadModel = {
  id?: number
  organo?: string
  sancion?: string
  ordenLista?: number
  payloadItem?: Record<string, unknown> | null
}

export type PersonaListItem = {
  id: number
  sujeto?: PersonaSujetoReadModel
  conteos?: PersonaConteosReadModel
  persona?: PersonaCoreReadModel
  reporteResumen?: unknown | null
  relacionesEmpresa?: PersonaRelacionEmpresaReadModel[]
}

export type PersonaDetail = PersonaListItem & {
  deudasSunat?: PersonaDeudaReadModel[]
  omisionesSunat?: PersonaDeudaReadModel[]
  reportesExpediente?: PersonaReporteExpedienteReadModel[]
  reportesListaSimple?: PersonaReporteListaSimpleReadModel[]
  reportesMinisterioVivienda?: PersonaReporteMinisterioViviendaReadModel[]
}

export type PersonaListResponse = {
  data: PersonaListItem[]
  totalRecords: number
  pageNumber: number
  pageSize: number
}

export type PersonaCreateResult = {
  raw: unknown
  personaId?: number
  personaSujetoId?: number
}

export type PersonaFlowSummaryInput = {
  personaId?: number
  personaSujetoId?: number
  empresaSujetoId?: number
  proyectoId?: number
}

export type PersonaDetailSummaryInput = PersonaDetail | null
