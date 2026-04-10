import type { AccionistaDraft } from './accionistas'
import { createAccionistaDraft, createInternoDraft } from './accionistas'
import EmpresaReportesStep from './EmpresaReportesStep'
import PersonaReportesStep from './PersonaReportesStep'

type Props = {
  value: AccionistaDraft[]
  onChange: (value: AccionistaDraft[]) => void
  onBack: () => void
  onNext: () => void
  loading?: boolean
}

export default function AccionistasStep({
  value,
  onChange,
  onBack,
  onNext,
  loading
}: Props) {
  const updateAccionistas = (next: AccionistaDraft[]) => onChange(next)

  const addAccionista = () => {
    updateAccionistas([...value, createAccionistaDraft(value.length + 1)])
  }

  const removeAccionista = (index: number) => {
    updateAccionistas(value.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: keyof AccionistaDraft, fieldValue: any) => {
    const next = [...value]
    next[index] = {
      ...next[index],
      [field]: fieldValue
    }
    updateAccionistas(next)
  }

  const updateNaturalDataField = (index: number, path: string, fieldValue: string) => {
    const next = [...value]
    const current = next[index]

    if (path.startsWith('persona.')) {
      const key = path.replace('persona.', '')
      current.natural = {
        ...current.natural,
        data: {
          ...current.natural.data,
          persona: {
            ...current.natural.data.persona,
            [key]: fieldValue
          }
        }
      }
    }

    if (path.startsWith('sujeto.')) {
      const key = path.replace('sujeto.', '')
      current.natural = {
        ...current.natural,
        data: {
          ...current.natural.data,
          sujeto: {
            ...current.natural.data.sujeto,
            [key]: fieldValue
          }
        }
      }
    }

    updateAccionistas(next)
  }

  const updateNaturalReportes = (index: number, reportes: ReturnType<typeof createAccionistaDraft>['natural']['reportes']) => {
    const next = [...value]
    next[index] = {
      ...next[index],
      natural: {
        ...next[index].natural,
        reportes
      }
    }
    updateAccionistas(next)
  }

  const updateJuridicaDataField = (index: number, path: string, fieldValue: string | boolean) => {
    const next = [...value]
    const current = next[index]

    if (path.startsWith('empresa.')) {
      const key = path.replace('empresa.', '')
      current.juridica = {
        ...current.juridica,
        data: {
          ...current.juridica.data,
          empresa: {
            ...current.juridica.data.empresa,
            [key]: fieldValue
          }
        }
      }
    }

    if (path.startsWith('sujeto.')) {
      const key = path.replace('sujeto.', '')
      current.juridica = {
        ...current.juridica,
        data: {
          ...current.juridica.data,
          sujeto: {
            ...current.juridica.data.sujeto,
            [key]: fieldValue
          }
        }
      }
    }

    updateAccionistas(next)
  }

  const updateJuridicaReportes = (index: number, reportes: ReturnType<typeof createAccionistaDraft>['juridica']['reportes']) => {
    const next = [...value]
    next[index] = {
      ...next[index],
      juridica: {
        ...next[index].juridica,
        reportes
      }
    }
    updateAccionistas(next)
  }

  const addInterno = (index: number) => {
    const next = [...value]
    next[index] = {
      ...next[index],
      juridica: {
        ...next[index].juridica,
        internos: [...next[index].juridica.internos, createInternoDraft()]
      }
    }
    updateAccionistas(next)
  }

  const removeInterno = (accionistaIndex: number, internoIndex: number) => {
    const next = [...value]
    next[accionistaIndex] = {
      ...next[accionistaIndex],
      juridica: {
        ...next[accionistaIndex].juridica,
        internos: next[accionistaIndex].juridica.internos.filter((_, i) => i !== internoIndex)
      }
    }
    updateAccionistas(next)
  }

  const updateInternoDataField = (
    accionistaIndex: number,
    internoIndex: number,
    path: string,
    fieldValue: string
  ) => {
    const next = [...value]
    const interno = next[accionistaIndex].juridica.internos[internoIndex]

    if (path.startsWith('persona.')) {
      const key = path.replace('persona.', '')
      next[accionistaIndex].juridica.internos[internoIndex] = {
        ...interno,
        data: {
          ...interno.data,
          persona: {
            ...interno.data.persona,
            [key]: fieldValue
          }
        }
      }
    }

    if (path.startsWith('sujeto.')) {
      const key = path.replace('sujeto.', '')
      next[accionistaIndex].juridica.internos[internoIndex] = {
        ...interno,
        data: {
          ...interno.data,
          sujeto: {
            ...interno.data.sujeto,
            [key]: fieldValue
          }
        }
      }
    }

    updateAccionistas(next)
  }

  const updateInternoReportes = (
    accionistaIndex: number,
    internoIndex: number,
    reportes: ReturnType<typeof createInternoDraft>['reportes']
  ) => {
    const next = [...value]
    next[accionistaIndex].juridica.internos[internoIndex] = {
      ...next[accionistaIndex].juridica.internos[internoIndex],
      reportes
    }
    updateAccionistas(next)
  }

  return (
    <div className="reportes-step">
      <div className="section-head">
        <h2>Accionistas</h2>
        <button type="button" onClick={addAccionista}>
          Agregar accionista
        </button>
      </div>

      {value.length === 0 ? (
        <div className="report-block">
          <p className="muted">No has agregado accionistas todavía.</p>
        </div>
      ) : null}

      {value.map((accionista, index) => (
        <section key={accionista.id} className="report-block">
          <div className="section-head">
            <h3>Accionista #{index + 1}</h3>
            <button type="button" className="danger" onClick={() => removeAccionista(index)}>
              Quitar
            </button>
          </div>

          <div className="mini-card">
            <select
              value={accionista.tipo}
              onChange={(e) => updateField(index, 'tipo', e.target.value)}
            >
              <option value="NATURAL">NATURAL</option>
              <option value="JURIDICA">JURIDICA</option>
            </select>

            <input
              placeholder="Observación"
              value={accionista.observacion}
              onChange={(e) => updateField(index, 'observacion', e.target.value)}
            />

            <input
              type="number"
              placeholder="Orden"
              value={accionista.ordenLista}
              onChange={(e) => updateField(index, 'ordenLista', Number(e.target.value))}
            />
          </div>

          {accionista.tipo === 'NATURAL' && (
            <div className="report-block inner-block">
              <h4>Persona natural completa</h4>

              <div className="mini-card">
                <input
                  placeholder="Nombre completo"
                  value={accionista.natural.data.persona.nombreCompleto}
                  onChange={(e) => updateNaturalDataField(index, 'persona.nombreCompleto', e.target.value)}
                />
                <select
                  value={accionista.natural.data.persona.tipoDocumento}
                  onChange={(e) => updateNaturalDataField(index, 'persona.tipoDocumento', e.target.value)}
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">PASAPORTE</option>
                </select>
                <input
                  placeholder="Número documento"
                  value={accionista.natural.data.persona.numeroDocumento}
                  onChange={(e) => updateNaturalDataField(index, 'persona.numeroDocumento', e.target.value)}
                />
                <input
                  placeholder="RUC personal"
                  value={accionista.natural.data.persona.rucPersonal}
                  onChange={(e) => updateNaturalDataField(index, 'persona.rucPersonal', e.target.value)}
                />
                <input
                  placeholder="Domicilio fiscal"
                  value={accionista.natural.data.persona.domicilioFiscalPersonal}
                  onChange={(e) => updateNaturalDataField(index, 'persona.domicilioFiscalPersonal', e.target.value)}
                />
              </div>

              <div className="mini-card">
                <input
                  placeholder="Estado contribuyente"
                  value={accionista.natural.data.persona.estadoContribuyente}
                  onChange={(e) => updateNaturalDataField(index, 'persona.estadoContribuyente', e.target.value)}
                />
                <input
                  placeholder="Condición contribuyente"
                  value={accionista.natural.data.persona.condicionContribuyente}
                  onChange={(e) => updateNaturalDataField(index, 'persona.condicionContribuyente', e.target.value)}
                />
                <input
                  placeholder="Score"
                  value={accionista.natural.data.sujeto.scoreValor}
                  onChange={(e) => updateNaturalDataField(index, 'sujeto.scoreValor', e.target.value)}
                />
                <input
                  placeholder="Nivel riesgo"
                  value={accionista.natural.data.sujeto.nivelRiesgo}
                  onChange={(e) => updateNaturalDataField(index, 'sujeto.nivelRiesgo', e.target.value)}
                />
                <input
                  placeholder="Banco deuda"
                  value={accionista.natural.data.sujeto.deudaTotalBanco}
                  onChange={(e) => updateNaturalDataField(index, 'sujeto.deudaTotalBanco', e.target.value)}
                />
              </div>

              <PersonaReportesStep
                value={accionista.natural.reportes}
                onChange={(reportes) => updateNaturalReportes(index, reportes)}
                hideActions
                title="Reportes del accionista natural"
              />
            </div>
          )}

          {accionista.tipo === 'JURIDICA' && (
            <div className="report-block inner-block">
              <h4>Empresa jurídica completa</h4>

              <div className="mini-card">
                <input
                  placeholder="Razón social"
                  value={accionista.juridica.data.empresa.razonSocial}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.razonSocial', e.target.value)}
                />
                <input
                  placeholder="RUC"
                  value={accionista.juridica.data.empresa.rucEmpresa}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.rucEmpresa', e.target.value)}
                />
                <input
                  placeholder="Nombre comercial"
                  value={accionista.juridica.data.empresa.nombreEmpresa}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.nombreEmpresa', e.target.value)}
                />
                <input
                  placeholder="Domicilio fiscal"
                  value={accionista.juridica.data.empresa.domicilioFiscal}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.domicilioFiscal', e.target.value)}
                />
                <input
                  placeholder="Fecha constitución"
                  value={accionista.juridica.data.empresa.fechaConstitucion}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.fechaConstitucion', e.target.value)}
                />
              </div>

              <div className="mini-card">
                <input
                  placeholder="Objeto social"
                  value={accionista.juridica.data.empresa.objetoSocial}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.objetoSocial', e.target.value)}
                />
                <input
                  placeholder="Objeto social código"
                  value={accionista.juridica.data.empresa.objetoSocialCodigo}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.objetoSocialCodigo', e.target.value)}
                />
                <input
                  placeholder="Capital monto"
                  value={accionista.juridica.data.empresa.capitalMonto}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.capitalMonto', e.target.value)}
                />
                <input
                  placeholder="Capital letras"
                  value={accionista.juridica.data.empresa.capitalMontoLetras}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.capitalMontoLetras', e.target.value)}
                />
                <input
                  placeholder="N° acciones"
                  value={accionista.juridica.data.empresa.capitalNumAcciones}
                  onChange={(e) => updateJuridicaDataField(index, 'empresa.capitalNumAcciones', e.target.value)}
                />
              </div>

              <div className="mini-card">
                <input
                  placeholder="Score"
                  value={accionista.juridica.data.sujeto.scoreValor}
                  onChange={(e) => updateJuridicaDataField(index, 'sujeto.scoreValor', e.target.value)}
                />
                <input
                  placeholder="Nivel riesgo"
                  value={accionista.juridica.data.sujeto.nivelRiesgo}
                  onChange={(e) => updateJuridicaDataField(index, 'sujeto.nivelRiesgo', e.target.value)}
                />
                <input
                  placeholder="Banco deuda"
                  value={accionista.juridica.data.sujeto.deudaTotalBanco}
                  onChange={(e) => updateJuridicaDataField(index, 'sujeto.deudaTotalBanco', e.target.value)}
                />
                <input
                  placeholder="Monto deuda"
                  value={accionista.juridica.data.sujeto.deudaTotalMonto}
                  onChange={(e) => updateJuridicaDataField(index, 'sujeto.deudaTotalMonto', e.target.value)}
                />
                <input
                  placeholder="Comportamiento 13m"
                  value={accionista.juridica.data.sujeto.comportamiento13m}
                  onChange={(e) => updateJuridicaDataField(index, 'sujeto.comportamiento13m', e.target.value)}
                />
              </div>

              <EmpresaReportesStep
                value={accionista.juridica.reportes}
                onChange={(reportes) => updateJuridicaReportes(index, reportes)}
                hideActions
                title="Reportes de la empresa jurídica"
              />

              <div className="section-head">
                <h4>Accionistas internos</h4>
                <button type="button" onClick={() => addInterno(index)}>
                  Agregar interno
                </button>
              </div>

              {accionista.juridica.internos.map((interno, internoIndex) => (
                <div key={`${accionista.id}-interno-${internoIndex}`} className="report-block inner-block">
                  <div className="section-head">
                    <h4>Interno #{internoIndex + 1}</h4>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => removeInterno(index, internoIndex)}
                    >
                      Quitar interno
                    </button>
                  </div>

                  <div className="mini-card">
                    <input
                      placeholder="Nombre completo"
                      value={interno.data.persona.nombreCompleto}
                      onChange={(e) =>
                        updateInternoDataField(index, internoIndex, 'persona.nombreCompleto', e.target.value)
                      }
                    />
                    <select
                      value={interno.data.persona.tipoDocumento}
                      onChange={(e) =>
                        updateInternoDataField(index, internoIndex, 'persona.tipoDocumento', e.target.value)
                      }
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">PASAPORTE</option>
                    </select>
                    <input
                      placeholder="Número documento"
                      value={interno.data.persona.numeroDocumento}
                      onChange={(e) =>
                        updateInternoDataField(index, internoIndex, 'persona.numeroDocumento', e.target.value)
                      }
                    />
                    <input
                      placeholder="RUC personal"
                      value={interno.data.persona.rucPersonal}
                      onChange={(e) =>
                        updateInternoDataField(index, internoIndex, 'persona.rucPersonal', e.target.value)
                      }
                    />
                    <input
                      placeholder="Score"
                      value={interno.data.sujeto.scoreValor}
                      onChange={(e) =>
                        updateInternoDataField(index, internoIndex, 'sujeto.scoreValor', e.target.value)
                      }
                    />
                  </div>

                  <PersonaReportesStep
                    value={interno.reportes}
                    onChange={(reportes) => updateInternoReportes(index, internoIndex, reportes)}
                    hideActions
                    title={`Reportes del interno #${internoIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <div className="actions">
        <button type="button" className="secondary" onClick={onBack}>
          Atrás
        </button>
        <button type="button" onClick={onNext} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar accionistas y seguir'}
        </button>
      </div>
    </div>
  )
}