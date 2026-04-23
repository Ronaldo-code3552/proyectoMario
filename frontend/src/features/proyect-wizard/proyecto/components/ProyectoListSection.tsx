import { useMemo } from 'react'
import PageSection from '../../shared/components/PageSection'
import DataTable from '../../shared/components/DataTable'
import { buildProyectoTableColumns } from '../config/table'
import type { ProyectoListItem } from '../api'

type Props = {
  proyectos: ProyectoListItem[]
  listLoading: boolean
  searchTerm: string
  pageNumber: number
  totalPages: number
  totalRecords: number
  onSearchTermChange: (value: string) => void
  onSearch: () => void
  onNewProyecto: () => void
  onGoEmpresa: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onView: (proyectoId: number) => void
  onEdit: (proyectoId: number) => void
  onDownload: (proyectoId: number) => void
}

export default function ProyectoListSection({
  proyectos,
  listLoading,
  searchTerm,
  pageNumber,
  totalPages,
  totalRecords,
  onSearchTermChange,
  onSearch,
  onNewProyecto,
  onGoEmpresa,
  onPrevPage,
  onNextPage,
  onView,
  onEdit,
  onDownload
}: Props) {
  const columns = useMemo(
    () =>
      buildProyectoTableColumns({
        onView,
        onEdit,
        onDownload
      }),
    [onView, onEdit, onDownload]
  )

  return (
    <PageSection
      className="table-page-section"
      eyebrow="Pagina 3"
      title="Proyecto"
      description="Aquí puedes revisar los proyectos registrados, consultar su detalle, actualizarlos y descargar su documento final. Cada nuevo proyecto abre una vista de formulario principal dentro del módulo."
    >
      <div className="detail-toolbar" style={{ marginBottom: '18px' }}>
        <div className="detail-toolbar-copy">
          <span className="detail-kicker">Alta de proyectos</span>
          <p className="muted">
            El alta ya no depende de la empresa activa del workspace ni de un popup apretado. Al
            abrir el formulario entrarás a una vista principal donde podrás buscar cualquier empresa
            existente, revisar su resumen y confirmar cuál será la empresa principal del proyecto.
          </p>
        </div>

        <div className="actions detail-page-actions">
          <button type="button" onClick={onNewProyecto}>
            Nuevo proyecto
          </button>
          <button type="button" className="secondary" onClick={onGoEmpresa}>
            Gestionar empresas
          </button>
        </div>
      </div>

      <div className="toolbar table-toolbar">
        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Buscar por empresa, fecha o texto del proyecto"
        />
        <button type="button" className="secondary" onClick={onSearch}>
          Buscar
        </button>
        <button type="button" onClick={onNewProyecto}>
          Nuevo proyecto
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={proyectos}
        getRowKey={(item) => item.id}
        loading={listLoading}
        emptyMessage="No se encontraron proyectos."
      />

      <div className="toolbar table-footer">
        <span className="muted">
          Página {pageNumber} de {totalPages} con {totalRecords} proyectos.
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
