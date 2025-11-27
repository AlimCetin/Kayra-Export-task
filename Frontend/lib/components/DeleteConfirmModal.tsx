interface DeleteConfirmModalProps {
  productId: number | null
  productName?: string
  loading: boolean
  onConfirm: (id: number) => void
  onCancel: () => void
}

export const DeleteConfirmModal = ({
  productId,
  productName,
  loading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!productId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-red-500/30 p-8 max-w-md w-full">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Ürünü Sil</h3>
            <p className="text-gray-400 text-sm mt-1">Bu işlem geri alınamaz</p>
          </div>
        </div>
        <p className="text-gray-300 mb-6">
          {productName && (
            <span className="font-semibold text-white">{productName}</span>
          )}{' '}
          Bu ürünü silmek istediğinizden emin misiniz? Bu işlem kalıcıdır ve geri alınamaz.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => onConfirm(productId)}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Siliniyor...
              </>
            ) : (
              'Evet, Sil'
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}


