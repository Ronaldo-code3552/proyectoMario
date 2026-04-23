import type { DataTableColumn } from '../../shared/components/DataTable'
import EntityActionButtons from '../../shared/components/EntityActionButtons'
import type { ProyectoListItem } from '../api'

const getCore = (item: ProyectoListItem) => item.proyecto ?? null

type ProyectoTableHandlers = {
  onView: (proyectoId: number) => void
  onEdit: (proyectoId: number) => void
  onDownload: (proyectoId: number) => void
}

export const buildProyectoTableColumns = ({
  onView,
  onEdit,
  onDownload
}: ProyectoTableHandlers): Array<DataTableColumn<ProyectoListItem>> => [
  {
    key: 'id',
    header: 'ID',
    render: (item) => item.id ?? getCore(item)?.id ?? '-'
  },
  {
    key: 'empresa',
    header: 'Empresa principal',
    render: (item) => item.empresaPrincipal?.razonSocial ?? item.empresaPrincipal?.nombreEmpresa ?? '-'
  },
  {
    key: 'fecha',
    header: 'Fecha 1',
    render: (item) => getCore(item)?.fecha1 ?? '-'
  },
  {
    key: 'texto',
    header: 'Texto proyecto',
    render: (item) => getCore(item)?.textoProyectosNatural ?? '-'
  },
  {
    key: 'gerente',
    header: 'Gerente',
    render: (item) => item.gerenteGeneral?.persona?.nombreCompleto ?? '-'
  },
  {
    key: 'accionistas',
    header: 'Accionistas',
    render: (item) => item.accionistas?.length ?? 0
  },
  {
    key: 'acciones',
    header: 'Acciones',
    className: 'actions-col',
    render: (item) => (
      <div className="row-actions">
        <EntityActionButtons
          actions={[
            {
              kind: 'view',
              label: `Ver proyecto ${item.id}`,
              onClick: () => onView(item.id)
            },
            {
              kind: 'edit',
              label: `Editar proyecto ${item.id}`,
              onClick: () => onEdit(item.id)
            }
          ]}
        />
        <button
          type="button"
          className="secondary"
          onClick={() => onDownload(item.id)}
        >
          DOCX
        </button>
      </div>
    )
  }
]