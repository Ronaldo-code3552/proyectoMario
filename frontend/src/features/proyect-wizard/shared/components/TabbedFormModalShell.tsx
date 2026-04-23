import type { FormEvent, ReactNode } from 'react'

export type TabbedFormModalTab<K extends string> = {
  key: K
  label: ReactNode
  description?: ReactNode
}

type Props<K extends string> = {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  tabs: Array<TabbedFormModalTab<K>>
  activeTab: K
  onTabChange: (key: K) => void
  onClose: () => void
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void
  submitLabel: ReactNode
  submitting?: boolean
  children: ReactNode
  context?: ReactNode
  workspaceHeader?: ReactNode
  sidebarLabel?: string
  layoutMode?: 'default' | 'expanded'
  sidebarWidth?: string
}

const joinClasses = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(' ')

export default function TabbedFormModalShell<K extends string>({
  eyebrow,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  onClose,
  onSubmit,
  submitLabel,
  submitting = false,
  children,
  context,
  workspaceHeader,
  sidebarLabel = 'Navegación del formulario',
  layoutMode = 'default',
  sidebarWidth
}: Props<K>) {
  const isExpanded = layoutMode === 'expanded'
  const resolvedSidebarWidth = sidebarWidth ?? (isExpanded ? '236px' : '280px')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className={joinClasses('modal-card', 'modal-xl', isExpanded && 'modal-card-spacious')}
        onClick={(event) => event.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: isExpanded ? '94vh' : '92vh',
          width: isExpanded ? 'min(1480px, 98vw)' : 'min(1200px, 96vw)'
        }}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            {description ? <p className="muted">{description}</p> : null}
          </div>

          <button type="button" className="secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {context ? (
          <div
            className="modal-context"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              margin: '0 1.25rem 0.75rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.02)'
            }}
          >
            {context}
          </div>
        ) : null}

        <form
          onSubmit={(event) => onSubmit(event)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0
          }}
        >
          <div
            className={joinClasses('form-modal-layout', isExpanded && 'form-modal-layout-spacious')}
            style={{
              display: 'grid',
              gridTemplateColumns: `${resolvedSidebarWidth} minmax(0, 1fr)`,
              gap: isExpanded ? '1.25rem' : '1rem',
              flex: 1,
              minHeight: 0,
              padding: '0 1.25rem 1rem'
            }}
          >
            <aside
              className={joinClasses('form-tabs', isExpanded && 'form-tabs-spacious')}
              aria-label={sidebarLabel}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                minHeight: 0,
                overflowY: 'auto',
                paddingRight: isExpanded ? '0.5rem' : '0.75rem',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={joinClasses('form-tab', activeTab === tab.key && 'active')}
                  onClick={() => onTabChange(tab.key)}
                  style={{
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <strong>{tab.label}</strong>
                  {tab.description ? <span>{tab.description}</span> : null}
                </button>
              ))}
            </aside>

            <div
              className="form-tab-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
                gap: '0.75rem'
              }}
            >
              {workspaceHeader ? (
                <div
                  style={{
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {workspaceHeader}
                </div>
              ) : null}

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  paddingRight: isExpanded ? '0.75rem' : '0.25rem'
                }}
              >
                {children}
              </div>
            </div>
          </div>

          <div
            className="actions"
            style={{
              marginTop: 'auto',
              padding: '1rem 1.25rem 1.25rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <button type="button" className="secondary" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
