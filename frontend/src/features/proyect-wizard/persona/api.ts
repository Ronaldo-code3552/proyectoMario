import { api } from '../../../lib/api'
import type { PersonaReportesState } from '../reportes'
import type { PersonaFormValues } from '../schemas'
import type {
  PersonaCreateResult,
  PersonaDetail,
  PersonaListItem,
  PersonaListResponse
} from './types'

export type { PersonaDetail, PersonaListItem, PersonaListResponse } from './types'

const normalizePersonaListResponse = (payload: any): PersonaListResponse => ({
  data: Array.isArray(payload?.data) ? payload.data : [],
  totalRecords: Number(payload?.totalRecords ?? 0),
  pageNumber: Number(payload?.pageNumber ?? 1),
  pageSize: Number(payload?.pageSize ?? 20)
})

export const getPersonas = async (params: {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}) => {
  const { data } = await api.get('/personas', {
    params: {
      page_number: params.pageNumber ?? 1,
      page_size: params.pageSize ?? 10,
      search_term: params.searchTerm || undefined
    }
  })

  return normalizePersonaListResponse(data?.data)
}

export const getPersonaById = async (personaId: number) => {
  const { data } = await api.get(`/personas/${personaId}`)
  return data?.data as PersonaDetail
}

export const createPersona = async (payload: PersonaFormValues): Promise<PersonaCreateResult> => {
  const { data } = await api.post('/personas', payload)

  return {
    raw: data,
    personaId: data?.data?.id,
    personaSujetoId: data?.data?.sujeto?.id
  }
}

export const updatePersona = async (
  personaId: number,
  payload: PersonaFormValues
): Promise<PersonaCreateResult> => {
  const { data } = await api.put(`/personas/${personaId}`, payload)

  return {
    raw: data,
    personaId: data?.data?.id,
    personaSujetoId: data?.data?.sujeto?.id
  }
}

export const deletePersona = async (personaId: number, force = false) => {
  const { data } = await api.delete(`/personas/${personaId}`, {
    params: {
      force
    }
  })

  return data
}

const postPersonaReporteExpediente = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/personas/${sujetoId}/reportes-expediente`, payload)
  return data
}

const postPersonaReporteListaSimple = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/personas/${sujetoId}/reportes-lista-simple`, payload)
  return data
}

const postPersonaReporteMinisterioVivienda = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/personas/${sujetoId}/reportes-ministerio-vivienda`, payload)
  return data
}

export const savePersonaReportes = async (
  sujetoId: number,
  reportes: PersonaReportesState
) => {
  for (const item of reportes.reportesExpediente) {
    await postPersonaReporteExpediente(sujetoId, item)
  }

  for (const item of reportes.reportesListaSimple) {
    await postPersonaReporteListaSimple(sujetoId, item)
  }

  for (const item of reportes.reportesMinisterioVivienda) {
    await postPersonaReporteMinisterioVivienda(sujetoId, item)
  }

  return { ok: true }
}