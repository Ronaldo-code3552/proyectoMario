import type { UseFormReturn } from 'react-hook-form'
import type { EmpresaFormValues } from '../schemas'

type EmpresaFormSectionProps = {
  form: UseFormReturn<EmpresaFormValues>
  title?: string
}

export function EmpresaGeneralFormSection({
  form,
  title = 'Empresa principal'
}: EmpresaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label>
        Razón social
        <input {...form.register('empresa.razonSocial')} />
      </label>

      <label>
        RUC
        <input {...form.register('empresa.rucEmpresa')} />
      </label>

      <label>
        Nombre comercial
        <input {...form.register('empresa.nombreEmpresa')} />
      </label>

      <label>
        Domicilio fiscal
        <input {...form.register('empresa.domicilioFiscal')} />
      </label>

      <label>
        Fecha de constitución
        <input type="date" {...form.register('empresa.fechaConstitucion')} />
      </label>

      <label>
        Objeto social
        <input {...form.register('empresa.objetoSocial')} />
      </label>

      <label>
        Partida registral
        <input {...form.register('empresa.partidaPersonasJuridicas')} />
      </label>

      <label>
        Oficina registral
        <input {...form.register('empresa.partidaPersonasJuridicasDireccion')} />
      </label>

      <label>
        Objeto social código
        <input {...form.register('empresa.objetoSocialCodigo')} />
      </label>
    </div>
  )
}

export function EmpresaRiskFormSection({
  form,
  title = 'Perfil de riesgo y endeudamiento'
}: EmpresaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label>
        Score valor
        <input {...form.register('sujeto.scoreValor')} />
      </label>

      <label>
        Nivel de riesgo
        <input {...form.register('sujeto.nivelRiesgo')} />
      </label>

      <label>
        Cantidad de riesgos
        <input {...form.register('sujeto.cantidadRiesgosNum')} />
      </label>

      <label>
        Estado de calificación
        <input {...form.register('sujeto.riesgosEstadoCalificacion')} />
      </label>

      <label>
        Comportamiento de pago
        <input {...form.register('sujeto.riesgosComportamientoPago')} />
      </label>

      <label>
        Comportamiento 13m
        <input {...form.register('sujeto.comportamiento13m')} />
      </label>

      <label>
        Deuda total texto
        <input {...form.register('sujeto.deudaTotalTexto')} />
      </label>

      <label>
        Deuda total monto
        <input {...form.register('sujeto.deudaTotalMonto')} />
      </label>

      <label>
        Deuda total crédito
        <input {...form.register('sujeto.deudaTotalCredito')} />
      </label>

      <label>
        Deuda total banco
        <input {...form.register('sujeto.deudaTotalBanco')} />
      </label>

      <label className="full-span">
        Descripción otras deudas
        <textarea rows={3} {...form.register('sujeto.descripcionOtrasDeudas')} />
      </label>
    </div>
  )
}

export function EmpresaCapitalFormSection({
  form,
  title = 'Capital y constitución'
}: EmpresaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label>
        Suma número
        <input {...form.register('empresa.sumaNumero')} />
      </label>

      <label>
        Suma número letra
        <input {...form.register('empresa.sumaNumeroLetra')} />
      </label>

      <label>
        Valor nominal
        <input {...form.register('empresa.valorNominal')} />
      </label>

      <label>
        Valor nominal número
        <input {...form.register('empresa.valorNominalNumero')} />
      </label>

      <label>
        Capital monto
        <input {...form.register('empresa.capitalMonto')} />
      </label>

      <label>
        Capital monto letras
        <input {...form.register('empresa.capitalMontoLetras')} />
      </label>

      <label>
        Capital número acciones
        <input {...form.register('empresa.capitalNumAcciones')} />
      </label>

      <label>
        Capital valor nominal
        <input {...form.register('empresa.capitalValorNominal')} />
      </label>

      <label className="full-span">
        Capital valor nominal letras
        <input {...form.register('empresa.capitalValorNominalLetras')} />
      </label>
    </div>
  )
}

export function EmpresaSunatSummaryFormSection({
  form,
  title = 'Perfil SUNAT y operación'
}: EmpresaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label>
        SUNAT estado empresa
        <input {...form.register('empresa.sunatEstadoEmpresa')} />
      </label>

      <label>
        SUNAT condición empresa
        <input {...form.register('empresa.sunatCondicionEmpresa')} />
      </label>

      <label>
        SUNAT deuda coactiva
        <input {...form.register('empresa.sunatDeudaCoactiva')} />
      </label>

      <label>
        SUNAT deuda monto total
        <input {...form.register('empresa.sunatDeudaMontoTotal')} />
      </label>

      <label>
        SUNAT omisiones
        <input {...form.register('empresa.sunatOmisiones')} />
      </label>

      <label>
        SUNAT omisiones monto
        <input {...form.register('empresa.sunatOmisionesMonto')} />
      </label>

      <label>
        SUNAT trabajadores mes
        <input {...form.register('empresa.sunatTrabajadoresMesFecha')} />
      </label>

      <label>
        SUNAT trabajadores año
        <input {...form.register('empresa.sunatTrabajadoresAnioFecha')} />
      </label>

      <label>
        SUNAT trabajadores
        <input {...form.register('empresa.sunatTrabajadores')} />
      </label>

      <label>
        SUNAT prestadores
        <input {...form.register('empresa.sunatPrestadores')} />
      </label>

      <label className="full-span">
        Representantes legales resumen
        <input {...form.register('empresa.representantesLegalesResumen')} />
      </label>
    </div>
  )
}

export function EmpresaEstablecimientosFormSection({
  form,
  title = 'Establecimientos'
}: EmpresaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label>
        Cantidad de establecimientos
        <input {...form.register('empresa.cantidadEstablecimientos')} />
      </label>

      <label className="full-span">
        Nombres de establecimientos
        <textarea rows={4} {...form.register('empresa.nombresEstablecimientos')} />
      </label>
    </div>
  )
}