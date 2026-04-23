import type { ReactNode } from 'react'

export type SummaryGridItem = {
  key: string
  label: ReactNode
  value: ReactNode
}

type Props = {
  items: SummaryGridItem[]
  emptyText?: ReactNode
}

export default function SummaryGrid({
  items,
  emptyText = '-'
}: Props) {
  return (
    <div className="summary-grid">
      {items.map((item) => (
        <div key={item.key}>
          <strong>{item.label}:</strong> {item.value ?? emptyText}
        </div>
      ))}
    </div>
  )
}