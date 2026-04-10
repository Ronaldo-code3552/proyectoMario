import { api } from '../../lib/api'
import type { EmpresaReportesState,PersonaReportesState } from './reportes'
import type { AccionistaDraft } from './accionistas'
import type {
  EmpresaFormValues,
  PersonaFormValues,
  ProyectoFormValues
} from './schemas'

export const createEmpresa = async (payload: EmpresaFormValues) => {
  const { data } = await api.post('/empresas', payload)

  return {
    raw: data,
    empresaId: data?.data?.id,
    empresaSujetoId: data?.data?.sujeto?.id
  }
}

export const createPersona = async (payload: PersonaFormValues) => {
  const { data } = await api.post('/personas', payload)

  return {
    raw: data,
    personaId: data?.data?.id,
    personaSujetoId: data?.data?.sujeto?.id
  }
}

export const createProyecto = async (payload: ProyectoFormValues) => {
  const { data } = await api.post('/proyectos', payload)

  return {
    raw: data,
    proyectoId: data?.data?.id ?? data?.data?.proyecto?.id
  }
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

export const generateProyectoDocx = async (proyectoId: number) => {
  const { data } = await api.post(`/documents/proyectos/${proyectoId}/docx`)
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