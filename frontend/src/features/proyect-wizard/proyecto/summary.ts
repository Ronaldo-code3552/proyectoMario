import type { SummaryGridItem } from '../shared/components/SummaryGrid'
import type { ProyectoDetail } from './types'

const getProyectoCore = (detail: ProyectoDetail | null) => detail?.proyecto ?? null

export const buildProyectoDetailSummary = (
  detail: ProyectoDetail | null
): SummaryGridItem[] => {
  const core = getProyectoCore(detail)

  if (!detail || !core) return []

  return [
    {
      key: 'id',
      label: 'Proyecto ID',
      value: detail.id ?? core.id ?? '-'
    },
    {
      key: 'empresa-principal',
      label: 'Empresa principal',
      value: detail.empresaPrincipal?.razonSocial ?? detail.empresaPrincipal?.nombreEmpresa ?? '-'
    },
    {
      key: 'empresa-sujeto-id',
      label: 'Empresa sujeto ID',
      value: core.empresaPrincipalSujetoId ?? detail.empresaPrincipal?.sujetoId ?? '-'
    },
    {
      key: 'fecha-1',
      label: 'Fecha 1',
      value: core.fecha1 ?? '-'
    },
    {
      key: 'texto',
      label: 'Texto proyecto',
      value: core.textoProyectosNatural ?? '-'
    },
    {
      key: 'carga-lote',
      label: 'Carga lote ID',
      value: core.cargaLoteId ?? '-'
    },
    {
      key: 'gerente',
      label: 'Gerente',
      value: detail.gerenteGeneral?.persona?.nombreCompleto ?? '-'
    },
    {
      key: 'gerente-documento',
      label: 'Documento gerente',
      value: detail.gerenteGeneral?.persona?.numeroDocumento ?? '-'
    },
    {
      key: 'accionistas',
      label: 'Accionistas',
      value: detail.accionistas?.length ?? 0
    },
    {
      key: 'fuente',
      label: 'Fuente',
      value: core.payloadOriginal?.fuente ?? '-'
    },
    {
      key: 'origen',
      label: 'Origen',
      value: core.payloadOriginal?.origen ?? '-'
    }
  ]
}

export const buildProyectoFlowSummary = (input: {
  empresaSujetoId?: number
  gerenteSujetoId?: number
  proyectoId?: number
  accionistasRegistrados: number
}): SummaryGridItem[] => [
  {
    key: 'empresa-sujeto-id',
    label: 'Empresa sujeto ID',
    value: input.empresaSujetoId ?? '-'
  },
  {
    key: 'gerente-sujeto-id',
    label: 'Gerente sujeto ID',
    value: input.gerenteSujetoId ?? '-'
  },
  {
    key: 'proyecto-id',
    label: 'Proyecto ID',
    value: input.proyectoId ?? '-'
  },
  {
    key: 'accionistas-registrados',
    label: 'Accionistas registrados',
    value: input.accionistasRegistrados
  }
]
