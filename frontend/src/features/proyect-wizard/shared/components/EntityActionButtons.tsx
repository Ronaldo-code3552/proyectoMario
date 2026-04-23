import {
  Eye,
  Pencil,
  Trash2,
  Wallet,
  CheckCircle2,
  Ban
} from 'lucide-react'

export type EntityActionTone = 'default' | 'danger'
export type EntityActionKind = 'view' | 'edit' | 'delete' | 'debt' | 'use' | 'cancel'

export type EntityActionConfig = {
  kind: EntityActionKind
  label: string
  onClick: () => void
  tone?: EntityActionTone
}

type Props = {
  actions: EntityActionConfig[]
}

const iconMap = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
  debt: Wallet,
  use: CheckCircle2,
  cancel: Ban
} satisfies Record<EntityActionKind, typeof Eye>

export default function EntityActionButtons({ actions }: Props) {
  return (
    <div className="icon-actions" role="group" aria-label="Acciones de fila">
      {actions.map((action) => {
        const Icon = iconMap[action.kind]

        return (
          <button
            key={`${action.kind}-${action.label}`}
            type="button"
            className={`icon-action ${action.tone === 'danger' ? 'danger' : ''}`}
            onClick={action.onClick}
            aria-label={action.label}
            title={action.label}
          >
            <Icon size={16} strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}