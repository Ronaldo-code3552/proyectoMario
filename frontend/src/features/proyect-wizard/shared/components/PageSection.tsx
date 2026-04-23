import type { ReactNode } from 'react'

type Props = {
  className?: string
  compact?: boolean
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
  headerActions?: ReactNode
  children: ReactNode
}

const joinClasses = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(' ')

export default function PageSection({
  className,
  compact = false,
  eyebrow,
  title,
  description,
  headerActions,
  children
}: Props) {
  const hasHeader = eyebrow || title || description || headerActions

  return (
    <section className={joinClasses('page-section', compact && 'compact', className)}>
      {hasHeader ? (
        <div className="section-head">
          <div className="section-copy">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {description ? <p className="muted">{description}</p> : null}
          </div>

          {headerActions ? (
            <div className="section-head-actions">
              {headerActions}
            </div>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  )
}
