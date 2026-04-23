import { useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { PersonaFormValues } from '../../schemas'
import TabbedFormModalShell from '../../shared/components/TabbedFormModalShell'
import { buildPersonaFormTabs, type PersonaFormTabKey } from '../config/formTabs'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
  form: UseFormReturn<PersonaFormValues>
  onClose: () => void
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
  initialTab?: PersonaFormTabKey
}

export default function PersonaFormModal({
  mode,
  form,
  onClose,
  onSubmit,
  initialTab = 'general'
}: Props) {
  const [activeTab, setActiveTab] = useState<PersonaFormTabKey>(initialTab)

  const tabs = useMemo(() => buildPersonaFormTabs(form), [form])
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]

  return (
    <TabbedFormModalShell
      eyebrow={mode === 'create' ? 'Alta' : 'Edición'}
      title={mode === 'create' ? 'Nueva persona' : 'Editar persona'}
      description="Aquí se crea o edita la persona base. Los reportes se gestionan en una sección separada dentro del flujo."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Guardar persona' : 'Guardar cambios'}
      submitting={form.formState.isSubmitting}
      sidebarLabel="Secciones del formulario de persona"
    >
      {currentTab.content}
    </TabbedFormModalShell>
  )
}