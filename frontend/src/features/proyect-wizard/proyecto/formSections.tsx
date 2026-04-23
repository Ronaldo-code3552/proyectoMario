import type { UseFormReturn } from 'react-hook-form'
import type { ProyectoFormValues } from '../schemas'
import ProyectoEmpresaSelector, {
  type ProyectoEmpresaPreview
} from './components/ProyectoEmpresaSelector'

type ProyectoFormSectionProps = {
  form: UseFormReturn<ProyectoFormValues>
  initialEmpresaPreview?: ProyectoEmpresaPreview
}

export function ProyectoFormSection({
  form,
  initialEmpresaPreview
}: ProyectoFormSectionProps) {
  return (
    <div className="form-grid">
      <h2>Proyecto</h2>

      <div className="full-span">
        <ProyectoEmpresaSelector
          form={form}
          initialEmpresaPreview={initialEmpresaPreview}
        />
      </div>

      <label>
        Fecha 1
        <input {...form.register('proyecto.fecha1')} />
      </label>

      <label>
        Texto proyecto
        <input {...form.register('proyecto.textoProyectosNatural')} />
      </label>

      <label>
        Carga lote ID
        <input
          type="number"
          {...form.register('proyecto.cargaLoteId', {
            valueAsNumber: true
          })}
        />
      </label>
    </div>
  )
}
