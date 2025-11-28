interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  retryLabel = 'Tekrar Dene' 
}: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-red-500/30 p-8 max-w-md w-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Hata</h3>
        </div>
        <p className="text-gray-300 mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 font-semibold"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}


