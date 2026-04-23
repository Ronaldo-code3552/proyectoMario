import PageSection from '../../shared/components/PageSection'
import PersonaReportesStep from '../../PersonaReportesStep'
import type { PersonaReportesState } from '../../reportes'
import type { PersonaDetail } from '../api'

type Props = {
  selectedPersona: PersonaDetail | null
  reportes: PersonaReportesState
  loading: boolean
  canSave: boolean
  onChange: (value: PersonaReportesState) => void
  onClose: () => void
  onSubmit: () => void
}

export default function PersonaDebtPanelModal({
  selectedPersona,
  reportes,
  loading,
  canSave,
  onChange,
  onClose,
  onSubmit
}: Props) {
  const reportesExpediente = selectedPersona?.reportesExpediente ?? []
  const reportesListaSimple = selectedPersona?.reportesListaSimple ?? []
  const reportesMinisterioVivienda = selectedPersona?.reportesMinisterioVivienda ?? []

  return (
    <PageSection
      eyebrow="Panel de reportes"
      title="Información pública de persona"
      description="Esta vista ya trabaja como pantalla principal del módulo Persona para revisar referencia pública existente y registrar nuevos reportes sin usar un popup clásico."
      className="detail-page-section"
    >
      <div className="detail-stack">
        <section className="detail-hero detail-hero-page">
          <div className="detail-hero-topline">
            <span className="eyebrow">Persona cargada</span>
            <span className="detail-status-badge active">Workspace activo</span>
          </div>

          <div className="detail-hero-layout">
            <div className="detail-hero-copy">
              <h3>{selectedPersona?.persona?.nombreCompleto ?? 'Persona sin seleccionar'}</h3>
              <p className="muted">
                Aquí contrastas los reportes que ya devolvió el backend con los nuevos registros que
                estás preparando para guardar en la persona activa del flujo.
              </p>
            </div>

            <div className="detail-flow-panel">
              <div className="detail-card-head">
                <h4>Contexto actual</h4>
                <span className="detail-badge">Lectura rápida</span>
              </div>
              <SummaryStrip
                items={[
                  ['Documento', selectedPersona?.persona?.numeroDocumento ?? '-'],
                  ['Sujeto ID', selectedPersona?.sujeto?.id ?? selectedPersona?.id ?? '-'],
                  ['Relaciones', selectedPersona?.relacionesEmpresa?.length ?? 0],
                  ['Expedientes', reportesExpediente.length],
                  ['Listas', reportesListaSimple.length],
                  ['Ministerio', reportesMinisterioVivienda.length]
                ]}
              />
            </div>
          </div>
        </section>

        <section className="detail-toolbar">
          <div className="detail-toolbar-copy">
            <span className="detail-kicker">Acciones disponibles</span>
            <p className="muted">
              Revisa primero los reportes ya persistidos y luego completa los nuevos registros
              editables del frontend antes de guardar.
            </p>
          </div>

          <div className="actions detail-page-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Volver al detalle
            </button>
            <button type="button" onClick={onSubmit} disabled={loading || !canSave}>
              {loading ? 'Guardando...' : 'Guardar reportes'}
            </button>
          </div>
        </section>

        <section className="detail-card detail-card-full">
          <div className="detail-card-head">
            <h3>Reportes ya registrados</h3>
            <span className="detail-badge">Solo referencia</span>
          </div>

          <div className="report-summary-strip">
            <div className="report-summary-card">
              <span>Expedientes</span>
              <strong>{reportesExpediente.length}</strong>
            </div>
            <div className="report-summary-card">
              <span>Lista simple</span>
              <strong>{reportesListaSimple.length}</strong>
            </div>
            <div className="report-summary-card">
              <span>Ministerio vivienda</span>
              <strong>{reportesMinisterioVivienda.length}</strong>
            </div>
          </div>

          {reportesExpediente.length > 0 ? (
            <section className="report-mini-panel">
              <h3>Expedientes</h3>
              <div className="detail-list">
                {reportesExpediente.map((item) => (
                  <div
                    key={`persona-exp-${item.id ?? `${item.tipoReporte}-${item.expediente}`}`}
                    className="detail-list-item"
                  >
                    <SummaryStrip
                      items={[
                        ['Tipo', item.tipoReporte ?? '-'],
                        ['Expediente', item.expediente ?? '-'],
                        ['Órgano', item.organo ?? '-'],
                        ['Partes', item.partes ?? '-'],
                        ['Estatus', item.estatus ?? '-']
                      ]}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {reportesListaSimple.length > 0 ? (
            <section className="report-mini-panel">
              <h3>Lista simple</h3>
              <div className="detail-list">
                {reportesListaSimple.map((item) => (
                  <div
                    key={`persona-lista-${item.id ?? `${item.tipoReporte}-${item.razonSocial}`}`}
                    className="detail-list-item"
                  >
                    <SummaryStrip
                      items={[
                        ['Tipo', item.tipoReporte ?? '-'],
                        ['Razón social', item.razonSocial ?? '-'],
                        ['Cantidad', item.cantidad ?? '-']
                      ]}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {reportesMinisterioVivienda.length > 0 ? (
            <section className="report-mini-panel">
              <h3>Ministerio de Vivienda</h3>
              <div className="detail-list">
                {reportesMinisterioVivienda.map((item) => (
                  <div
                    key={`persona-ministerio-${item.id ?? `${item.organo}-${item.sancion}`}`}
                    className="detail-list-item"
                  >
                    <SummaryStrip
                      items={[
                        ['Órgano', item.organo ?? '-'],
                        ['Sanción', item.sancion ?? '-']
                      ]}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {reportesExpediente.length === 0 &&
          reportesListaSimple.length === 0 &&
          reportesMinisterioVivienda.length === 0 ? (
            <p className="muted">No hay reportes registrados actualmente para esta persona.</p>
          ) : null}
        </section>

        <section className="report-block report-block-featured">
          <div className="report-block-copy report-block-copy-featured">
            <div className="report-block-copy-topline">
              <div>
                <span className="eyebrow">Edición actual</span>
                <h2>Nuevos reportes a registrar</h2>
              </div>
              <span className="report-code-badge">Editable</span>
            </div>
            <p className="report-block-supporting-copy">
              Estos registros sí pertenecen al estado editable actual del frontend y se enviarán al
              backend cuando confirmes el guardado.
            </p>
          </div>

          <PersonaReportesStep
            value={reportes}
            onChange={onChange}
            onNext={onSubmit}
            loading={loading}
            hideActions
            title="Reportes nuevos de la persona"
          />
        </section>

        <div
          className="actions"
          style={{
            borderTop: '1px solid rgba(124, 155, 180, 0.14)',
            paddingTop: '1rem'
          }}
        >
          <button type="button" className="secondary" onClick={onClose}>
            Volver
          </button>

          <button type="button" onClick={onSubmit} disabled={loading || !canSave}>
            {loading ? 'Guardando...' : 'Guardar reportes'}
          </button>
        </div>
      </div>
    </PageSection>
  )
}

function SummaryStrip({
  items
}: {
  items: Array<[string, string | number]>
}) {
  return (
    <div className="summary-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{label}:</strong> {value}
        </div>
      ))}
    </div>
  )
}
