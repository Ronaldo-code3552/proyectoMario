import type { PersonaReportesState } from './reportes'
import {
  createEmptyReporteExpedienteItem,
  createEmptyReporteListaSimpleItem,
  createEmptyReporteMinisterioViviendaItem
} from './reportes'

type Props = {
  value: PersonaReportesState
  onChange: (value: PersonaReportesState) => void
  onBack?: () => void
  onNext?: () => void
  loading?: boolean
  hideActions?: boolean
  title?: string
}

export default function PersonaReportesStep({
  value,
  onChange,
  onBack = () => {},
  onNext = () => {},
  loading,
  hideActions = false,
  title = 'Reportes de persona / gerente'
}: Props) {
  const updateSection = <K extends keyof PersonaReportesState>(
    section: K,
    nextValue: PersonaReportesState[K]
  ) => {
    onChange({
      ...value,
      [section]: nextValue
    })
  }

  const updateItem = <K extends keyof PersonaReportesState>(
    section: K,
    index: number,
    field: string,
    fieldValue: any
  ) => {
    const items = [...value[section]] as any[]
    items[index] = {
      ...items[index],
      [field]: fieldValue
    }
    updateSection(section, items as PersonaReportesState[K])
  }

  const addItem = <K extends keyof PersonaReportesState>(
    section: K,
    factory: (ordenLista?: number) => any
  ) => {
    const nextOrder = value[section].length + 1
    updateSection(section, [...value[section], factory(nextOrder)] as PersonaReportesState[K])
  }

  const removeItem = <K extends keyof PersonaReportesState>(section: K, index: number) => {
    const items = value[section].filter((_, i) => i !== index)
    updateSection(section, items as PersonaReportesState[K])
  }

  return (
    <div className="reportes-step">
      <h2>{title}</h2>

      <section className="report-block">
        <div className="section-head">
          <h3>Reportes expediente</h3>
          <button type="button" onClick={() => addItem('reportesExpediente', createEmptyReporteExpedienteItem)}>
            Agregar
          </button>
        </div>

        {value.reportesExpediente.map((item, index) => (
          <div key={`persona-exp-${index}`} className="mini-card">
            <select value={item.tipoReporte} onChange={(e) => updateItem('reportesExpediente', index, 'tipoReporte', e.target.value)}>
              <option value="COMISION_REPRESION">COMISION_REPRESION</option>
              <option value="SALA_CONCURSAL">SALA_CONCURSAL</option>
              <option value="COMISION">COMISION</option>
              <option value="JUZGADO_CIVIL">JUZGADO_CIVIL</option>
              <option value="JUZGADO_FAMILIAR">JUZGADO_FAMILIAR</option>
              <option value="JUZGADO_LABORAL">JUZGADO_LABORAL</option>
            </select>
            <input placeholder="Expediente" value={item.expediente} onChange={(e) => updateItem('reportesExpediente', index, 'expediente', e.target.value)} />
            <input placeholder="Órgano" value={item.organo} onChange={(e) => updateItem('reportesExpediente', index, 'organo', e.target.value)} />
            <input placeholder="Partes" value={item.partes} onChange={(e) => updateItem('reportesExpediente', index, 'partes', e.target.value)} />
            <input placeholder="Estatus" value={item.estatus} onChange={(e) => updateItem('reportesExpediente', index, 'estatus', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('reportesExpediente', index)}>
              Quitar
            </button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Reportes lista simple</h3>
          <button type="button" onClick={() => addItem('reportesListaSimple', createEmptyReporteListaSimpleItem)}>
            Agregar
          </button>
        </div>

        {value.reportesListaSimple.map((item, index) => (
          <div key={`persona-lista-${index}`} className="mini-card">
            <select value={item.tipoReporte} onChange={(e) => updateItem('reportesListaSimple', index, 'tipoReporte', e.target.value)}>
              <option value="PROTECCION">PROTECCION</option>
              <option value="RANKING_CONSTRUCTORAS">RANKING_CONSTRUCTORAS</option>
              <option value="SALA_PROTECCION">SALA_PROTECCION</option>
              <option value="COMISION_SIGNOS">COMISION_SIGNOS</option>
              <option value="COMISION_INVENTOS">COMISION_INVENTOS</option>
            </select>
            <input placeholder="Razón social" value={item.razonSocial} onChange={(e) => updateItem('reportesListaSimple', index, 'razonSocial', e.target.value)} />
            <input placeholder="Cantidad" value={item.cantidad} onChange={(e) => updateItem('reportesListaSimple', index, 'cantidad', e.target.value)} />
            <input
              placeholder="Fechas"
              value={String(item.payloadItem?.fechas ?? '')}
              onChange={(e) =>
                updateItem('reportesListaSimple', index, 'payloadItem', {
                  ...(item.payloadItem ?? {}),
                  fechas: e.target.value,
                  fuente: 'frontend',
                  tipo: String(item.tipoReporte).toLowerCase()
                })
              }
            />
            <button type="button" className="danger" onClick={() => removeItem('reportesListaSimple', index)}>
              Quitar
            </button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Ministerio de Vivienda</h3>
          <button type="button" onClick={() => addItem('reportesMinisterioVivienda', createEmptyReporteMinisterioViviendaItem)}>
            Agregar
          </button>
        </div>

        {value.reportesMinisterioVivienda.map((item, index) => (
          <div key={`persona-minv-${index}`} className="mini-card">
            <input placeholder="Órgano" value={item.organo} onChange={(e) => updateItem('reportesMinisterioVivienda', index, 'organo', e.target.value)} />
            <input placeholder="Sanción" value={item.sancion} onChange={(e) => updateItem('reportesMinisterioVivienda', index, 'sancion', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('reportesMinisterioVivienda', index)}>
              Quitar
            </button>
          </div>
        ))}
      </section>

      {!hideActions && (
        <div className="actions">
          <button type="button" className="secondary" onClick={onBack}>
            Atrás
          </button>
          <button type="button" onClick={onNext} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar reportes y seguir'}
          </button>
        </div>
      )}
    </div>
  )
}