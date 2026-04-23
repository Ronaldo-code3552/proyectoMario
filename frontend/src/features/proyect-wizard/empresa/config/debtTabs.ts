import type { EmpresaDebtSectionKey } from '../components/EmpresaDebtProfileSection'
import type { TabbedFormModalTab } from '../../shared/components/TabbedFormModalShell'

export type EmpresaDebtTabDensity = 'compact' | 'medium' | 'heavy'
export type EmpresaDebtTabLayoutHint = 'simple' | 'sectioned'

export type EmpresaDebtTabConfig = TabbedFormModalTab<EmpresaDebtSectionKey> & {
  workspaceTitle: string
  workspaceDescription: string
  density: EmpresaDebtTabDensity
  layoutHint: EmpresaDebtTabLayoutHint
  isHeavy?: boolean
}

export const empresaDebtTabs: EmpresaDebtTabConfig[] = [
  {
    key: 'sunat',
    label: 'INFORMACION_PUBLICA_SUNAT',
    description: 'Estado fiscal, deudas, omisiones, PLAME, representantes y locales',
    workspaceTitle: 'Información pública SUNAT',
    workspaceDescription:
      'Aquí se consolida la información tributaria y operativa base de la empresa, incluyendo deuda, omisiones, representantes legales y establecimientos.',
    density: 'medium',
    layoutHint: 'sectioned'
  },
  {
    key: 'sunarp',
    label: 'INFORMACION_PUBLICA_SUNARP',
    description: 'Capital, acciones y valor nominal',
    workspaceTitle: 'Información pública SUNARP',
    workspaceDescription:
      'Aquí se trabaja la información societaria y registral vinculada al capital, acciones y estructura base de la empresa.',
    density: 'compact',
    layoutHint: 'simple'
  },
  {
    key: 'riesgo',
    label: 'INFORMACION_PUBLICA_CENTRAL_DE_RIESGOS',
    description: 'Score, riesgo, comportamiento y deuda total',
    workspaceTitle: 'Información pública de central de riesgos',
    workspaceDescription:
      'Aquí se organiza el perfil financiero y de riesgo de la empresa, incluyendo score, comportamiento de pago y deuda consolidada.',
    density: 'compact',
    layoutHint: 'simple'
  },
  {
    key: 'indecopi',
    label: 'INFORMACION_PUBLICA_INDECOPI',
    description: 'Expedientes, listas simples y otros hallazgos regulatorios',
    workspaceTitle: 'Información pública INDECOPI',
    workspaceDescription:
      'Este módulo agrupa información más extensa y heterogénea, por lo que debe tratarse como un bloque escalable y seccionado.',
    density: 'heavy',
    layoutHint: 'sectioned',
    isHeavy: true
  }
]