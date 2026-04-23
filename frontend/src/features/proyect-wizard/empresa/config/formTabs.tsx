import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import {
  EmpresaCapitalFormSection,
  EmpresaEstablecimientosFormSection,
  EmpresaGeneralFormSection,
  EmpresaRiskFormSection,
  EmpresaSunatSummaryFormSection
} from '../../forms'
import type { EmpresaFormValues } from '../../schemas'
import type { TabbedFormModalTab } from '../../shared/components/TabbedFormModalShell'

export type EmpresaFormTabKey =
  | 'general'
  | 'riesgo'
  | 'sunat'
  | 'sunarp'
  | 'establecimientos'

export type EmpresaFormTab = TabbedFormModalTab<EmpresaFormTabKey> & {
  content: ReactNode
}

export const buildEmpresaFormTabs = (
  form: UseFormReturn<EmpresaFormValues>
): EmpresaFormTab[] => [
  {
    key: 'general',
    label: 'General',
    description: 'Identidad, registro y objeto social',
    content: <EmpresaGeneralFormSection form={form} title="Información general" />
  },
  {
    key: 'riesgo',
    label: 'Central de Riesgos',
    description: 'Sujeto, score y endeudamiento base',
    content: <EmpresaRiskFormSection form={form} />
  },
  {
    key: 'sunat',
    label: 'SUNAT',
    description: 'Estado fiscal y operación base',
    content: <EmpresaSunatSummaryFormSection form={form} />
  },
  {
    key: 'sunarp',
    label: 'SUNARP',
    description: 'Capital y estructura societaria',
    content: <EmpresaCapitalFormSection form={form} />
  },
  {
    key: 'establecimientos',
    label: 'Locales',
    description: 'Establecimientos y anexos',
    content: <EmpresaEstablecimientosFormSection form={form} />
  }
]