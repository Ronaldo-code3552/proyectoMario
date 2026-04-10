import { z } from 'zod'

export const empresaSchema = z.object({
  sujeto: z.object({
    jsonPathOrigen: z.string(),
    hashNegocio: z.string(),
    scoreValor: z.string(),
    nivelRiesgo: z.string(),
    cantidadRiesgosNum: z.string(),
    riesgosEstadoCalificacion: z.string(),
    riesgosComportamientoPago: z.string(),
    comportamiento13m: z.string(),
    deudaTotalTexto: z.string(),
    deudaTotalMonto: z.string(),
    deudaTotalCredito: z.string(),
    deudaTotalBanco: z.string(),
    descripcionOtrasDeudas: z.string()
  }),
  empresa: z.object({
    nombreEmpresa: z.string(),
    razonSocial: z.string().min(1, 'La razón social es obligatoria'),
    rucEmpresa: z.string().length(11, 'El RUC debe tener 11 dígitos'),
    partidaPersonasJuridicas: z.string(),
    partidaPersonasJuridicasDireccion: z.string(),
    domicilioFiscal: z.string(),
    fechaConstitucion: z.string(),
    objetoSocialCodigo: z.string(),
    objetoSocial: z.string(),
    sumaNumero: z.string(),
    sumaNumeroLetra: z.string(),
    valorNominal: z.string(),
    valorNominalNumero: z.string(),
    capitalMonto: z.string(),
    capitalMontoLetras: z.string(),
    capitalNumAcciones: z.string(),
    capitalValorNominal: z.string(),
    capitalValorNominalLetras: z.string(),
    sunatEstadoEmpresa: z.string(),
    sunatCondicionEmpresa: z.string(),
    sunatDeudaCoactiva: z.string(),
    sunatDeudaMontoTotal: z.string(),
    sunatOmisiones: z.string(),
    sunatOmisionesMonto: z.string(),
    sunatTrabajadoresMesFecha: z.string(),
    sunatTrabajadoresAnioFecha: z.string(),
    sunatTrabajadores: z.string(),
    sunatPrestadores: z.string(),
    representantesLegalesResumen: z.string(),
    infoEstablecimientosAnexosSunat: z.boolean(),
    cantidadEstablecimientos: z.string(),
    nombresEstablecimientos: z.string()
  })
})

export const personaSchema = z.object({
  sujeto: z.object({
    jsonPathOrigen: z.string(),
    hashNegocio: z.string(),
    scoreValor: z.string(),
    nivelRiesgo: z.string(),
    cantidadRiesgosNum: z.string(),
    riesgosEstadoCalificacion: z.string(),
    riesgosComportamientoPago: z.string(),
    comportamiento13m: z.string(),
    deudaTotalTexto: z.string(),
    deudaTotalMonto: z.string(),
    deudaTotalCredito: z.string(),
    deudaTotalBanco: z.string(),
    descripcionOtrasDeudas: z.string()
  }),
  persona: z.object({
    nombreCompleto: z.string().min(1, 'El nombre es obligatorio'),
    tipoDocumento: z.string().min(1, 'El tipo de documento es obligatorio'),
    tipoDocumentoRaw: z.string(),
    numeroDocumento: z.string().min(1, 'El número de documento es obligatorio'),
    rucPersonal: z.string(),
    domicilioFiscalPersonal: z.string(),
    estadoContribuyente: z.string(),
    condicionContribuyente: z.string(),
    deudaPublicaSunat: z.string(),
    omisionesTributariasSunat: z.string(),
    nombreJsonRaw: z.string(),
    gerenteNombreJsonRaw: z.string(),
    gerenteNumeroDocumentoRaw: z.string()
  })
})

export const proyectoSchema = z.object({
  proyecto: z.object({
    empresaPrincipalSujetoId: z.number(),
    fecha1: z.string().min(1, 'La fecha es obligatoria'),
    textoProyectosNatural: z.string().min(1, 'El texto del proyecto es obligatorio'),
    cargaLoteId: z.number().optional(),
    payloadOriginal: z.object({
      fuente: z.string(),
      origen: z.string()
    })
  })
})

export type EmpresaFormValues = z.infer<typeof empresaSchema>
export type PersonaFormValues = z.infer<typeof personaSchema>
export type ProyectoFormValues = z.infer<typeof proyectoSchema>