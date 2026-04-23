import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  asignarGerenteGeneral,
  afiliarAccionistaExistente,
  createEmpresa,
  deleteEmpresa,
  getEmpresaById,
  saveAccionistas,
  saveEmpresaReportes,
  updateEmpresa
} from './empresa/api'
import {
  createPersona,
  deletePersona,
  getPersonaById,
  savePersonaReportes,
  updatePersona
} from './persona/api'
import {
  createProyecto,
  deleteProyecto,
  downloadProyectoDocxV2,
  getProyectoById,
  updateProyecto
} from './proyecto/api'

import type { AccionistaDraft } from './accionistas'
import { getEmpresaEntityId, getEmpresaSujetoId } from './empresa/identifiers'
import { getPersonaEntityId, getPersonaSujetoId } from './persona/identifiers'
import { buildEmpresaSubmitPayload } from './empresa/payload'
import { buildPersonaSubmitPayload } from './persona/payload'
import {
  cloneEmpresaDefaultValues,
  clonePersonaDefaultValues,
  cloneProyectoDefaultValues,
  empresaDefaultValues,
  mapEmpresaDetailToFormValues,
  mapPersonaDetailToFormValues,
  mapProyectoDetailToFormValues,
  personaDefaultValues,
  proyectoDefaultValues
} from './defaults'

import {
  emptyEmpresaReportesState,
  emptyPersonaReportesState,
  type EmpresaReportesState,
  type PersonaReportesState
} from './reportes'
import {
  empresaSchema,
  personaSchema,
  proyectoSchema,
  type EmpresaFormValues,
  type PersonaFormValues,
  type ProyectoFormValues
} from './schemas'

export type WorkspaceState = {
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

export function useProyectoWorkspace() {
  const [state, setState] = useState<WorkspaceState>({})
  const [globalError, setGlobalError] = useState('')
  const [globalSuccess, setGlobalSuccess] = useState('')
  const [globalWarning, setGlobalWarning] = useState('')
  const [docxLoading, setDocxLoading] = useState(false)
  const [empresaReportesLoading, setEmpresaReportesLoading] = useState(false)
  const [personaReportesLoading, setPersonaReportesLoading] = useState(false)
  const [accionistasLoading, setAccionistasLoading] = useState(false)
  const [empresaReportes, setEmpresaReportes] = useState<EmpresaReportesState>(emptyEmpresaReportesState())
  const [personaReportes, setPersonaReportes] = useState<PersonaReportesState>(emptyPersonaReportesState())
  const [accionistas, setAccionistas] = useState<AccionistaDraft[]>([])

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
    defaultValues: proyectoDefaultValues
  })

  const clearMessages = () => {
    setGlobalError('')
    setGlobalSuccess('')
    setGlobalWarning('')
  }

  const pushSuccess = (message: string) => {
    setGlobalError('')
    setGlobalWarning('')
    setGlobalSuccess(message)
    toast.success(message)
  }

  const pushError = (message: string) => {
    setGlobalSuccess('')
    setGlobalWarning('')
    setGlobalError(message)
    toast.error(message)
  }

  const pushWarning = (message: string) => {
    setGlobalSuccess('')
    setGlobalError('')
    setGlobalWarning(message)
    toast.warning(message)
  }

  const refreshCurrentEmpresaContext = async () => {
    const currentEmpresaId = state.empresaId ?? state.empresaSujetoId

    if (!currentEmpresaId) return null

    const detail = await getEmpresaById(currentEmpresaId)

    setState((prev) => ({
      ...prev,
      empresaId: getEmpresaEntityId(detail),
      empresaSujetoId: getEmpresaSujetoId(detail),
      empresaRaw: detail
    }))

    return detail
  }

  const refreshCurrentProyectoContext = async () => {
    if (!state.proyectoId) return null

    const detail = await getProyectoById(state.proyectoId)

    setState((prev) => ({
      ...prev,
      proyectoId: detail.id ?? detail.proyecto?.id ?? prev.proyectoId,
      proyectoRaw: detail,
      empresaSujetoId:
        detail.proyecto?.empresaPrincipalSujetoId ??
        detail.empresaPrincipal?.sujetoId ??
        prev.empresaSujetoId
    }))

    return detail
  }

  const submitEmpresa = async (values: EmpresaFormValues) => {
    clearMessages()

    try {
      const payload = buildEmpresaSubmitPayload(values)

      const empresaRecordId = state.empresaId ?? state.empresaSujetoId

      const result = empresaRecordId
        ? await updateEmpresa(empresaRecordId, payload)
        : await createEmpresa(payload)

      const resolvedEmpresaId = result.empresaId ?? result.empresaSujetoId
      const resolvedEmpresaSujetoId = result.empresaSujetoId ?? result.empresaId

      if (!resolvedEmpresaId || !resolvedEmpresaSujetoId) {
        pushError('No se pudieron resolver empresaId y empresaSujetoId en la respuesta del backend.')
        return null
      }

      setState((prev) => ({
        ...prev,
        empresaId: resolvedEmpresaId,
        empresaSujetoId: resolvedEmpresaSujetoId,
        empresaRaw: result.raw
      }))

      pushSuccess(
        empresaRecordId
          ? 'Empresa actualizada correctamente.'
          : 'Empresa creada correctamente.'
      )

      return result.raw?.data ?? null
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo guardar la empresa.')
      return null
    }
  }

  const saveEmpresa = empresaForm.handleSubmit(submitEmpresa)

  const loadEmpresaIntoWorkspace = async (empresaId: number) => {
    clearMessages()

    try {
      const detail = await getEmpresaById(empresaId)

      if (!detail?.id) {
        pushError('No se pudo cargar el detalle de la empresa.')
        return null
      }

      empresaForm.reset(mapEmpresaDetailToFormValues(detail))
      setEmpresaReportes(emptyEmpresaReportesState())

      setState((prev) => ({
        ...prev,
        empresaId: getEmpresaEntityId(detail),
        empresaSujetoId: getEmpresaSujetoId(detail),
        empresaRaw: detail
      }))

      pushSuccess('Empresa cargada en el flujo correctamente.')
      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo cargar la empresa.')
      return null
    }
  }

  const startNewEmpresa = () => {
    clearMessages()
    empresaForm.reset(cloneEmpresaDefaultValues())
    setEmpresaReportes(emptyEmpresaReportesState())
    setState((prev) => ({
      ...prev,
      empresaId: undefined,
      empresaSujetoId: undefined,
      empresaRaw: undefined
    }))
  }

  const removeEmpresa = async (empresaId: number, force = false) => {
    clearMessages()

    try {
      const result = await deleteEmpresa(empresaId, force)

      if (!result?.ok) {
        pushError(result?.message ?? 'No se pudo eliminar la empresa.')
        return result
      }

      pushSuccess(result?.message ?? 'Empresa eliminada correctamente.')

      if (state.empresaId === empresaId || state.empresaSujetoId === empresaId) {
        startNewEmpresa()
      }

      return result
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo eliminar la empresa.')
      return null
    }
  }

  const saveEmpresaReportesStep = async () => {
    clearMessages()

    if (!state.empresaSujetoId) {
      pushWarning('Primero necesitas crear la empresa.')
      return false
    }

    try {
      setEmpresaReportesLoading(true)
      await saveEmpresaReportes(state.empresaSujetoId, empresaReportes)
      pushSuccess('Reportes de empresa guardados correctamente.')
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudieron guardar los reportes de empresa.')
      return false
    } finally {
      setEmpresaReportesLoading(false)
    }
  }

  const submitEmpresaDebtProfile = async (values: EmpresaFormValues) => {
    clearMessages()

    try {
      setEmpresaReportesLoading(true)

      const payload = buildEmpresaSubmitPayload(values)

      const empresaRecordId = state.empresaId ?? state.empresaSujetoId

      const result = empresaRecordId
        ? await updateEmpresa(empresaRecordId, payload)
        : await createEmpresa(payload)

      const resolvedEmpresaId = result.empresaId ?? result.empresaSujetoId
      const resolvedEmpresaSujetoId = result.empresaSujetoId ?? result.empresaId

      if (!resolvedEmpresaId || !resolvedEmpresaSujetoId) {
        pushError('No se pudieron resolver empresaId y empresaSujetoId en la respuesta del backend.')
        return null
      }

      if (
        empresaReportes.sunatDeudas.length > 0 ||
        empresaReportes.sunatOmisiones.length > 0 ||
        empresaReportes.representantesLegales.length > 0 ||
        empresaReportes.reportesExpediente.length > 0 ||
        empresaReportes.reportesListaSimple.length > 0 ||
        empresaReportes.reportesMinisterioVivienda.length > 0
      ) {
        await saveEmpresaReportes(resolvedEmpresaSujetoId, empresaReportes)
      }

      const detail = await getEmpresaById(resolvedEmpresaId)

      setState((prev) => ({
        ...prev,
        empresaId: getEmpresaEntityId(detail),
        empresaSujetoId: getEmpresaSujetoId(detail),
        empresaRaw: detail
      }))

      setEmpresaReportes(emptyEmpresaReportesState())
      pushSuccess('Panel de deudas y reportes de empresa guardado correctamente.')
      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo guardar el perfil financiero.')
      return null
    } finally {
      setEmpresaReportesLoading(false)
    }
  }

  const submitPersona = async (values: PersonaFormValues) => {
    clearMessages()

    try {
      const payload = buildPersonaSubmitPayload(values)
      const personaRecordId = state.personaId ?? state.personaSujetoId

      const result = personaRecordId
        ? await updatePersona(personaRecordId, payload)
        : await createPersona(payload)

      if (!result.personaSujetoId) {
        pushError('No se encontró personaSujetoId en la respuesta del backend.')
        return null
      }

      const detail = await getPersonaById(result.personaId ?? result.personaSujetoId)

      personaForm.reset(mapPersonaDetailToFormValues(detail))

      setState((prev) => ({
        ...prev,
        personaId: getPersonaEntityId(detail),
        personaSujetoId: getPersonaSujetoId(detail),
        personaRaw: detail
      }))

      pushSuccess(
        personaRecordId
          ? 'Persona actualizada correctamente.'
          : 'Persona creada correctamente.'
      )

      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo guardar la persona.')
      return null
    }
  }

  const savePersona = personaForm.handleSubmit(submitPersona)

  const loadPersonaIntoWorkspace = async (personaId: number) => {
    clearMessages()

    try {
      const detail = await getPersonaById(personaId)

      if (!detail?.id) {
        pushError('No se pudo cargar el detalle de la persona.')
        return null
      }

      personaForm.reset(mapPersonaDetailToFormValues(detail))
      setPersonaReportes(emptyPersonaReportesState())

      setState((prev) => ({
        ...prev,
        personaId: getPersonaEntityId(detail),
        personaSujetoId: getPersonaSujetoId(detail),
        personaRaw: detail
      }))

      pushSuccess('Persona cargada en el flujo correctamente.')
      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo cargar la persona.')
      return null
    }
  }

  const startNewPersona = () => {
    clearMessages()
    personaForm.reset(clonePersonaDefaultValues())
    setPersonaReportes(emptyPersonaReportesState())
    setState((prev) => ({
      ...prev,
      personaId: undefined,
      personaSujetoId: undefined,
      personaRaw: undefined
    }))
  }

  const removePersona = async (personaId: number, force = false) => {
    clearMessages()

    try {
      const result = await deletePersona(personaId, force)

      if (!result?.ok) {
        pushError(result?.message ?? 'No se pudo eliminar la persona.')
        return result
      }

      pushSuccess(result?.message ?? 'Persona eliminada correctamente.')

      if (state.personaId === personaId || state.personaSujetoId === personaId) {
        startNewPersona()
      }

      return result
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo eliminar la persona.')
      return null
    }
  }

  const savePersonaReportesStep = async () => {
    clearMessages()

    if (!state.personaSujetoId) {
      pushWarning('Primero necesitas crear o cargar la persona.')
      return false
    }

    try {
      setPersonaReportesLoading(true)
      await savePersonaReportes(state.personaSujetoId, personaReportes)
      pushSuccess('Reportes de persona guardados correctamente.')
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudieron guardar los reportes de persona.')
      return false
    } finally {
      setPersonaReportesLoading(false)
    }
  }

  const submitProyecto = async (values: ProyectoFormValues) => {
    clearMessages()

    try {
      if (!values.proyecto.empresaPrincipalSujetoId || values.proyecto.empresaPrincipalSujetoId <= 0) {
        pushWarning('Selecciona una empresa principal válida antes de guardar el proyecto.')
        return null
      }

      const isUpdate = Boolean(state.proyectoId)

      const result = isUpdate
        ? await updateProyecto(state.proyectoId as number, values)
        : await createProyecto(values)

      if (!result.proyectoId) {
        pushError('No se encontró proyectoId en la respuesta del backend.')
        return null
      }

      const detail = await getProyectoById(result.proyectoId)

      proyectoForm.reset(mapProyectoDetailToFormValues(detail))

      setState((prev) => ({
        ...prev,
        proyectoId: detail.id ?? detail.proyecto?.id ?? result.proyectoId,
        proyectoRaw: detail,
        empresaSujetoId:
          detail.proyecto?.empresaPrincipalSujetoId ??
          detail.empresaPrincipal?.sujetoId ??
          prev.empresaSujetoId
      }))

      pushSuccess(
        isUpdate
          ? 'Proyecto actualizado correctamente.'
          : 'Proyecto creado correctamente.'
      )

      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo guardar el proyecto.')
      return null
    }
  }

  const saveProyecto = proyectoForm.handleSubmit(submitProyecto)

  const assignGerenteGeneralStep = async (params: {
    personaId?: number
    personaSujetoId: number
    observacion?: string
  }) => {
    clearMessages()

    if (!state.empresaSujetoId || !state.proyectoId) {
      pushWarning('Primero necesitas tener empresa y proyecto activos en el flujo.')
      return false
    }

    try {
      await asignarGerenteGeneral({
        empresaSujetoId: state.empresaSujetoId,
        personaSujetoId: params.personaSujetoId,
        proyectoId: state.proyectoId,
        observacion: params.observacion ?? 'Gerente general principal del proyecto'
      })

      await refreshCurrentEmpresaContext()
      await refreshCurrentProyectoContext()

      pushSuccess('Gerente general asignado correctamente.')
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo asignar el gerente general.')
      return false
    }
  }

  const affiliateExistingAccionistaStep = async (params: {
    accionistaId?: number
    accionistaSujetoId: number
    tipo: 'NATURAL' | 'JURIDICA'
    ordenLista?: number
    observacion?: string
  }) => {
    clearMessages()

    if (!state.empresaSujetoId || !state.proyectoId) {
      pushWarning('Primero necesitas tener empresa y proyecto activos en el flujo.')
      return false
    }

    try {
      await afiliarAccionistaExistente(state.empresaSujetoId, {
        accionistaSujetoId: params.accionistaSujetoId,
        proyectoId: state.proyectoId,
        ordenLista: params.ordenLista,
        observacion: params.observacion,
        payloadContexto: params.tipo === 'JURIDICA' ? { tipo: 'JURIDICA' } : undefined
      })

      await refreshCurrentEmpresaContext()
      await refreshCurrentProyectoContext()

      pushSuccess(
        params.tipo === 'JURIDICA'
          ? 'Accionista jurídico afiliado correctamente.'
          : 'Accionista natural afiliado correctamente.'
      )
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo afiliar el accionista.')
      return false
    }
  }

  const loadProyectoIntoWorkspace = async (proyectoId: number) => {
    clearMessages()

    try {
      const detail = await getProyectoById(proyectoId)

      if (!detail?.id && !detail?.proyecto?.id) {
        pushError('No se pudo cargar el detalle del proyecto.')
        return null
      }

      proyectoForm.reset(mapProyectoDetailToFormValues(detail))

      setState((prev) => ({
        ...prev,
        proyectoId: detail.id ?? detail.proyecto?.id,
        proyectoRaw: detail,
        empresaSujetoId:
          detail.proyecto?.empresaPrincipalSujetoId ??
          detail.empresaPrincipal?.sujetoId ??
          prev.empresaSujetoId
      }))

      pushSuccess('Proyecto cargado en el flujo correctamente.')
      return detail
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo cargar el proyecto.')
      return null
    }
  }

  const startNewProyecto = () => {
    clearMessages()

    proyectoForm.reset(cloneProyectoDefaultValues())

    setState((prev) => ({
      ...prev,
      proyectoId: undefined,
      proyectoRaw: undefined
    }))
  }

  const removeProyecto = async (proyectoId: number) => {
    clearMessages()

    try {
      const result = await deleteProyecto(proyectoId)

      if (!result?.ok) {
        pushError(result?.message ?? 'No se pudo eliminar el proyecto.')
        return result
      }

      pushSuccess(result?.message ?? 'Proyecto eliminado correctamente.')

      if (state.proyectoId === proyectoId) {
        startNewProyecto()
      }

      return result
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo eliminar el proyecto.')
      return null
    }
  }

  const downloadProyectoDocxById = async (proyectoId: number) => {
    clearMessages()
    setDocxLoading(true)

    try {
      const { blob, fileName } = await downloadProyectoDocxV2(proyectoId)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setState((prev) => ({
        ...prev,
        proyectoId,
        docxRaw: {
          version: 'v2',
          downloaded: true,
          fileName
        }
      }))

      pushSuccess('Documento V2 descargado correctamente.')
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? 'No se pudo descargar el DOCX V2.')
      return false
    } finally {
      setDocxLoading(false)
    }
  }

  const handleGenerateDocx = async () => {
    if (!state.proyectoId) return
    await downloadProyectoDocxById(state.proyectoId)
  }

  const saveAccionistasStep = async () => {
    clearMessages()

    if (!state.empresaSujetoId || !state.proyectoId) {
      pushWarning('Primero necesitas crear la empresa y el proyecto.')
      return false
    }

    try {
      setAccionistasLoading(true)
      await saveAccionistas(state.empresaSujetoId, state.proyectoId, accionistas)
      pushSuccess('Accionistas guardados correctamente.')
      return true
    } catch (error: any) {
      pushError(error?.response?.data?.detail ?? error?.message ?? 'No se pudieron guardar los accionistas.')
      return false
    } finally {
      setAccionistasLoading(false)
    }
  }

  return {
    accionistas,
    accionistasLoading,
    clearMessages,
    docxLoading,
    empresaForm,
    empresaReportes,
    empresaReportesLoading,
    globalError,
    globalSuccess,
    globalWarning,
    handleGenerateDocx,
    loadEmpresaIntoWorkspace,
    loadPersonaIntoWorkspace,
    loadProyectoIntoWorkspace,
    personaForm,
    personaReportes,
    personaReportesLoading,
    proyectoForm,
    removeEmpresa,
    removePersona,
    removeProyecto,
    saveAccionistasStep,
    assignGerenteGeneralStep,
    affiliateExistingAccionistaStep,
    submitEmpresaDebtProfile,
    saveEmpresa,
    saveEmpresaReportesStep,
    savePersona,
    savePersonaReportesStep,
    saveProyecto,
    setAccionistas,
    setEmpresaReportes,
    setPersonaReportes,
    startNewEmpresa,
    startNewPersona,
    startNewProyecto,
    state,
    submitEmpresa,
    submitPersona,
    submitProyecto,
    downloadProyectoDocxById
  }
}
