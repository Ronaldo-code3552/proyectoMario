import { useMemo } from 'react'
import PageSection from '../../shared/components/PageSection'
import DataTable from '../../shared/components/DataTable'
import { buildPersonaTableColumns } from '../config/table'
import type { PersonaListItem } from '../api'

type Props = {
  personas: PersonaListItem[]
  listLoading: boolean
  searchTerm: string
  pageNumber: number
  totalPages: number
  totalRecords: number
  onSearchTermChange: (value: string) => void
  onSearch: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onView: (personaId: number) => void
  onEdit: (personaId: number) => void
  onDebt: (personaId: number) => void
  onNewPersona: () => void
}

export default function PersonaListSection({
  personas,
  listLoading,
  searchTerm,
  pageNumber,
  totalPages,
  totalRecords,
  onSearchTermChange,
  onSearch,
  onPrevPage,
  onNextPage,
  onView,
  onEdit,
  onDebt,
  onNewPersona
}: Props) {
  const columns = useMemo(
    () =>
      buildPersonaTableColumns({
        onView,
        onEdit,
        onDebt
      }),
    [onView, onEdit, onDebt]
  )

  return (
    <PageSection
      className="table-page-section"
      eyebrow="Pagina 2"
      title="Persona"
      description="Aquí puedes revisar todas las personas registradas, consultar su detalle y trabajar su formulario y reportes dentro del flujo actual."
    >
      <div className="toolbar table-toolbar">
        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Buscar por documento, nombre o RUC personal"
        />
        <button type="button" className="secondary" onClick={onSearch}>
          Buscar
        </button>
        <button type="button" onClick={onNewPersona}>
          Nueva persona
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={personas}
        getRowKey={(item) => item.id}
        loading={listLoading}
        emptyMessage="No se encontraron personas."
      />

      <div className="toolbar table-footer">
        <span className="muted">
          Página {pageNumber} de {totalPages} con {totalRecords} personas.
        </span>

        <div className="row-actions">
          <button
            type="button"
            className="secondary"
            onClick={onPrevPage}
            disabled={pageNumber === 1}
          >
            Anterior
          </button>

          <button
            type="button"
            className="secondary"
            onClick={onNextPage}
            disabled={pageNumber >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </PageSection>
  )
}
