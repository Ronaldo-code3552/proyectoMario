import { api } from '../../../lib/api'
import type { AccionistaDraft } from '../accionistas'
import type { EmpresaReportesState } from '../reportes'
import type { EmpresaFormValues } from '../schemas'
import { createPersona, savePersonaReportes } from '../persona/api'
import type {
  EmpresaDetail,
  EmpresaListResponse
} from './types'

export type { EmpresaDetail, EmpresaListItem, EmpresaListResponse } from './types'

const normalizeEmpresaListResponse = (payload: any): EmpresaListResponse => ({
  data: Array.isArray(payload?.data) ? payload.data : [],
  totalRecords: Number(payload?.totalRecords ?? 0),
  pageNumber: Number(payload?.pageNumber ?? 1),
  pageSize: Number(payload?.pageSize ?? 20)
})

export const getEmpresas = async (params: {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}) => {
  const { data } = await api.get('/empresas', {
    params: {
      page_number: params.pageNumber ?? 1,
      page_size: params.pageSize ?? 10,
      search_term: params.searchTerm || undefined
    }
  })

  return normalizeEmpresaListResponse(data?.data)
}

export const getEmpresaById = async (empresaId: number) => {
  const { data } = await api.get(`/empresas/${empresaId}`)
  return data?.data as EmpresaDetail
}

export const createEmpresa = async (payload: EmpresaFormValues) => {
  const { data } = await api.post('/empresas', payload)

  return {
    raw: data,
    empresaId: data?.data?.id,
    empresaSujetoId: data?.data?.sujeto?.id
  }
}

export const updateEmpresa = async (empresaId: number, payload: EmpresaFormValues) => {
  const { data } = await api.put(`/empresas/${empresaId}`, payload)

  return {
    raw: data,
    empresaId: data?.data?.id,
    empresaSujetoId: data?.data?.sujeto?.id
  }
}

export const deleteEmpresa = async (empresaId: number, force = false) => {
  const { data } = await api.delete(`/empresas/${empresaId}`, {
    params: {
      force
    }
  })

  return data
}

export const asignarGerenteGeneral = async (payload: {
  empresaSujetoId: number
  personaSujetoId: number
  proyectoId?: number
  observacion?: string
}) => {
  const { data } = await api.post(
    `/empresas/${payload.empresaSujetoId}/gerente-general`,
    {
      personaSujetoId: payload.personaSujetoId,
      proyectoId: payload.proyectoId,
      observacion: payload.observacion ?? 'Gerente general principal del proyecto'
    }
  )

  return data
}

export const afiliarAccionistaExistente = async (
  empresaSujetoId: number,
  payload: {
    accionistaSujetoId: number
    proyectoId?: number
    ordenLista?: number
    observacion?: string
    payloadContexto?: Record<string, unknown>
  }
) => {
  const { data } = await api.post(`/empresas/${empresaSujetoId}/accionistas`, payload)
  return data
}

const postEmpresaSunatDeuda = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/sunat-deudas`, payload)
  return data
}

const postEmpresaSunatOmision = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/sunat-omisiones`, payload)
  return data
}

const postEmpresaRepresentanteLegal = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/representantes-legales`, payload)
  return data
}

const postEmpresaReporteExpediente = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/reportes-expediente`, payload)
  return data
}

const postEmpresaReporteListaSimple = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/reportes-lista-simple`, payload)
  return data
}

const postEmpresaReporteMinisterioVivienda = async (sujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${sujetoId}/reportes-ministerio-vivienda`, payload)
  return data
}

export const saveEmpresaReportes = async (
  sujetoId: number,
  reportes: EmpresaReportesState
) => {
  for (const item of reportes.sunatDeudas) {
    await postEmpresaSunatDeuda(sujetoId, item)
  }

  for (const item of reportes.sunatOmisiones) {
    await postEmpresaSunatOmision(sujetoId, item)
  }

  for (const item of reportes.representantesLegales) {
    await postEmpresaRepresentanteLegal(sujetoId, item)
  }

  for (const item of reportes.reportesExpediente) {
    await postEmpresaReporteExpediente(sujetoId, item)
  }

  for (const item of reportes.reportesListaSimple) {
    await postEmpresaReporteListaSimple(sujetoId, item)
  }

  for (const item of reportes.reportesMinisterioVivienda) {
    await postEmpresaReporteMinisterioVivienda(sujetoId, item)
  }

  return { ok: true }
}

const postAccionista = async (empresaSujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${empresaSujetoId}/accionistas`, payload)
  return data
}

const postAccionistaInterno = async (empresaSujetoId: number, payload: any) => {
  const { data } = await api.post(`/empresas/${empresaSujetoId}/accionistas-internos`, payload)
  return data
}

export const saveAccionistas = async (
  empresaPrincipalSujetoId: number,
  proyectoId: number,
  accionistas: AccionistaDraft[]
) => {
  for (const accionista of accionistas) {
    if (accionista.tipo === 'NATURAL') {
      const natural = await createPersona(accionista.natural.data)

      if (!natural.personaSujetoId) {
        throw new Error('No se pudo obtener personaSujetoId del accionista natural.')
      }

      await savePersonaReportes(
        natural.personaSujetoId,
        accionista.natural.reportes
      )

      await postAccionista(empresaPrincipalSujetoId, {
        accionistaSujetoId: natural.personaSujetoId,
        proyectoId,
        ordenLista: accionista.ordenLista,
        observacion: accionista.observacion || 'Accionista natural'
      })
    }

    if (accionista.tipo === 'JURIDICA') {
      const juridica = await createEmpresa(accionista.juridica.data)

      if (!juridica.empresaSujetoId) {
        throw new Error('No se pudo obtener empresaSujetoId del accionista jurídico.')
      }

      await saveEmpresaReportes(
        juridica.empresaSujetoId,
        accionista.juridica.reportes
      )

      await postAccionista(empresaPrincipalSujetoId, {
        accionistaSujetoId: juridica.empresaSujetoId,
        proyectoId,
        ordenLista: accionista.ordenLista,
        observacion: accionista.observacion || 'Accionista jurídico',
        payloadContexto: {
          tipo: 'JURIDICA'
        }
      })

      for (let i = 0; i < accionista.juridica.internos.length; i++) {
        const internoDraft = accionista.juridica.internos[i]

        const interno = await createPersona(internoDraft.data)

        if (!interno.personaSujetoId) {
          throw new Error('No se pudo obtener personaSujetoId del accionista interno.')
        }

        await savePersonaReportes(
          interno.personaSujetoId,
          internoDraft.reportes
        )

        await postAccionistaInterno(juridica.empresaSujetoId, {
          personaSujetoId: interno.personaSujetoId,
          proyectoId,
          ordenLista: i + 1,
          observacion: `Accionista interno ${i + 1}`
        })
      }
    }
  }

  return { ok: true }
}
