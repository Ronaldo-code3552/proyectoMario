import type { PersonaFormValues } from '../schemas'

const clean = (value: string | undefined | null) => (value ?? '').trim()

export const buildPersonaSubmitPayload = (
  values: PersonaFormValues
): PersonaFormValues => {
  const nombreCompleto = clean(values.persona.nombreCompleto)
  const tipoDocumento = clean(values.persona.tipoDocumento).toUpperCase()
  const numeroDocumento = clean(values.persona.numeroDocumento)

  const hashNegocio =
    tipoDocumento && numeroDocumento ? `${tipoDocumento}|${numeroDocumento}` : ''

  return {
    sujeto: {
      ...values.sujeto,
      jsonPathOrigen: clean(values.sujeto.jsonPathOrigen) || '$.empresa.gerente_general',
      hashNegocio,
      scoreValor: clean(values.sujeto.scoreValor),
      nivelRiesgo: clean(values.sujeto.nivelRiesgo),
      cantidadRiesgosNum: clean(values.sujeto.cantidadRiesgosNum),
      riesgosEstadoCalificacion: clean(values.sujeto.riesgosEstadoCalificacion),
      riesgosComportamientoPago: clean(values.sujeto.riesgosComportamientoPago),
      comportamiento13m: clean(values.sujeto.comportamiento13m),
      deudaTotalTexto: clean(values.sujeto.deudaTotalTexto),
      deudaTotalMonto: clean(values.sujeto.deudaTotalMonto),
      deudaTotalCredito: clean(values.sujeto.deudaTotalCredito),
      deudaTotalBanco: clean(values.sujeto.deudaTotalBanco),
      descripcionOtrasDeudas: clean(values.sujeto.descripcionOtrasDeudas)
    },
    persona: {
      ...values.persona,
      nombreCompleto,
      tipoDocumento,
      tipoDocumentoRaw: tipoDocumento,
      numeroDocumento,
      rucPersonal: clean(values.persona.rucPersonal),
      domicilioFiscalPersonal: clean(values.persona.domicilioFiscalPersonal),
      estadoContribuyente: clean(values.persona.estadoContribuyente),
      condicionContribuyente: clean(values.persona.condicionContribuyente),
      deudaPublicaSunat: clean(values.persona.deudaPublicaSunat),
      omisionesTributariasSunat: clean(values.persona.omisionesTributariasSunat),
      nombreJsonRaw: nombreCompleto,
      gerenteNombreJsonRaw: nombreCompleto,
      gerenteNumeroDocumentoRaw: numeroDocumento
    }
  }
}