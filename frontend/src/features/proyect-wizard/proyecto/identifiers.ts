import type { ProyectoDetail } from './types'

export const getProyectoEntityId = (detail: ProyectoDetail | null | undefined) =>
  detail?.id ?? detail?.proyecto?.id

export const getProyectoEmpresaSujetoId = (detail: ProyectoDetail | null | undefined) =>
  detail?.proyecto?.empresaPrincipalSujetoId ?? detail?.empresaPrincipal?.sujetoId

export const getProyectoGerenteSujetoId = (detail: ProyectoDetail | null | undefined) =>
  detail?.gerenteGeneral?.sujeto?.id ?? detail?.gerenteGeneral?.persona?.sujetoId

export const matchesProyectoWorkspace = (
  detail: ProyectoDetail | null | undefined,
  workspace: {
    proyectoId?: number
    empresaSujetoId?: number
  }
) => {
  if (!detail) return false

  const proyectoId = getProyectoEntityId(detail)
  const empresaSujetoId = getProyectoEmpresaSujetoId(detail)

  if (proyectoId !== undefined && workspace.proyectoId !== undefined) {
    return proyectoId === workspace.proyectoId
  }

  return (
    empresaSujetoId !== undefined &&
    workspace.empresaSujetoId !== undefined &&
    empresaSujetoId === workspace.empresaSujetoId
  )
}
