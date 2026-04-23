import type { DataTableColumn } from '../../shared/components/DataTable'
import EntityActionButtons from '../../shared/components/EntityActionButtons'
import type { EmpresaListItem } from '../api'

type EmpresaTableHandlers = {
  onView: (empresaId: number) => void
  onEdit: (empresaId: number) => void
  onDebt: (empresaId: number) => void
}

export const buildEmpresaTableColumns = ({
  onView,
  onEdit,
  onDebt
}: EmpresaTableHandlers): Array<DataTableColumn<EmpresaListItem>> => [
  {
    key: 'id',
    header: 'ID',
    className: 'empresa-col-id',
    render: (item) => item.id
  },
  {
    key: 'ruc',
    header: 'RUC',
    className: 'empresa-col-ruc',
    render: (item) => item.empresa?.rucEmpresa ?? '-'
  },
  {
    key: 'razon-social',
    header: 'Razón social',
    className: 'empresa-col-razon',
    render: (item) => item.empresa?.razonSocial ?? '-'
  },
  {
    key: 'nombre',
    header: 'Nombre',
    className: 'empresa-col-nombre empresa-col-optional',
    render: (item) => item.empresa?.nombreEmpresa ?? '-'
  },
  {
    key: 'riesgo',
    header: 'Riesgo',
    className: 'empresa-col-riesgo empresa-col-optional',
    render: (item) => item.sujeto?.nivelRiesgo ?? '-'
  },
  {
    key: 'gerente',
    header: 'Gerente',
    className: 'empresa-col-gerente',
    render: (item) => item.gerenteGeneral?.persona?.nombreCompleto ?? '-'
  },
  {
    key: 'proyectos',
    header: 'Proyectos',
    className: 'empresa-col-count empresa-col-optional',
    render: (item) => item.proyectos?.length ?? 0
  },
  {
    key: 'accionistas',
    header: 'Accionistas',
    className: 'empresa-col-count empresa-col-optional',
    render: (item) => item.accionistas?.length ?? 0
  },
  {
    key: 'estado',
    header: 'Estado',
    className: 'empresa-col-estado',
    render: (item) => item.empresa?.sunatEstadoEmpresa ?? '-'
  },
  {
    key: 'acciones',
    header: 'Acciones',
    className: 'actions-col empresa-col-actions',
    render: (item) => (
      <EntityActionButtons
        actions={[
          {
            kind: 'view',
            label: `Ver empresa ${item.id}`,
            onClick: () => onView(item.id)
          },
          {
            kind: 'edit',
            label: `Editar empresa ${item.id}`,
            onClick: () => onEdit(item.id)
          },
          {
            kind: 'debt',
            label: `Completar deudas de empresa ${item.id}`,
            onClick: () => onDebt(item.id)
          }
        ]}
      />
    )
  }
]
