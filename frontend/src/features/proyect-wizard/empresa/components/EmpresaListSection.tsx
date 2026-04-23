import { useMemo } from 'react'
import PageSection from '../../shared/components/PageSection'
import DataTable from '../../shared/components/DataTable'
import { buildEmpresaTableColumns } from '../config/table'
import type { EmpresaListItem } from '../api'

type Props = {
  empresas: EmpresaListItem[]
  listLoading: boolean
  searchTerm: string
  pageNumber: number
  totalPages: number
  totalRecords: number
  onSearchTermChange: (value: string) => void
  onSearch: () => void
  onNewEmpresa: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onView: (empresaId: number) => void
  onEdit: (empresaId: number) => void
  onDebt: (empresaId: number) => void
}

export default function EmpresaListSection({
  empresas,
  listLoading,
  searchTerm,
  pageNumber,
  totalPages,
  totalRecords,
  onSearchTermChange,
  onSearch,
  onNewEmpresa,
  onPrevPage,
  onNextPage,
  onView,
  onEdit,
  onDebt
}: Props) {
  const columns = useMemo(
    () =>
      buildEmpresaTableColumns({
        onView,
        onEdit,
        onDebt
      }),
    [onView, onEdit, onDebt]
  )

  return (
    <PageSection
      className="table-page-section"
      eyebrow="Modulo base"
      title="Empresa"
      description="Este panel ya trabaja como CRUD profesional: listado, búsqueda, detalle, edición y recién después el formulario."
    >
      <div className="toolbar table-toolbar">
        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Buscar por RUC, razón social, gerente o proyecto"
        />
        <button type="button" className="secondary" onClick={onSearch}>
          Buscar
        </button>
        <button type="button" onClick={onNewEmpresa}>
          Nueva empresa
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={empresas}
        getRowKey={(item) => item.id}
        loading={listLoading}
        emptyMessage="No se encontraron empresas."
        className="empresa-table-wrap"
        tableClassName="empresa-table"
      />

      <div className="toolbar table-footer">
        <span className="muted">
          Página {pageNumber} de {totalPages} con {totalRecords} empresas.
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
