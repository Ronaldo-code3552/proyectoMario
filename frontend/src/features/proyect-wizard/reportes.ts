export type SunatItem = {
  monto: string
  periodo: string
  fechaTexto: string
  entidad: string
  ordenLista: number
  payloadItem?: Record<string, unknown>
}

export type RepresentanteLegalItem = {
  puestoRepresentanteLegal: string
  fechaDesdeRepresentanteLegal: string
  nombreRepresentanteLegal: string
  documentoRepresentanteLegal: string
  documentoNumeroRepresentanteLegal: string
  ordenLista: number
  payloadItem?: Record<string, unknown>
}

export type ReporteExpedienteItem = {
  tipoReporte: string
  expediente: string
  organo: string
  partes: string
  estatus: string
  ordenLista: number
  payloadItem?: Record<string, unknown>
}

export type ReporteListaSimpleItem = {
  tipoReporte: string
  razonSocial: string
  cantidad: string
  ordenLista: number
  payloadItem?: Record<string, unknown>
}

export type ReporteMinisterioViviendaItem = {
  organo: string
  sancion: string
  ordenLista: number
  payloadItem?: Record<string, unknown>
}

export type EmpresaReportesState = {
  sunatDeudas: SunatItem[]
  sunatOmisiones: SunatItem[]
  representantesLegales: RepresentanteLegalItem[]
  reportesExpediente: ReporteExpedienteItem[]
  reportesListaSimple: ReporteListaSimpleItem[]
  reportesMinisterioVivienda: ReporteMinisterioViviendaItem[]
}

export const createEmptySunatItem = (
  ordenLista = 1,
  tipo: 'deuda_sunat' | 'omision_sunat' = 'deuda_sunat'
): SunatItem => ({
  monto: '',
  periodo: '',
  fechaTexto: '',
  entidad: 'SUNAT',
  ordenLista,
  payloadItem: {
    fuente: 'frontend',
    tipo
  }
})

export const createEmptyRepresentanteLegalItem = (ordenLista = 1): RepresentanteLegalItem => ({
  puestoRepresentanteLegal: '',
  fechaDesdeRepresentanteLegal: '',
  nombreRepresentanteLegal: '',
  documentoRepresentanteLegal: 'DNI',
  documentoNumeroRepresentanteLegal: '',
  ordenLista,
  payloadItem: {
    fuente: 'frontend',
    tipo: 'representante_legal'
  }
})

export const createEmptyReporteExpedienteItem = (ordenLista = 1): ReporteExpedienteItem => ({
  tipoReporte: 'COMISION_REPRESION',
  expediente: '',
  organo: '',
  partes: '',
  estatus: '',
  ordenLista,
  payloadItem: {
    fuente: 'frontend',
    tipo: 'reporte_expediente_empresa'
  }
})

export const createEmptyReporteListaSimpleItem = (ordenLista = 1): ReporteListaSimpleItem => ({
  tipoReporte: 'PROTECCION',
  razonSocial: '',
  cantidad: '',
  ordenLista,
  payloadItem: {
    fuente: 'frontend',
    tipo: 'proteccion',
    fechas: ''
  }
})

export const createEmptyReporteMinisterioViviendaItem = (ordenLista = 1): ReporteMinisterioViviendaItem => ({
  organo: 'MINISTERIO DE VIVIENDA',
  sancion: '',
  ordenLista,
  payloadItem: {
    fuente: 'frontend',
    tipo: 'ministerio_vivienda'
  }
})

export const emptyEmpresaReportesState = (): EmpresaReportesState => ({
  sunatDeudas: [],
  sunatOmisiones: [],
  representantesLegales: [],
  reportesExpediente: [],
  reportesListaSimple: [],
  reportesMinisterioVivienda: []
})

export type PersonaReportesState = {
  reportesExpediente: ReporteExpedienteItem[]
  reportesListaSimple: ReporteListaSimpleItem[]
  reportesMinisterioVivienda: ReporteMinisterioViviendaItem[]
}

export const emptyPersonaReportesState = (): PersonaReportesState => ({
  reportesExpediente: [],
  reportesListaSimple: [],
  reportesMinisterioVivienda: []
})
