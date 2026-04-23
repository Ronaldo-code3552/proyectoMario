export type ProyectoPayloadOriginalReadModel = {
  fuente?: string
  origen?: string
}

export type ProyectoCoreReadModel = {
  id?: number
  createdAt?: string
  updatedAt?: string
  empresaPrincipalSujetoId?: number
  fecha1?: string
  textoProyectosNatural?: string
  cargaLoteId?: number
  payloadOriginal?: ProyectoPayloadOriginalReadModel
}

export type ProyectoCargaLoteReadModel = {
  id?: number
  createdAt?: string
  hashArchivo?: string | null
  observacion?: string | null
  nombreArchivo?: string | null
}

export type ProyectoSujetoReadModel = {
  id?: number
  scoreValor?: string
  tipoSujeto?: string
  nivelRiesgo?: string
  hashNegocio?: string
  deudaTotalBanco?: string | null
  deudaTotalMonto?: string | null
  deudaTotalTexto?: string | null
  comportamiento13m?: string | null
  deudaTotalCredito?: string | null
  cantidadRiesgosNum?: string | null
  descripcionOtrasDeudas?: string | null
  riesgosComportamientoPago?: string | null
  riesgosEstadoCalificacion?: string | null
}

export type ProyectoEmpresaReadModel = {
  sujetoId?: number
  rucEmpresa?: string
  razonSocial?: string
  nombreEmpresa?: string
  domicilioFiscal?: string | null
  sunatEstadoEmpresa?: string | null
  sunatCondicionEmpresa?: string | null
}

export type ProyectoPersonaCoreReadModel = {
  sujetoId?: number
  rucPersonal?: string
  nombreCompleto?: string
  numeroDocumento?: string
  tipoDocumento?: string
  tipoDocumentoRaw?: string
  estadoContribuyente?: string | null
  condicionContribuyente?: string | null
  domicilioFiscalPersonal?: string | null
}

export type ProyectoPersonaReadModel = {
  sujeto?: ProyectoSujetoReadModel
  persona?: ProyectoPersonaCoreReadModel
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
  ordenLista?: number | null
}

export type ProyectoAccionistaInternoReadModel = {
  sujeto?: ProyectoSujetoReadModel
  persona?: ProyectoPersonaCoreReadModel | null
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
  ordenLista?: number | null
}

export type ProyectoAccionistaReadModel = {
  sujeto?: ProyectoSujetoReadModel
  empresa?: ProyectoEmpresaReadModel | null
  persona?: ProyectoPersonaCoreReadModel | null
  contexto?: Record<string, unknown> | null
  ordenLista?: number | null
  relacionId?: number | null
  observacion?: string | null
  tipoRelacion?: string | null
  ACCIONISTAS_INTERNOS?: ProyectoAccionistaInternoReadModel[]
  accionistasInternos?: ProyectoAccionistaInternoReadModel[]
}

export type ProyectoListItem = {
  id: number
  proyecto?: ProyectoCoreReadModel
  empresaPrincipal?: ProyectoEmpresaReadModel | null
  gerenteGeneral?: ProyectoPersonaReadModel | null
  accionistas?: ProyectoAccionistaReadModel[]
}

export type ProyectoDetail = ProyectoListItem & {
  proyecto?: ProyectoCoreReadModel
  cargaLote?: ProyectoCargaLoteReadModel | null
  empresaPrincipal?: ProyectoEmpresaReadModel | null
  gerenteGeneral?: ProyectoPersonaReadModel | null
  accionistas?: ProyectoAccionistaReadModel[]
}

export type ProyectoListResponse = {
  data: ProyectoListItem[]
  totalRecords: number
  pageNumber: number
  pageSize: number
}
