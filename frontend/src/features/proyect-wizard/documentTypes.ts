export type DocumentTypeOption = {
  value: string
  label: string
}

export const documentTypeOptions: DocumentTypeOption[] = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'CE' },
  { value: 'PASAPORTE', label: 'PASAPORTE' },
  { value: 'RUC', label: 'RUC' },
  { value: 'OTRO', label: 'OTRO' },
  { value: 'NO_APLICA', label: 'NO APLICA' }
]
