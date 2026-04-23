import { useMemo, useState, type FormEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { EmpresaDetail } from '../api'
import type { EmpresaReportesState } from '../../reportes'
import type { EmpresaFormValues } from '../../schemas'
import PageSection from '../../shared/components/PageSection'
import EmpresaDebtProfileSection, { type EmpresaDebtSectionKey } from './EmpresaDebtProfileSection'
import { empresaDebtTabs } from '../config/debtTabs'

type Props = {
  form: UseFormReturn<EmpresaFormValues>
  selectedEmpresa: EmpresaDetail | null
  reportes: EmpresaReportesState
  onReportesChange: (value: EmpresaReportesState) => void
  onClose: () => void
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void
}

export default function EmpresaDebtPanelModal({
  form,
  selectedEmpresa,
  reportes,
  onReportesChange,
  onClose,
  onSubmit
}: Props) {
  const [activeTab, setActiveTab] = useState<EmpresaDebtSectionKey>('sunat')

  const tabs = useMemo(() => empresaDebtTabs, [])
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]

  const context = selectedEmpresa ? (
    <div
      className="modal-context"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        margin: 0
      }}
    >
      <div><strong>Empresa:</strong> {selectedEmpresa.empresa?.razonSocial ?? '-'}</div>
      <div><strong>RUC:</strong> {selectedEmpresa.empresa?.rucEmpresa ?? '-'}</div>
      <div><strong>Sujeto ID:</strong> {selectedEmpresa.sujeto?.id ?? selectedEmpresa.id}</div>
      <div><strong>Deudas registradas:</strong> {selectedEmpresa.deudasSunat?.length ?? 0}</div>
      <div><strong>Omisiones registradas:</strong> {selectedEmpresa.omisionesSunat?.length ?? 0}</div>
      <div><strong>Representantes registrados:</strong> {selectedEmpresa.representantesLegales?.length ?? 0}</div>
      <div><strong>Expedientes registrados:</strong> {selectedEmpresa.reportesExpediente?.length ?? 0}</div>
      <div><strong>Listas simples:</strong> {selectedEmpresa.reportesListaSimple?.length ?? 0}</div>
      <div><strong>Ministerio vivienda:</strong> {selectedEmpresa.reportesMinisterioVivienda?.length ?? 0}</div>
    </div>
  ) : null

  return (
    <PageSection
      eyebrow="Panel de deudas"
      title="Informacion pública de empresa y reportes"
      description="Este panel ya trabaja como pantalla principal del módulo Empresa. Aquí ordenamos las deudas y reportes públicos sin encerrarlos en un popup."
    >
      <form
        onSubmit={(event) => onSubmit(event)}
        style={{
          display: 'grid',
          gap: '1.25rem',
          minWidth: 0
        }}
      >
        <div className="actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
          <button type="button" className="secondary" onClick={onClose}>
            Volver al módulo Empresa
          </button>

          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar panel de deudas'}
          </button>
        </div>

        {context}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-start',
            minWidth: 0
          }}
        >
          <aside
            aria-label="Módulos de información pública de empresa"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flex: '0 0 220px',
              maxWidth: '220px',
              minWidth: 0,
              position: 'sticky',
              top: '24px'
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`form-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
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
            style={{
              flex: '1 1 720px',
              minWidth: 0
            }}
          >
            <EmpresaDebtProfileSection
              form={form}
              reportes={reportes}
              onChange={onReportesChange}
              section={activeTab}
              selectedEmpresa={selectedEmpresa}
              workspaceTitle={currentTab.workspaceTitle}
              workspaceDescription={currentTab.workspaceDescription}
            />
          </div>
        </div>

        <div
          className="actions"
          style={{
            borderTop: '1px solid rgba(124, 155, 180, 0.14)',
            paddingTop: '1rem'
          }}
        >
          <button type="button" className="secondary" onClick={onClose}>
            Volver
          </button>

          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar panel de deudas'}
          </button>
        </div>
      </form>
    </PageSection>
  )
}
