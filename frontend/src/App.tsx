import { Toaster } from 'sonner'
import ProyectoWizard from './features/proyect-wizard/ProyectWizard'

export default function App() {
  return (
    <>
      <ProyectoWizard />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        expand
        toastOptions={{
          duration: 4200,
          classNames: {
            toast: 'app-toast',
            title: 'app-toast-title',
            description: 'app-toast-description',
            success: 'app-toast-success',
            error: 'app-toast-error',
            warning: 'app-toast-warning',
            closeButton: 'app-toast-close'
          }
        }}
      />
    </>
  )
}
