import { useCallback, useEffect, useState } from 'react'
import { getPersonaById, getPersonas, type PersonaDetail, type PersonaListItem } from './api'
import type { useProyectoWorkspace } from '../useProyectoWorkspace'
import type { PersonaFormValues } from '../schemas'

type Workspace = ReturnType<typeof useProyectoWorkspace>
export type PersonaPanelMode = 'browse' | 'detail' | 'create' | 'edit' | 'debts'

export function usePersonaPageController(workspace: Workspace) {
  const {
    loadPersonaIntoWorkspace,
    removePersona,
    savePersonaReportesStep,
    startNewPersona,
    state,
    submitPersona
  } = workspace

  const [personas, setPersonas] = useState<PersonaListItem[]>([])
  const [selectedPersona, setSelectedPersona] = useState<PersonaDetail | null>(null)
  const [panelMode, setPanelMode] = useState<PersonaPanelMode>('browse')
  const [listLoading, setListLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))

  const loadList = useCallback(
    async (nextPage = pageNumber, nextSearch = searchTerm) => {
      try {
        setListLoading(true)

        const result = await getPersonas({
          pageNumber: nextPage,
          pageSize,
          searchTerm: nextSearch
        })

        setPersonas(result.data)
        setTotalRecords(result.totalRecords)
      } finally {
        setListLoading(false)
      }
    },
    [pageNumber, pageSize, searchTerm]
  )

  const loadDetail = useCallback(async (personaId: number) => {
    try {
      setDetailLoading(true)
      const detail = await getPersonaById(personaId)
      setSelectedPersona(detail)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
  }, [loadList])

  const handleSearch = async () => {
    setPageNumber(1)
    await loadList(1, searchTerm)
  }

  const handleNewPersona = () => {
    startNewPersona()
    setSelectedPersona(null)
    setPanelMode('create')
  }

  const handleViewPersona = async (personaId: number) => {
    await loadDetail(personaId)
    setPanelMode('detail')
  }

  const handleEditPersona = async (personaId: number) => {
    const detail = await loadPersonaIntoWorkspace(personaId)

    if (!detail) return

    setSelectedPersona(detail)
    setPanelMode('edit')
  }

  const handleDebtPersona = async (personaId: number) => {
    const detail = await loadPersonaIntoWorkspace(personaId)

    if (!detail) return

    setSelectedPersona(detail)
    setPanelMode('debts')
  }

  const handleUsePersona = async (personaId: number) => {
    const detail = await loadPersonaIntoWorkspace(personaId)

    if (!detail) return

    setSelectedPersona(detail)
    setPanelMode('detail')
  }

  const handleDeletePersona = async (personaId: number) => {
    const confirmed = window.confirm(
      'Se intentará eliminar la persona. Si tiene dependencias, el sistema te lo avisará antes de forzar.'
    )

    if (!confirmed) return

    const result = await removePersona(personaId, false)

    if (!result) return

    if (result?.ok === false && result?.dependencias) {
      const forceConfirmed = window.confirm(
        'La persona tiene dependencias asociadas. ¿Deseas forzar la eliminación en cascada?'
      )

      if (!forceConfirmed) return

      const forced = await removePersona(personaId, true)

      if (!forced?.ok) return
    }

    if (selectedPersona?.id === personaId) {
      setSelectedPersona(null)
      setPanelMode('browse')
    }

    await loadList()
  }

  const handleSavePersona = async (values: PersonaFormValues) => {
    const detail = await submitPersona(values)

    if (!detail?.id) return

    setSelectedPersona(detail)
    setPanelMode('detail')
    await loadList()
  }

  const handleSavePersonaDebt = async () => {
    const ok = await savePersonaReportesStep()

    if (!ok) return false

    const currentPersonaId = state.personaId ?? selectedPersona?.id

    if (!currentPersonaId) {
      setPanelMode('detail')
      return true
    }

    const detail = await loadPersonaIntoWorkspace(currentPersonaId)

    if (detail) {
      setSelectedPersona(detail)
    }

    setPanelMode('detail')
    await loadList()
    return true
  }

  return {
    personas,
    selectedPersona,
    panelMode,
    listLoading,
    detailLoading,
    searchTerm,
    pageNumber,
    totalPages,
    totalRecords,
    setSearchTerm,
    setPageNumber,
    setPanelMode,
    loadDetail,
    handleViewPersona,
    handleSearch,
    handleNewPersona,
    handleEditPersona,
    handleDebtPersona,
    handleUsePersona,
    handleDeletePersona,
    handleSavePersona,
    handleSavePersonaDebt
  }
}
