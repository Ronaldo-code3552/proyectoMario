import type { EmpresaReportesState } from './reportes'
import {
  createEmptyReporteExpedienteItem,
  createEmptyReporteListaSimpleItem,
  createEmptyReporteMinisterioViviendaItem,
  createEmptyRepresentanteLegalItem,
  createEmptySunatItem
} from './reportes'

type Props = {
  value: EmpresaReportesState
  onChange: (value: EmpresaReportesState) => void
  onBack?: () => void
  onNext?: () => void
  loading?: boolean
  hideActions?: boolean
  title?: string
}

export default function EmpresaReportesStep({
  value,
  onChange,
  onBack = () => {},
  onNext = () => {},
  loading,
  hideActions = false,
  title = 'Reportes de empresa'
}: Props) {
  const updateSection = <K extends keyof EmpresaReportesState>(
    section: K,
    nextValue: EmpresaReportesState[K]
  ) => {
    onChange({
      ...value,
      [section]: nextValue
    })
  }

  const updateItem = <K extends keyof EmpresaReportesState>(
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
    updateSection(section, items as EmpresaReportesState[K])
  }

  const addItem = <K extends keyof EmpresaReportesState>(
    section: K,
    factory: (ordenLista?: number) => any
  ) => {
    const nextOrder = value[section].length + 1
    updateSection(section, [...value[section], factory(nextOrder)] as EmpresaReportesState[K])
  }

  const removeItem = <K extends keyof EmpresaReportesState>(section: K, index: number) => {
    const items = value[section].filter((_, i) => i !== index)
    updateSection(section, items as EmpresaReportesState[K])
  }

  return (
    <div className="reportes-step">
      <h2>{title}</h2>

      <section className="report-block">
        <div className="section-head">
          <h3>Deudas SUNAT</h3>
          <button type="button" onClick={() => addItem('sunatDeudas', createEmptySunatItem)}>Agregar</button>
        </div>

        {value.sunatDeudas.map((item, index) => (
          <div key={`deuda-${index}`} className="mini-card">
            <input placeholder="Monto" value={item.monto} onChange={(e) => updateItem('sunatDeudas', index, 'monto', e.target.value)} />
            <input placeholder="Periodo" value={item.periodo} onChange={(e) => updateItem('sunatDeudas', index, 'periodo', e.target.value)} />
            <input placeholder="Fecha texto" value={item.fechaTexto} onChange={(e) => updateItem('sunatDeudas', index, 'fechaTexto', e.target.value)} />
            <input placeholder="Entidad" value={item.entidad} onChange={(e) => updateItem('sunatDeudas', index, 'entidad', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('sunatDeudas', index)}>Quitar</button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Omisiones SUNAT</h3>
          <button type="button" onClick={() => addItem('sunatOmisiones', createEmptySunatItem)}>Agregar</button>
        </div>

        {value.sunatOmisiones.map((item, index) => (
          <div key={`omision-${index}`} className="mini-card">
            <input placeholder="Monto" value={item.monto} onChange={(e) => updateItem('sunatOmisiones', index, 'monto', e.target.value)} />
            <input placeholder="Periodo" value={item.periodo} onChange={(e) => updateItem('sunatOmisiones', index, 'periodo', e.target.value)} />
            <input placeholder="Fecha texto" value={item.fechaTexto} onChange={(e) => updateItem('sunatOmisiones', index, 'fechaTexto', e.target.value)} />
            <input placeholder="Entidad" value={item.entidad} onChange={(e) => updateItem('sunatOmisiones', index, 'entidad', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('sunatOmisiones', index)}>Quitar</button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Representantes legales</h3>
          <button type="button" onClick={() => addItem('representantesLegales', createEmptyRepresentanteLegalItem)}>Agregar</button>
        </div>

        {value.representantesLegales.map((item, index) => (
          <div key={`rep-${index}`} className="mini-card">
            <input placeholder="Puesto" value={item.puestoRepresentanteLegal} onChange={(e) => updateItem('representantesLegales', index, 'puestoRepresentanteLegal', e.target.value)} />
            <input placeholder="Fecha desde" value={item.fechaDesdeRepresentanteLegal} onChange={(e) => updateItem('representantesLegales', index, 'fechaDesdeRepresentanteLegal', e.target.value)} />
            <input placeholder="Nombre" value={item.nombreRepresentanteLegal} onChange={(e) => updateItem('representantesLegales', index, 'nombreRepresentanteLegal', e.target.value)} />
            <input placeholder="Tipo documento" value={item.documentoRepresentanteLegal} onChange={(e) => updateItem('representantesLegales', index, 'documentoRepresentanteLegal', e.target.value)} />
            <input placeholder="Número documento" value={item.documentoNumeroRepresentanteLegal} onChange={(e) => updateItem('representantesLegales', index, 'documentoNumeroRepresentanteLegal', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('representantesLegales', index)}>Quitar</button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Reportes expediente</h3>
          <button type="button" onClick={() => addItem('reportesExpediente', createEmptyReporteExpedienteItem)}>Agregar</button>
        </div>

        {value.reportesExpediente.map((item, index) => (
          <div key={`exp-${index}`} className="mini-card">
            <select value={item.tipoReporte} onChange={(e) => updateItem('reportesExpediente', index, 'tipoReporte', e.target.value)}>
              <option value="COMISION_REPRESION">COMISION_REPRESION</option>
              <option value="SALA_DEFENSA">SALA_DEFENSA</option>
              <option value="SALA_CONCURSAL">SALA_CONCURSAL</option>
              <option value="COMISION">COMISION</option>
              <option value="JUZGADO_CIVIL">JUZGADO_CIVIL</option>
              <option value="JUZGADO_FAMILIAR">JUZGADO_FAMILIAR</option>
              <option value="JUZGADO_LABORAL">JUZGADO_LABORAL</option>
              <option value="RECLAMOS">RECLAMOS</option>
              <option value="INFRACCIONES">INFRACCIONES</option>
            </select>
            <input placeholder="Expediente" value={item.expediente} onChange={(e) => updateItem('reportesExpediente', index, 'expediente', e.target.value)} />
            <input placeholder="Órgano" value={item.organo} onChange={(e) => updateItem('reportesExpediente', index, 'organo', e.target.value)} />
            <input placeholder="Partes" value={item.partes} onChange={(e) => updateItem('reportesExpediente', index, 'partes', e.target.value)} />
            <input placeholder="Estatus" value={item.estatus} onChange={(e) => updateItem('reportesExpediente', index, 'estatus', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('reportesExpediente', index)}>Quitar</button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Reportes lista simple</h3>
          <button type="button" onClick={() => addItem('reportesListaSimple', createEmptyReporteListaSimpleItem)}>Agregar</button>
        </div>

        {value.reportesListaSimple.map((item, index) => (
          <div key={`lista-${index}`} className="mini-card">
            <select value={item.tipoReporte} onChange={(e) => updateItem('reportesListaSimple', index, 'tipoReporte', e.target.value)}>
              <option value="RANKING_CONSTRUCTORAS">RANKING_CONSTRUCTORAS</option>
              <option value="PROTECCION">PROTECCION</option>
              <option value="SALA_PROTECCION">SALA_PROTECCION</option>
              <option value="COMISION_SIGNOS">COMISION_SIGNOS</option>
              <option value="COMISION_INVENTOS">COMISION_INVENTOS</option>
              <option value="RECLAMOS">RECLAMOS</option>
              <option value="INFRACCIONES">INFRACCIONES</option>
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
            <button type="button" className="danger" onClick={() => removeItem('reportesListaSimple', index)}>Quitar</button>
          </div>
        ))}
      </section>

      <section className="report-block">
        <div className="section-head">
          <h3>Ministerio de Vivienda</h3>
          <button type="button" onClick={() => addItem('reportesMinisterioVivienda', createEmptyReporteMinisterioViviendaItem)}>Agregar</button>
        </div>

        {value.reportesMinisterioVivienda.map((item, index) => (
          <div key={`minv-${index}`} className="mini-card">
            <input placeholder="Órgano" value={item.organo} onChange={(e) => updateItem('reportesMinisterioVivienda', index, 'organo', e.target.value)} />
            <input placeholder="Sanción" value={item.sancion} onChange={(e) => updateItem('reportesMinisterioVivienda', index, 'sancion', e.target.value)} />
            <button type="button" className="danger" onClick={() => removeItem('reportesMinisterioVivienda', index)}>Quitar</button>
          </div>
        ))}
      </section>

      {!hideActions && (
        <div className="actions">
          <button type="button" className="secondary" onClick={onBack}>Atrás</button>
          <button type="button" onClick={onNext} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar reportes y seguir'}
          </button>
        </div>
      )}
    </div>
  )
}