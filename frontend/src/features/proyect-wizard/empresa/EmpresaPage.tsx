import EmpresaDebtPanelModal from './components/EmpresaDebtPanelModal'
import EmpresaFormModal from './components/EmpresaFormModal'
import EmpresaDetailSection from './components/EmpresaDetailSection'
import EmpresaListSection from './components/EmpresaListSection'
import { useEmpresaPageController } from './useEmpresaPageController'
import type { useProyectoWorkspace } from '../useProyectoWorkspace'

type Workspace = ReturnType<typeof useProyectoWorkspace>

type Props = {
  workspace: Workspace
  onGoProyecto: () => void
}

export default function EmpresaPage({ workspace, onGoProyecto }: Props) {
  const {
    empresaForm,
    empresaReportes,
    setEmpresaReportes,
    state
  } = workspace

  const controller = useEmpresaPageController(workspace)

  const handleSaveEmpresa = empresaForm.handleSubmit(controller.handleSaveEmpresa)
  const handleSaveEmpresaDebt = empresaForm.handleSubmit(controller.handleSaveEmpresaDebt)
  const isDebtView = controller.panelMode === 'debts'
  const isDetailView = controller.panelMode === 'detail'

  return (
    <div className="page-grid">
      {isDebtView ? (
        <EmpresaDebtPanelModal
          form={empresaForm}
          selectedEmpresa={controller.selectedEmpresa}
          reportes={empresaReportes}
          onReportesChange={setEmpresaReportes}
          onClose={() => controller.setPanelMode('browse')}
          onSubmit={handleSaveEmpresaDebt}
        />
      ) : isDetailView ? (
        <EmpresaDetailSection
          selectedEmpresa={controller.selectedEmpresa}
          detailLoading={controller.detailLoading}
          empresaId={state.empresaId}
          empresaSujetoId={state.empresaSujetoId}
          proyectoId={state.proyectoId}
          onBackToList={() => controller.setPanelMode('browse')}
          onGoProyecto={onGoProyecto}
          onUse={controller.handleUseEmpresa}
          onEdit={controller.handleEditEmpresa}
          onDelete={controller.handleDeleteEmpresa}
          onDebt={controller.handleDebtEmpresa}
        />
      ) : (
        <>
          <EmpresaListSection
            empresas={controller.empresas}
            listLoading={controller.listLoading}
            searchTerm={controller.searchTerm}
            pageNumber={controller.pageNumber}
            totalPages={controller.totalPages}
            totalRecords={controller.totalRecords}
            onSearchTermChange={controller.setSearchTerm}
            onSearch={controller.handleSearch}
            onNewEmpresa={controller.handleNewEmpresa}
            onPrevPage={() => controller.setPageNumber((prev) => Math.max(1, prev - 1))}
            onNextPage={() => controller.setPageNumber((prev) => Math.min(controller.totalPages, prev + 1))}
            onView={controller.handleViewEmpresa}
            onEdit={controller.handleEditEmpresa}
            onDebt={controller.handleDebtEmpresa}
          />
        </>
      )}

      {(controller.panelMode === 'create' || controller.panelMode === 'edit') ? (
        <EmpresaFormModal
          mode={controller.panelMode}
          form={empresaForm}
          onClose={() => controller.setPanelMode('browse')}
          onSubmit={handleSaveEmpresa}
        />
      ) : null}

    </div>
  )
}
