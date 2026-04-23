import type { EmpresaFormValues } from '../schemas'

const clean = (value: string | undefined | null) => (value ?? '').trim()

const hasEstablecimientosInfo = (values: EmpresaFormValues['empresa']) => {
  const cantidad = clean(values.cantidadEstablecimientos)
  const nombres = clean(values.nombresEstablecimientos)

  const hasCantidad = cantidad !== '' && cantidad !== '0'
  const hasNombres = nombres !== ''

  return hasCantidad || hasNombres
}

export const buildEmpresaSubmitPayload = (
  values: EmpresaFormValues
): EmpresaFormValues => {
  const rucEmpresa = clean(values.empresa.rucEmpresa)

  return {
    sujeto: {
      ...values.sujeto,
      jsonPathOrigen: '$.empresa',
      hashNegocio: rucEmpresa,
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
    empresa: {
      ...values.empresa,
      nombreEmpresa: clean(values.empresa.nombreEmpresa),
      razonSocial: clean(values.empresa.razonSocial),
      rucEmpresa,
      partidaPersonasJuridicas: clean(values.empresa.partidaPersonasJuridicas),
      partidaPersonasJuridicasDireccion: clean(values.empresa.partidaPersonasJuridicasDireccion),
      domicilioFiscal: clean(values.empresa.domicilioFiscal),
      fechaConstitucion: clean(values.empresa.fechaConstitucion),
      objetoSocialCodigo: clean(values.empresa.objetoSocialCodigo),
      objetoSocial: clean(values.empresa.objetoSocial),
      sumaNumero: clean(values.empresa.sumaNumero),
      sumaNumeroLetra: clean(values.empresa.sumaNumeroLetra),
      valorNominal: clean(values.empresa.valorNominal),
      valorNominalNumero: clean(values.empresa.valorNominalNumero),
      capitalMonto: clean(values.empresa.capitalMonto),
      capitalMontoLetras: clean(values.empresa.capitalMontoLetras),
      capitalNumAcciones: clean(values.empresa.capitalNumAcciones),
      capitalValorNominal: clean(values.empresa.capitalValorNominal),
      capitalValorNominalLetras: clean(values.empresa.capitalValorNominalLetras),
      sunatEstadoEmpresa: clean(values.empresa.sunatEstadoEmpresa),
      sunatCondicionEmpresa: clean(values.empresa.sunatCondicionEmpresa),
      sunatDeudaCoactiva: clean(values.empresa.sunatDeudaCoactiva),
      sunatDeudaMontoTotal: clean(values.empresa.sunatDeudaMontoTotal),
      sunatOmisiones: clean(values.empresa.sunatOmisiones),
      sunatOmisionesMonto: clean(values.empresa.sunatOmisionesMonto),
      sunatTrabajadoresMesFecha: clean(values.empresa.sunatTrabajadoresMesFecha),
      sunatTrabajadoresAnioFecha: clean(values.empresa.sunatTrabajadoresAnioFecha),
      sunatTrabajadores: clean(values.empresa.sunatTrabajadores),
      sunatPrestadores: clean(values.empresa.sunatPrestadores),
      representantesLegalesResumen: clean(values.empresa.representantesLegalesResumen),
      cantidadEstablecimientos: clean(values.empresa.cantidadEstablecimientos),
      nombresEstablecimientos: clean(values.empresa.nombresEstablecimientos),
      infoEstablecimientosAnexosSunat: hasEstablecimientosInfo(values.empresa)
    }
  }
}