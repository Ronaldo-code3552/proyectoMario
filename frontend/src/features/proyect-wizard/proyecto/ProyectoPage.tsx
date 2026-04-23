import ProyectoDetailSection from './components/ProyectoDetailSection'
import ProyectoFormModal from './components/ProyectoFormModal'
import ProyectoListSection from './components/ProyectoListSection'
import type { ProyectoEmpresaPreview } from './components/ProyectoEmpresaSelector'
import type { ProyectoDetail } from './types'
import { useProyectoPageController } from './useProyectoPageController'
import { useProyectoWorkspace } from '../useProyectoWorkspace'

type Workspace = ReturnType<typeof useProyectoWorkspace>
type DownloadState = {
  version?: string
  fileName?: string
  downloaded?: boolean
}

type Props = {
  workspace: Workspace
  onGoEmpresa: () => void
}

export default function ProyectoPage({ workspace, onGoEmpresa }: Props) {
  const {
    accionistas,
    assignGerenteGeneralStep,
    affiliateExistingAccionistaStep,
    docxLoading,
    handleGenerateDocx,
    proyectoForm,
    state
  } = workspace

  const controller = useProyectoPageController(workspace)
  const handleSaveProyecto = proyectoForm.handleSubmit(controller.handleSaveProyecto)
  const currentProyecto = state.proyectoRaw as ProyectoDetail | undefined
  const currentDownload = state.docxRaw as DownloadState | undefined
  const selectedProyecto = currentProyecto ?? controller.selectedProyecto
  const isDetailView = controller.panelMode === 'detail'
  const isFormView = controller.panelMode === 'create' || controller.panelMode === 'edit'
  const formMode =
    controller.panelMode === 'create' || controller.panelMode === 'edit'
      ? controller.panelMode
      : null
  const initialEmpresaPreview: ProyectoEmpresaPreview | undefined = currentProyecto
    ? {
        sujetoId:
          currentProyecto.proyecto?.empresaPrincipalSujetoId ??
          currentProyecto.empresaPrincipal?.sujetoId,
        razonSocial: currentProyecto.empresaPrincipal?.razonSocial,
        nombreEmpresa: currentProyecto.empresaPrincipal?.nombreEmpresa,
        rucEmpresa: currentProyecto.empresaPrincipal?.rucEmpresa,
        tipoSujeto: 'JURIDICA'
      }
    : undefined

  const handleGoEmpresaFromForm = () => {
    controller.setPanelMode('browse')
    onGoEmpresa()
  }

  const handleCloseForm = () => {
    if (controller.panelMode === 'edit' && selectedProyecto) {
      controller.setPanelMode('detail')
      return
    }

    controller.setPanelMode('browse')
  }

  return (
    <div className="page-grid">
      {isFormView && formMode ? (
        <ProyectoFormModal
          mode={formMode}
          form={proyectoForm}
          initialEmpresaPreview={initialEmpresaPreview}
          onClose={handleCloseForm}
          onGoEmpresa={handleGoEmpresaFromForm}
          onSubmit={handleSaveProyecto}
        />
      ) : isDetailView ? (
        <ProyectoDetailSection
          selectedProyecto={selectedProyecto}
          detailLoading={controller.detailLoading}
          proyectoId={state.proyectoId}
          empresaSujetoId={state.empresaSujetoId}
          accionistasRegistrados={selectedProyecto?.accionistas?.length ?? accionistas.length}
          currentDownload={currentDownload}
          docxLoading={docxLoading}
          onBackToList={() => controller.setPanelMode('browse')}
          onGoEmpresa={onGoEmpresa}
          onUse={controller.handleUseProyecto}
          onEdit={controller.handleEditProyecto}
          onDelete={controller.handleDeleteProyecto}
          onAssignGerenteGeneral={assignGerenteGeneralStep}
          onAffiliateAccionista={affiliateExistingAccionistaStep}
          onDownloadCurrent={handleGenerateDocx}
        />
      ) : (
        <ProyectoListSection
          proyectos={controller.proyectos}
          listLoading={controller.listLoading}
          searchTerm={controller.searchTerm}
          pageNumber={controller.pageNumber}
          totalPages={controller.totalPages}
          totalRecords={controller.totalRecords}
          onSearchTermChange={controller.setSearchTerm}
          onSearch={controller.handleSearch}
          onNewProyecto={controller.handleNewProyecto}
          onGoEmpresa={onGoEmpresa}
          onPrevPage={() => controller.setPageNumber((prev) => Math.max(1, prev - 1))}
          onNextPage={() =>
            controller.setPageNumber((prev) => Math.min(controller.totalPages, prev + 1))
          }
          onView={controller.handleViewProyecto}
          onEdit={controller.handleEditProyecto}
          onDownload={controller.handleDownloadProyecto}
        />
      )}
    </div>
  )
}
