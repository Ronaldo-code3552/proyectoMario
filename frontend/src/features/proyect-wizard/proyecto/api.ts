import { api } from '../../../lib/api'
import type { ProyectoFormValues } from '../schemas'
import type {
  ProyectoDetail,
  ProyectoListItem,
  ProyectoListResponse
} from './types'

export type { ProyectoDetail, ProyectoListItem, ProyectoListResponse } from './types'

const normalizeProyectoListResponse = (payload: any): ProyectoListResponse => ({
  data: Array.isArray(payload?.data) ? payload.data : [],
  totalRecords: Number(payload?.totalRecords ?? 0),
  pageNumber: Number(payload?.pageNumber ?? 1),
  pageSize: Number(payload?.pageSize ?? 20)
})

export const getProyectos = async (params: {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}) => {
  const { data } = await api.get('/proyectos', {
    params: {
      page_number: params.pageNumber ?? 1,
      page_size: params.pageSize ?? 10,
      search_term: params.searchTerm || undefined
    }
  })

  return normalizeProyectoListResponse(data?.data)
}

export const getProyectoById = async (proyectoId: number) => {
  const { data } = await api.get(`/proyectos/${proyectoId}`)
  return data?.data as ProyectoDetail
}

export const createProyecto = async (payload: ProyectoFormValues) => {
  const { data } = await api.post('/proyectos', payload)

  return {
    raw: data,
    proyectoId: data?.data?.id ?? data?.data?.proyecto?.id
  }
}

export const updateProyecto = async (proyectoId: number, payload: ProyectoFormValues) => {
  const { data } = await api.put(`/proyectos/${proyectoId}`, payload)

  return {
    raw: data,
    proyectoId: data?.data?.id ?? data?.data?.proyecto?.id
  }
}

export const deleteProyecto = async (proyectoId: number) => {
  const { data } = await api.delete(`/proyectos/${proyectoId}`)
  return data
}

export const downloadProyectoDocxV2 = async (proyectoId: number) => {
  const response = await api.post(
    `/documents/proyectos/${proyectoId}/docx/v2/download`,
    null,
    {
      responseType: 'blob'
    }
  )

  const blob = new Blob(
    [response.data],
    {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  )

  const contentDisposition = response.headers?.['content-disposition'] || ''
  const match = contentDisposition.match(/filename="?([^"]+)"?/i)
  const fileName = match?.[1] || `proyecto_${proyectoId}_v2.docx`

  return {
    blob,
    fileName
  }
}