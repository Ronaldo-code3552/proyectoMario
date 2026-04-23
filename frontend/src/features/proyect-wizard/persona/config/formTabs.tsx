import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { PersonaFormSection } from '../../forms'
import type { PersonaFormValues } from '../../schemas'
import type { TabbedFormModalTab } from '../../shared/components/TabbedFormModalShell'

export type PersonaFormTabKey = 'general'

export type PersonaFormTab = TabbedFormModalTab<PersonaFormTabKey> & {
  content: ReactNode
}

export const buildPersonaFormTabs = (
  form: UseFormReturn<PersonaFormValues>
): PersonaFormTab[] => [
  {
    key: 'general',
    label: 'General',
    description: 'Identidad y datos base',
    content: <PersonaFormSection form={form} title="Persona base" />
  }
]
