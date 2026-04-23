import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { getEmpresas } from '../../empresa/api'
import { getEmpresaSujetoId } from '../../empresa/identifiers'
import type { EmpresaListItem } from '../../empresa/types'
import type { ProyectoFormValues } from '../../schemas'

export type ProyectoEmpresaPreview = {
  entityId?: number
  sujetoId?: number
  razonSocial?: string
  nombreEmpresa?: string
  rucEmpresa?: string
  tipoSujeto?: string
  nivelRiesgo?: string
  proyectosRegistrados?: number
}

type Props = {
  form: UseFormReturn<ProyectoFormValues>
  initialEmpresaPreview?: ProyectoEmpresaPreview
}

const toPreview = (empresa: EmpresaListItem): ProyectoEmpresaPreview => ({
  entityId: empresa.id,
  sujetoId: getEmpresaSujetoId(empresa),
  razonSocial: empresa.empresa?.razonSocial,
  nombreEmpresa: empresa.empresa?.nombreEmpresa,
  rucEmpresa: empresa.empresa?.rucEmpresa,
  tipoSujeto: empresa.sujeto?.tipoSujeto,
  nivelRiesgo: empresa.sujeto?.nivelRiesgo,
  proyectosRegistrados: empresa.proyectos?.length
})

const formatValue = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === '') return '-'
  return String(value)
}

export default function ProyectoEmpresaSelector({
  form,
  initialEmpresaPreview
}: Props) {
  const [items, setItems] = useState<EmpresaListItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<ProyectoEmpresaPreview | null>(
    initialEmpresaPreview ?? null
  )

  const selectedSujetoId = form.watch('proyecto.empresaPrincipalSujetoId')
  const selectedError = form.formState.errors.proyecto?.empresaPrincipalSujetoId?.message

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const response = await getEmpresas({
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
  }, [pageNumber, query])

  useEffect(() => {
    const selectedFromList = items.find((item) => getEmpresaSujetoId(item) === selectedSujetoId)

    if (selectedFromList) {
      setSelectedEmpresa(toPreview(selectedFromList))
      return
    }

    if (
      initialEmpresaPreview?.sujetoId &&
      initialEmpresaPreview.sujetoId === selectedSujetoId
    ) {
      setSelectedEmpresa(initialEmpresaPreview)
      return
    }

    if (!selectedSujetoId) {
      setSelectedEmpresa(null)
      return
    }

    if (selectedEmpresa?.sujetoId !== selectedSujetoId) {
      setSelectedEmpresa(null)
    }
  }, [initialEmpresaPreview, items, selectedEmpresa?.sujetoId, selectedSujetoId])

  const handleSelect = (empresa: EmpresaListItem) => {
    const nextSujetoId = getEmpresaSujetoId(empresa) ?? 0
    const preview = toPreview(empresa)

    setSelectedEmpresa(preview)
    form.setValue('proyecto.empresaPrincipalSujetoId', nextSujetoId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const clearSelection = () => {
    setSelectedEmpresa(null)
    form.setValue('proyecto.empresaPrincipalSujetoId', 0, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  return (
    <div className="project-company-selector">
      <input
        type="hidden"
        {...form.register('proyecto.empresaPrincipalSujetoId', {
          valueAsNumber: true
        })}
      />

      <div className="project-company-selector-header">
        <div className="project-company-selector-copy">
          <span className="detail-kicker">Empresa principal del proyecto</span>
          <h3>Selecciona una empresa existente</h3>
          <p className="muted">
            El proyecto ya no depende de la empresa activa del workspace. Aquí eliges
            explícitamente la empresa principal y persistimos su `sujetoId` correcto.
          </p>
        </div>

        <div className="project-company-selector-badges">
          <span className="detail-badge">
            {selectedSujetoId ? `Sujeto ${selectedSujetoId}` : 'Sin selección'}
          </span>
        </div>
      </div>

      <div className="assignment-modal-layout project-company-selector-layout">
        <section className="assignment-panel project-company-selector-list-panel">
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
              placeholder="Buscar por razón social, nombre comercial o RUC"
            />
            <button type="submit" className="secondary">
              Buscar
            </button>
          </form>

          <div className="assignment-results project-company-selector-results">
            {loading ? <p className="muted">Buscando empresas...</p> : null}

            {!loading && items.length === 0 ? (
              <p className="muted">
                No se encontraron empresas para esa búsqueda. Ajusta el término o vuelve a intentar.
              </p>
            ) : null}

            {items.map((item) => {
              const itemSujetoId = getEmpresaSujetoId(item)
              const isActive = itemSujetoId === selectedSujetoId

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`assignment-result-card${isActive ? ' active' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <strong>{item.empresa?.razonSocial ?? `Empresa ${item.id}`}</strong>
                  <span>{item.empresa?.nombreEmpresa ?? 'Sin nombre comercial'}</span>
                  <span>RUC: {item.empresa?.rucEmpresa ?? '-'}</span>
                  <span>Sujeto ID: {itemSujetoId ?? '-'}</span>
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

        <section className="assignment-panel assignment-preview-panel project-company-selector-preview-panel">
          <div className="detail-card-head">
            <h3>Resumen previo</h3>
            <span className="detail-badge">Antes de guardar</span>
          </div>

          {selectedEmpresa ? (
            <div className="project-company-selector-summary-grid">
              <SummaryRow label="Razón social" value={selectedEmpresa.razonSocial} />
              <SummaryRow label="Nombre comercial" value={selectedEmpresa.nombreEmpresa} />
              <SummaryRow label="RUC" value={selectedEmpresa.rucEmpresa} />
              <SummaryRow label="Sujeto ID" value={selectedEmpresa.sujetoId} />
              <SummaryRow label="Tipo sujeto" value={selectedEmpresa.tipoSujeto ?? 'JURIDICA'} />
              <SummaryRow label="Riesgo" value={selectedEmpresa.nivelRiesgo} />
              <SummaryRow
                label="Proyectos registrados"
                value={selectedEmpresa.proyectosRegistrados}
              />
            </div>
          ) : (
            <p className="muted">
              Selecciona una empresa del panel izquierdo para confirmar que es la correcta antes de
              guardar el proyecto.
            </p>
          )}

          <div className="project-company-selector-note">
            <p className="muted">
              El payload del proyecto usará exactamente este `empresaPrincipalSujetoId`, y después
              del guardado el workspace se alineará con la empresa elegida para mantener coherencia
              en gerente general, accionistas y documento Word.
            </p>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={clearSelection}
              disabled={!selectedSujetoId}
            >
              Limpiar selección
            </button>
          </div>
        </section>
      </div>

      {selectedError ? (
        <p className="form-inline-error">{selectedError}</p>
      ) : (
        <p className="form-inline-help">
          Elige una empresa para que el proyecto quede asociado al `sujetoId` correcto desde el
          inicio.
        </p>
      )}
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
      <strong>{formatValue(value)}</strong>
    </div>
  )
}
