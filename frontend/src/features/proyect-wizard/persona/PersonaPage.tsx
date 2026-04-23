import type { useProyectoWorkspace } from '../useProyectoWorkspace'
import PersonaDetailSection from './components/PersonaDetailSection'
import PersonaFormModal from './components/PersonaFormModal'
import PersonaListSection from './components/PersonaListSection'
import PersonaDebtPanelModal from './components/PersonaDebtPanelModal'
import { usePersonaPageController } from './usePersonaPageController'

type Workspace = ReturnType<typeof useProyectoWorkspace>

type Props = {
  workspace: Workspace
  onGoEmpresa: () => void
  onGoProyecto: () => void
}

export default function PersonaPage({
  workspace,
  onGoEmpresa,
  onGoProyecto
}: Props) {
  const {
    personaForm,
    personaReportes,
    personaReportesLoading,
    setPersonaReportes,
    state
  } = workspace

  const controller = usePersonaPageController(workspace)
  const handleSavePersona = personaForm.handleSubmit(controller.handleSavePersona)
  const isDetailView = controller.panelMode === 'detail'
  const isDebtView = controller.panelMode === 'debts'

  return (
    <div className="page-grid">
      {isDebtView ? (
        <PersonaDebtPanelModal
          selectedPersona={controller.selectedPersona}
          reportes={personaReportes}
          loading={personaReportesLoading}
          canSave={Boolean(state.personaSujetoId)}
          onChange={setPersonaReportes}
          onClose={() => controller.setPanelMode('detail')}
          onSubmit={controller.handleSavePersonaDebt}
        />
      ) : isDetailView ? (
        <PersonaDetailSection
          selectedPersona={controller.selectedPersona}
          detailLoading={controller.detailLoading}
          personaId={state.personaId}
          personaSujetoId={state.personaSujetoId}
          empresaSujetoId={state.empresaSujetoId}
          proyectoId={state.proyectoId}
          onBackToList={() => controller.setPanelMode('browse')}
          onGoEmpresa={onGoEmpresa}
          onGoProyecto={onGoProyecto}
          onUse={controller.handleUsePersona}
          onEdit={controller.handleEditPersona}
          onDelete={controller.handleDeletePersona}
          onDebt={controller.handleDebtPersona}
        />
      ) : (
        <PersonaListSection
          personas={controller.personas}
          listLoading={controller.listLoading}
          searchTerm={controller.searchTerm}
          pageNumber={controller.pageNumber}
          totalPages={controller.totalPages}
          totalRecords={controller.totalRecords}
          onSearchTermChange={controller.setSearchTerm}
          onSearch={controller.handleSearch}
          onPrevPage={() => controller.setPageNumber((prev) => Math.max(1, prev - 1))}
          onNextPage={() =>
            controller.setPageNumber((prev) => Math.min(controller.totalPages, prev + 1))
          }
          onView={controller.handleViewPersona}
          onEdit={controller.handleEditPersona}
          onDebt={controller.handleDebtPersona}
          onNewPersona={controller.handleNewPersona}
        />
      )}

      {(controller.panelMode === 'create' || controller.panelMode === 'edit') ? (
        <PersonaFormModal
          mode={controller.panelMode}
          form={personaForm}
          onClose={() => controller.setPanelMode('browse')}
          onSubmit={handleSavePersona}
        />
      ) : null}
    </div>
  )
}
