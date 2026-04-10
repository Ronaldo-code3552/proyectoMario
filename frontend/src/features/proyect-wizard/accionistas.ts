import type { EmpresaFormValues, PersonaFormValues } from './schemas'
import type { EmpresaReportesState, PersonaReportesState } from './reportes'
import { emptyEmpresaReportesState, emptyPersonaReportesState } from './reportes'

export type AccionistaTipo = 'NATURAL' | 'JURIDICA'

export type PersonaCompletaDraft = {
  data: PersonaFormValues
  reportes: PersonaReportesState
}

export type EmpresaCompletaDraft = {
  data: EmpresaFormValues
  reportes: EmpresaReportesState
  internos: PersonaCompletaDraft[]
}

export type AccionistaDraft = {
  id: string
  tipo: AccionistaTipo
  ordenLista: number
  observacion: string
  natural: PersonaCompletaDraft
  juridica: EmpresaCompletaDraft
}

const emptyPersonaPayload = (): PersonaFormValues => ({
  sujeto: {
    jsonPathOrigen: '$.accionista',
    hashNegocio: '',
    scoreValor: '',
    nivelRiesgo: '',
    cantidadRiesgosNum: '',
    riesgosEstadoCalificacion: '',
    riesgosComportamientoPago: '',
    comportamiento13m: '',
    deudaTotalTexto: '',
    deudaTotalMonto: '',
    deudaTotalCredito: '',
    deudaTotalBanco: '',
    descripcionOtrasDeudas: ''
  },
  persona: {
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    tipoDocumentoRaw: 'DNI',
    numeroDocumento: '',
    rucPersonal: '',
    domicilioFiscalPersonal: '',
    estadoContribuyente: '',
    condicionContribuyente: '',
    deudaPublicaSunat: '',
    omisionesTributariasSunat: '',
    nombreJsonRaw: '',
    gerenteNombreJsonRaw: '',
    gerenteNumeroDocumentoRaw: ''
  }
})

const emptyEmpresaPayload = (): EmpresaFormValues => ({
  sujeto: {
    jsonPathOrigen: '$.accionista',
    hashNegocio: '',
    scoreValor: '',
    nivelRiesgo: '',
    cantidadRiesgosNum: '',
    riesgosEstadoCalificacion: '',
    riesgosComportamientoPago: '',
    comportamiento13m: '',
    deudaTotalTexto: '',
    deudaTotalMonto: '',
    deudaTotalCredito: '',
    deudaTotalBanco: '',
    descripcionOtrasDeudas: ''
  },
  empresa: {
    nombreEmpresa: '',
    razonSocial: '',
    rucEmpresa: '',
    partidaPersonasJuridicas: '',
    partidaPersonasJuridicasDireccion: '',
    domicilioFiscal: '',
    fechaConstitucion: '',
    objetoSocialCodigo: '',
    objetoSocial: '',
    sumaNumero: '',
    sumaNumeroLetra: '',
    valorNominal: '',
    valorNominalNumero: '',
    capitalMonto: '',
    capitalMontoLetras: '',
    capitalNumAcciones: '',
    capitalValorNominal: '',
    capitalValorNominalLetras: '',
    sunatEstadoEmpresa: '',
    sunatCondicionEmpresa: '',
    sunatDeudaCoactiva: '',
    sunatDeudaMontoTotal: '',
    sunatOmisiones: '',
    sunatOmisionesMonto: '',
    sunatTrabajadoresMesFecha: '',
    sunatTrabajadoresAnioFecha: '',
    sunatTrabajadores: '',
    sunatPrestadores: '',
    representantesLegalesResumen: '',
    infoEstablecimientosAnexosSunat: false,
    cantidadEstablecimientos: '',
    nombresEstablecimientos: ''
  }
})

export const createPersonaCompletaDraft = (jsonPathOrigen = '$.accionista'): PersonaCompletaDraft => ({
  data: {
    ...emptyPersonaPayload(),
    sujeto: {
      ...emptyPersonaPayload().sujeto,
      jsonPathOrigen
    }
  },
  reportes: emptyPersonaReportesState()
})

export const createEmpresaCompletaDraft = (jsonPathOrigen = '$.accionista'): EmpresaCompletaDraft => ({
  data: {
    ...emptyEmpresaPayload(),
    sujeto: {
      ...emptyEmpresaPayload().sujeto,
      jsonPathOrigen
    }
  },
  reportes: emptyEmpresaReportesState(),
  internos: []
})

export const createAccionistaDraft = (ordenLista = 1): AccionistaDraft => ({
  id: crypto.randomUUID(),
  tipo: 'NATURAL',
  ordenLista,
  observacion: '',
  natural: createPersonaCompletaDraft('$.accionista_natural'),
  juridica: createEmpresaCompletaDraft('$.accionista_juridico')
})

export const createInternoDraft = (): PersonaCompletaDraft =>
  createPersonaCompletaDraft('$.accionista_interno')