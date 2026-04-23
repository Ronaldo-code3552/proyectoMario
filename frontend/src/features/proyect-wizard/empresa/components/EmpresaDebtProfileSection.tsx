import type { UseFormReturn } from 'react-hook-form'
import {
  createEmptyReporteExpedienteItem,
  createEmptyReporteListaSimpleItem,
  createEmptyReporteMinisterioViviendaItem,
  createEmptyRepresentanteLegalItem,
  createEmptySunatItem,
  type EmpresaReportesState,
  type ReporteListaSimpleItem,
  type ReporteExpedienteItem
} from '../../reportes'
import { documentTypeOptions } from '../../documentTypes'
import type { EmpresaFormValues } from '../../schemas'
import type { EmpresaDetail } from '../types'

export type EmpresaDebtSectionKey = 'sunat' | 'sunarp' | 'riesgo' | 'indecopi'

type Props = {
  form: UseFormReturn<EmpresaFormValues>
  reportes: EmpresaReportesState
  onChange: (value: EmpresaReportesState) => void
  section: EmpresaDebtSectionKey
  selectedEmpresa?: EmpresaDetail | null
  workspaceTitle: string
  workspaceDescription: string
}

const humanizeReportKey = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')

export default function EmpresaDebtProfileSection({
  form,
  reportes,
  onChange,
  section,
  selectedEmpresa,
  workspaceTitle,
  workspaceDescription
}: Props) {
  const indecopiSummary = [
    {
      label: 'Expedientes cargados',
      value: (selectedEmpresa?.reportesExpediente?.length ?? 0) + reportes.reportesExpediente.length
    },
    {
      label: 'Listas simples',
      value: (selectedEmpresa?.reportesListaSimple?.length ?? 0) + reportes.reportesListaSimple.length
    },
    {
      label: 'Registros ministerio vivienda',
      value:
        (selectedEmpresa?.reportesMinisterioVivienda?.length ?? 0) +
        reportes.reportesMinisterioVivienda.length
    }
  ]

  const updateSection = <K extends keyof EmpresaReportesState>(
    section: K,
    nextValue: EmpresaReportesState[K]
  ) => {
    onChange({
      ...reportes,
      [section]: nextValue
    })
  }

  const addItem = <K extends keyof EmpresaReportesState>(
    section: K,
    factory: (ordenLista?: number) => EmpresaReportesState[K][number]
  ) => {
    const nextOrder = reportes[section].length + 1
    updateSection(section, [...reportes[section], factory(nextOrder)] as EmpresaReportesState[K])
  }

  const updateItem = <K extends keyof EmpresaReportesState>(
    section: K,
    index: number,
    field: string,
    fieldValue: string
  ) => {
    const items = [...reportes[section]] as EmpresaReportesState[K]
    const currentItem = items[index]

    items[index] = {
      ...currentItem,
      [field]: fieldValue
    } as EmpresaReportesState[K][number]

    updateSection(section, items)
  }

  const removeItem = <K extends keyof EmpresaReportesState>(section: K, index: number) => {
    updateSection(
      section,
      reportes[section].filter((_, itemIndex) => itemIndex !== index) as EmpresaReportesState[K]
    )
  }

  const expedienteItemsByType = (tipoReporte: ReporteExpedienteItem['tipoReporte']) =>
    reportes.reportesExpediente
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.tipoReporte === tipoReporte)

  const existingExpedienteItemsByType = (tipoReporte: string) =>
    (selectedEmpresa?.reportesExpediente ?? []).filter((item) => item.tipoReporte === tipoReporte)

  const updateExpedienteItem = (
    index: number,
    field: keyof ReporteExpedienteItem,
    fieldValue: string
  ) => {
    const items = [...reportes.reportesExpediente]
    items[index] = {
      ...items[index],
      [field]: fieldValue
    }
    updateSection('reportesExpediente', items)
  }

  const expedienteTypeMeta: Record<
    string,
    {
      title: string
      emptyCopy: string
      payloadTipo: string
      defaultOrgano?: string
    }
  > = {
    COMISION_REPRESION: {
      title: 'lista_reporte_comision_represion',
      emptyCopy: 'No hay detalles nuevos para comision represion.',
      payloadTipo: 'reporte_expediente_empresa',
      defaultOrgano: 'INDECOPI'
    },
    COMISION: {
      title: 'lista_reporte_comision',
      emptyCopy: 'No hay detalles nuevos para comision.',
      payloadTipo: 'comision',
      defaultOrgano: 'Comisión de Protección al Consumidor - INDECOPI'
    },
    SALA_DEFENSA: {
      title: 'lista_reporte_sala_defensa',
      emptyCopy: 'No hay detalles nuevos para sala defensa.',
      payloadTipo: 'sala_defensa',
      defaultOrgano: 'SALA DE DEFENSA'
    },
    JUZGADO_CIVIL: {
      title: 'lista_reporte_juzgado_civil',
      emptyCopy: 'No hay detalles nuevos para juzgado civil.',
      payloadTipo: 'juzgado_civil',
      defaultOrgano: '1ER JUZGADO CIVIL'
    },
    JUZGADO_LABORAL: {
      title: 'lista_reporte_juzgado_laboral',
      emptyCopy: 'No hay detalles nuevos para juzgado laboral.',
      payloadTipo: 'juzgado_laboral',
      defaultOrgano: '1ER JUZGADO LABORAL'
    },
    INFRACCIONES: {
      title: 'lista_reporte_infracciones',
      emptyCopy: 'No hay detalles nuevos para infracciones.',
      payloadTipo: 'infracciones'
    },
    RECLAMOS: {
      title: 'lista_reporte_reclamos',
      emptyCopy: 'No hay detalles nuevos para reclamos.',
      payloadTipo: 'reclamos'
    }
  }

  const listaSimpleTypeMeta: Record<
    string,
    {
      title: string
      emptyCopy: string
      payloadTipo: string
    }
  > = {
    RANKING_CONSTRUCTORAS: {
      title: 'RANKING_CONSTRUCTORAS',
      emptyCopy: 'No hay registros nuevos para ranking constructoras.',
      payloadTipo: 'ranking_constructoras'
    },
    PROTECCION: {
      title: 'PROTECCION',
      emptyCopy: 'No hay registros nuevos para proteccion.',
      payloadTipo: 'proteccion'
    },
    SALA_PROTECCION: {
      title: 'SALA_PROTECCION',
      emptyCopy: 'No hay registros nuevos para sala proteccion.',
      payloadTipo: 'sala_proteccion'
    },
    COMISION_SIGNOS: {
      title: 'COMISION_SIGNOS',
      emptyCopy: 'No hay registros nuevos para comision signos.',
      payloadTipo: 'comision_signos'
    },
    COMISION_INVENTOS: {
      title: 'COMISION_INVENTOS',
      emptyCopy: 'No hay registros nuevos para comision inventos.',
      payloadTipo: 'comision_inventos'
    }
  }

  const listaSimpleItemsByType = (tipoReporte: ReporteListaSimpleItem['tipoReporte']) =>
    reportes.reportesListaSimple
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.tipoReporte === tipoReporte)

  const existingListaSimpleItemsByType = (tipoReporte: string) =>
    (selectedEmpresa?.reportesListaSimple ?? []).filter((item) => item.tipoReporte === tipoReporte)

  const expedientePanelTypes = Array.from(
    new Set([
      'COMISION',
      'COMISION_REPRESION',
      'SALA_DEFENSA',
      'JUZGADO_CIVIL',
      'JUZGADO_LABORAL',
      'INFRACCIONES',
      'RECLAMOS',
      ...reportes.reportesExpediente.map((item) => item.tipoReporte),
      ...(selectedEmpresa?.reportesExpediente ?? []).map((item) => item.tipoReporte ?? '')
    ])
  ).filter(Boolean)

  const listaSimplePanelTypes = Array.from(
    new Set([
      'RANKING_CONSTRUCTORAS',
      'PROTECCION',
      'SALA_PROTECCION',
      'COMISION_SIGNOS',
      'COMISION_INVENTOS',
      ...reportes.reportesListaSimple.map((item) => item.tipoReporte),
      ...(selectedEmpresa?.reportesListaSimple ?? []).map((item) => item.tipoReporte ?? '')
    ])
  ).filter((tipoReporte) => Boolean(tipoReporte) && tipoReporte !== 'RECLAMOS')

  const existingMinisterioViviendaItems = selectedEmpresa?.reportesMinisterioVivienda ?? []

  const addListaSimpleItem = (tipoReporte: ReporteListaSimpleItem['tipoReporte']) => {
    const nextOrder = reportes.reportesListaSimple.length + 1
    const meta = listaSimpleTypeMeta[tipoReporte] ?? {
      title: tipoReporte,
      emptyCopy: 'No hay registros nuevos.',
      payloadTipo: String(tipoReporte).toLowerCase()
    }

    updateSection('reportesListaSimple', [
      ...reportes.reportesListaSimple,
      {
        ...createEmptyReporteListaSimpleItem(nextOrder),
        tipoReporte,
        payloadItem: {
          fuente: 'frontend',
          tipo: meta.payloadTipo,
          fechas: ''
        }
      }
    ])
  }

  const updateListaSimpleItem = (
    index: number,
    field: keyof ReporteListaSimpleItem,
    fieldValue: string
  ) => {
    const items = [...reportes.reportesListaSimple]
    items[index] = {
      ...items[index],
      [field]: fieldValue
    }
    updateSection('reportesListaSimple', items)
  }

  const addMinisterioViviendaItem = () => {
    const nextOrder = reportes.reportesMinisterioVivienda.length + 1
    updateSection('reportesMinisterioVivienda', [
      ...reportes.reportesMinisterioVivienda,
      createEmptyReporteMinisterioViviendaItem(nextOrder)
    ])
  }

  const addExpedienteItem = (tipoReporte: ReporteExpedienteItem['tipoReporte']) => {
    const nextOrder = reportes.reportesExpediente.length + 1
    const meta = expedienteTypeMeta[tipoReporte] ?? {
      title: tipoReporte,
      emptyCopy: 'No hay detalles nuevos.',
      payloadTipo: String(tipoReporte).toLowerCase(),
      defaultOrgano: ''
    }

    updateSection('reportesExpediente', [
      ...reportes.reportesExpediente,
      {
        ...createEmptyReporteExpedienteItem(nextOrder),
        tipoReporte,
        organo: meta.defaultOrgano ?? '',
        payloadItem: {
          fuente: 'frontend',
          tipo: meta.payloadTipo
        }
      }
    ])
  }

  const renderReadonlyMiniCard = (
    badge: string,
    fields: Array<{ label: string; value: string | number | undefined | null }>
  ) => (
    <div className="mini-card readonly-mini-card">
      <div className="readonly-mini-card-badge full-span">{badge}</div>
      {fields.map((field) => (
        <div key={`${badge}-${field.label}`} className="mini-card-field">
          <span>{field.label}</span>
          <div>{field.value || '-'}</div>
        </div>
      ))}
    </div>
  )

  const renderSectionIntro = (
    eyebrow: string,
    sectionCode: string,
    sectionSummary: string,
    tone: 'default' | 'featured' = 'default'
  ) => (
    <div className={`report-block-copy${tone === 'featured' ? ' report-block-copy-featured' : ''}`}>
      <div className="report-block-copy-topline">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{workspaceTitle}</h2>
        </div>
        <span className="report-code-badge">{sectionCode}</span>
      </div>
      <p className="muted">{workspaceDescription}</p>
      <p className="report-block-supporting-copy">{sectionSummary}</p>
    </div>
  )

  const renderExpedientePanel = (
    tipoReporte: ReporteExpedienteItem['tipoReporte']
  ) => {
    const meta = expedienteTypeMeta[tipoReporte]
    const items = expedienteItemsByType(tipoReporte)
    const existingItems = existingExpedienteItemsByType(tipoReporte)
    const heading = humanizeReportKey(tipoReporte)

    return (
      <section className="report-mini-panel">
        <div className="section-head">
          <div>
            <h3>{heading}</h3>
            <p className="muted">{meta?.title ?? tipoReporte}</p>
          </div>
          <button type="button" onClick={() => addExpedienteItem(tipoReporte)}>
            Agregar detalle
          </button>
        </div>

        {existingItems.length === 0 && items.length === 0 ? (
          <p className="muted">{meta?.emptyCopy ?? 'No hay detalles nuevos.'}</p>
        ) : null}

        {existingItems.map((item, index) => (
          <div key={`existing-${tipoReporte}-${item.id ?? index}`}>
            {renderReadonlyMiniCard(`Registro API ID ${item.id ?? '-'}`, [
              { label: 'TIPO_REPORTE', value: item.tipoReporte },
              { label: 'EXPEDIENTE', value: item.expediente },
              { label: 'ORGANO', value: item.organo },
              { label: 'PARTES', value: item.partes },
              { label: 'ESTATUS', value: item.estatus },
              { label: 'ORDEN_LISTA', value: item.ordenLista }
            ])}
          </div>
        ))}

        {items.map(({ item, index }) => (
          <div key={`${tipoReporte}-${index}`} className="mini-card">
            <div className="readonly-mini-card-badge full-span">Nuevo registro</div>
            <input
              placeholder="expediente"
              value={item.expediente}
              onChange={(event) => updateExpedienteItem(index, 'expediente', event.target.value)}
            />
            <input
              placeholder="organo"
              value={item.organo}
              onChange={(event) => updateExpedienteItem(index, 'organo', event.target.value)}
            />
            <input
              placeholder="denunciantes / partes"
              value={item.partes}
              onChange={(event) => updateExpedienteItem(index, 'partes', event.target.value)}
            />
            <input
              placeholder="estatus"
              value={item.estatus}
              onChange={(event) => updateExpedienteItem(index, 'estatus', event.target.value)}
            />
            <button type="button" className="danger" onClick={() => removeItem('reportesExpediente', index)}>
              Quitar
            </button>
          </div>
        ))}
      </section>
    )
  }

  const renderListaSimplePanel = (tipoReporte: ReporteListaSimpleItem['tipoReporte']) => {
    const meta = listaSimpleTypeMeta[tipoReporte]
    const items = listaSimpleItemsByType(tipoReporte)
    const existingItems = existingListaSimpleItemsByType(tipoReporte)

    return (
      <section className="report-mini-panel">
        <div className="section-head">
          <div>
            <h3>{meta?.title ?? tipoReporte}</h3>
            <p className="muted">reportes_lista_simple</p>
          </div>
          <button type="button" onClick={() => addListaSimpleItem(tipoReporte)}>
            Agregar registro
          </button>
        </div>

        {existingItems.length === 0 && items.length === 0 ? (
          <p className="muted">{meta?.emptyCopy ?? 'No hay registros nuevos.'}</p>
        ) : null}

        {existingItems.map((item, index) => (
          <div key={`existing-${tipoReporte}-${item.id ?? index}`}>
            {renderReadonlyMiniCard(`Registro API ID ${item.id ?? '-'}`, [
              { label: 'TIPO_REPORTE', value: item.tipoReporte },
              { label: 'RAZON_SOCIAL', value: item.razonSocial },
              { label: 'CANTIDAD', value: item.cantidad },
              {
                label: 'FECHAS',
                value: String((item.payloadItem as { fechas?: string } | undefined)?.fechas ?? '-')
              },
              { label: 'ORDEN_LISTA', value: item.ordenLista }
            ])}
          </div>
        ))}

        {items.map(({ item, index }) => (
          <div key={`${tipoReporte}-${index}`} className="mini-card mini-card-simple">
            <div className="readonly-mini-card-badge full-span">Nuevo registro</div>
            <input
              placeholder="razonSocial"
              value={item.razonSocial}
              onChange={(event) => updateListaSimpleItem(index, 'razonSocial', event.target.value)}
            />
            <input
              placeholder="cantidad"
              value={item.cantidad}
              onChange={(event) => updateListaSimpleItem(index, 'cantidad', event.target.value)}
            />
            <input
              placeholder="payloadItem.fechas"
              value={String(item.payloadItem?.fechas ?? '')}
              onChange={(event) =>
                updateSection(
                  'reportesListaSimple',
                  reportes.reportesListaSimple.map((currentItem, currentIndex) =>
                    currentIndex === index
                      ? {
                          ...currentItem,
                          payloadItem: {
                            ...currentItem.payloadItem,
                            fechas: event.target.value
                          }
                        }
                      : currentItem
                  )
                )
              }
            />
            <button type="button" className="danger" onClick={() => removeItem('reportesListaSimple', index)}>
              Quitar
            </button>
          </div>
        ))}
      </section>
    )
  }

  const sections = {
    sunat: (
      <section className="report-block">
        {renderSectionIntro(
          'Módulo activo',
          'Informacion_publica_SUNAT',
          'Estado general y sub secciones hijas de deuda, omisiones, PLAME, representantes y locales.'
        )}

        <div className="report-subgrid">
          <section className="report-mini-panel">
            <h3>SUNAT_estado_empresa_y_condicion</h3>
            <div className="form-grid">
              <label>
                SUNAT_ESTADO_EMPRESA
                <input {...form.register('empresa.sunatEstadoEmpresa')} />
              </label>

              <label>
                SUNAT_CONDICION_EMPRESA
                <input {...form.register('empresa.sunatCondicionEmpresa')} />
              </label>
            </div>
          </section>

          <section className="report-mini-panel">
            <h3>Deuda_coactiva_publica_en_web_SUNAT</h3>
            <div className="form-grid">
              <label>
                SUNAT_DEUDA_COACTIVA
                <input {...form.register('empresa.sunatDeudaCoactiva')} />
              </label>

              <label>
                MONTO_TOTAL
                <input {...form.register('empresa.sunatDeudaMontoTotal')} />
              </label>
            </div>

            <div className="section-head">
              <h4>LISTA_SUNAT_DEUDA</h4>
              <button
                type="button"
                onClick={() => addItem('sunatDeudas', (ordenLista) => createEmptySunatItem(ordenLista, 'deuda_sunat'))}
              >
                Agregar deuda
              </button>
            </div>

            {reportes.sunatDeudas.length === 0 ? <p className="muted">No hay deudas nuevas agregadas.</p> : null}

            {reportes.sunatDeudas.map((item, index) => (
              <div key={`deuda-${index}`} className="mini-card">
                <label>
                  MONTO
                  <input
                    placeholder="12500.50"
                    value={item.monto}
                    onChange={(event) => updateItem('sunatDeudas', index, 'monto', event.target.value)}
                  />
                </label>
                <label>
                  PERIODO
                  <input
                    placeholder="2026-03"
                    value={item.periodo}
                    onChange={(event) => updateItem('sunatDeudas', index, 'periodo', event.target.value)}
                  />
                </label>
                <label>
                  FECHA_TEXTO
                  <input
                    placeholder="Marzo 2026"
                    value={item.fechaTexto}
                    onChange={(event) => updateItem('sunatDeudas', index, 'fechaTexto', event.target.value)}
                  />
                </label>
                <label>
                  ENTIDAD
                  <input
                    placeholder="SUNAT"
                    value={item.entidad}
                    onChange={(event) => updateItem('sunatDeudas', index, 'entidad', event.target.value)}
                  />
                </label>
                <button type="button" className="danger" onClick={() => removeItem('sunatDeudas', index)}>
                  Quitar
                </button>
              </div>
            ))}
          </section>

          <section className="report-mini-panel">
            <h3>Omisiones_tributarias_publicas_en_web_SUNAT</h3>
            <div className="form-grid">
              <label>
                SUNAT_OMISIONES
                <input {...form.register('empresa.sunatOmisiones')} />
              </label>

              <label>
                SUNAT_OMISIONES_MONTO
                <input {...form.register('empresa.sunatOmisionesMonto')} />
              </label>
            </div>

            <div className="section-head">
              <h4>LISTA_SUNAT_OMISIONES</h4>
              <button
                type="button"
                onClick={() =>
                  addItem('sunatOmisiones', (ordenLista) => createEmptySunatItem(ordenLista, 'omision_sunat'))
                }
              >
                Agregar omision
              </button>
            </div>

            {reportes.sunatOmisiones.length === 0 ? <p className="muted">No hay omisiones nuevas agregadas.</p> : null}

            {reportes.sunatOmisiones.map((item, index) => (
              <div key={`omision-${index}`} className="mini-card">
                <label>
                  MONTO
                  <input
                    placeholder="700.00"
                    value={item.monto}
                    onChange={(event) => updateItem('sunatOmisiones', index, 'monto', event.target.value)}
                  />
                </label>
                <label>
                  PERIODO
                  <input
                    placeholder="2026-03"
                    value={item.periodo}
                    onChange={(event) => updateItem('sunatOmisiones', index, 'periodo', event.target.value)}
                  />
                </label>
                <label>
                  FECHA_TEXTO
                  <input
                    placeholder="Marzo 2026"
                    value={item.fechaTexto}
                    onChange={(event) => updateItem('sunatOmisiones', index, 'fechaTexto', event.target.value)}
                  />
                </label>
                <label>
                  ENTIDAD
                  <input
                    placeholder="SUNAT"
                    value={item.entidad}
                    onChange={(event) => updateItem('sunatOmisiones', index, 'entidad', event.target.value)}
                  />
                </label>
                <button type="button" className="danger" onClick={() => removeItem('sunatOmisiones', index)}>
                  Quitar
                </button>
              </div>
            ))}
          </section>

          <section className="report-mini-panel">
            <h3>Cantidad_de_Trabajadores_Segun_PLAME_en_web_SUNAT</h3>
            <div className="form-grid">
              <label>
                SUNAT_TRABAJADORES_MES_FECHA
                <input {...form.register('empresa.sunatTrabajadoresMesFecha')} />
              </label>

              <label>
                SUNAT_TRABAJADORES_ANIO_FECHA
                <input {...form.register('empresa.sunatTrabajadoresAnioFecha')} />
              </label>

              <label>
                SUNAT_TRABAJADORES
                <input {...form.register('empresa.sunatTrabajadores')} />
              </label>

              <label>
                SUNAT_PRESTADORES
                <input {...form.register('empresa.sunatPrestadores')} />
              </label>
            </div>
          </section>

          <section className="report-mini-panel">
            <h3>Representantes_legales_en_web_SUNAT</h3>
            <div className="form-grid">
              <label className="full-span">
                REPRESENTANTES_LEGALES_RESUMEN
                <input {...form.register('empresa.representantesLegalesResumen')} />
              </label>
            </div>

            <div className="section-head">
              <h4>lista_representantes_legales</h4>
              <button
                type="button"
                onClick={() => addItem('representantesLegales', createEmptyRepresentanteLegalItem)}
              >
                Agregar representante
              </button>
            </div>

            {reportes.representantesLegales.length === 0 ? (
              <p className="muted">No hay representantes nuevos agregados.</p>
            ) : null}

            {reportes.representantesLegales.map((item, index) => (
              <div key={`representante-${index}`} className="mini-card mini-card-legal">
                <label>
                  PUESTO_REPRESENTANTE_LEGAL
                  <input
                    placeholder="Gerente General"
                    value={item.puestoRepresentanteLegal}
                    onChange={(event) =>
                      updateItem('representantesLegales', index, 'puestoRepresentanteLegal', event.target.value)
                    }
                  />
                </label>
                <label>
                  FECHA_DESDE_REPRESENTANTE_LEGAL
                  <input
                    type="date"
                    value={item.fechaDesdeRepresentanteLegal}
                    onChange={(event) =>
                      updateItem('representantesLegales', index, 'fechaDesdeRepresentanteLegal', event.target.value)
                    }
                  />
                </label>
                <label>
                  NOMBRE_REPRESENTANTE_LEGAL
                  <input
                    placeholder="JUAN CARLOS PEREZ LOPEZ"
                    value={item.nombreRepresentanteLegal}
                    onChange={(event) =>
                      updateItem('representantesLegales', index, 'nombreRepresentanteLegal', event.target.value)
                    }
                  />
                </label>
                <label>
                  DOCUMENTO_REPRESENTANTE_LEGAL
                  <select
                    value={item.documentoRepresentanteLegal}
                    onChange={(event) =>
                      updateItem('representantesLegales', index, 'documentoRepresentanteLegal', event.target.value)
                    }
                  >
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  DOCUMENTO_NUMERO_REPRESENTANTE_LEGAL
                  <input
                    placeholder="12345678"
                    value={item.documentoNumeroRepresentanteLegal}
                    onChange={(event) =>
                      updateItem('representantesLegales', index, 'documentoNumeroRepresentanteLegal', event.target.value)
                    }
                  />
                </label>
                <button type="button" className="danger" onClick={() => removeItem('representantesLegales', index)}>
                  Quitar
                </button>
              </div>
            ))}
          </section>

          <section className="report-mini-panel">
            <h3>Establecimientos_anexos_en_web_SUNAT</h3>
            <div className="form-grid">
              <label>
                CANTIDAD_ESTABLECIMIENTOS
                <input {...form.register('empresa.cantidadEstablecimientos')} />
              </label>

              <label className="full-span">
                NOMBRES_ESTABLECIMIENTOS
                <textarea rows={3} {...form.register('empresa.nombresEstablecimientos')} />
              </label>
            </div>
          </section>
        </div>
      </section>
    ),
    sunarp: (
      <section className="report-block">
        {renderSectionIntro(
          'Módulo activo',
          'Informacion_publica_SUNARP',
          'Capital y valores nominales publicados para la empresa.'
        )}

        <div className="report-subgrid">
          <section className="report-mini-panel">
            <h3>Capital_social</h3>
            <div className="form-grid">
              <label>
                CAPITAL_MONTO
                <input {...form.register('empresa.capitalMonto')} />
              </label>

              <label>
                CAPITAL_MONTO_LETRAS
                <input {...form.register('empresa.capitalMontoLetras')} />
              </label>

              <label>
                CAPITAL_NUM_ACCIONES
                <input {...form.register('empresa.capitalNumAcciones')} />
              </label>

              <label>
                CAPITAL_VALOR_NOMINAL
                <input {...form.register('empresa.capitalValorNominal')} />
              </label>

              <label className="full-span">
                CAPITAL_VALOR_NOMINAL_LETRAS
                <input {...form.register('empresa.capitalValorNominalLetras')} />
              </label>
            </div>
          </section>
        </div>
      </section>
    ),
    riesgo: (
      <section className="report-block">
        {renderSectionIntro(
          'Módulo activo',
          'Informacion_publica_Central_de_Riesgos',
          'Score, calificacion, comportamiento de pago y resumen de deudas.'
        )}

        <div className="report-subgrid">
          <section className="report-mini-panel">
            <h3>Central_de_Riesgos</h3>
            <div className="form-grid">
              <label>
                SCORE_VALOR
                <input {...form.register('sujeto.scoreValor')} />
              </label>

              <label>
                NIVEL_RIESGO
                <input {...form.register('sujeto.nivelRiesgo')} />
              </label>

              <label>
                EMPRESAS_RIESGO_NUM
                <input {...form.register('sujeto.cantidadRiesgosNum')} />
              </label>

              <label>
                RIESGOS_ESTADO_CALIFICACION
                <input {...form.register('sujeto.riesgosEstadoCalificacion')} />
              </label>

              <label>
                RIESGOS_COMPORTAMIENTO_PAGO
                <input {...form.register('sujeto.riesgosComportamientoPago')} />
              </label>

              <label>
                COMPORTAMIENTO_13M
                <input {...form.register('sujeto.comportamiento13m')} />
              </label>

              <label>
                DEUDA_TOTAL_TEXTO
                <input {...form.register('sujeto.deudaTotalTexto')} />
              </label>

              <label>
                DEUDA_TOTAL_MONTO
                <input {...form.register('sujeto.deudaTotalMonto')} />
              </label>

              <label>
                DEUDA_TOTAL_CREDITO
                <input {...form.register('sujeto.deudaTotalCredito')} />
              </label>

              <label>
                DEUDA_TOTAL_BANCO
                <input {...form.register('sujeto.deudaTotalBanco')} />
              </label>

              <label className="full-span">
                DESCRIPCION_OTRAS_DEUDAS
                <textarea rows={3} {...form.register('sujeto.descripcionOtrasDeudas')} />
              </label>
            </div>
          </section>
        </div>
      </section>
    ),
    indecopi: (
      <section className="report-block report-block-featured">
        {renderSectionIntro(
          'Módulo activo',
          'Informacion_publica_INDECOPI',
          'Competencia desleal, expedientes, listas simples y reportes complementarios como ministerio vivienda.',
          'featured'
        )}

        <div className="report-summary-strip" aria-label="Resumen de informacion indecopi">
          {indecopiSummary.map((item) => (
            <article key={item.label} className="report-summary-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="report-subgrid report-subgrid-roomy">
          <section className="report-group-panel">
            <div className="report-group-head">
              <h3>Competencia_desleal</h3>
              <p className="muted">Registrar expedientes por tipo de reporte.</p>
            </div>
            <div className="report-nested-grid">
              {expedientePanelTypes.map((tipoReporte) =>
                renderExpedientePanel(tipoReporte)
              )}
            </div>
          </section>

          <section className="report-group-panel">
            <div className="report-group-head">
              <h3>Listas_simples</h3>
              <p className="muted">Registrar reportes de resumen por categoria.</p>
            </div>
            <div className="report-nested-grid">
              {listaSimplePanelTypes.map((tipoReporte) =>
                renderListaSimplePanel(tipoReporte)
              )}
            </div>
          </section>

          <section className="report-group-panel">
            <div className="report-group-head">
              <h3>Ministerio_vivienda</h3>
              <p className="muted">Registrar sanciones u observaciones de la entidad.</p>
            </div>

            <div className="section-head">
              <h4>reportes_ministerio_vivienda</h4>
              <button type="button" onClick={addMinisterioViviendaItem}>
                Agregar registro
              </button>
            </div>

            {existingMinisterioViviendaItems.length === 0 && reportes.reportesMinisterioVivienda.length === 0 ? (
              <p className="muted">No hay registros nuevos para ministerio vivienda.</p>
            ) : null}

            {existingMinisterioViviendaItems.map((item, index) => (
              <div key={`existing-ministerio-vivienda-${item.id ?? index}`}>
                {renderReadonlyMiniCard(`Registro API ID ${item.id ?? '-'}`, [
                  { label: 'ORGANO', value: item.organo },
                  { label: 'SANCION', value: item.sancion },
                  { label: 'ORDEN_LISTA', value: item.ordenLista }
                ])}
              </div>
            ))}

            {reportes.reportesMinisterioVivienda.map((item, index) => (
              <div key={`ministerio-vivienda-${index}`} className="mini-card mini-card-simple">
                <div className="readonly-mini-card-badge full-span">Nuevo registro</div>
                <input
                  placeholder="organo"
                  value={item.organo}
                  onChange={(event) => updateItem('reportesMinisterioVivienda', index, 'organo', event.target.value)}
                />
                <input
                  placeholder="sancion"
                  value={item.sancion}
                  onChange={(event) =>
                    updateItem('reportesMinisterioVivienda', index, 'sancion', event.target.value)
                  }
                />
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeItem('reportesMinisterioVivienda', index)}
                >
                  Quitar
                </button>
              </div>
            ))}
          </section>
        </div>
      </section>
    )
  }

  return <div className="form-stack">{sections[section]}</div>
}
