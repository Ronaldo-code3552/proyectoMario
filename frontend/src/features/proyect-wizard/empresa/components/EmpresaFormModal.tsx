import { useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { EmpresaFormValues } from '../../schemas'
import TabbedFormModalShell from '../../shared/components/TabbedFormModalShell'
import { buildEmpresaFormTabs, type EmpresaFormTabKey } from '../config/formTabs'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
  form: UseFormReturn<EmpresaFormValues>
  onClose: () => void
  onSubmit: () => void
  initialTab?: EmpresaFormTabKey
}

export default function EmpresaFormModal({
  mode,
  form,
  onClose,
  onSubmit,
  initialTab = 'general'
}: Props) {
  const [activeTab, setActiveTab] = useState<EmpresaFormTabKey>(initialTab)

  const tabs = useMemo(() => buildEmpresaFormTabs(form), [form])
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]

  return (
    <TabbedFormModalShell
      eyebrow={mode === 'create' ? 'Alta' : 'Edicion'}
      title={mode === 'create' ? 'Nueva empresa' : 'Editar empresa'}
      description="Aquí se crea o edita la empresa base. Las deudas y listas hijas se gestionan en un panel separado, solo después de que la empresa exista."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Crear empresa' : 'Guardar cambios'}
      submitting={form.formState.isSubmitting}
    >
      {currentTab.content}
    </TabbedFormModalShell>
  )
}