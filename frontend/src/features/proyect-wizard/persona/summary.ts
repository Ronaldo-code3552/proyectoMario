import type { SummaryGridItem } from '../shared/components/SummaryGrid'
import type {
  PersonaDetailSummaryInput,
  PersonaFlowSummaryInput
} from './types'

export const buildPersonaFlowSummary = (
  flow: PersonaFlowSummaryInput
): SummaryGridItem[] => [
  {
    key: 'persona-id',
    label: 'Persona ID',
    value: flow.personaId ?? '-'
  },
  {
    key: 'persona-sujeto-id',
    label: 'Persona sujeto ID',
    value: flow.personaSujetoId ?? '-'
  },
  {
    key: 'empresa-sujeto-id',
    label: 'Empresa asociada',
    value: flow.empresaSujetoId ?? '-'
  },
  {
    key: 'proyecto-id',
    label: 'Proyecto activo',
    value: flow.proyectoId ?? '-'
  }
]

export const buildPersonaDetailSummary = (
  detail: PersonaDetailSummaryInput
): SummaryGridItem[] => {
  if (!detail) return []

  return [
    {
      key: 'id',
      label: 'ID',
      value: detail.id
    },
    {
      key: 'sujeto-id',
      label: 'Sujeto ID',
      value: detail.sujeto?.id ?? detail.id
    },
    {
      key: 'nombre',
      label: 'Nombre completo',
      value: detail.persona?.nombreCompleto ?? '-'
    },
    {
      key: 'tipo-documento',
      label: 'Tipo documento',
      value: detail.persona?.tipoDocumento ?? '-'
    },
    {
      key: 'numero-documento',
      label: 'Número documento',
      value: detail.persona?.numeroDocumento ?? '-'
    },
    {
      key: 'ruc-personal',
      label: 'RUC personal',
      value: detail.persona?.rucPersonal ?? '-'
    },
    {
      key: 'domicilio',
      label: 'Domicilio fiscal',
      value: detail.persona?.domicilioFiscalPersonal ?? '-'
    },
    {
      key: 'riesgo',
      label: 'Riesgo',
      value: detail.sujeto?.nivelRiesgo ?? '-'
    },
    {
      key: 'score',
      label: 'Score',
      value: detail.sujeto?.scoreValor ?? '-'
    },
    {
      key: 'relaciones',
      label: 'Relaciones empresa',
      value: detail.relacionesEmpresa?.length ?? 0
    },
    {
      key: 'deudas',
      label: 'Deudas SUNAT',
      value: detail.deudasSunat?.length ?? 0
    },
    {
      key: 'omisiones',
      label: 'Omisiones SUNAT',
      value: detail.omisionesSunat?.length ?? 0
    },
    {
      key: 'expedientes',
      label: 'Reportes expediente',
      value: detail.reportesExpediente?.length ?? 0
    },
    {
      key: 'listas',
      label: 'Reportes lista simple',
      value: detail.reportesListaSimple?.length ?? 0
    },
    {
      key: 'ministerio',
      label: 'Ministerio vivienda',
      value: detail.reportesMinisterioVivienda?.length ?? 0
    }
  ]
}
