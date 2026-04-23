import type { ReactNode } from 'react'
import PageSection from '../../shared/components/PageSection'
import { getEmpresaEntityId, getEmpresaSujetoId, matchesEmpresaWorkspace } from '../identifiers'
import { buildEmpresaFlowSummary } from '../summary'
import type { EmpresaDetail } from '../api'
import type {
  EmpresaAccionistaReadModel,
  EmpresaDeudaReadModel,
  EmpresaRelacionPersonaReadModel,
  EmpresaReporteExpedienteReadModel,
  EmpresaReporteListaSimpleReadModel,
  EmpresaReporteMinisterioViviendaReadModel,
  EmpresaRepresentanteLegalReadModel,
  ProyectoResumenReadModel
} from '../types'

type Props = {
  selectedEmpresa: EmpresaDetail | null
  detailLoading: boolean
  empresaId?: number
  empresaSujetoId?: number
  proyectoId?: number
  onBackToList: () => void
  onGoProyecto: () => void
  onUse: (empresaId: number) => void
  onEdit: (empresaId: number) => void
  onDelete: (empresaId: number) => void
  onDebt: (empresaId: number) => void
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

const renderRelacionPersona = (
  title: string,
  relation: EmpresaRelacionPersonaReadModel | null | undefined,
  emptyMessage: string
) => {
  if (!relation) {
    return (
      <article className="detail-card">
        <div className="detail-card-head">
          <h3>{title}</h3>
          <span className="detail-badge">Sin vínculo</span>
        </div>
        <p className="muted">{emptyMessage}</p>
      </article>
    )
  }

  return (
    <article className="detail-card">
      <div className="detail-card-head">
        <div className="detail-record-title">
          <span className="detail-kicker">{title}</span>
          <h3>{relation.persona?.nombreCompleto ?? 'Persona vinculada'}</h3>
        </div>
        <span className="detail-badge">{formatValue(relation.tipoRelacion ?? title)}</span>
      </div>

      <div className="detail-record">
        <div className="detail-chip-row">
          <span className="detail-chip">
            Documento {buildInlineLabel(relation.persona?.tipoDocumento, relation.persona?.numeroDocumento)}
          </span>
          <span className="detail-chip">RUC personal {formatValue(relation.persona?.rucPersonal)}</span>
          <span className="detail-chip">Sujeto {formatValue(relation.sujeto?.id)}</span>
        </div>

        <DetailKeyValueGrid
          entries={[
            {
              key: 'estado-contribuyente',
              label: 'Estado contribuyente',
              value: relation.persona?.estadoContribuyente
            },
            {
              key: 'condicion-contribuyente',
              label: 'Condición contribuyente',
              value: relation.persona?.condicionContribuyente
            },
            {
              key: 'domicilio-fiscal',
              label: 'Domicilio fiscal',
              value: relation.persona?.domicilioFiscalPersonal
            },
            {
              key: 'observacion',
              label: 'Observación',
              value: relation.observacion
            }
          ]}
        />

        <TechnicalDisclosure
          title={`Metadatos de ${title.toLowerCase()}`}
          description="IDs internos y contexto devuelto por el backend para auditoría y soporte."
          entries={[
            { key: 'relacion-id', label: 'Relación ID', value: relation.relacionId },
            { key: 'orden-lista', label: 'Orden', value: relation.ordenLista },
            { key: 'sujeto-id', label: 'Sujeto ID', value: relation.sujeto?.id },
            { key: 'tipo-sujeto', label: 'Tipo sujeto', value: relation.sujeto?.tipoSujeto },
            { key: 'hash-negocio', label: 'Hash negocio', value: relation.sujeto?.hashNegocio },
            { key: 'persona-sujeto-id', label: 'Persona sujeto ID', value: relation.persona?.sujetoId }
          ]}
          raw={relation.contexto}
          rawLabel="Contexto crudo"
        />
      </div>
    </article>
  )
}

const renderProyecto = (proyecto: ProyectoResumenReadModel, index: number) => (
  <article key={`proyecto-${proyecto.id ?? index}`} className="detail-list-item detail-record">
    <div className="detail-record-top">
      <div className="detail-record-title">
        <h4>{proyecto.textoProyectosNatural || `Proyecto ${proyecto.id ?? index + 1}`}</h4>
        <p className="detail-record-subtitle">
          {buildInlineLabel(
            proyecto.fecha1 ? `Fecha ${proyecto.fecha1}` : null,
            proyecto.cargaLote?.nombreArchivo ? `Archivo ${proyecto.cargaLote.nombreArchivo}` : null
          )}
        </p>
      </div>
      <div className="detail-chip-row">
        <span className="detail-chip">Proyecto ID {formatValue(proyecto.id)}</span>
        <span className="detail-chip">Carga lote {formatValue(proyecto.cargaLote?.id)}</span>
      </div>
    </div>

    <DetailKeyValueGrid
      entries={[
        { key: 'fecha1', label: 'Fecha principal', value: proyecto.fecha1 },
        { key: 'archivo', label: 'Archivo de carga', value: proyecto.cargaLote?.nombreArchivo },
        { key: 'observacion', label: 'Observación carga', value: proyecto.cargaLote?.observacion },
        { key: 'actualizado', label: 'Actualizado', value: proyecto.updatedAt }
      ]}
    />

    <TechnicalDisclosure
      title="Metadatos del proyecto"
      description="Datos técnicos del proyecto relacionado y de su carga de origen."
      entries={[
        { key: 'proyecto-id', label: 'Proyecto ID', value: proyecto.id },
        { key: 'created-at', label: 'Creado', value: proyecto.createdAt },
        { key: 'updated-at', label: 'Actualizado', value: proyecto.updatedAt },
        { key: 'carga-lote-id', label: 'Carga lote ID', value: proyecto.cargaLote?.id },
        { key: 'hash-archivo', label: 'Hash archivo', value: proyecto.cargaLote?.hashArchivo }
      ]}
      raw={proyecto.payloadOriginal}
      rawLabel="Payload original"
    />
  </article>
)

const renderAccionistaInterno = (
  interno: EmpresaRelacionPersonaReadModel,
  index: number
) => (
  <div key={`interno-${interno.relacionId ?? index}`} className="detail-subentity-card">
    <div className="detail-record-title">
      <strong>{interno.persona?.nombreCompleto ?? `Accionista interno ${index + 1}`}</strong>
      <span className="detail-record-subtitle">
        {buildInlineLabel(interno.persona?.tipoDocumento, interno.persona?.numeroDocumento)}
      </span>
    </div>

    <div className="detail-chip-row">
      <span className="detail-chip">Orden {formatValue(interno.ordenLista)}</span>
      <span className="detail-chip">Relación {formatValue(interno.tipoRelacion)}</span>
    </div>

    <TechnicalDisclosure
      title="Metadatos del accionista interno"
      entries={[
        { key: 'relacion-id', label: 'Relación ID', value: interno.relacionId },
        { key: 'sujeto-id', label: 'Sujeto ID', value: interno.sujeto?.id },
        { key: 'persona-sujeto-id', label: 'Persona sujeto ID', value: interno.persona?.sujetoId }
      ]}
      raw={interno.contexto}
      rawLabel="Contexto crudo"
    />
  </div>
)

const renderAccionista = (accionista: EmpresaAccionistaReadModel, index: number) => {
  const accionistaName =
    accionista.empresa?.razonSocial ??
    accionista.persona?.nombreCompleto ??
    `Accionista ${index + 1}`

  const accionistaCaption = accionista.empresa
    ? buildInlineLabel(
        accionista.empresa?.nombreEmpresa,
        accionista.empresa?.rucEmpresa ? `RUC ${accionista.empresa.rucEmpresa}` : null
      )
    : buildInlineLabel(
        accionista.persona?.tipoDocumento,
        accionista.persona?.numeroDocumento,
        accionista.persona?.rucPersonal ? `RUC ${accionista.persona.rucPersonal}` : null
      )

  return (
    <article key={`accionista-${accionista.relacionId ?? index}`} className="detail-list-item detail-record">
      <div className="detail-record-top">
        <div className="detail-record-title">
          <h4>{accionistaName}</h4>
          <p className="detail-record-subtitle">{accionistaCaption}</p>
        </div>

        <div className="detail-chip-row">
          <span className="detail-chip">{formatValue(accionista.sujeto?.tipoSujeto ?? 'Sin tipo')}</span>
          <span className="detail-chip">Orden {formatValue(accionista.ordenLista)}</span>
          <span className="detail-chip">Riesgo {formatValue(accionista.sujeto?.nivelRiesgo)}</span>
        </div>
      </div>

      <DetailKeyValueGrid
        entries={[
          { key: 'tipo-relacion', label: 'Tipo relación', value: accionista.tipoRelacion },
          { key: 'observacion', label: 'Observación', value: accionista.observacion },
          { key: 'nombre-comercial', label: 'Nombre comercial', value: accionista.empresa?.nombreEmpresa },
          { key: 'ruc-empresa', label: 'RUC empresa', value: accionista.empresa?.rucEmpresa },
          {
            key: 'documento-persona',
            label: 'Documento persona',
            value: buildInlineLabel(
              accionista.persona?.tipoDocumento,
              accionista.persona?.numeroDocumento
            )
          },
          { key: 'ruc-personal', label: 'RUC personal', value: accionista.persona?.rucPersonal }
        ]}
      />

      {accionista.accionistasInternos?.length ? (
        <div className="detail-subentity-list">
          <span className="detail-kicker">Accionistas internos</span>
          {accionista.accionistasInternos.map(renderAccionistaInterno)}
        </div>
      ) : null}

      <TechnicalDisclosure
        title="Metadatos del accionista"
        description="Referencia interna de la relación y contexto crudo asociado a este accionista."
        entries={[
          { key: 'relacion-id', label: 'Relación ID', value: accionista.relacionId },
          { key: 'sujeto-id', label: 'Sujeto ID', value: accionista.sujeto?.id },
          { key: 'tipo-sujeto', label: 'Tipo sujeto', value: accionista.sujeto?.tipoSujeto },
          { key: 'hash-negocio', label: 'Hash negocio', value: accionista.sujeto?.hashNegocio },
          { key: 'empresa-sujeto-id', label: 'Empresa sujeto ID', value: accionista.empresa?.sujetoId },
          { key: 'persona-sujeto-id', label: 'Persona sujeto ID', value: accionista.persona?.sujetoId }
        ]}
        raw={accionista.contexto}
        rawLabel="Contexto crudo"
      />
    </article>
  )
}

const renderDeuda = (
  title: string,
  items: EmpresaDeudaReadModel[] | undefined,
  emptyMessage: string
) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>{title}</h3>
        <p className="muted">
          Registro público de obligaciones asociadas a la empresa. Se priorizan monto, periodo y
          entidad antes del payload técnico.
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
                  {buildInlineLabel(
                    item.periodo ? `Periodo ${item.periodo}` : null,
                    item.fechaTexto
                  )}
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
                { key: 'orden-lista', label: 'Orden', value: item.ordenLista }
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

const renderRepresentantes = (
  items: EmpresaRepresentanteLegalReadModel[] | undefined
) => (
  <article className="detail-card detail-card-full">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Representantes legales</h3>
        <p className="muted">
          Personas con representación formal registradas para la empresa, con foco en rol,
          documento y fecha de vigencia.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay representantes legales devueltos por el API.</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`representante-${item.id ?? index}`} className="detail-list-item detail-record">
            <div className="detail-record-top">
              <div className="detail-record-title">
                <h4>{item.nombreRepresentanteLegal ?? `Representante ${index + 1}`}</h4>
                <p className="detail-record-subtitle">
                  {buildInlineLabel(item.documentoRepresentanteLegal, item.documentoNumeroRepresentanteLegal)}
                </p>
              </div>

              <div className="detail-chip-row">
                <span className="detail-chip">{formatValue(item.puestoRepresentanteLegal)}</span>
                <span className="detail-chip">Desde {formatValue(item.fechaDesdeRepresentanteLegal)}</span>
              </div>
            </div>

            <DetailKeyValueGrid
              entries={[
                { key: 'puesto', label: 'Puesto', value: item.puestoRepresentanteLegal },
                { key: 'fecha-desde', label: 'Fecha desde', value: item.fechaDesdeRepresentanteLegal },
                { key: 'tipo-documento', label: 'Tipo documento', value: item.documentoRepresentanteLegal },
                {
                  key: 'numero-documento',
                  label: 'Número documento',
                  value: item.documentoNumeroRepresentanteLegal
                }
              ]}
            />

            <TechnicalDisclosure
              title="Metadatos del representante"
              entries={[
                { key: 'id', label: 'ID', value: item.id },
                { key: 'orden-lista', label: 'Orden', value: item.ordenLista }
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

const renderExpedientes = (items: EmpresaReporteExpedienteReadModel[] | undefined) => (
  <article className="detail-card detail-card-full">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Expedientes y procedimientos</h3>
        <p className="muted">
          Historial público de expedientes para lectura de negocio: órgano, partes y estado antes
          del detalle técnico.
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
                { key: 'tipo', label: 'Tipo de reporte', value: item.tipoReporte },
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

const renderListaSimple = (items: EmpresaReporteListaSimpleReadModel[] | undefined) => (
  <article className="detail-card detail-card-full">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Listas simples y referencias</h3>
        <p className="muted">
          Señales públicas resumidas para lectura rápida. La ficha prioriza razón social, tipo y
          cantidad antes del payload técnico.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay listas simples devueltas por el API.</p> : null}

    {items?.length ? (
      <div className="detail-list">
        {items.map((item, index) => (
          <div key={`lista-simple-${item.id ?? index}`} className="detail-list-item detail-record">
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
  items: EmpresaReporteMinisterioViviendaReadModel[] | undefined
) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Ministerio de Vivienda</h3>
        <p className="muted">
          Registro público asociado a sanciones u observaciones de este organismo.
        </p>
      </div>
      <span className="detail-badge">{items?.length ?? 0} registros</span>
    </div>

    {!items?.length ? <p className="muted">No hay registros de Ministerio de Vivienda.</p> : null}

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

export default function EmpresaDetailSection({
  selectedEmpresa,
  detailLoading,
  empresaId,
  empresaSujetoId,
  proyectoId,
  onBackToList,
  onGoProyecto,
  onUse,
  onEdit,
  onDelete,
  onDebt
}: Props) {
  const flowEntries = buildEmpresaFlowSummary({
    empresaId,
    empresaSujetoId,
    proyectoId
  }).map((item) => ({
    key: item.key,
    label: typeof item.label === 'string' ? item.label : item.key,
    value: item.value
  }))

  const isActiveInFlow = matchesEmpresaWorkspace(selectedEmpresa, {
    empresaId,
    empresaSujetoId
  })

  const totalPublicSignals =
    (selectedEmpresa?.reportesExpediente?.length ?? 0) +
    (selectedEmpresa?.reportesListaSimple?.length ?? 0) +
    (selectedEmpresa?.reportesMinisterioVivienda?.length ?? 0)

  return (
    <PageSection
      eyebrow="Vista principal"
      title="Detalle de empresa"
      description="Esta vista concentra la ficha completa, el estado dentro del flujo y las acciones principales de trabajo para la empresa seleccionada."
      className="empresa-detail-section detail-page-section"
      headerActions={
        <div className="row-actions">
          <button type="button" className="secondary" onClick={onBackToList}>
            Volver al listado
          </button>
          <button type="button" className="secondary" onClick={onGoProyecto}>
            Ir a Proyecto
          </button>
        </div>
      }
    >
      {detailLoading ? <p className="muted">Cargando detalle...</p> : null}

      {!detailLoading && !selectedEmpresa ? (
        <p className="muted">
          Selecciona una empresa del listado para abrir su vista de detalle y trabajarla como una
          pantalla principal del módulo.
        </p>
      ) : null}

      {selectedEmpresa ? (
        <div className="detail-stack">
          <section className="detail-hero detail-hero-page">
            <div className="detail-hero-topline">
              <span className="eyebrow">Empresa seleccionada</span>
              <span className={`detail-status-badge${isActiveInFlow ? ' active' : ''}`}>
                {isActiveInFlow ? 'Activa en el flujo' : 'Disponible para usar'}
              </span>
            </div>

            <div className="detail-hero-layout">
              <div className="detail-hero-copy">
                <h3>{selectedEmpresa.empresa?.razonSocial ?? `Empresa ${selectedEmpresa.id}`}</h3>
                <p className="muted detail-hero-lead">
                  Ficha ejecutiva de la empresa seleccionada. Aquí priorizamos identidad, riesgo,
                  cumplimiento, relaciones y señales públicas antes del detalle técnico del API.
                </p>

                <div className="detail-chip-row">
                  <span className="detail-chip">RUC {formatValue(selectedEmpresa.empresa?.rucEmpresa)}</span>
                  <span className="detail-chip">
                    Comercial {formatValue(selectedEmpresa.empresa?.nombreEmpresa)}
                  </span>
                  <span className="detail-chip">
                    Riesgo {formatValue(selectedEmpresa.sujeto?.nivelRiesgo)}
                  </span>
                  <span className="detail-chip">
                    SUNAT {formatValue(selectedEmpresa.empresa?.sunatEstadoEmpresa)}
                  </span>
                  <span className="detail-chip">
                    Gerente {formatValue(selectedEmpresa.gerenteGeneral?.persona?.nombreCompleto)}
                  </span>
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
                  description="Claves internas usadas por el workspace para validar que el detalle y el flujo estén alineados."
                  entries={[
                    {
                      key: 'empresa-id-ruta',
                      label: 'Empresa ID de ruta',
                      value: getEmpresaEntityId(selectedEmpresa)
                    },
                    {
                      key: 'empresa-sujeto-id',
                      label: 'Sujeto ID',
                      value: getEmpresaSujetoId(selectedEmpresa)
                    },
                    {
                      key: 'empresa-model-sujeto-id',
                      label: 'Empresa.sujetoId',
                      value: selectedEmpresa.empresa?.sujetoId
                    },
                    {
                      key: 'gerente-sujeto-id',
                      label: 'Gerente sujeto ID',
                      value: selectedEmpresa.gerenteGeneral?.sujeto?.id
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
                Usa esta empresa en el proyecto, edítala o completa su enriquecimiento público sin
                salir de la vista principal.
              </p>
            </div>

            <div className="actions detail-page-actions">
              <button type="button" onClick={() => onUse(selectedEmpresa.id)}>
                Usar en el flujo
              </button>
              <button type="button" className="secondary" onClick={() => onDebt(selectedEmpresa.id)}>
                Completar deudas y reportes
              </button>
              <button type="button" className="secondary" onClick={() => onEdit(selectedEmpresa.id)}>
                Editar empresa
              </button>
              <button type="button" className="danger" onClick={() => onDelete(selectedEmpresa.id)}>
                Eliminar empresa
              </button>
            </div>
          </section>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Resumen ejecutivo</h3>
                <p className="muted">
                  Lectura rápida para usuarios de negocio: identidad societaria, perfil de riesgo,
                  situación SUNAT y capacidad operativa.
                </p>
              </div>
              <span className="detail-badge">Ficha ejecutiva</span>
            </div>

            <DetailMetricGrid
              entries={[
                {
                  key: 'proyectos',
                  label: 'Proyectos asociados',
                  value: selectedEmpresa.proyectos?.length ?? 0
                },
                {
                  key: 'accionistas',
                  label: 'Accionistas',
                  value: selectedEmpresa.accionistas?.length ?? 0
                },
                {
                  key: 'representantes',
                  label: 'Representantes',
                  value: selectedEmpresa.representantesLegales?.length ?? 0
                },
                {
                  key: 'deudas-sunat',
                  label: 'Deudas SUNAT',
                  value: selectedEmpresa.deudasSunat?.length ?? 0
                },
                {
                  key: 'omisiones-sunat',
                  label: 'Omisiones SUNAT',
                  value: selectedEmpresa.omisionesSunat?.length ?? 0
                },
                {
                  key: 'reportes-publicos',
                  label: 'Señales públicas',
                  value: totalPublicSignals
                }
              ]}
            />

            <div className="detail-executive-grid">
              <ExecutivePanel
                title="Identidad y registro"
                description="Información principal para reconocer la empresa y su marco registral."
                entries={[
                  { key: 'razon-social', label: 'Razón social', value: selectedEmpresa.empresa?.razonSocial },
                  { key: 'nombre-comercial', label: 'Nombre comercial', value: selectedEmpresa.empresa?.nombreEmpresa },
                  { key: 'ruc', label: 'RUC', value: selectedEmpresa.empresa?.rucEmpresa },
                  { key: 'domicilio', label: 'Domicilio fiscal', value: selectedEmpresa.empresa?.domicilioFiscal },
                  {
                    key: 'fecha-constitucion',
                    label: 'Fecha constitución',
                    value: selectedEmpresa.empresa?.fechaConstitucion
                  },
                  {
                    key: 'objeto-social',
                    label: 'Objeto social',
                    value: selectedEmpresa.empresa?.objetoSocial
                  }
                ]}
              />

              <ExecutivePanel
                title="Riesgo y calificación"
                description="Señales de riesgo y comportamiento financiero devueltas por el backend."
                entries={[
                  { key: 'nivel-riesgo', label: 'Nivel de riesgo', value: selectedEmpresa.sujeto?.nivelRiesgo },
                  { key: 'score', label: 'Score', value: selectedEmpresa.sujeto?.scoreValor },
                  {
                    key: 'estado-calificacion',
                    label: 'Estado calificación',
                    value: selectedEmpresa.sujeto?.riesgosEstadoCalificacion
                  },
                  {
                    key: 'comportamiento-pago',
                    label: 'Comportamiento pago',
                    value: selectedEmpresa.sujeto?.riesgosComportamientoPago
                  },
                  {
                    key: 'comportamiento-13m',
                    label: 'Comportamiento 13m',
                    value: selectedEmpresa.sujeto?.comportamiento13m
                  },
                  {
                    key: 'descripcion-otras-deudas',
                    label: 'Descripción otras deudas',
                    value: selectedEmpresa.sujeto?.descripcionOtrasDeudas
                  }
                ]}
              />

              <ExecutivePanel
                title="SUNAT y actividad"
                description="Estado tributario, omisiones y señales operativas visibles para el usuario."
                entries={[
                  {
                    key: 'sunat-estado',
                    label: 'Estado SUNAT',
                    value: selectedEmpresa.empresa?.sunatEstadoEmpresa
                  },
                  {
                    key: 'sunat-condicion',
                    label: 'Condición SUNAT',
                    value: selectedEmpresa.empresa?.sunatCondicionEmpresa
                  },
                  {
                    key: 'deuda-coactiva',
                    label: 'Deuda coactiva',
                    value: selectedEmpresa.empresa?.sunatDeudaCoactiva
                  },
                  {
                    key: 'deuda-total',
                    label: 'Deuda total',
                    value: selectedEmpresa.empresa?.sunatDeudaMontoTotal
                  },
                  {
                    key: 'omisiones',
                    label: 'Omisiones',
                    value: selectedEmpresa.empresa?.sunatOmisiones
                  },
                  {
                    key: 'omisiones-monto',
                    label: 'Monto omisiones',
                    value: selectedEmpresa.empresa?.sunatOmisionesMonto
                  },
                  {
                    key: 'trabajadores',
                    label: 'Trabajadores',
                    value: selectedEmpresa.empresa?.sunatTrabajadores
                  },
                  {
                    key: 'prestadores',
                    label: 'Prestadores',
                    value: selectedEmpresa.empresa?.sunatPrestadores
                  }
                ]}
              />

              <ExecutivePanel
                title="Capital y estructura"
                description="Datos de capital social, partida registral y presencia operativa."
                entries={[
                  { key: 'capital', label: 'Capital monto', value: selectedEmpresa.empresa?.capitalMonto },
                  {
                    key: 'capital-letras',
                    label: 'Capital en letras',
                    value: selectedEmpresa.empresa?.capitalMontoLetras
                  },
                  {
                    key: 'numero-acciones',
                    label: 'Núm. acciones',
                    value: selectedEmpresa.empresa?.capitalNumAcciones
                  },
                  {
                    key: 'valor-nominal',
                    label: 'Valor nominal',
                    value: selectedEmpresa.empresa?.valorNominal
                  },
                  {
                    key: 'partida-pj',
                    label: 'Partida PJ',
                    value: selectedEmpresa.empresa?.partidaPersonasJuridicas
                  },
                  {
                    key: 'oficina-registral',
                    label: 'Oficina registral',
                    value: selectedEmpresa.empresa?.partidaPersonasJuridicasDireccion
                  },
                  {
                    key: 'establecimientos',
                    label: 'Establecimientos',
                    value: selectedEmpresa.empresa?.cantidadEstablecimientos
                  },
                  {
                    key: 'representantes-resumen',
                    label: 'Resumen representantes',
                    value: selectedEmpresa.empresa?.representantesLegalesResumen
                  }
                ]}
              />
            </div>
          </article>

          <div className="detail-grid">
            {renderRelacionPersona(
              'Gerente general',
              selectedEmpresa.gerenteGeneral,
              'No hay gerente general asociado.'
            )}

            <article className="detail-card">
              <div className="detail-card-head">
                <div className="detail-card-copy">
                  <h3>Lectura societaria</h3>
                  <p className="muted">
                    Bloque narrativo para revisar rápidamente la estructura legal y operativa de la empresa.
                  </p>
                </div>
                <span className="detail-badge">Contexto de negocio</span>
              </div>

              <p className="detail-lead-value">
                {formatValue(
                  selectedEmpresa.empresa?.objetoSocial ??
                    selectedEmpresa.empresa?.representantesLegalesResumen ??
                    'Sin narrativa societaria registrada.'
                )}
              </p>

              <DetailKeyValueGrid
                entries={[
                  {
                    key: 'suma-numero',
                    label: 'Suma número',
                    value: selectedEmpresa.empresa?.sumaNumero
                  },
                  {
                    key: 'suma-numero-letra',
                    label: 'Suma en letras',
                    value: selectedEmpresa.empresa?.sumaNumeroLetra
                  },
                  {
                    key: 'valor-nominal-numero',
                    label: 'Valor nominal en letras',
                    value: selectedEmpresa.empresa?.valorNominalNumero
                  },
                  {
                    key: 'capital-valor-nominal',
                    label: 'Capital valor nominal',
                    value: selectedEmpresa.empresa?.capitalValorNominal
                  },
                  {
                    key: 'capital-valor-nominal-letras',
                    label: 'Capital valor nominal letras',
                    value: selectedEmpresa.empresa?.capitalValorNominalLetras
                  },
                  {
                    key: 'nombres-establecimientos',
                    label: 'Nombres establecimientos',
                    value: selectedEmpresa.empresa?.nombresEstablecimientos
                  },
                  {
                    key: 'trabajadores-fecha',
                    label: 'Trabajadores mes/año',
                    value: buildInlineLabel(
                      selectedEmpresa.empresa?.sunatTrabajadoresMesFecha,
                      selectedEmpresa.empresa?.sunatTrabajadoresAnioFecha
                    )
                  },
                  {
                    key: 'anexos-sunat',
                    label: 'Anexos SUNAT',
                    value: selectedEmpresa.empresa?.infoEstablecimientosAnexosSunat
                  }
                ]}
              />
            </article>
          </div>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Proyectos vinculados</h3>
                <p className="muted">
                  Relación de proyectos donde ya participa esta empresa, con foco en fecha, carga y
                  observaciones útiles para el expediente.
                </p>
              </div>
              <span className="detail-badge">{selectedEmpresa.proyectos?.length ?? 0} registros</span>
            </div>

            {!selectedEmpresa.proyectos?.length ? (
              <p className="muted">No hay proyectos asociados a esta empresa.</p>
            ) : (
              <div className="detail-list">
                {selectedEmpresa.proyectos.map(renderProyecto)}
              </div>
            )}
          </article>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Accionistas y estructura de propiedad</h3>
                <p className="muted">
                  Entidades relacionadas como accionistas, distinguiendo la lectura de negocio de
                  sus metadatos internos y contextos técnicos.
                </p>
              </div>
              <span className="detail-badge">{selectedEmpresa.accionistas?.length ?? 0} registros</span>
            </div>

            {!selectedEmpresa.accionistas?.length ? (
              <p className="muted">No hay accionistas asociados a esta empresa.</p>
            ) : (
              <div className="detail-list">
                {selectedEmpresa.accionistas.map(renderAccionista)}
              </div>
            )}
          </article>

          {renderRepresentantes(selectedEmpresa.representantesLegales)}

          <div className="detail-grid">
            {renderDeuda(
              'Deudas SUNAT',
              selectedEmpresa.deudasSunat,
              'No hay deudas SUNAT asociadas.'
            )}

            {renderDeuda(
              'Omisiones SUNAT',
              selectedEmpresa.omisionesSunat,
              'No hay omisiones SUNAT asociadas.'
            )}
          </div>

          {renderExpedientes(selectedEmpresa.reportesExpediente)}
          {renderListaSimple(selectedEmpresa.reportesListaSimple)}
          {renderMinisterioVivienda(selectedEmpresa.reportesMinisterioVivienda)}

          <article className="detail-card detail-card-full detail-technical-section">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Metadatos técnicos</h3>
                <p className="muted">
                  Zona secundaria para soporte y validación. Aquí quedan IDs, timestamps, hashes,
                  paths y payloads crudos fuera del flujo principal de lectura.
                </p>
              </div>
              <span className="detail-badge">Secundario</span>
            </div>

            <div className="detail-technical-stack">
              <TechnicalDisclosure
                title="Sujeto técnico"
                description="Identificadores y trazabilidad del sujeto jurídico asociado a la empresa."
                entries={[
                  { key: 'id', label: 'ID', value: selectedEmpresa.sujeto?.id },
                  { key: 'tipo-sujeto', label: 'Tipo sujeto', value: selectedEmpresa.sujeto?.tipoSujeto },
                  { key: 'created-at', label: 'Creado', value: selectedEmpresa.sujeto?.createdAt },
                  { key: 'updated-at', label: 'Actualizado', value: selectedEmpresa.sujeto?.updatedAt },
                  { key: 'json-path', label: 'jsonPathOrigen', value: selectedEmpresa.sujeto?.jsonPathOrigen },
                  { key: 'hash-negocio', label: 'hashNegocio', value: selectedEmpresa.sujeto?.hashNegocio },
                  {
                    key: 'cantidad-riesgos',
                    label: 'Cantidad riesgos',
                    value: selectedEmpresa.sujeto?.cantidadRiesgosNum
                  },
                  {
                    key: 'deuda-total-texto',
                    label: 'Deuda total texto',
                    value: selectedEmpresa.sujeto?.deudaTotalTexto
                  },
                  {
                    key: 'deuda-total-monto',
                    label: 'Deuda total monto',
                    value: selectedEmpresa.sujeto?.deudaTotalMonto
                  },
                  {
                    key: 'deuda-total-credito',
                    label: 'Deuda total crédito',
                    value: selectedEmpresa.sujeto?.deudaTotalCredito
                  },
                  {
                    key: 'deuda-total-banco',
                    label: 'Banco',
                    value: selectedEmpresa.sujeto?.deudaTotalBanco
                  }
                ]}
              />

              <TechnicalDisclosure
                title="Empresa técnica"
                description="Claves internas y metadatos estructurales de la empresa devueltos por el API."
                entries={[
                  { key: 'sujeto-id', label: 'Sujeto ID', value: selectedEmpresa.empresa?.sujetoId },
                  { key: 'created-at', label: 'Creado', value: selectedEmpresa.empresa?.createdAt },
                  { key: 'updated-at', label: 'Actualizado', value: selectedEmpresa.empresa?.updatedAt },
                  {
                    key: 'objeto-social-codigo',
                    label: 'Objeto social código',
                    value: selectedEmpresa.empresa?.objetoSocialCodigo
                  }
                ]}
              />

              <TechnicalDisclosure
                title="Reporte resumen crudo"
                description="Respuesta consolidada del backend reservada para inspección técnica."
                raw={selectedEmpresa.reporteResumen}
                rawLabel="reporteResumen"
              />
            </div>
          </article>
        </div>
      ) : null}
    </PageSection>
  )
}
