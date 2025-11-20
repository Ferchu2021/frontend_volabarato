import './Badge.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = ({ children, variant = 'primary', size = 'md' }: BadgeProps) => {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {children}
    </span>
  )
}

export default Badge

