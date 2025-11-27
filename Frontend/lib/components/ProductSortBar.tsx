import { SortOption } from '@/lib/types/product.types'

interface ProductSortBarProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  totalProducts: number
}

export const ProductSortBar = ({ sortBy, onSortChange, totalProducts }: ProductSortBarProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <label className="text-white/80 font-semibold text-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sırala:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
        >
          <option value="date-desc" className="bg-slate-800">Tarih (Yeni → Eski)</option>
          <option value="date-asc" className="bg-slate-800">Tarih (Eski → Yeni)</option>
          <option value="name-asc" className="bg-slate-800">İsim (A → Z)</option>
          <option value="name-desc" className="bg-slate-800">İsim (Z → A)</option>
          <option value="price-asc" className="bg-slate-800">Fiyat (Düşük → Yüksek)</option>
          <option value="price-desc" className="bg-slate-800">Fiyat (Yüksek → Düşük)</option>
        </select>
      </div>
      <div className="text-white/60 text-sm">
        Toplam <span className="font-bold text-white">{totalProducts}</span> ürün
      </div>
    </div>
  )
}


