import type { UseFormReturn } from 'react-hook-form'
import { documentTypeOptions } from '../documentTypes'
import type { PersonaFormValues } from '../schemas'

type PersonaFormSectionProps = {
  form: UseFormReturn<PersonaFormValues>
  title?: string
}

export function PersonaFormSection({
  form,
  title = 'Persona'
}: PersonaFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>{title}</h2>

      <label className="full-span">
        Nombre completo
        <input {...form.register('persona.nombreCompleto')} />
      </label>

      <label>
        Tipo documento
        <select {...form.register('persona.tipoDocumento')}>
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Número documento
        <input {...form.register('persona.numeroDocumento')} />
      </label>

      <label>
        RUC personal
        <input {...form.register('persona.rucPersonal')} />
      </label>

      <label className="full-span">
        Domicilio fiscal
        <input {...form.register('persona.domicilioFiscalPersonal')} />
      </label>

      <label>
        Estado contribuyente
        <input {...form.register('persona.estadoContribuyente')} />
      </label>

      <label>
        Condición contribuyente
        <input {...form.register('persona.condicionContribuyente')} />
      </label>

      <label>
        Deuda pública SUNAT
        <input {...form.register('persona.deudaPublicaSunat')} />
      </label>

      <label>
        Omisiones tributarias SUNAT
        <input {...form.register('persona.omisionesTributariasSunat')} />
      </label>

      <label className="full-span">
        JSON path origen
        <input {...form.register('sujeto.jsonPathOrigen')} />
      </label>

      <label>
        Score
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

      <label className="full-span">
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
        <textarea rows={4} {...form.register('sujeto.descripcionOtrasDeudas')} />
      </label>
    </div>
  )
}
