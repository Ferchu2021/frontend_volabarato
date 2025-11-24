import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import Toast, { ToastProps } from './Toast'
import './ToastContainer.css'

interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

interface ToastContainerProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastContainerProps) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = useCallback((message: string, type: ToastProps['type'] = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration, onClose: () => removeToast(id) }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

