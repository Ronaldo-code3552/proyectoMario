import { useEffect, useState } from 'react'
import { getPersonas } from '../../persona/api'
import { getPersonaEntityId, getPersonaSujetoId } from '../../persona/identifiers'
import type { PersonaListItem } from '../../persona/types'

type Props = {
  open: boolean
  empresaSujetoId?: number
  proyectoId?: number
  onClose: () => void
  onConfirm: (params: {
    personaId?: number
    personaSujetoId: number
    observacion: string
  }) => Promise<boolean>
}

export default function GerenteGeneralAssignmentModal({
  open,
  empresaSujetoId,
  proyectoId,
  onClose,
  onConfirm
}: Props) {
  const [items, setItems] = useState<PersonaListItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaListItem | null>(null)
  const [observacion, setObservacion] = useState('Gerente general principal del proyecto')

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const response = await getPersonas({
          pageNumber,
          pageSize: 8,
          searchTerm: query
        })

        if (cancelled) return

        setItems(response.data)
        setTotalPages(Math.max(1, Math.ceil(response.totalRecords / response.pageSize)))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [open, pageNumber, query])

  useEffect(() => {
    if (!open) {
      setSelectedPersona(null)
      setSearchTerm('')
      setQuery('')
      setPageNumber(1)
      setObservacion('Gerente general principal del proyecto')
    }
  }, [open])

  if (!open) return null

  const selectedSujetoId = getPersonaSujetoId(selectedPersona)

  const handleSubmit = async () => {
    if (!selectedSujetoId) return

    try {
      setSubmitting(true)
      const ok = await onConfirm({
        personaId: getPersonaEntityId(selectedPersona),
        personaSujetoId: selectedSujetoId,
        observacion
      })

      if (ok) onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-card modal-xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          display: 'grid',
          gap: '1rem',
          width: 'min(1240px, 96vw)',
          maxHeight: '92vh'
        }}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">Asignación</span>
            <h2>Asignar gerente general</h2>
            <p className="muted">
              Selecciona una persona existente, revisa su resumen y confirma la relación sin escribir
              IDs manualmente.
            </p>
          </div>

          <button type="button" className="secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="modal-context" style={{ margin: 0 }}>
          <div><strong>Empresa sujeto ID:</strong> {empresaSujetoId ?? '-'}</div>
          <div><strong>Proyecto ID:</strong> {proyectoId ?? '-'}</div>
          <div><strong>Relación:</strong> GERENTE_GENERAL</div>
        </div>

        <div className="assignment-modal-layout">
          <section className="assignment-panel">
            <form
              className="assignment-searchbar"
              onSubmit={(event) => {
                event.preventDefault()
                setPageNumber(1)
                setQuery(searchTerm.trim())
              }}
            >
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, documento o RUC personal"
              />
              <button type="submit" className="secondary">
                Buscar
              </button>
            </form>

            <div className="assignment-results">
              {loading ? <p className="muted">Buscando personas...</p> : null}

              {!loading && items.length === 0 ? (
                <p className="muted">No se encontraron personas para esa búsqueda.</p>
              ) : null}

              {items.map((item) => {
                const isActive = getPersonaEntityId(item) === getPersonaEntityId(selectedPersona)

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`assignment-result-card${isActive ? ' active' : ''}`}
                    onClick={() => setSelectedPersona(item)}
                  >
                    <strong>{item.persona?.nombreCompleto ?? `Persona ${item.id}`}</strong>
                    <span>{item.persona?.tipoDocumento ?? '-'} {item.persona?.numeroDocumento ?? '-'}</span>
                    <span>Sujeto ID: {getPersonaSujetoId(item) ?? '-'}</span>
                    <span>Riesgo: {item.sujeto?.nivelRiesgo ?? '-'}</span>
                  </button>
                )
              })}
            </div>

            <div className="toolbar table-footer">
              <span className="muted">Página {pageNumber} de {totalPages}</span>
              <div className="row-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                  disabled={pageNumber === 1 || loading}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
                  disabled={pageNumber >= totalPages || loading}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </section>

          <section className="assignment-panel assignment-preview-panel">
            <div className="detail-card-head">
              <h3>Resumen previo</h3>
              <span className="detail-badge">Confirmación</span>
            </div>

            {selectedPersona ? (
              <div className="detail-list-item">
                <SummaryRow label="Nombre completo" value={selectedPersona.persona?.nombreCompleto} />
                <SummaryRow label="Tipo documento" value={selectedPersona.persona?.tipoDocumento} />
                <SummaryRow label="Número documento" value={selectedPersona.persona?.numeroDocumento} />
                <SummaryRow label="RUC personal" value={selectedPersona.persona?.rucPersonal} />
                <SummaryRow label="Sujeto ID" value={selectedSujetoId} />
                <SummaryRow label="Tipo sujeto" value={selectedPersona.sujeto?.tipoSujeto} />
                <SummaryRow label="Riesgo" value={selectedPersona.sujeto?.nivelRiesgo} />
              </div>
            ) : (
              <p className="muted">
                Selecciona una persona del panel izquierdo para revisar el resumen antes de guardar.
              </p>
            )}

            <label>
              Observación
              <input value={observacion} onChange={(event) => setObservacion(event.target.value)} />
            </label>

            <div className="actions">
              <button type="button" className="secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedSujetoId || submitting || !empresaSujetoId || !proyectoId}
              >
                {submitting ? 'Asignando...' : 'Confirmar gerente general'}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function SummaryRow({
  label,
  value
}: {
  label: string
  value: string | number | undefined | null
}) {
  return (
    <div className="assignment-summary-row">
      <span>{label}</span>
      <strong>{value ?? '-'}</strong>
    </div>
  )
}
