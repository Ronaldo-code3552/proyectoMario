import { useState } from 'react'
import { buildProyectoFlowSummary } from '../summary'
import AccionistaAffiliationModal from './AccionistaAffiliationModal'
import GerenteGeneralAssignmentModal from './GerenteGeneralAssignmentModal'

type DownloadState = {
  version?: string
  fileName?: string
  downloaded?: boolean
}

type Props = {
  empresaSujetoId?: number
  gerenteSujetoId?: number
  proyectoId?: number
  accionistasRegistrados: number
  gerenteNombre?: string
  empresaNombre?: string
  currentDownload?: DownloadState
  docxLoading: boolean
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

const hasValue = (value: unknown) => value !== null && value !== undefined && value !== ''

const formatValue = (value: unknown) => {
  if (!hasValue(value)) return '-'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  return String(value)
}

function FlowKeyGrid({
  items
}: {
  items: Array<{ key: string; label: string; value: unknown }>
}) {
  return (
    <div className="detail-key-grid">
      {items.map((item) => (
        <div key={item.key} className="detail-key-cell">
          <span>{item.label}</span>
          <strong>{formatValue(item.value)}</strong>
        </div>
      ))}
    </div>
  )
}

export default function ProyectoFlowSection({
  empresaSujetoId,
  gerenteSujetoId,
  proyectoId,
  accionistasRegistrados,
  gerenteNombre,
  empresaNombre,
  currentDownload,
  docxLoading,
  onAssignGerenteGeneral,
  onAffiliateAccionista,
  onDownloadCurrent
}: Props) {
  const [gerenteModalOpen, setGerenteModalOpen] = useState(false)
  const [accionistaModalOpen, setAccionistaModalOpen] = useState(false)

  const flowItems = buildProyectoFlowSummary({
    empresaSujetoId,
    gerenteSujetoId,
    proyectoId,
    accionistasRegistrados
  }).map((item) => ({
    key: item.key,
    label: typeof item.label === 'string' ? item.label : item.key,
    value: item.value
  }))

  const gerenteStatus = gerenteNombre ? 'Asignado' : 'Pendiente'
  const accionistasStatus = accionistasRegistrados > 0 ? 'Registrados' : 'Pendientes'
  const docxStatus = currentDownload?.downloaded ? 'Disponible' : 'Pendiente'
  const flowReady = Boolean(empresaSujetoId && proyectoId)

  return (
    <>
      <section className="detail-card detail-card-full">
        <div className="detail-card-head">
          <div className="detail-card-copy">
            <span className="detail-kicker">Cierre operacional</span>
            <h3>Operaciones del proyecto</h3>
            <p className="muted">
              Desde aquí asignas gerente general, afilias accionistas existentes y controlas la
              salida documental del proyecto sin salir de su ficha principal.
            </p>
          </div>
          <span className="detail-badge">Workflow activo</span>
        </div>

        <div className="detail-metric-grid">
          <div className="detail-metric-card">
            <span>Gerente general</span>
            <strong>{gerenteStatus}</strong>
          </div>
          <div className="detail-metric-card">
            <span>Accionistas</span>
            <strong>{accionistasStatus}</strong>
          </div>
          <div className="detail-metric-card">
            <span>Documento DOCX</span>
            <strong>{docxStatus}</strong>
          </div>
          <div className="detail-metric-card">
            <span>Contexto operativo</span>
            <strong>{flowReady ? 'Listo' : 'Incompleto'}</strong>
          </div>
        </div>

        <div className="detail-executive-grid">
          <section className="detail-summary-panel">
            <div className="detail-card-copy">
              <span className="detail-kicker">Contexto actual</span>
              <p className="muted">
                Resumen operativo del proyecto y de la empresa principal actualmente vinculada al flujo.
              </p>
            </div>

            <FlowKeyGrid items={flowItems} />
          </section>

          <section className="detail-summary-panel">
            <div className="detail-card-copy">
              <span className="detail-kicker">Lectura rápida</span>
              <p className="muted">
                Estado narrativo del cierre operacional para tomar acciones sin revisar bloques
                técnicos adicionales.
              </p>
            </div>

            <div className="detail-key-grid">
              <div className="detail-key-cell">
                <span>Empresa operativa</span>
                <strong>{formatValue(empresaNombre)}</strong>
              </div>
              <div className="detail-key-cell">
                <span>Gerente actual</span>
                <strong>{formatValue(gerenteNombre)}</strong>
              </div>
              <div className="detail-key-cell">
                <span>Última descarga</span>
                <strong>{formatValue(currentDownload?.fileName)}</strong>
              </div>
              <div className="detail-key-cell">
                <span>Versión documento</span>
                <strong>{formatValue(currentDownload?.version ?? 'V2')}</strong>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-toolbar">
          <div className="detail-toolbar-copy">
            <span className="detail-kicker">Acciones disponibles</span>
            <p className="muted">
              {flowReady
                ? 'El proyecto ya tiene el contexto mínimo para seguir con asignaciones y documentación.'
                : 'Falta alinear empresa y proyecto antes de habilitar todas las operaciones del cierre.'}
            </p>
          </div>

          <div className="actions detail-page-actions">
            <button
              type="button"
              onClick={() => setGerenteModalOpen(true)}
              disabled={!flowReady}
            >
              Asignar gerente general
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => setAccionistaModalOpen(true)}
              disabled={!flowReady}
            >
              Afiliar accionista
            </button>

            <button
              type="button"
              className="secondary"
              onClick={onDownloadCurrent}
              disabled={!proyectoId || docxLoading}
            >
              {docxLoading ? 'Descargando...' : 'Descargar DOCX V2'}
            </button>
          </div>
        </div>
      </section>

      <GerenteGeneralAssignmentModal
        open={gerenteModalOpen}
        empresaSujetoId={empresaSujetoId}
        proyectoId={proyectoId}
        onClose={() => setGerenteModalOpen(false)}
        onConfirm={onAssignGerenteGeneral}
      />

      <AccionistaAffiliationModal
        open={accionistaModalOpen}
        empresaSujetoId={empresaSujetoId}
        proyectoId={proyectoId}
        onClose={() => setAccionistaModalOpen(false)}
        onConfirm={onAffiliateAccionista}
      />
    </>
  )
}
