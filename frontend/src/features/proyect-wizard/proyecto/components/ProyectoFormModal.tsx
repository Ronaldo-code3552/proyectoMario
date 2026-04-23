import { useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { ProyectoFormValues } from '../../schemas'
import PageSection from '../../shared/components/PageSection'
import { buildProyectoFormTabs, type ProyectoFormTabKey } from '../config/formTabs'
import type { ProyectoEmpresaPreview } from './ProyectoEmpresaSelector'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
  form: UseFormReturn<ProyectoFormValues>
  initialEmpresaPreview?: ProyectoEmpresaPreview
  onClose: () => void
  onGoEmpresa: () => void
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
}

const joinClasses = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(' ')

export default function ProyectoFormModal({
  mode,
  form,
  initialEmpresaPreview,
  onClose,
  onGoEmpresa,
  onSubmit
}: Props) {
  const [activeTab, setActiveTab] = useState<ProyectoFormTabKey>('general')
  const tabs = useMemo(
    () => buildProyectoFormTabs(form, initialEmpresaPreview),
    [form, initialEmpresaPreview]
  )
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]
  const isCreate = mode === 'create'
  const backLabel = isCreate ? 'Volver al listado' : 'Volver al detalle'

  return (
    <PageSection
      eyebrow={isCreate ? 'Alta' : 'Edición'}
      title={isCreate ? 'Nuevo proyecto' : 'Editar proyecto'}
      description="Esta vista ya funciona como pantalla principal del módulo Proyecto. Aquí defines la empresa principal y dejas listo el contexto que luego usará el cierre operacional."
      className="detail-page-section project-form-page-section"
      headerActions={
        <div className="row-actions">
          <button type="button" className="secondary" onClick={onClose}>
            {backLabel}
          </button>
          <button type="button" className="secondary" onClick={onGoEmpresa}>
            Gestionar empresas
          </button>
        </div>
      }
    >
      <form
        onSubmit={(event) => onSubmit(event)}
        className="project-form-page"
      >
        <div className="detail-toolbar project-form-page-intro">
          <div className="detail-toolbar-copy">
            <span className="detail-kicker">Empresa principal del proyecto</span>
            <p className="muted">
              Selecciona aquí la empresa principal del proyecto. El formulario ya no se presenta
              como popup y el selector de empresa trabaja con todo el espacio útil del módulo.
            </p>
          </div>

          <div className="detail-flow-panel project-form-page-note">
            <span className="detail-kicker">Modo de trabajo</span>
            <p className="muted">
              {isCreate
                ? 'Estás creando un proyecto nuevo dentro del flujo principal del módulo.'
                : 'Estás editando un proyecto existente sin salir de su workspace principal.'}
            </p>
          </div>
        </div>

        <div className="form-modal-layout form-modal-layout-spacious project-form-page-layout">
          <aside
            className="form-tabs form-tabs-spacious project-form-page-tabs"
            aria-label="Secciones del formulario de proyecto"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={joinClasses('form-tab', activeTab === tab.key && 'active')}
                onClick={() => setActiveTab(tab.key)}
              >
                <strong>{tab.label}</strong>
                {tab.description ? <span>{tab.description}</span> : null}
              </button>
            ))}
          </aside>

          <div className="form-tab-panel project-form-page-panel">
            {currentTab.content}
          </div>
        </div>

        <div className="actions project-form-page-footer">
          <button type="button" className="secondary" onClick={onClose}>
            {backLabel}
          </button>

          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Guardando...'
              : isCreate
                ? 'Guardar proyecto'
                : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </PageSection>
  )
}
