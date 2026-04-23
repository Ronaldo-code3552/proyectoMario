import type { PersonaDetail, PersonaListItem } from './types'

type PersonaLike = PersonaDetail | PersonaListItem | null | undefined

export const getPersonaEntityId = (detail: PersonaLike) => detail?.id

export const getPersonaSujetoId = (detail: PersonaLike) =>
  detail?.sujeto?.id ?? detail?.persona?.sujetoId ?? detail?.id

export const matchesPersonaWorkspace = (
  detail: PersonaLike,
  workspace: {
    personaId?: number
    personaSujetoId?: number
  }
) => {
  if (!detail) return false

  const entityId = getPersonaEntityId(detail)
  const sujetoId = getPersonaSujetoId(detail)

  return [entityId, sujetoId].some(
    (candidate) =>
      candidate !== undefined &&
      (candidate === workspace.personaId || candidate === workspace.personaSujetoId)
  )
}
