import { useEffect, useState } from 'react'
import { getEmpresas } from '../../empresa/api'
import { getEmpresaEntityId, getEmpresaSujetoId } from '../../empresa/identifiers'
import type { EmpresaListItem } from '../../empresa/types'
import { getPersonas } from '../../persona/api'
import { getPersonaEntityId, getPersonaSujetoId } from '../../persona/identifiers'
import type { PersonaListItem } from '../../persona/types'

type AccionistaTipo = 'NATURAL' | 'JURIDICA'

type Props = {
  open: boolean
  empresaSujetoId?: number
  proyectoId?: number
  onClose: () => void
  onConfirm: (params: {
    accionistaId?: number
    accionistaSujetoId: number
    tipo: AccionistaTipo
    ordenLista?: number
    observacion?: string
  }) => Promise<boolean>
}

export default function AccionistaAffiliationModal({
  open,
  empresaSujetoId,
  proyectoId,
  onClose,
  onConfirm
}: Props) {
  const [tipo, setTipo] = useState<AccionistaTipo>('NATURAL')
  const [empresas, setEmpresas] = useState<EmpresaListItem[]>([])
  const [personas, setPersonas] = useState<PersonaListItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaListItem | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<PersonaListItem | null>(null)
  const [ordenLista, setOrdenLista] = useState(1)
  const [observacion, setObservacion] = useState('Accionista natural')

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)

        if (tipo === 'NATURAL') {
          const response = await getPersonas({
            pageNumber,
            pageSize: 8,
            searchTerm: query
          })

          if (cancelled) return

          setPersonas(response.data)
          setTotalPages(Math.max(1, Math.ceil(response.totalRecords / response.pageSize)))
          return
        }

        const response = await getEmpresas({
          pageNumber,
          pageSize: 8,
          searchTerm: query
        })

        if (cancelled) return

        setEmpresas(response.data)
        setTotalPages(Math.max(1, Math.ceil(response.totalRecords / response.pageSize)))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [open, tipo, pageNumber, query])

  useEffect(() => {
    if (!open) {
      setTipo('NATURAL')
      setEmpresas([])
      setPersonas([])
      setSearchTerm('')
      setQuery('')
      setPageNumber(1)
      setTotalPages(1)
      setSelectedEmpresa(null)
      setSelectedPersona(null)
      setOrdenLista(1)
      setObservacion('Accionista natural')
    }
  }, [open])

  if (!open) return null

  const selectedSujetoId =
    tipo === 'NATURAL' ? getPersonaSujetoId(selectedPersona) : getEmpresaSujetoId(selectedEmpresa)

  const selectedEntityId =
    tipo === 'NATURAL' ? getPersonaEntityId(selectedPersona) : getEmpresaEntityId(selectedEmpresa)

  const handleTypeChange = (nextTipo: AccionistaTipo) => {
    setTipo(nextTipo)
    setSelectedEmpresa(null)
    setSelectedPersona(null)
    setPageNumber(1)
    setSearchTerm('')
    setQuery('')
    setObservacion(nextTipo === 'JURIDICA' ? 'Accionista jurídico principal' : 'Accionista natural')
  }

  const handleSubmit = async () => {
    if (!selectedSujetoId) return

    try {
      setSubmitting(true)
      const ok = await onConfirm({
        accionistaId: selectedEntityId,
        accionistaSujetoId: selectedSujetoId,
        tipo,
        ordenLista,
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
            <span className="eyebrow">Afiliación</span>
            <h2>Afiliar accionista existente</h2>
            <p className="muted">
              Elige si el accionista es natural o jurídico, busca una entidad existente, revisa el
              resumen y confirma la afiliación con los IDs de sujeto correctos.
            </p>
          </div>

          <button type="button" className="secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="modal-context" style={{ margin: 0 }}>
          <div><strong>Empresa sujeto ID:</strong> {empresaSujetoId ?? '-'}</div>
          <div><strong>Proyecto ID:</strong> {proyectoId ?? '-'}</div>
          <div><strong>Tipo actual:</strong> {tipo}</div>
        </div>

        <div className="assignment-modal-layout">
          <section className="assignment-panel">
            <div className="segmented-control" role="tablist" aria-label="Tipo de accionista">
              <button
                type="button"
                className={tipo === 'NATURAL' ? 'active' : ''}
                onClick={() => handleTypeChange('NATURAL')}
              >
                Natural
              </button>
              <button
                type="button"
                className={tipo === 'JURIDICA' ? 'active' : ''}
                onClick={() => handleTypeChange('JURIDICA')}
              >
                Jurídica
              </button>
            </div>

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
                placeholder={
                  tipo === 'NATURAL'
                    ? 'Buscar por nombre, documento o RUC personal'
                    : 'Buscar por razón social, nombre comercial o RUC'
                }
              />
              <button type="submit" className="secondary">
                Buscar
              </button>
            </form>

            <div className="assignment-results">
              {loading ? <p className="muted">Buscando entidades...</p> : null}

              {!loading && tipo === 'NATURAL' && personas.length === 0 ? (
                <p className="muted">No se encontraron personas para esa búsqueda.</p>
              ) : null}

              {!loading && tipo === 'JURIDICA' && empresas.length === 0 ? (
                <p className="muted">No se encontraron empresas para esa búsqueda.</p>
              ) : null}

              {tipo === 'NATURAL'
                ? personas.map((item) => {
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
                  })
                : empresas.map((item) => {
                    const isActive = getEmpresaEntityId(item) === getEmpresaEntityId(selectedEmpresa)

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`assignment-result-card${isActive ? ' active' : ''}`}
                        onClick={() => setSelectedEmpresa(item)}
                      >
                        <strong>{item.empresa?.razonSocial ?? `Empresa ${item.id}`}</strong>
                        <span>{item.empresa?.rucEmpresa ?? '-'} · {item.empresa?.nombreEmpresa ?? '-'}</span>
                        <span>Sujeto ID: {getEmpresaSujetoId(item) ?? '-'}</span>
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
              <span className="detail-badge">Antes de guardar</span>
            </div>

            {tipo === 'NATURAL' && selectedPersona ? (
              <div className="detail-list-item">
                <SummaryRow label="Nombre completo" value={selectedPersona.persona?.nombreCompleto} />
                <SummaryRow label="Tipo documento" value={selectedPersona.persona?.tipoDocumento} />
                <SummaryRow label="Número documento" value={selectedPersona.persona?.numeroDocumento} />
                <SummaryRow label="RUC personal" value={selectedPersona.persona?.rucPersonal} />
                <SummaryRow label="Sujeto ID" value={getPersonaSujetoId(selectedPersona)} />
                <SummaryRow label="Tipo sujeto" value={selectedPersona.sujeto?.tipoSujeto} />
                <SummaryRow label="Riesgo" value={selectedPersona.sujeto?.nivelRiesgo} />
              </div>
            ) : null}

            {tipo === 'JURIDICA' && selectedEmpresa ? (
              <div className="detail-list-item">
                <SummaryRow label="Razón social" value={selectedEmpresa.empresa?.razonSocial} />
                <SummaryRow label="Nombre comercial" value={selectedEmpresa.empresa?.nombreEmpresa} />
                <SummaryRow label="RUC" value={selectedEmpresa.empresa?.rucEmpresa} />
                <SummaryRow label="Sujeto ID" value={getEmpresaSujetoId(selectedEmpresa)} />
                <SummaryRow label="Tipo sujeto" value={selectedEmpresa.sujeto?.tipoSujeto} />
                <SummaryRow label="Riesgo" value={selectedEmpresa.sujeto?.nivelRiesgo} />
              </div>
            ) : null}

            {!selectedSujetoId ? (
              <p className="muted">
                Selecciona una entidad del panel izquierdo para revisar el resumen antes de confirmar
                la afiliación.
              </p>
            ) : null}

            <div className="assignment-form-grid">
              <label>
                Orden lista
                <input
                  type="number"
                  min={1}
                  value={ordenLista}
                  onChange={(event) => setOrdenLista(Number(event.target.value) || 1)}
                />
              </label>

              <label className="full-span">
                Observación
                <input value={observacion} onChange={(event) => setObservacion(event.target.value)} />
              </label>
            </div>

            <div className="actions">
              <button type="button" className="secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedSujetoId || submitting || !empresaSujetoId || !proyectoId}
              >
                {submitting ? 'Afiliando...' : 'Confirmar accionista'}
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
