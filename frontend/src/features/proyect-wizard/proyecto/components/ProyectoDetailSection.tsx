import type { ReactNode } from 'react'
import PageSection from '../../shared/components/PageSection'
import {
  getProyectoEmpresaSujetoId,
  getProyectoEntityId,
  getProyectoGerenteSujetoId,
  matchesProyectoWorkspace
} from '../identifiers'
import type {
  ProyectoAccionistaInternoReadModel,
  ProyectoAccionistaReadModel,
  ProyectoDetail,
  ProyectoPersonaReadModel
} from '../types'
import ProyectoFlowSection from './ProyectoFlowSection'

type DownloadState = {
  version?: string
  fileName?: string
  downloaded?: boolean
}

type Props = {
  selectedProyecto: ProyectoDetail | null
  detailLoading: boolean
  proyectoId?: number
  empresaSujetoId?: number
  accionistasRegistrados: number
  currentDownload?: DownloadState
  docxLoading: boolean
  onBackToList: () => void
  onGoEmpresa: () => void
  onUse: (proyectoId: number) => void
  onEdit: (proyectoId: number) => void
  onDelete: (proyectoId: number) => void
  onAssignGerenteGeneral: (params: {
    personaId?: number
    personaSujetoId: number
    observacion: string
  }) => Promise<boolean>
  onAffiliateAccionista: (params: {
    accionistaId?: number
    accionistaSujetoId: number
    tipo: 'NATURAL' | 'JURIDICA'
    ordenLista?: number
    observacion?: string
  }) => Promise<boolean>
  onDownloadCurrent: () => void
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

const renderGerente = (gerente: ProyectoPersonaReadModel | null | undefined) => {
  if (!gerente) {
    return (
      <article className="detail-card">
        <div className="detail-card-head">
          <h3>Gerente general</h3>
          <span className="detail-badge">Pendiente</span>
        </div>
        <p className="muted">Todavía no se refleja un gerente general asociado en este proyecto.</p>
      </article>
    )
  }

  return (
    <article className="detail-card">
      <div className="detail-card-head">
        <div className="detail-record-title">
          <span className="detail-kicker">Gerente general</span>
          <h3>{gerente.persona?.nombreCompleto ?? 'Persona vinculada'}</h3>
        </div>
        <span className="detail-badge">{formatValue(gerente.tipoRelacion ?? 'GERENTE_GENERAL')}</span>
      </div>

      <div className="detail-record">
        <div className="detail-chip-row">
          <span className="detail-chip">
            Documento {buildInlineLabel(gerente.persona?.tipoDocumento, gerente.persona?.numeroDocumento)}
          </span>
          <span className="detail-chip">RUC {formatValue(gerente.persona?.rucPersonal)}</span>
          <span className="detail-chip">Riesgo {formatValue(gerente.sujeto?.nivelRiesgo)}</span>
        </div>

        <DetailKeyValueGrid
          entries={[
            { key: 'nombre', label: 'Nombre completo', value: gerente.persona?.nombreCompleto },
            { key: 'tipo-documento', label: 'Tipo documento', value: gerente.persona?.tipoDocumento },
            { key: 'numero-documento', label: 'Número documento', value: gerente.persona?.numeroDocumento },
            { key: 'estado', label: 'Estado contribuyente', value: gerente.persona?.estadoContribuyente },
            {
              key: 'condicion',
              label: 'Condición contribuyente',
              value: gerente.persona?.condicionContribuyente
            },
            { key: 'domicilio', label: 'Domicilio fiscal', value: gerente.persona?.domicilioFiscalPersonal },
            { key: 'observacion', label: 'Observación', value: gerente.observacion }
          ]}
        />

        <TechnicalDisclosure
          title="Metadatos del gerente"
          description="IDs internos y relación técnica del gerente general en este proyecto."
          entries={[
            { key: 'relacion-id', label: 'Relación ID', value: gerente.relacionId },
            { key: 'orden', label: 'Orden', value: gerente.ordenLista },
            { key: 'sujeto-id', label: 'Sujeto ID', value: gerente.sujeto?.id ?? gerente.persona?.sujetoId },
            { key: 'tipo-sujeto', label: 'Tipo sujeto', value: gerente.sujeto?.tipoSujeto },
            { key: 'score', label: 'Score', value: gerente.sujeto?.scoreValor }
          ]}
        />
      </div>
    </article>
  )
}

const renderAccionistaInterno = (
  interno: ProyectoAccionistaInternoReadModel,
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
        { key: 'sujeto-id', label: 'Sujeto ID', value: interno.sujeto?.id ?? interno.persona?.sujetoId },
        { key: 'observacion', label: 'Observación', value: interno.observacion }
      ]}
    />
  </div>
)

const renderAccionista = (accionista: ProyectoAccionistaReadModel, index: number) => {
  const internos = accionista.accionistasInternos ?? accionista.ACCIONISTAS_INTERNOS ?? []
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
          { key: 'razon-social', label: 'Razón social', value: accionista.empresa?.razonSocial },
          { key: 'nombre-comercial', label: 'Nombre comercial', value: accionista.empresa?.nombreEmpresa },
          { key: 'ruc-empresa', label: 'RUC empresa', value: accionista.empresa?.rucEmpresa },
          {
            key: 'documento-persona',
            label: 'Documento persona',
            value: buildInlineLabel(accionista.persona?.tipoDocumento, accionista.persona?.numeroDocumento)
          },
          { key: 'nombre-persona', label: 'Nombre persona', value: accionista.persona?.nombreCompleto },
          { key: 'ruc-persona', label: 'RUC personal', value: accionista.persona?.rucPersonal }
        ]}
      />

      {internos.length ? (
        <div className="detail-subentity-list">
          <span className="detail-kicker">Accionistas internos</span>
          {internos.map(renderAccionistaInterno)}
        </div>
      ) : null}

      <TechnicalDisclosure
        title="Metadatos del accionista"
        description="Contexto técnico y IDs internos de la afiliación accionaria."
        entries={[
          { key: 'relacion-id', label: 'Relación ID', value: accionista.relacionId },
          { key: 'sujeto-id', label: 'Sujeto ID', value: accionista.sujeto?.id },
          { key: 'tipo-sujeto', label: 'Tipo sujeto', value: accionista.sujeto?.tipoSujeto },
          { key: 'score', label: 'Score', value: accionista.sujeto?.scoreValor }
        ]}
        raw={accionista.contexto}
        rawLabel="Contexto crudo"
      />
    </article>
  )
}

const renderCargaLote = (
  detail: ProyectoDetail,
  currentDownload?: DownloadState
) => (
  <article className="detail-card">
    <div className="detail-card-head">
      <div className="detail-card-copy">
        <h3>Base documental</h3>
        <p className="muted">
          Trazabilidad de la carga y del último artefacto documental generado desde el proyecto.
        </p>
      </div>
      <span className="detail-badge">
        {currentDownload?.downloaded ? 'DOCX disponible' : 'Sin descarga reciente'}
      </span>
    </div>

    <p className="detail-lead-value">
      {formatValue(detail.cargaLote?.observacion ?? 'Todavía no se registran observaciones de carga.')}
    </p>

    <DetailKeyValueGrid
      entries={[
        { key: 'archivo', label: 'Archivo de carga', value: detail.cargaLote?.nombreArchivo },
        { key: 'carga-lote-id', label: 'Carga lote ID', value: detail.cargaLote?.id },
        { key: 'ultima-descarga', label: 'Última descarga', value: currentDownload?.fileName },
        { key: 'version-docx', label: 'Versión DOCX', value: currentDownload?.version ?? 'V2' },
        { key: 'estado-descarga', label: 'Estado descarga', value: currentDownload?.downloaded ? 'Disponible' : 'Pendiente' },
        { key: 'creado', label: 'Creado', value: detail.cargaLote?.createdAt }
      ]}
    />

    <TechnicalDisclosure
      title="Metadatos de la carga"
      entries={[
        { key: 'hash-archivo', label: 'Hash archivo', value: detail.cargaLote?.hashArchivo },
        { key: 'carga-lote-id', label: 'Carga lote ID', value: detail.cargaLote?.id }
      ]}
    />
  </article>
)

export default function ProyectoDetailSection({
  selectedProyecto,
  detailLoading,
  proyectoId,
  empresaSujetoId,
  accionistasRegistrados,
  currentDownload,
  docxLoading,
  onBackToList,
  onGoEmpresa,
  onUse,
  onEdit,
  onDelete,
  onAssignGerenteGeneral,
  onAffiliateAccionista,
  onDownloadCurrent
}: Props) {
  const projectEntityId = getProyectoEntityId(selectedProyecto)
  const gerenteSujetoId = getProyectoGerenteSujetoId(selectedProyecto)
  const isActiveInFlow = matchesProyectoWorkspace(selectedProyecto, {
    proyectoId,
    empresaSujetoId
  })

  const accionistasCount = selectedProyecto?.accionistas?.length ?? accionistasRegistrados

  return (
    <PageSection
      eyebrow="Vista principal"
      title="Detalle de proyecto"
      description="Esta vista concentra la ficha del proyecto, su contexto operacional y las acciones críticas de cierre dentro de una sola pantalla de trabajo."
      className="detail-page-section"
      headerActions={
        <div className="row-actions">
          <button type="button" className="secondary" onClick={onBackToList}>
            Volver al listado
          </button>
          <button type="button" className="secondary" onClick={onGoEmpresa}>
            Ir a Empresa
          </button>
        </div>
      }
    >
      {detailLoading ? <p className="muted">Cargando detalle...</p> : null}

      {!detailLoading && !selectedProyecto ? (
        <p className="muted">
          Selecciona un proyecto del listado para abrir su vista de detalle y continuar con el
          cierre operacional desde una pantalla principal.
        </p>
      ) : null}

      {selectedProyecto ? (
        <div className="detail-stack">
          <section className="detail-hero detail-hero-page">
            <div className="detail-hero-topline">
              <span className="eyebrow">Proyecto seleccionado</span>
              <span className={`detail-status-badge${isActiveInFlow ? ' active' : ''}`}>
                {isActiveInFlow ? 'Activo en el flujo' : 'Disponible para usar'}
              </span>
            </div>

            <div className="detail-hero-layout">
              <div className="detail-hero-copy">
                <h3>{selectedProyecto.proyecto?.textoProyectosNatural ?? `Proyecto ${projectEntityId}`}</h3>
                <p className="muted detail-hero-lead">
                  Ficha ejecutiva del proyecto. Aquí priorizamos empresa principal, gerente general,
                  composición accionaria y salida documental antes de la traza técnica interna.
                </p>

                <div className="detail-chip-row">
                  <span className="detail-chip">
                    Empresa {formatValue(selectedProyecto.empresaPrincipal?.razonSocial ?? selectedProyecto.empresaPrincipal?.nombreEmpresa)}
                  </span>
                  <span className="detail-chip">Fecha {formatValue(selectedProyecto.proyecto?.fecha1)}</span>
                  <span className="detail-chip">
                    Gerente {formatValue(selectedProyecto.gerenteGeneral?.persona?.nombreCompleto)}
                  </span>
                  <span className="detail-chip">
                    DOCX {currentDownload?.downloaded ? 'Disponible' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="detail-flow-panel">
                <div className="detail-card-head">
                  <h4>Estado dentro del flujo</h4>
                  <span className="detail-badge">Workspace activo</span>
                </div>

                <DetailKeyValueGrid
                  entries={[
                    { key: 'proyecto-id', label: 'Proyecto ID', value: proyectoId ?? projectEntityId },
                    {
                      key: 'empresa-sujeto-id',
                      label: 'Empresa sujeto ID',
                      value: empresaSujetoId ?? getProyectoEmpresaSujetoId(selectedProyecto)
                    },
                    {
                      key: 'gerente-sujeto-id',
                      label: 'Gerente sujeto ID',
                      value: gerenteSujetoId
                    },
                    { key: 'accionistas', label: 'Accionistas', value: accionistasCount }
                  ]}
                />

                <TechnicalDisclosure
                  title="Identificadores de match"
                  description="Claves usadas por el workspace para mantener el proyecto alineado con empresa, gerente y cierre operacional."
                  entries={[
                    { key: 'proyecto-id', label: 'Proyecto ID', value: projectEntityId },
                    {
                      key: 'empresa-principal-sujeto-id',
                      label: 'Empresa principal sujeto ID',
                      value: getProyectoEmpresaSujetoId(selectedProyecto)
                    },
                    {
                      key: 'gerente-sujeto-id',
                      label: 'Gerente sujeto ID',
                      value: getProyectoGerenteSujetoId(selectedProyecto)
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
                Usa este proyecto en el workspace, ajusta su ficha base o elimínalo. Las
                operaciones de cierre y documentación viven dentro de esta misma pantalla.
              </p>
            </div>

            <div className="actions detail-page-actions">
              <button type="button" onClick={() => projectEntityId && onUse(projectEntityId)}>
                Usar en el flujo
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => projectEntityId && onEdit(projectEntityId)}
              >
                Editar proyecto
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => projectEntityId && onDelete(projectEntityId)}
              >
                Eliminar proyecto
              </button>
            </div>
          </section>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Resumen ejecutivo</h3>
                <p className="muted">
                  Lectura rápida para usuarios de negocio: base del proyecto, empresa principal,
                  cierre societario y trazabilidad documental.
                </p>
              </div>
              <span className="detail-badge">Ficha ejecutiva</span>
            </div>

            <DetailMetricGrid
              entries={[
                { key: 'accionistas', label: 'Accionistas', value: accionistasCount },
                {
                  key: 'gerente',
                  label: 'Gerente general',
                  value: selectedProyecto.gerenteGeneral?.persona?.nombreCompleto ? 'Asignado' : 'Pendiente'
                },
                { key: 'carga-lote', label: 'Carga lote', value: selectedProyecto.cargaLote?.id ?? 'Sin carga' },
                { key: 'docx', label: 'DOCX', value: currentDownload?.downloaded ? 'Disponible' : 'Pendiente' }
              ]}
            />

            <div className="detail-executive-grid">
              <ExecutivePanel
                title="Proyecto base"
                description="Datos principales del proyecto que ordenan el expediente y su contexto inicial."
                entries={[
                  { key: 'proyecto-id', label: 'Proyecto ID', value: projectEntityId },
                  { key: 'fecha-1', label: 'Fecha 1', value: selectedProyecto.proyecto?.fecha1 },
                  {
                    key: 'texto-proyecto',
                    label: 'Texto proyecto',
                    value: selectedProyecto.proyecto?.textoProyectosNatural
                  },
                  {
                    key: 'empresa-principal-sujeto-id',
                    label: 'Empresa principal sujeto ID',
                    value: selectedProyecto.proyecto?.empresaPrincipalSujetoId
                  }
                ]}
              />

              <ExecutivePanel
                title="Empresa principal"
                description="Identidad de la empresa que sostiene el proyecto y su estado tributario visible."
                entries={[
                  { key: 'razon-social', label: 'Razón social', value: selectedProyecto.empresaPrincipal?.razonSocial },
                  {
                    key: 'nombre-comercial',
                    label: 'Nombre comercial',
                    value: selectedProyecto.empresaPrincipal?.nombreEmpresa
                  },
                  { key: 'ruc', label: 'RUC', value: selectedProyecto.empresaPrincipal?.rucEmpresa },
                  { key: 'domicilio', label: 'Domicilio fiscal', value: selectedProyecto.empresaPrincipal?.domicilioFiscal },
                  {
                    key: 'estado-sunat',
                    label: 'Estado SUNAT',
                    value: selectedProyecto.empresaPrincipal?.sunatEstadoEmpresa
                  },
                  {
                    key: 'condicion-sunat',
                    label: 'Condición SUNAT',
                    value: selectedProyecto.empresaPrincipal?.sunatCondicionEmpresa
                  }
                ]}
              />

              <ExecutivePanel
                title="Cierre societario"
                description="Situación actual del gerente general y de la composición accionaria del proyecto."
                entries={[
                  {
                    key: 'gerente',
                    label: 'Gerente general',
                    value: selectedProyecto.gerenteGeneral?.persona?.nombreCompleto
                  },
                  {
                    key: 'gerente-documento',
                    label: 'Documento gerente',
                    value: buildInlineLabel(
                      selectedProyecto.gerenteGeneral?.persona?.tipoDocumento,
                      selectedProyecto.gerenteGeneral?.persona?.numeroDocumento
                    )
                  },
                  { key: 'gerente-riesgo', label: 'Riesgo gerente', value: selectedProyecto.gerenteGeneral?.sujeto?.nivelRiesgo },
                  { key: 'accionistas', label: 'Accionistas afiliados', value: accionistasCount }
                ]}
              />

              <ExecutivePanel
                title="Salida documental"
                description="Trazabilidad de la carga y del último documento generado desde el proyecto."
                entries={[
                  { key: 'archivo-carga', label: 'Archivo de carga', value: selectedProyecto.cargaLote?.nombreArchivo },
                  { key: 'observacion-carga', label: 'Observación carga', value: selectedProyecto.cargaLote?.observacion },
                  { key: 'ultima-descarga', label: 'Última descarga', value: currentDownload?.fileName },
                  { key: 'version-docx', label: 'Versión DOCX', value: currentDownload?.version ?? 'V2' }
                ]}
              />
            </div>
          </article>

          <ProyectoFlowSection
            empresaSujetoId={empresaSujetoId}
            gerenteSujetoId={gerenteSujetoId}
            proyectoId={proyectoId}
            accionistasRegistrados={accionistasRegistrados}
            gerenteNombre={selectedProyecto.gerenteGeneral?.persona?.nombreCompleto}
            empresaNombre={
              selectedProyecto.empresaPrincipal?.razonSocial ??
              selectedProyecto.empresaPrincipal?.nombreEmpresa
            }
            currentDownload={currentDownload}
            docxLoading={docxLoading}
            onAssignGerenteGeneral={onAssignGerenteGeneral}
            onAffiliateAccionista={onAffiliateAccionista}
            onDownloadCurrent={onDownloadCurrent}
          />

          <div className="detail-grid">
            {renderGerente(selectedProyecto.gerenteGeneral)}
            {renderCargaLote(selectedProyecto, currentDownload)}
          </div>

          <article className="detail-card detail-card-full">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Accionistas afiliados</h3>
                <p className="muted">
                  La composición accionaria se presenta como relación de entidades y no como dump técnico.
                  Cada registro conserva su traza interna en un segundo plano plegable.
                </p>
              </div>
              <span className="detail-badge">{selectedProyecto.accionistas?.length ?? 0} registros</span>
            </div>

            {!selectedProyecto.accionistas?.length ? (
              <p className="muted">Todavía no hay accionistas reflejados en el detalle del proyecto.</p>
            ) : (
              <div className="detail-list">
                {selectedProyecto.accionistas.map(renderAccionista)}
              </div>
            )}
          </article>

          <article className="detail-card detail-card-full detail-technical-section">
            <div className="detail-card-head">
              <div className="detail-card-copy">
                <h3>Metadatos técnicos</h3>
                <p className="muted">
                  Zona secundaria para soporte y validación. Aquí quedan payloads, timestamps, hashes
                  y claves internas fuera del flujo principal de lectura del proyecto.
                </p>
              </div>
              <span className="detail-badge">Secundario</span>
            </div>

            <div className="detail-technical-stack">
              <TechnicalDisclosure
                title="Proyecto técnico"
                description="Metadatos base del proyecto y payload original del backend."
                entries={[
                  { key: 'proyecto-id', label: 'Proyecto ID', value: selectedProyecto.proyecto?.id ?? selectedProyecto.id },
                  { key: 'created-at', label: 'Creado', value: selectedProyecto.proyecto?.createdAt },
                  { key: 'updated-at', label: 'Actualizado', value: selectedProyecto.proyecto?.updatedAt },
                  { key: 'carga-lote-id', label: 'Carga lote ID', value: selectedProyecto.proyecto?.cargaLoteId }
                ]}
                raw={selectedProyecto.proyecto?.payloadOriginal}
                rawLabel="Payload original"
              />

              <TechnicalDisclosure
                title="Empresa principal técnica"
                description="Claves internas de la empresa principal dentro del proyecto."
                entries={[
                  { key: 'sujeto-id', label: 'Sujeto ID', value: selectedProyecto.empresaPrincipal?.sujetoId },
                  { key: 'ruc', label: 'RUC', value: selectedProyecto.empresaPrincipal?.rucEmpresa }
                ]}
              />

              <TechnicalDisclosure
                title="Carga lote técnica"
                description="Trazabilidad interna del lote que dio origen al expediente."
                entries={[
                  { key: 'id', label: 'Carga lote ID', value: selectedProyecto.cargaLote?.id },
                  { key: 'created-at', label: 'Creado', value: selectedProyecto.cargaLote?.createdAt },
                  { key: 'hash-archivo', label: 'Hash archivo', value: selectedProyecto.cargaLote?.hashArchivo },
                  { key: 'observacion', label: 'Observación', value: selectedProyecto.cargaLote?.observacion }
                ]}
              />
            </div>
          </article>
        </div>
      ) : null}
    </PageSection>
  )
}
