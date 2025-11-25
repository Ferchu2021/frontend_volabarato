import './SkeletonLoader.css'

interface SkeletonLoaderProps {
  width?: string
  height?: string
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

const SkeletonLoader = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular'
}: SkeletonLoaderProps) => {
  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height }}
    />
  )
}

export default SkeletonLoader

