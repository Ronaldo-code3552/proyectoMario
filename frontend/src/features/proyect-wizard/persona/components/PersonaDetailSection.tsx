import type { ReactNode } from 'react'
import PageSection from '../../shared/components/PageSection'
import { buildPersonaFlowSummary } from '../summary'
import {
  getPersonaEntityId,
  getPersonaSujetoId,
  matchesPersonaWorkspace
} from '../identifiers'
import type {
  PersonaDeudaReadModel,
  PersonaDetail,
  PersonaProyectoRelacionReadModel,
  PersonaRelacionEmpresaReadModel,
  PersonaReporteExpedienteReadModel,
  PersonaReporteListaSimpleReadModel,
  PersonaReporteMinisterioViviendaReadModel
} from '../types'

type Props = {
  selectedPersona: PersonaDetail | null
  detailLoading: boolean
  personaId?: number
  personaSujetoId?: number
  empresaSujetoId?: number
  proyectoId?: number
  onBackToList: () => void
  onGoEmpresa: () => void
  onGoProyecto: () => void
  onUse: (personaId: number) => void
  onEdit: (personaId: number) => void
  onDelete: (personaId: number) => void
  onDebt: (personaId: number) => void
}

type DetailEntry = {
  key: string
  label: string
  value: unknown
}

const hasValue = (value: unknown) => value !== null && value !== undefined && value !== ''

const formatValue = (value: unknown): ReactNode => {
  if (!hasValue(value)) return '-'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return value as ReactNode
}

const buildInlineLabel = (...parts: Array<unknown>) => {
  const values = parts.filter(hasValue).map((part) => String(part))
  return values.length ? values.join(' · ') : '-'
}

const readJsonString = (value: unknown) => {
  if (!hasValue(value)) return null
  return JSON.stringify(value, null, 2)
}

function DetailKeyValueGrid({
  entries,
  includeEmpty = true,
  className = ''
}: {
  entries: DetailEntry[]
  includeEmpty?: boolean
  className?: string
}) {
  const visibleEntries = includeEmpty ? entries : entries.filter((entry) => hasValue(entry.value))

  if (!visibleEntries.length) return <p className="muted">Sin datos relevantes en este bloque.</p>

  return (
    <div className={`detail-key-grid${className ? ` ${className}` : ''}`}>
      {visibleEntries.map((entry) => (
        <div key={entry.key} className="detail-key-cell">
          <span>{entry.label}</span>
          <strong>{formatValue(entry.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function DetailMetricGrid({ entries }: { entries: DetailEntry[] }) {
  const visibleEntries = entries.filter((entry) => hasValue(entry.value))

  if (!visibleEntries.length) return null

  return (
    <div className="detail-metric-grid">
      {visibleEntries.map((entry) => (
        <div key={entry.key} className="detail-metric-card">
          <span>{entry.label}</span>
          <strong>{formatValue(entry.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function TechnicalDisclosure({
  title,
  description,
  entries = [],
  raw,
  rawLabel = 'Payload crudo'
}: {
  title: string
  description?: string
  entries?: DetailEntry[]
  raw?: unknown
  rawLabel?: string
}) {
  const visibleEntries = entries.filter((entry) => hasValue(entry.value))
  const rawValue = readJsonString(raw)

  if (!visibleEntries.length && !rawValue) return null

  return (
    <details className="detail-technical-disclosure">
      <summary className="detail-technical-summary">
        <div className="detail-technical-summary-copy">
          <span className="detail-kicker">Detalle técnico</span>
          <strong>{title}</strong>
        </div>
        <span className="detail-badge">Expandir</span>
      </summary>

      <div className="detail-technical-content">
        {description ? <p className="muted">{description}</p> : null}

        {visibleEntries.length ? (
          <div className="detail-technical-grid">
            {visibleEntries.map((entry) => (
              <div key={entry.key} className="detail-technical-item">
                <span>{entry.label}</span>
                <strong>{formatValue(entry.value)}</strong>
              </div>
            ))}
          </div>
        ) : null}

        {rawValue ? (
          <div className="detail-json-block">
            <span className="detail-kicker">{rawLabel}</span>
            <pre className="json-box detail-json-box detail-raw-box">{rawValue}</pre>
          </div>
        ) : null}
      </div>
    </details>
  )
}

function ExecutivePanel({
  title,
  description,
  entries
}: {
  title: string
  description: string
  entries: DetailEntry[]
}) {
  return (
    <section className="detail-summary-panel">
      <div className="detail-card-copy">
        <span className="detail-kicker">{title}</span>
        <p className="muted">{description}</p>
      </div>
      <DetailKeyValueGrid entries={entries} />
    </section>
  )
}

const renderRelacionEmpresa = (
  relation: PersonaRelacionEmpresaReadModel,
  index: number
) => {
  const relationLabel =
    relation.empresa?.razonSocial ??
    relation.empresa?.nombreEmpresa ??
    `Relación ${index + 1}`

  return (
    <article key={`relacion-${relation.relacionId ?? index}`} className="detail-list-item detail-record">
      <div className="detail-record-top">
        <div className="detail-record-title">
          <h4>{relationLabel}</h4>
          <p className="detail-record-subtitle">
            {buildInlineLabel(
              relation.empresa?.rucEmpresa ? `RUC ${relation.empresa.rucEmpresa}` : null,
              relation.empresa?.sunatEstadoEmpresa,
              relation.empresa?.sunatCondicionEmpresa
            )}
          </p>
        </div>

        <div className="detail-chip-row">
          <span className="detail-chip">{formatValue(relation.tipoRelacion ?? 'Sin tipo')}</span>
          <span className="detail-chip">Orden {formatValue(relation.ordenLista)}</span>
          <span className="detail-chip">Proyecto {formatValue(relation.proyectoId)}</span>
        </div>
      </div>

      <DetailKeyValueGrid
        entries={[
          { key: 'razon-social', label: 'Razón social', value: relation.empresa?.razonSocial },
          { key: 'nombre-comercial', label: 'Nombre comercial', value: relation.empresa?.nombreEmpresa },
          { key: 'ruc', label: 'RUC', value: relation.empresa?.rucEmpresa },
          { key: 'estado-sunat', label: 'Estado SUNAT', value: relation.empresa?.sunatEstadoEmpresa },
          {
            key: 'condicion-sunat',
            label: 'Condición SUNAT',
            value: relation.empresa?.sunatCondicionEmpresa
          },
          { key: 'observacion', label: 'Observación', value: relation.observacion }
        ]}
      />

      {relation.proyectos?.length ? (
        <div className="detail-subentity-list">
          <span className="detail-kicker">Proyectos vinculados</span>
          {relation.proyectos.map(
            (proyecto: PersonaProyectoRelacionReadModel, proyectoIndex: number) => (
            <div key={`proyecto-${proyecto.id ?? proyectoIndex}`} className="detail-subentity-card">
              <div className="detail-record-title">
                <strong>{proyecto.textoProyectosNatural ?? `Proyecto ${proyecto.id ?? proyectoIndex + 1}`}</strong>
                <span className="detail-record-subtitle">
                  {buildInlineLabel(
                    proyecto.id ? `Proyecto ${proyecto.id}` : null,
                    proyecto.fecha1 ? `Fecha ${proyecto.fecha1}` : null
                  )}
                </span>
              </div>
            </div>
            )
          )}
        </div>
      ) : null}

      <TechnicalDisclosure
        title="Metadatos de la relación"
        description="IDs internos y contexto crudo que explican cómo el backend vincula esta persona con la empresa."
        entries={[
          { key: 'relacion-id', label: 'Relación ID', value: relation.relacionId },
          { key: 'orden', label: 'Orden', value: relation.ordenLista },
          { key: 'proyecto-id', label: 'Proyecto ID', value: relation.proyectoId },
          { key: 'sujeto-origen', label: 'Sujeto origen', value: relation.sujetoOrigenId },
          { key: 'sujeto-destino', label: 'Sujeto destino', value: relation.sujetoDestinoId },
          { key: 'empresa-sujeto-id', label: 'Empresa sujeto ID', value: relation.empresa?.sujetoId },
          { key: 'created-at', label: 'Creado', value: relation.createdAt }
        ]}
        raw={relation.contexto}
        rawLabel="Contexto crudo"
      />
    </article>
  )
}

const renderSunatCard = (
  title: string,
  items: PersonaDeudaReadModel[] | undefined,
  emptyMessage: string
) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>{title}</h3>
        <p className="muted">
          Registros tributarios visibles para la persona. Se priorizan monto, periodo y entidad
          antes del payload técnico.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">{emptyMessage}</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`${title}-${item.id ?? index}`} className="detail-list-item detail-record">
            <div className="detail-record-top">
              <div className="detail-record-title">
                <h4>{item.entidad ?? 'Entidad no especificada'}</h4>
                <p className="detail-record-subtitle">
                  {buildInlineLabel(item.periodo ? `Periodo ${item.periodo}` : null, item.fechaTexto)}
                </p>
              </div>

              <div className="detail-chip-row">
                <span className="detail-chip">Monto {formatValue(item.monto)}</span>
                <span className="detail-chip">Orden {formatValue(item.ordenLista)}</span>
              </div>
            </div>

            <DetailKeyValueGrid
              entries={[
                { key: 'monto', label: 'Monto', value: item.monto },
                { key: 'periodo', label: 'Periodo', value: item.periodo },
                { key: 'fecha', label: 'Fecha de referencia', value: item.fechaTexto },
                { key: 'entidad', label: 'Entidad', value: item.entidad }
              ]}
            />

            <TechnicalDisclosure
              title="Metadatos del registro"
              entries={[
                { key: 'id', label: 'ID', value: item.id },
                { key: 'orden', label: 'Orden', value: item.ordenLista }
              ]}
              raw={item.payloadItem}
              rawLabel="Payload crudo"
            />
          </div>
        ))}
      </div>
    ) : null}
  </article>
)

const renderReportesExpediente = (items: PersonaReporteExpedienteReadModel[] | undefined) => (
  <article className="detail-card detail-card-full">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Expedientes y procedimientos</h3>
        <p className="muted">
          Historial público asociado a la persona, con foco en expediente, órgano y estado.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay expedientes devueltos por el API.</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`expediente-${item.id ?? index}`} className="detail-list-item detail-record">
            <div className="detail-record-top">
              <div className="detail-record-title">
                <h4>{item.expediente ?? `Expediente ${index + 1}`}</h4>
                <p className="detail-record-subtitle">
                  {buildInlineLabel(item.tipoReporte, item.organo)}
                </p>
              </div>

              <div className="detail-chip-row">
                <span className="detail-chip">Estado {formatValue(item.estatus)}</span>
                <span className="detail-chip">Orden {formatValue(item.ordenLista)}</span>
              </div>
            </div>

            <DetailKeyValueGrid
              entries={[
                { key: 'tipo-reporte', label: 'Tipo de reporte', value: item.tipoReporte },
                { key: 'organo', label: 'Órgano', value: item.organo },
                { key: 'partes', label: 'Partes', value: item.partes },
                { key: 'estatus', label: 'Estatus', value: item.estatus }
              ]}
            />

            <TechnicalDisclosure
              title="Metadatos del expediente"
              entries={[
                { key: 'id', label: 'ID', value: item.id },
                { key: 'orden', label: 'Orden', value: item.ordenLista }
              ]}
              raw={item.payloadItem}
              rawLabel="Payload crudo"
            />
          </div>
        ))}
      </div>
    ) : null}
  </article>
)

const renderListaSimple = (items: PersonaReporteListaSimpleReadModel[] | undefined) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Listas simples</h3>
        <p className="muted">
          Señales resumidas para lectura rápida, sin exponer el payload técnico como contenido principal.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay listas simples devueltas por el API.</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`lista-${item.id ?? index}`} className="detail-list-item detail-record">
            <div className="detail-record-top">
              <div className="detail-record-title">
                <h4>{item.razonSocial ?? `Registro ${index + 1}`}</h4>
                <p className="detail-record-subtitle">{formatValue(item.tipoReporte)}</p>
              </div>

              <div className="detail-chip-row">
                <span className="detail-chip">Cantidad {formatValue(item.cantidad)}</span>
                <span className="detail-chip">Orden {formatValue(item.ordenLista)}</span>
              </div>
            </div>

            <DetailKeyValueGrid
              entries={[
                { key: 'tipo', label: 'Tipo de reporte', value: item.tipoReporte },
                { key: 'razon-social', label: 'Razón social', value: item.razonSocial },
                { key: 'cantidad', label: 'Cantidad', value: item.cantidad },
                {
                  key: 'fechas',
                  label: 'Fechas',
                  value: (item.payloadItem as { fechas?: string } | undefined)?.fechas
                }
              ]}
            />

            <TechnicalDisclosure
              title="Metadatos de lista simple"
              entries={[
                { key: 'id', label: 'ID', value: item.id },
                { key: 'orden', label: 'Orden', value: item.ordenLista }
              ]}
              raw={item.payloadItem}
              rawLabel="Payload crudo"
            />
          </div>
        ))}
      </div>
    ) : null}
  </article>
)

const renderMinisterioVivienda = (
  items: PersonaReporteMinisterioViviendaReadModel[] | undefined
) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Ministerio de Vivienda</h3>
        <p className="muted">
          Registros públicos vinculados a este organismo, priorizando órgano y sanción para lectura de negocio.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay registros del Ministerio de Vivienda.</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`ministerio-${item.id ?? index}`} className="detail-list-item detail-record">
            <div className="detail-record-top">
              <div className="detail-record-title">
                <h4>{item.organo ?? `Registro ${index + 1}`}</h4>
                <p className="detail-record-subtitle">{formatValue(item.sancion)}</p>
              </div>

              <div className="detail-chip-row">
                <span className="detail-chip">Orden {formatValue(item.ordenLista)}</span>
              </div>
            </div>

            <DetailKeyValueGrid
              entries={[
                { key: 'organo', label: 'Órgano', value: item.organo },
                { key: 'sancion', label: 'Sanción', value: item.sancion }
              ]}
            />

            <TechnicalDisclosure
              title="Metadatos del registro"
              entries={[
                { key: 'id', label: 'ID', value: item.id },
                { key: 'orden', label: 'Orden', value: item.ordenLista }
              ]}
              raw={item.payloadItem}
              rawLabel="Payload crudo"
            />
          </div>
        ))}
      </div>
    ) : null}
  </article>
)

export default function PersonaDetailSection({
  selectedPersona,
  detailLoading,
  personaId,
  personaSujetoId,
  empresaSujetoId,
  proyectoId,
  onBackToList,
  onGoEmpresa,
  onGoProyecto,
  onUse,
  onEdit,
  onDelete,
  onDebt
}: Props) {
  const flowEntries = buildPersonaFlowSummary({
    personaId,
    personaSujetoId,
    empresaSujetoId,
    proyectoId
  }).map((item) => ({
    key: item.key,
    label: typeof item.label === 'string' ? item.label : item.key,
    value: item.value
  }))

  const isActiveInFlow = matchesPersonaWorkspace(selectedPersona, {
    personaId,
    personaSujetoId
  })

  const totalPublicSignals =
    (selectedPersona?.reportesExpediente?.length ?? 0) +
    (selectedPersona?.reportesListaSimple?.length ?? 0) +
    (selectedPersona?.reportesMinisterioVivienda?.length ?? 0)

  return (
    <PageSection
      eyebrow="Vista principal"
      title="Detalle de persona"
      description="Esta vista concentra la ficha completa de la persona, su contexto dentro del flujo y el acceso directo a los reportes públicos sin encerrarlos en bloques secundarios."
      className="detail-page-section"
      headerActions={
        <div className="row-actions">
          <button type="button" className="secondary" onClick={onBackToList}>
            Volver al listado
          </button>
          <button type="button" className="secondary" onClick={onGoEmpresa}>
            Ir a Empresa
          </button>
          <button type="button" className="secondary" onClick={onGoProyecto}>
            Ir a Proyecto
          </button>
        </div>
      }
    >
      {detailLoading ? <p className="muted">Cargando detalle...</p> : null}

      {!detailLoading && !selectedPersona ? (
        <p className="muted">
          Selecciona una persona del listado para abrir su vista de detalle y trabajarla como una
          pantalla principal del módulo.
        </p>
      ) : null}

      {selectedPersona ? (
        <div className="detail-stack">
          <section className="detail-hero detail-hero-page">
            <div className="detail-hero-topline">
              <span className="eyebrow">Persona seleccionada</span>
              <span className={`detail-status-badge${isActiveInFlow ? ' active' : ''}`}>
                {isActiveInFlow ? 'Activa en el flujo' : 'Disponible para usar'}
              </span>
            </div>

            <div className="detail-hero-layout">
              <div className="detail-hero-copy">
                <h3>{selectedPersona.persona?.nombreCompleto ?? `Persona ${selectedPersona.id}`}</h3>
                <p className="muted detail-hero-lead">
                  Ficha ejecutiva de la persona seleccionada. Aquí priorizamos identidad, riesgo,
                  vínculos empresariales y señales públicas antes de abrir la traza técnica del API.
                </p>

                <div className="detail-chip-row">
                  <span className="detail-chip">
                    Documento {buildInlineLabel(selectedPersona.persona?.tipoDocumento, selectedPersona.persona?.numeroDocumento)}
                  </span>
                  <span className="detail-chip">RUC {formatValue(selectedPersona.persona?.rucPersonal)}</span>
                  <span className="detail-chip">Riesgo {formatValue(selectedPersona.sujeto?.nivelRiesgo)}</span>
                  <span className="detail-chip">Empresas {formatValue(selectedPersona.relacionesEmpresa?.length ?? 0)}</span>
                </div>
              </div>

              <div className="detail-flow-panel">
                <div className="detail-card-head">
                  <h4>Estado dentro del flujo</h4>
                  <span className="detail-badge">Workspace activo</span>
                </div>

                <DetailKeyValueGrid entries={flowEntries} />

                <TechnicalDisclosure
                  title="Identificadores de match"
                  description="Claves usadas por el workspace para validar la persona activa en el flujo."
                  entries={[
                    { key: 'persona-id', label: 'Persona ID', value: getPersonaEntityId(selectedPersona) },
                    { key: 'persona-sujeto-id', label: 'Sujeto ID', value: getPersonaSujetoId(selectedPersona) },
                    {
                      key: 'documento',
                      label: 'Documento principal',
                      value: selectedPersona.persona?.numeroDocumento
                    }
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="detail-toolbar">
            <div className="detail-toolbar-copy">
              <span className="detail-kicker">Acciones disponibles</span>
              <p className="muted">
                Usa esta persona en el flujo, continúa con sus reportes públicos o ajústala sin
                volver a la vista de listado.
              </p>
            </div>

            <div className="actions detail-page-actions">
              <button type="button" onClick={() => onUse(selectedPersona.id)}>
                Usar en el flujo
              </button>
              <button type="button" className="secondary" onClick={() => onDebt(selectedPersona.id)}>
                Completar reportes
              </button>
              <button type="button" className="secondary" onClick={() => onEdit(selectedPersona.id)}>
                Editar persona
              </button>
              <button type="button" className="danger" onClick={() => onDelete(selectedPersona.id)}>
                Eliminar persona
              </button>
            </div>
          </section>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Resumen ejecutivo</h3>
                <p className="muted">
                  Lectura rápida para usuarios de negocio: identidad de la persona, perfil de riesgo,
                  cumplimiento tributario y señales públicas disponibles.
                </p>
              </div>
              <span className="detail-badge">Ficha ejecutiva</span>
            </div>

            <DetailMetricGrid
              entries={[
                {
                  key: 'relaciones',
                  label: 'Empresas relacionadas',
                  value: selectedPersona.relacionesEmpresa?.length ?? 0
                },
                {
                  key: 'deudas',
                  label: 'Deudas SUNAT',
                  value: selectedPersona.deudasSunat?.length ?? 0
                },
                {
                  key: 'omisiones',
                  label: 'Omisiones SUNAT',
                  value: selectedPersona.omisionesSunat?.length ?? 0
                },
                {
                  key: 'senales',
                  label: 'Señales públicas',
                  value: totalPublicSignals
                }
              ]}
            />

            <div className="detail-executive-grid">
              <ExecutivePanel
                title="Identidad y registro"
                description="Datos principales para reconocer a la persona y ubicarla dentro del expediente."
                entries={[
                  {
                    key: 'nombre-completo',
                    label: 'Nombre completo',
                    value: selectedPersona.persona?.nombreCompleto
                  },
                  {
                    key: 'tipo-documento',
                    label: 'Tipo documento',
                    value: selectedPersona.persona?.tipoDocumento
                  },
                  {
                    key: 'numero-documento',
                    label: 'Número documento',
                    value: selectedPersona.persona?.numeroDocumento
                  },
                  {
                    key: 'ruc-personal',
                    label: 'RUC personal',
                    value: selectedPersona.persona?.rucPersonal
                  },
                  {
                    key: 'domicilio-fiscal',
                    label: 'Domicilio fiscal',
                    value: selectedPersona.persona?.domicilioFiscalPersonal
                  }
                ]}
              />

              <ExecutivePanel
                title="Riesgo y perfil"
                description="Señales de score, calificación y comportamiento financiero devueltas por el backend."
                entries={[
                  { key: 'riesgo', label: 'Nivel de riesgo', value: selectedPersona.sujeto?.nivelRiesgo },
                  { key: 'score', label: 'Score', value: selectedPersona.sujeto?.scoreValor },
                  {
                    key: 'estado-calificacion',
                    label: 'Estado calificación',
                    value: selectedPersona.sujeto?.riesgosEstadoCalificacion
                  },
                  {
                    key: 'comportamiento-pago',
                    label: 'Comportamiento pago',
                    value: selectedPersona.sujeto?.riesgosComportamientoPago
                  },
                  {
                    key: 'comportamiento-13m',
                    label: 'Comportamiento 13m',
                    value: selectedPersona.sujeto?.comportamiento13m
                  },
                  {
                    key: 'otras-deudas',
                    label: 'Otras deudas',
                    value: selectedPersona.sujeto?.descripcionOtrasDeudas
                  }
                ]}
              />

              <ExecutivePanel
                title="Cumplimiento y trazas tributarias"
                description="Estado contributivo y señales públicas relevantes para la lectura del caso."
                entries={[
                  {
                    key: 'estado-contribuyente',
                    label: 'Estado contribuyente',
                    value: selectedPersona.persona?.estadoContribuyente
                  },
                  {
                    key: 'condicion-contribuyente',
                    label: 'Condición contribuyente',
                    value: selectedPersona.persona?.condicionContribuyente
                  },
                  {
                    key: 'deuda-publica',
                    label: 'Deuda pública SUNAT',
                    value: selectedPersona.persona?.deudaPublicaSunat
                  },
                  {
                    key: 'omisiones-tributarias',
                    label: 'Omisiones tributarias',
                    value: selectedPersona.persona?.omisionesTributariasSunat
                  },
                  {
                    key: 'deuda-total-monto',
                    label: 'Deuda total monto',
                    value: selectedPersona.sujeto?.deudaTotalMonto
                  },
                  {
                    key: 'deuda-total-banco',
                    label: 'Banco principal',
                    value: selectedPersona.sujeto?.deudaTotalBanco
                  }
                ]}
              />

              <ExecutivePanel
                title="Participación empresarial"
                description="Resumen de relaciones con empresas y actividad dentro de proyectos."
                entries={[
                  {
                    key: 'empresas-relacionadas',
                    label: 'Empresas relacionadas',
                    value: selectedPersona.relacionesEmpresa?.length ?? 0
                  },
                  {
                    key: 'empresa-principal',
                    label: 'Empresa más visible',
                    value:
                      selectedPersona.relacionesEmpresa?.[0]?.empresa?.razonSocial ??
                      selectedPersona.relacionesEmpresa?.[0]?.empresa?.nombreEmpresa
                  },
                  {
                    key: 'tipo-relacion-principal',
                    label: 'Tipo relación más visible',
                    value: selectedPersona.relacionesEmpresa?.[0]?.tipoRelacion
                  },
                  {
                    key: 'proyecto-relacionado',
                    label: 'Proyecto relacionado',
                    value: selectedPersona.relacionesEmpresa?.[0]?.proyectoId
                  }
                ]}
              />
            </div>
          </article>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Relaciones con empresas</h3>
                <p className="muted">
                  Aquí las relaciones se muestran como entidades vinculadas, no como un dump técnico:
                  primero negocio y participación, luego trazabilidad interna si hace falta.
                </p>
              </div>
              <span className="detail-badge">{selectedPersona.relacionesEmpresa?.length ?? 0} relaciones</span>
            </div>

            {!selectedPersona.relacionesEmpresa?.length ? (
              <p className="muted">No hay relaciones con empresas devueltas por el API.</p>
            ) : (
              <div className="detail-list">
                {selectedPersona.relacionesEmpresa.map(renderRelacionEmpresa)}
              </div>
            )}
          </article>

          <div className="detail-grid">
            {renderSunatCard(
              'Deudas SUNAT',
              selectedPersona.deudasSunat,
              'No hay deudas SUNAT devueltas por el API.'
            )}

            {renderSunatCard(
              'Omisiones SUNAT',
              selectedPersona.omisionesSunat,
              'No hay omisiones SUNAT devueltas por el API.'
            )}
          </div>

          {renderReportesExpediente(selectedPersona.reportesExpediente)}

          <div className="detail-grid">
            {renderListaSimple(selectedPersona.reportesListaSimple)}
            {renderMinisterioVivienda(selectedPersona.reportesMinisterioVivienda)}
          </div>

          <article className="detail-card detail-card-full detail-technical-section">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Metadatos técnicos</h3>
                <p className="muted">
                  Zona secundaria para soporte y validación. Aquí quedan IDs, timestamps, raw fields
                  y respuestas consolidadas del backend fuera del flujo principal de lectura.
                </p>
              </div>
              <span className="detail-badge">Secundario</span>
            </div>

            <div className="detail-technical-stack">
              <TechnicalDisclosure
                title="Sujeto técnico"
                description="Identificadores y trazabilidad del sujeto asociado a la persona."
                entries={[
                  { key: 'id', label: 'ID', value: selectedPersona.sujeto?.id },
                  { key: 'tipo-sujeto', label: 'Tipo sujeto', value: selectedPersona.sujeto?.tipoSujeto },
                  { key: 'created-at', label: 'Creado', value: selectedPersona.sujeto?.createdAt },
                  { key: 'updated-at', label: 'Actualizado', value: selectedPersona.sujeto?.updatedAt },
                  { key: 'json-path', label: 'jsonPathOrigen', value: selectedPersona.sujeto?.jsonPathOrigen },
                  { key: 'hash-negocio', label: 'hashNegocio', value: selectedPersona.sujeto?.hashNegocio },
                  {
                    key: 'cantidad-riesgos',
                    label: 'Cantidad riesgos',
                    value: selectedPersona.sujeto?.cantidadRiesgosNum
                  },
                  {
                    key: 'deuda-total-texto',
                    label: 'Deuda total texto',
                    value: selectedPersona.sujeto?.deudaTotalTexto
                  },
                  {
                    key: 'deuda-total-credito',
                    label: 'Deuda total crédito',
                    value: selectedPersona.sujeto?.deudaTotalCredito
                  }
                ]}
              />

              <TechnicalDisclosure
                title="Persona técnica"
                description="Campos crudos y metadatos que ayudan a auditar el origen de la información."
                entries={[
                  { key: 'sujeto-id', label: 'Sujeto ID', value: selectedPersona.persona?.sujetoId },
                  { key: 'created-at', label: 'Creado', value: selectedPersona.persona?.createdAt },
                  { key: 'updated-at', label: 'Actualizado', value: selectedPersona.persona?.updatedAt },
                  {
                    key: 'tipo-documento-raw',
                    label: 'Tipo documento raw',
                    value: selectedPersona.persona?.tipoDocumentoRaw
                  },
                  {
                    key: 'nombre-json-raw',
                    label: 'Nombre JSON raw',
                    value: selectedPersona.persona?.nombreJsonRaw
                  },
                  {
                    key: 'gerente-nombre-json',
                    label: 'Gerente nombre JSON raw',
                    value: selectedPersona.persona?.gerenteNombreJsonRaw
                  },
                  {
                    key: 'gerente-numero-raw',
                    label: 'Gerente número raw',
                    value: selectedPersona.persona?.gerenteNumeroDocumentoRaw
                  }
                ]}
              />

              <TechnicalDisclosure
                title="Reporte resumen crudo"
                description="Respuesta consolidada del backend reservada para inspección técnica."
                raw={selectedPersona.reporteResumen}
                rawLabel="reporteResumen"
              />
            </div>
          </article>
        </div>
      ) : null}
    </PageSection>
  )
}
