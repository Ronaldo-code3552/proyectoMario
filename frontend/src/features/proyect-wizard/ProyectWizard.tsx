import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  empresaSchema,
  personaSchema,
  proyectoSchema,
  type EmpresaFormValues,
  type PersonaFormValues,
  type ProyectoFormValues
} from './schemas'
import {
  asignarGerenteGeneral,
  createEmpresa,
  createPersona,
  createProyecto,
  generateProyectoDocx,
  saveEmpresaReportes,
  savePersonaReportes,
  saveAccionistas
} from './api'
import EmpresaReportesStep from './EmpresaReportesStep'
import PersonaReportesStep from './PersonaReportesStep'
import AccionistasStep from './AccionistasStep'
import {
  emptyEmpresaReportesState,
  emptyPersonaReportesState,
  type EmpresaReportesState,
  type PersonaReportesState
} from './reportes'
import { createAccionistaDraft, type AccionistaDraft } from './accionistas'

type WizardState = {
  empresaId?: number
  empresaSujetoId?: number
  personaId?: number
  personaSujetoId?: number
  proyectoId?: number
  empresaRaw?: unknown
  personaRaw?: unknown
  proyectoRaw?: unknown
  docxRaw?: unknown
}

const empresaDefaultValues: EmpresaFormValues = {
  sujeto: {
    jsonPathOrigen: '$.empresa',
    hashNegocio: '',
    scoreValor: '',
    nivelRiesgo: '',
    cantidadRiesgosNum: '',
    riesgosEstadoCalificacion: '',
    riesgosComportamientoPago: '',
    comportamiento13m: '',
    deudaTotalTexto: '',
    deudaTotalMonto: '',
    deudaTotalCredito: '',
    deudaTotalBanco: '',
    descripcionOtrasDeudas: ''
  },
  empresa: {
    nombreEmpresa: '',
    razonSocial: '',
    rucEmpresa: '',
    partidaPersonasJuridicas: '',
    partidaPersonasJuridicasDireccion: '',
    domicilioFiscal: '',
    fechaConstitucion: '',
    objetoSocialCodigo: '',
    objetoSocial: '',
    sumaNumero: '',
    sumaNumeroLetra: '',
    valorNominal: '',
    valorNominalNumero: '',
    capitalMonto: '',
    capitalMontoLetras: '',
    capitalNumAcciones: '',
    capitalValorNominal: '',
    capitalValorNominalLetras: '',
    sunatEstadoEmpresa: '',
    sunatCondicionEmpresa: '',
    sunatDeudaCoactiva: '',
    sunatDeudaMontoTotal: '',
    sunatOmisiones: '',
    sunatOmisionesMonto: '',
    sunatTrabajadoresMesFecha: '',
    sunatTrabajadoresAnioFecha: '',
    sunatTrabajadores: '',
    sunatPrestadores: '',
    representantesLegalesResumen: '',
    infoEstablecimientosAnexosSunat: false,
    cantidadEstablecimientos: '',
    nombresEstablecimientos: ''
  }
}

const personaDefaultValues: PersonaFormValues = {
  sujeto: {
    jsonPathOrigen: '$.empresa.gerente_general',
    hashNegocio: '',
    scoreValor: '',
    nivelRiesgo: '',
    cantidadRiesgosNum: '',
    riesgosEstadoCalificacion: '',
    riesgosComportamientoPago: '',
    comportamiento13m: '',
    deudaTotalTexto: '',
    deudaTotalMonto: '',
    deudaTotalCredito: '',
    deudaTotalBanco: '',
    descripcionOtrasDeudas: ''
  },
  persona: {
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    tipoDocumentoRaw: 'DNI',
    numeroDocumento: '',
    rucPersonal: '',
    domicilioFiscalPersonal: '',
    estadoContribuyente: '',
    condicionContribuyente: '',
    deudaPublicaSunat: '',
    omisionesTributariasSunat: '',
    nombreJsonRaw: '',
    gerenteNombreJsonRaw: '',
    gerenteNumeroDocumentoRaw: ''
  }
}

export default function ProyectoWizard() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>({})
  const [globalError, setGlobalError] = useState('')
  const [globalSuccess, setGlobalSuccess] = useState('')
  const [docxLoading, setDocxLoading] = useState(false)

  const [empresaReportes, setEmpresaReportes] = useState<EmpresaReportesState>(emptyEmpresaReportesState())
  const [personaReportes, setPersonaReportes] = useState<PersonaReportesState>(emptyPersonaReportesState())
  const [accionistas, setAccionistas] = useState<AccionistaDraft[]>([createAccionistaDraft(1)])

  const [empresaReportesLoading, setEmpresaReportesLoading] = useState(false)
  const [personaReportesLoading, setPersonaReportesLoading] = useState(false)
  const [accionistasLoading, setAccionistasLoading] = useState(false)

  const empresaForm = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresaDefaultValues
  })

  const personaForm = useForm<PersonaFormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: personaDefaultValues
  })

  const proyectoForm = useForm<ProyectoFormValues>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      proyecto: {
        empresaPrincipalSujetoId: 0,
        fecha1: '',
        textoProyectosNatural: '',
        cargaLoteId: 2,
        payloadOriginal: {
          fuente: 'frontend',
          origen: 'formulario_manual'
        }
      }
    }
  })

  const clearMessages = () => {
    setGlobalError('')
    setGlobalSuccess('')
  }

  const saveEmpresa = empresaForm.handleSubmit(async (values) => {
    clearMessages()

    try {
      const result = await createEmpresa(values)

      if (!result.empresaSujetoId) {
        setGlobalError('No se encontró empresaSujetoId en la respuesta del backend.')
        return
      }

      setState((prev) => ({
        ...prev,
        empresaId: result.empresaId,
        empresaSujetoId: result.empresaSujetoId,
        empresaRaw: result.raw
      }))

      proyectoForm.setValue('proyecto.empresaPrincipalSujetoId', result.empresaSujetoId)
      setGlobalSuccess('Empresa creada correctamente.')
      setStep(1)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudo crear la empresa.')
    }
  })

  const saveReportesEmpresaStep = async () => {
    clearMessages()

    if (!state.empresaSujetoId) {
      setGlobalError('Primero necesitas crear la empresa.')
      return
    }

    try {
      setEmpresaReportesLoading(true)
      await saveEmpresaReportes(state.empresaSujetoId, empresaReportes)
      setGlobalSuccess('Reportes de empresa guardados correctamente.')
      setStep(2)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudieron guardar los reportes de empresa.')
    } finally {
      setEmpresaReportesLoading(false)
    }
  }

  const savePersona = personaForm.handleSubmit(async (values) => {
    clearMessages()

    try {
      const result = await createPersona(values)

      if (!result.personaSujetoId) {
        setGlobalError('No se encontró personaSujetoId en la respuesta del backend.')
        return
      }

      setState((prev) => ({
        ...prev,
        personaId: result.personaId,
        personaSujetoId: result.personaSujetoId,
        personaRaw: result.raw
      }))

      setGlobalSuccess('Persona creada correctamente.')
      setStep(3)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudo crear la persona.')
    }
  })

  const saveReportesPersonaStep = async () => {
    clearMessages()

    if (!state.personaSujetoId) {
      setGlobalError('Primero necesitas crear la persona.')
      return
    }

    try {
      setPersonaReportesLoading(true)
      await savePersonaReportes(state.personaSujetoId, personaReportes)
      setGlobalSuccess('Reportes de persona guardados correctamente.')
      setStep(4)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudieron guardar los reportes de persona.')
    } finally {
      setPersonaReportesLoading(false)
    }
  }

  const saveProyecto = proyectoForm.handleSubmit(async (values) => {
    clearMessages()

    try {
      const result = await createProyecto(values)

      if (!result.proyectoId) {
        setGlobalError('No se encontró proyectoId en la respuesta del backend.')
        return
      }

      if (state.empresaSujetoId && state.personaSujetoId) {
        await asignarGerenteGeneral({
          empresaSujetoId: state.empresaSujetoId,
          personaSujetoId: state.personaSujetoId,
          proyectoId: result.proyectoId,
          observacion: 'Gerente general principal del proyecto'
        })
      }

      setState((prev) => ({
        ...prev,
        proyectoId: result.proyectoId,
        proyectoRaw: result.raw
      }))

      setGlobalSuccess('Proyecto creado y gerente asignado correctamente.')
      setStep(5)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudo crear el proyecto.')
    }
  })

  const saveAccionistasStep = async () => {
    clearMessages()

    if (!state.empresaSujetoId || !state.proyectoId) {
      setGlobalError('Primero necesitas crear la empresa y el proyecto.')
      return
    }

    try {
      setAccionistasLoading(true)
      await saveAccionistas(state.empresaSujetoId, state.proyectoId, accionistas)
      setGlobalSuccess('Accionistas guardados correctamente.')
      setStep(6)
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? error?.message ?? 'No se pudieron guardar los accionistas.')
    } finally {
      setAccionistasLoading(false)
    }
  }

  const handleGenerateDocx = async () => {
    if (!state.proyectoId) return

    clearMessages()
    setDocxLoading(true)

    try {
      const result = await generateProyectoDocx(state.proyectoId)
      setState((prev) => ({
        ...prev,
        docxRaw: result
      }))
      setGlobalSuccess('Documento generado correctamente.')
    } catch (error: any) {
      setGlobalError(error?.response?.data?.detail ?? 'No se pudo generar el DOCX.')
    } finally {
      setDocxLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Generador de Proyecto</h1>
        <p className="muted">Empresa + reportes empresa + persona + reportes persona + proyecto + accionistas + docx</p>

        <div className="steps">
          <div className={`step ${step === 0 ? 'active' : ''} ${step > 0 ? 'done' : ''}`}>1. Empresa</div>
          <div className={`step ${step === 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>2. Reportes Empresa</div>
          <div className={`step ${step === 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>3. Persona</div>
          <div className={`step ${step === 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>4. Reportes Persona</div>
          <div className={`step ${step === 4 ? 'active' : ''} ${step > 4 ? 'done' : ''}`}>5. Proyecto</div>
          <div className={`step ${step === 5 ? 'active' : ''} ${step > 5 ? 'done' : ''}`}>6. Accionistas</div>
          <div className={`step ${step === 6 ? 'active' : ''}`}>7. Resumen</div>
        </div>

        {globalError ? <div className="alert error">{globalError}</div> : null}
        {globalSuccess ? <div className="alert success">{globalSuccess}</div> : null}

        {step === 0 && (
          <form onSubmit={saveEmpresa} className="form-grid">
            <h2>Empresa principal</h2>

            <label>
              Razón social
              <input {...empresaForm.register('empresa.razonSocial')} />
            </label>

            <label>
              RUC
              <input {...empresaForm.register('empresa.rucEmpresa')} />
            </label>

            <label>
              Nombre comercial
              <input {...empresaForm.register('empresa.nombreEmpresa')} />
            </label>

            <label>
              Domicilio fiscal
              <input {...empresaForm.register('empresa.domicilioFiscal')} />
            </label>

            <label>
              Fecha de constitución
              <input type="date" {...empresaForm.register('empresa.fechaConstitucion')} />
            </label>

            <label>
              Objeto social
              <input {...empresaForm.register('empresa.objetoSocial')} />
            </label>

            <label>
              Score
              <input {...empresaForm.register('sujeto.scoreValor')} />
            </label>

            <label>
              Nivel de riesgo
              <input {...empresaForm.register('sujeto.nivelRiesgo')} />
            </label>

            <div className="actions">
              <button type="submit" disabled={empresaForm.formState.isSubmitting}>
                {empresaForm.formState.isSubmitting ? 'Guardando...' : 'Guardar empresa'}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <EmpresaReportesStep
            value={empresaReportes}
            onChange={setEmpresaReportes}
            onBack={() => setStep(0)}
            onNext={saveReportesEmpresaStep}
            loading={empresaReportesLoading}
          />
        )}

        {step === 2 && (
          <form onSubmit={savePersona} className="form-grid">
            <h2>Gerente general</h2>

            <label>
              Nombre completo
              <input {...personaForm.register('persona.nombreCompleto')} />
            </label>

            <label>
              Tipo documento
              <select {...personaForm.register('persona.tipoDocumento')}>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="PASAPORTE">PASAPORTE</option>
              </select>
            </label>

            <label>
              Número documento
              <input {...personaForm.register('persona.numeroDocumento')} />
            </label>

            <label>
              RUC personal
              <input {...personaForm.register('persona.rucPersonal')} />
            </label>

            <label>
              Domicilio fiscal
              <input {...personaForm.register('persona.domicilioFiscalPersonal')} />
            </label>

            <label>
              Score
              <input {...personaForm.register('sujeto.scoreValor')} />
            </label>

            <label>
              Nivel de riesgo
              <input {...personaForm.register('sujeto.nivelRiesgo')} />
            </label>

            <div className="actions">
              <button type="button" className="secondary" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button type="submit" disabled={personaForm.formState.isSubmitting}>
                {personaForm.formState.isSubmitting ? 'Guardando...' : 'Guardar persona'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <PersonaReportesStep
            value={personaReportes}
            onChange={setPersonaReportes}
            onBack={() => setStep(2)}
            onNext={saveReportesPersonaStep}
            loading={personaReportesLoading}
          />
        )}

        {step === 4 && (
          <form onSubmit={saveProyecto} className="form-grid">
            <h2>Proyecto</h2>

            <label>
              Empresa principal sujeto ID
              <input
                type="number"
                readOnly
                {...proyectoForm.register('proyecto.empresaPrincipalSujetoId', {
                  valueAsNumber: true
                })}
              />
            </label>

            <label>
              Fecha 1
              <input {...proyectoForm.register('proyecto.fecha1')} />
            </label>

            <label>
              Texto proyecto
              <input {...proyectoForm.register('proyecto.textoProyectosNatural')} />
            </label>

            <label>
              Carga lote ID
              <input
                type="number"
                {...proyectoForm.register('proyecto.cargaLoteId', {
                  valueAsNumber: true
                })}
              />
            </label>

            <div className="actions">
              <button type="button" className="secondary" onClick={() => setStep(3)}>
                Atrás
              </button>
              <button type="submit" disabled={proyectoForm.formState.isSubmitting}>
                {proyectoForm.formState.isSubmitting ? 'Guardando...' : 'Guardar proyecto'}
              </button>
            </div>
          </form>
        )}

        {step === 5 && (
          <AccionistasStep
            value={accionistas}
            onChange={setAccionistas}
            onBack={() => setStep(4)}
            onNext={saveAccionistasStep}
            loading={accionistasLoading}
          />
        )}

        {step === 6 && (
          <div className="summary">
            <h2>Resumen</h2>

            <div className="summary-grid">
              <div><strong>Empresa ID:</strong> {state.empresaId ?? '-'}</div>
              <div><strong>Empresa sujeto ID:</strong> {state.empresaSujetoId ?? '-'}</div>
              <div><strong>Persona ID:</strong> {state.personaId ?? '-'}</div>
              <div><strong>Persona sujeto ID:</strong> {state.personaSujetoId ?? '-'}</div>
              <div><strong>Proyecto ID:</strong> {state.proyectoId ?? '-'}</div>
              <div><strong>Cantidad de accionistas:</strong> {accionistas.length}</div>
            </div>

            <div className="actions">
              <button type="button" className="secondary" onClick={() => setStep(5)}>
                Atrás
              </button>
              <button type="button" onClick={handleGenerateDocx} disabled={!state.proyectoId || docxLoading}>
                {docxLoading ? 'Generando...' : 'Generar DOCX'}
              </button>
            </div>

            {state.docxRaw ? (
              <pre className="json-box">{JSON.stringify(state.docxRaw, null, 2)}</pre>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}