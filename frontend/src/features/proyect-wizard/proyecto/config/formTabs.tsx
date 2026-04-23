import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { ProyectoFormValues } from '../../schemas'
import type { TabbedFormModalTab } from '../../shared/components/TabbedFormModalShell'
import type { ProyectoEmpresaPreview } from '../components/ProyectoEmpresaSelector'
import { ProyectoFormSection } from '../formSections'

export type ProyectoFormTabKey = 'general'

export type ProyectoFormTab = TabbedFormModalTab<ProyectoFormTabKey> & {
  content: ReactNode
}

export const buildProyectoFormTabs = (
  form: UseFormReturn<ProyectoFormValues>,
  initialEmpresaPreview?: ProyectoEmpresaPreview
): ProyectoFormTab[] => [
  {
    key: 'general',
    label: 'General',
    description: 'Datos base del proyecto',
    content: (
      <ProyectoFormSection
        form={form}
        initialEmpresaPreview={initialEmpresaPreview}
      />
    )
  }
]
