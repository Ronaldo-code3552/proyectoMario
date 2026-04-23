import type { SummaryGridItem } from '../shared/components/SummaryGrid'
import type { EmpresaDetail } from './types'

type EmpresaFlowSummaryInput = {
  empresaId?: number
  empresaSujetoId?: number
  proyectoId?: number
}

export const buildEmpresaDetailSummary = (
  selectedEmpresa: EmpresaDetail | null
): SummaryGridItem[] => {
  if (!selectedEmpresa) return []

  return [
    { key: 'id', label: 'ID', value: selectedEmpresa.id },
    {
      key: 'sujeto-id',
      label: 'Sujeto ID',
      value: selectedEmpresa.sujeto?.id ?? selectedEmpresa.id
    },
    {
      key: 'ruc',
      label: 'RUC',
      value: selectedEmpresa.empresa?.rucEmpresa ?? '-'
    },
    {
      key: 'razon-social',
      label: 'Razón social',
      value: selectedEmpresa.empresa?.razonSocial ?? '-'
    },
    {
      key: 'nombre-comercial',
      label: 'Nombre comercial',
      value: selectedEmpresa.empresa?.nombreEmpresa ?? '-'
    },
    {
      key: 'domicilio',
      label: 'Domicilio',
      value: selectedEmpresa.empresa?.domicilioFiscal ?? '-'
    },
    {
      key: 'riesgo',
      label: 'Riesgo',
      value: selectedEmpresa.sujeto?.nivelRiesgo ?? '-'
    },
    {
      key: 'score',
      label: 'Score',
      value: selectedEmpresa.sujeto?.scoreValor ?? '-'
    },
    {
      key: 'gerente',
      label: 'Gerente',
      value: selectedEmpresa.gerenteGeneral?.persona?.nombreCompleto ?? '-'
    },
    {
      key: 'proyectos',
      label: 'Proyectos',
      value: selectedEmpresa.proyectos?.length ?? 0
    },
    {
      key: 'accionistas',
      label: 'Accionistas',
      value: selectedEmpresa.accionistas?.length ?? 0
    },
    {
      key: 'representantes',
      label: 'Representantes legales',
      value: selectedEmpresa.representantesLegales?.length ?? 0
    }
  ]
}

export const buildEmpresaFlowSummary = (
  flow: EmpresaFlowSummaryInput
): SummaryGridItem[] => [
  {
    key: 'empresa-id',
    label: 'Empresa ID',
    value: flow.empresaId ?? '-'
  },
  {
    key: 'empresa-sujeto-id',
    label: 'Empresa sujeto ID',
    value: flow.empresaSujetoId ?? '-'
  },
  {
    key: 'proyecto-id',
    label: 'Proyecto ID vinculado',
    value: flow.proyectoId ?? '-'
  }
]