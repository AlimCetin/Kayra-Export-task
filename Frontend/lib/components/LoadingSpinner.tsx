interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner = ({ message = 'Yükleniyor...', size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-xl text-white font-semibold">{message}</p>
      </div>
    </div>
  )
}


