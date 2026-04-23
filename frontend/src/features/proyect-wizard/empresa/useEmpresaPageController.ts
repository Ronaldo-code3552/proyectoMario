import { useCallback, useEffect, useState } from 'react'
import { getEmpresaById, getEmpresas, type EmpresaDetail, type EmpresaListItem } from './api'
import type { useProyectoWorkspace } from '../useProyectoWorkspace'
import type { EmpresaFormValues } from '../schemas'

type Workspace = ReturnType<typeof useProyectoWorkspace>

export type EmpresaPanelMode = 'browse' | 'detail' | 'create' | 'edit' | 'debts'

export function useEmpresaPageController(workspace: Workspace) {
  const {
    loadEmpresaIntoWorkspace,
    removeEmpresa,
    startNewEmpresa,
    submitEmpresa,
    submitEmpresaDebtProfile
  } = workspace

  const [empresas, setEmpresas] = useState<EmpresaListItem[]>([])
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaDetail | null>(null)
  const [panelMode, setPanelMode] = useState<EmpresaPanelMode>('browse')
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

        const result = await getEmpresas({
          pageNumber: nextPage,
          pageSize,
          searchTerm: nextSearch
        })

        setEmpresas(result.data)
        setTotalRecords(result.totalRecords)
      } finally {
        setListLoading(false)
      }
    },
    [pageNumber, pageSize, searchTerm]
  )

  const loadDetail = useCallback(async (empresaId: number) => {
    try {
      setDetailLoading(true)
      const detail = await getEmpresaById(empresaId)
      setSelectedEmpresa(detail)
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

  const handleNewEmpresa = () => {
    startNewEmpresa()
    setSelectedEmpresa(null)
    setPanelMode('create')
  }

  const handleViewEmpresa = async (empresaId: number) => {
    await loadDetail(empresaId)
    setPanelMode('detail')
  }

  const handleEditEmpresa = async (empresaId: number) => {
    const detail = await loadEmpresaIntoWorkspace(empresaId)

    if (!detail) return

    setSelectedEmpresa(detail)
    setPanelMode('edit')
  }

  const handleDebtEmpresa = async (empresaId: number) => {
    const detail = await loadEmpresaIntoWorkspace(empresaId)

    if (!detail) return

    setSelectedEmpresa(detail)
    setPanelMode('debts')
  }

  const handleUseEmpresa = async (empresaId: number) => {
    const detail = await loadEmpresaIntoWorkspace(empresaId)

    if (!detail) return

    setSelectedEmpresa(detail)
    setPanelMode('detail')
  }

  const handleDeleteEmpresa = async (empresaId: number) => {
    const confirmed = window.confirm(
      'Se intentará eliminar la empresa. Si tiene dependencias, el sistema te lo avisará antes de forzar.'
    )

    if (!confirmed) return

    const result = await removeEmpresa(empresaId, false)

    if (!result) return

    if (result?.ok === false && result?.dependencias) {
      const forceConfirmed = window.confirm(
        'La empresa tiene dependencias asociadas. ¿Deseas forzar la eliminación en cascada?'
      )

      if (!forceConfirmed) return

      const forced = await removeEmpresa(empresaId, true)

      if (!forced?.ok) return
    }

    if (selectedEmpresa?.id === empresaId) {
      setSelectedEmpresa(null)
      setPanelMode('browse')
    }

    await loadList()
  }

  const handleSaveEmpresa = async (values: EmpresaFormValues) => {
    const detail = await submitEmpresa(values)

    if (!detail?.id) return

    setSelectedEmpresa(detail)
    setPanelMode('detail')
    await loadList()
  }

  const handleSaveEmpresaDebt = async (values: EmpresaFormValues) => {
    const detail = await submitEmpresaDebtProfile(values)

    if (!detail?.id) return

    setSelectedEmpresa(detail)
    setPanelMode('detail')
    await loadList()
  }

  return {
    empresas,
    selectedEmpresa,
    panelMode,
    listLoading,
    detailLoading,
    searchTerm,
    pageNumber,
    totalPages,
    totalRecords,
    pageSize,
    setSearchTerm,
    setPageNumber,
    setPanelMode,
    setSelectedEmpresa,
    loadList,
    loadDetail,
    handleViewEmpresa,
    handleSearch,
    handleNewEmpresa,
    handleEditEmpresa,
    handleDebtEmpresa,
    handleUseEmpresa,
    handleDeleteEmpresa,
    handleSaveEmpresa,
    handleSaveEmpresaDebt
  }
}
