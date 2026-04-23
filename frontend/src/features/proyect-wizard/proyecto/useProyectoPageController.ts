import { useCallback, useEffect, useState } from 'react'
import { getProyectoById, getProyectos, type ProyectoDetail, type ProyectoListItem } from './api'
import { useProyectoWorkspace } from '../useProyectoWorkspace'
import type { ProyectoFormValues } from '../schemas'

type Workspace = ReturnType<typeof useProyectoWorkspace>
export type ProyectoPanelMode = 'browse' | 'detail' | 'create' | 'edit'

export function useProyectoPageController(workspace: Workspace) {
  const {
    loadProyectoIntoWorkspace,
    removeProyecto,
    startNewProyecto,
    submitProyecto,
    downloadProyectoDocxById
  } = workspace

  const [proyectos, setProyectos] = useState<ProyectoListItem[]>([])
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoDetail | null>(null)
  const [panelMode, setPanelMode] = useState<ProyectoPanelMode>('browse')
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
        const result = await getProyectos({
          pageNumber: nextPage,
          pageSize,
          searchTerm: nextSearch
        })
        setProyectos(result.data)
        setTotalRecords(result.totalRecords)
      } finally {
        setListLoading(false)
      }
    },
    [pageNumber, pageSize, searchTerm]
  )

  const loadDetail = useCallback(async (proyectoId: number) => {
    try {
      setDetailLoading(true)
      const detail = await getProyectoById(proyectoId)
      setSelectedProyecto(detail)
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

  const handleNewProyecto = () => {
    startNewProyecto()
    setSelectedProyecto(null)
    setPanelMode('create')
  }

  const handleViewProyecto = async (proyectoId: number) => {
    try {
      setDetailLoading(true)
      const detail = await loadProyectoIntoWorkspace(proyectoId)
      if (!detail) return

      setSelectedProyecto(detail)
      setPanelMode('detail')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleEditProyecto = async (proyectoId: number) => {
    const detail = await loadProyectoIntoWorkspace(proyectoId)
    if (!detail) return

    setSelectedProyecto(detail)
    setPanelMode('edit')
  }

  const handleUseProyecto = async (proyectoId: number) => {
    const detail = await loadProyectoIntoWorkspace(proyectoId)
    if (!detail) return

    setSelectedProyecto(detail)
    setPanelMode('detail')
  }

  const handleDeleteProyecto = async (proyectoId: number) => {
    const confirmed = window.confirm('¿Deseas eliminar este proyecto?')
    if (!confirmed) return

    const result = await removeProyecto(proyectoId)
    if (!result?.ok) return

    if (selectedProyecto?.id === proyectoId) {
      setSelectedProyecto(null)
      setPanelMode('browse')
    }

    await loadList()
  }

  const handleDownloadProyecto = async (proyectoId: number) => {
    await downloadProyectoDocxById(proyectoId)
  }

  const handleSaveProyecto = async (values: ProyectoFormValues) => {
    const detail = await submitProyecto(values)
    const savedId = detail?.id ?? detail?.proyecto?.id

    if (!savedId) return

    setSelectedProyecto(detail)
    setPanelMode('detail')
    await loadList()
  }

  return {
    proyectos,
    selectedProyecto,
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
    handleViewProyecto,
    handleSearch,
    handleNewProyecto,
    handleEditProyecto,
    handleUseProyecto,
    handleDeleteProyecto,
    handleDownloadProyecto,
    handleSaveProyecto
  }
}
