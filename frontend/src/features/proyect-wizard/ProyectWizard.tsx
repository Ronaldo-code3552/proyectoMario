import { useState } from 'react'
import EmpresaPage from './empresa/EmpresaPage'
import PersonaPage from './persona/PersonaPage'
import ProyectoPage from './proyecto/ProyectoPage'
import { getProyectoGerenteSujetoId } from './proyecto/identifiers'
import type { ProyectoDetail } from './proyecto/types'
import { useProyectoWorkspace } from './useProyectoWorkspace'

type PageKey = 'empresa' | 'persona' | 'proyecto'

const pages: Array<{ key: PageKey; title: string; description: string }> = [
  {
    key: 'empresa',
    title: 'Empresa',
    description: 'Empresa principal, gerente general y accionistas'
  },
  {
    key: 'persona',
    title: 'Persona',
    description: 'Alta dedicada de personas naturales y sus reportes'
  },
  {
    key: 'proyecto',
    title: 'Proyecto',
    description: 'Proyecto afiliado a la empresa principal'
  }
]

export default function ProyectoWizard() {
  const [activePage, setActivePage] = useState<PageKey>('empresa')
  const workspace = useProyectoWorkspace()
  const currentProyecto = workspace.state.proyectoRaw as ProyectoDetail | undefined
  const gerenteProyectoSujetoId = getProyectoGerenteSujetoId(currentProyecto)

  return (
    <div className="page">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand-block">
            <span className="eyebrow">Mario Proyecto</span>
            <h2>Gestor de entidades</h2>
            <p className="muted">
              Reorganizamos el flujo en tres paginas funcionales para que el dominio no viva en
              una sola pantalla.
            </p>
          </div>

          <nav className="nav-list" aria-label="Paginas">
            {pages.map((page) => {
              const isActive = activePage === page.key

              return (
                <button
                  key={page.key}
                  type="button"
                  className={`nav-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActivePage(page.key)}
                >
                  <strong>{page.title}</strong>
                  <span>{page.description}</span>
                </button>
              )
            })}
          </nav>

          <div className="status-card">
            <div><strong>Empresa activa:</strong> {workspace.state.empresaSujetoId ?? '-'}</div>
            <div><strong>Persona activa:</strong> {workspace.state.personaSujetoId ?? '-'}</div>
            <div><strong>Gerente proyecto:</strong> {gerenteProyectoSujetoId ?? '-'}</div>
            <div><strong>Proyecto:</strong> {workspace.state.proyectoId ?? '-'}</div>
          </div>
        </aside>

        <main className="content">
          {activePage === 'empresa' && (
            <EmpresaPage
              workspace={workspace}
              onGoProyecto={() => setActivePage('proyecto')}
            />
          )}

          {activePage === 'persona' && (
            <PersonaPage
              workspace={workspace}
              onGoEmpresa={() => setActivePage('empresa')}
              onGoProyecto={() => setActivePage('proyecto')}
            />
          )}

          {activePage === 'proyecto' && (
            <ProyectoPage
              workspace={workspace}
              onGoEmpresa={() => setActivePage('empresa')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
