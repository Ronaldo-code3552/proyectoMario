import type { EmpresaDetail } from './empresa/api'
import type { PersonaDetail } from './persona/api'
import type { ProyectoDetail } from './proyecto/api'
import type { EmpresaFormValues, PersonaFormValues, ProyectoFormValues } from './schemas'

export const empresaDefaultValues: EmpresaFormValues = {
  sujeto: {
    jsonPathOrigen: '$.empresa',
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
}

export const personaDefaultValues: PersonaFormValues = {
  sujeto: {
    jsonPathOrigen: '$.empresa.gerente_general',
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
}

export const proyectoDefaultValues: ProyectoFormValues = {
  proyecto: {
    empresaPrincipalSujetoId: 0,
    fecha1: '',
    textoProyectosNatural: '',
    cargaLoteId: 2,
    payloadOriginal: {
      fuente: 'frontend',
      origen: 'formulario_manual'
    }
  }
}

export const cloneEmpresaDefaultValues = (): EmpresaFormValues =>
  JSON.parse(JSON.stringify(empresaDefaultValues))

export const clonePersonaDefaultValues = (): PersonaFormValues =>
  JSON.parse(JSON.stringify(personaDefaultValues))

export const cloneProyectoDefaultValues = (): ProyectoFormValues =>
  JSON.parse(JSON.stringify(proyectoDefaultValues))

export const mapEmpresaDetailToFormValues = (detail: EmpresaDetail): EmpresaFormValues => ({
  sujeto: {
    ...cloneEmpresaDefaultValues().sujeto,
    ...(detail.sujeto ?? {})
  },
  empresa: {
    ...cloneEmpresaDefaultValues().empresa,
    ...(detail.empresa ?? {})
  }
})

export const mapPersonaDetailToFormValues = (detail: PersonaDetail): PersonaFormValues => ({
  sujeto: {
    ...clonePersonaDefaultValues().sujeto,
    jsonPathOrigen: detail.sujeto?.jsonPathOrigen ?? clonePersonaDefaultValues().sujeto.jsonPathOrigen,
    hashNegocio: detail.sujeto?.hashNegocio ?? '',
    scoreValor: detail.sujeto?.scoreValor ?? '',
    nivelRiesgo: detail.sujeto?.nivelRiesgo ?? '',
    cantidadRiesgosNum: detail.sujeto?.cantidadRiesgosNum ?? '',
    riesgosEstadoCalificacion: detail.sujeto?.riesgosEstadoCalificacion ?? '',
    riesgosComportamientoPago: detail.sujeto?.riesgosComportamientoPago ?? '',
    comportamiento13m: detail.sujeto?.comportamiento13m ?? '',
    deudaTotalTexto: detail.sujeto?.deudaTotalTexto ?? '',
    deudaTotalMonto: detail.sujeto?.deudaTotalMonto ?? '',
    deudaTotalCredito: detail.sujeto?.deudaTotalCredito ?? '',
    deudaTotalBanco: detail.sujeto?.deudaTotalBanco ?? '',
    descripcionOtrasDeudas: detail.sujeto?.descripcionOtrasDeudas ?? ''
  },
  persona: {
    ...clonePersonaDefaultValues().persona,
    nombreCompleto: detail.persona?.nombreCompleto ?? '',
    tipoDocumento: detail.persona?.tipoDocumento ?? 'DNI',
    tipoDocumentoRaw: detail.persona?.tipoDocumentoRaw ?? detail.persona?.tipoDocumento ?? 'DNI',
    numeroDocumento: detail.persona?.numeroDocumento ?? '',
    rucPersonal: detail.persona?.rucPersonal ?? '',
    domicilioFiscalPersonal: detail.persona?.domicilioFiscalPersonal ?? '',
    estadoContribuyente: detail.persona?.estadoContribuyente ?? '',
    condicionContribuyente: detail.persona?.condicionContribuyente ?? '',
    deudaPublicaSunat: detail.persona?.deudaPublicaSunat ?? '',
    omisionesTributariasSunat: detail.persona?.omisionesTributariasSunat ?? '',
    nombreJsonRaw: detail.persona?.nombreJsonRaw ?? '',
    gerenteNombreJsonRaw: detail.persona?.gerenteNombreJsonRaw ?? '',
    gerenteNumeroDocumentoRaw: detail.persona?.gerenteNumeroDocumentoRaw ?? ''
  }
})


export const mapProyectoDetailToFormValues = (detail: ProyectoDetail): ProyectoFormValues => {
  const core = detail.proyecto

  return {
    proyecto: {
      ...cloneProyectoDefaultValues().proyecto,
      empresaPrincipalSujetoId:
        Number(core?.empresaPrincipalSujetoId ?? detail.empresaPrincipal?.sujetoId ?? 0) || 0,
      fecha1: core?.fecha1 ?? '',
      textoProyectosNatural: core?.textoProyectosNatural ?? '',
      cargaLoteId:
        Number(core?.cargaLoteId ?? cloneProyectoDefaultValues().proyecto.cargaLoteId ?? 0) || 0,
      payloadOriginal: {
        fuente:
          core?.payloadOriginal?.fuente ??
          cloneProyectoDefaultValues().proyecto.payloadOriginal.fuente,
        origen:
          core?.payloadOriginal?.origen ??
          cloneProyectoDefaultValues().proyecto.payloadOriginal.origen
      }
    }
  }
}