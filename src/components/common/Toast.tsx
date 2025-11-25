import { useEffect } from 'react'
import { FaCheck, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import './Toast.css'

export interface ToastProps {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: (id: string) => void
}

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: <FaCheck />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationCircle />
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={() => onClose(id)}
        aria-label="Cerrar"
      >
        <FaTimes />
      </button>
    </div>
  )
}

export default Toast

