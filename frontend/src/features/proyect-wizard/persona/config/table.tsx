import type { DataTableColumn } from '../../shared/components/DataTable'
import EntityActionButtons from '../../shared/components/EntityActionButtons'
import type { PersonaListItem } from '../api'

type PersonaTableHandlers = {
  onView: (personaId: number) => void
  onEdit: (personaId: number) => void
  onDebt: (personaId: number) => void
}

export const buildPersonaTableColumns = ({
  onView,
  onEdit,
  onDebt
}: PersonaTableHandlers): Array<DataTableColumn<PersonaListItem>> => [
  {
    key: 'id',
    header: 'ID',
    render: (item) => item.id
  },
  {
    key: 'tipo-documento',
    header: 'Tipo doc.',
    render: (item) => item.persona?.tipoDocumento ?? '-'
  },
  {
    key: 'numero-documento',
    header: 'Número',
    render: (item) => item.persona?.numeroDocumento ?? '-'
  },
  {
    key: 'nombre',
    header: 'Nombre completo',
    render: (item) => item.persona?.nombreCompleto ?? '-'
  },
  {
    key: 'riesgo',
    header: 'Riesgo',
    render: (item) => item.sujeto?.nivelRiesgo ?? '-'
  },
  {
    key: 'relaciones',
    header: 'Relaciones',
    render: (item) => item.conteos?.relacionesEmpresa ?? 0
  },
  {
    key: 'expedientes',
    header: 'Expedientes',
    render: (item) => item.conteos?.reportesExpediente ?? 0
  },
  {
    key: 'listas',
    header: 'Listas',
    render: (item) => item.conteos?.reportesListaSimple ?? 0
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (item) => item.persona?.estadoContribuyente ?? '-'
  },
  {
    key: 'acciones',
    header: 'Acciones',
    className: 'actions-col',
    render: (item) => (
      <EntityActionButtons
        actions={[
          {
            kind: 'view',
            label: `Ver persona ${item.id}`,
            onClick: () => onView(item.id)
          },
          {
            kind: 'edit',
            label: `Editar persona ${item.id}`,
            onClick: () => onEdit(item.id)
          },
          {
            kind: 'debt',
            label: `Completar reportes de persona ${item.id}`,
            onClick: () => onDebt(item.id)
          }
        ]}
      />
    )
  }
]