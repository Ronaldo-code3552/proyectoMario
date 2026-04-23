import type { ReactNode } from 'react'
import EntityActionButtons, { type EntityActionConfig } from './EntityActionButtons'

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
  render: (row: T) => ReactNode
}

type Props<T> = {
  columns: Array<DataTableColumn<T>>
  rows: T[]
  getRowKey: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  className?: string
  tableClassName?: string
  rowClassName?: string | ((row: T) => string | undefined)
  onRowClick?: (row: T) => void
  rowActions?: (row: T) => EntityActionConfig[]
  actionsHeader?: ReactNode
  actionsClassName?: string
}

const joinClasses = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(' ')

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  loading = false,
  emptyMessage = 'No hay registros.',
  className,
  tableClassName,
  rowClassName,
  onRowClick,
  rowActions,
  actionsHeader = 'Acciones',
  actionsClassName = 'actions-col'
}: Props<T>) {
  const resolvedColumns: Array<DataTableColumn<T>> = rowActions
    ? [
        ...columns,
        {
          key: '__actions__',
          header: actionsHeader,
          className: actionsClassName,
          headerClassName: actionsClassName,
          cellClassName: actionsClassName,
          render: (row) => (
            <div onClick={(event) => event.stopPropagation()}>
              <EntityActionButtons actions={rowActions(row)} />
            </div>
          )
        }
      ]
    : columns

  return (
    <div className={joinClasses('data-table-wrap', className)}>
      <table className={joinClasses('data-table', tableClassName)}>
        <thead>
          <tr>
            {resolvedColumns.map((column) => (
              <th
                key={column.key}
                className={joinClasses(column.className, column.headerClassName)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={resolvedColumns.length} className="table-state">
                Cargando registros...
              </td>
            </tr>
          ) : null}

          {!loading && rows.length === 0 ? (
            <tr>
              <td colSpan={resolvedColumns.length} className="table-state">
                {emptyMessage}
              </td>
            </tr>
          ) : null}

          {!loading
            ? rows.map((row) => {
                const resolvedRowClassName =
                  typeof rowClassName === 'function' ? rowClassName(row) : rowClassName

                return (
                  <tr
                    key={getRowKey(row)}
                    className={joinClasses(onRowClick ? 'is-clickable' : '', resolvedRowClassName)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {resolvedColumns.map((column) => (
                      <td
                        key={column.key}
                        className={joinClasses(column.className, column.cellClassName)}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                )
              })
            : null}
        </tbody>
      </table>
    </div>
  )
}