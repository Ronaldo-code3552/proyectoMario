import type { EmpresaDetail } from './types'

export const getEmpresaEntityId = (detail: EmpresaDetail | null | undefined) =>
  detail?.id

export const getEmpresaSujetoId = (detail: EmpresaDetail | null | undefined) =>
  detail?.sujeto?.id ?? detail?.empresa?.sujetoId ?? detail?.id

export const matchesEmpresaWorkspace = (
  detail: EmpresaDetail | null | undefined,
  workspace: {
    empresaId?: number
    empresaSujetoId?: number
  }
) => {
  if (!detail) return false

  const entityId = getEmpresaEntityId(detail)
  const sujetoId = getEmpresaSujetoId(detail)

  return [entityId, sujetoId].some(
    (candidate) =>
      candidate !== undefined &&
      (candidate === workspace.empresaId || candidate === workspace.empresaSujetoId)
  )
}
