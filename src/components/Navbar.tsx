import { Search, ShoppingBag, X } from 'lucide-react';
import { BRAND_CONFIG } from '../data/products';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCartItems: number;
  onOpenCart: () => void;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  totalCartItems,
  onOpenCart,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-teal-900/10">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2.5 sm:gap-6 lg:gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          className="text-base sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 rounded"
        >
          {BRAND_CONFIG.name}
        </a>

        {/* Zone 2: Live search + concise single-line navigation links */}
        <div className="flex items-center gap-6 flex-1 min-w-0 max-w-2xl">
          <div className="relative flex-1 min-w-0">
            <label htmlFor="catalog-search" className="sr-only">
              Cari produk viral atau jastip
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari produk..."
              className="w-full h-10 pl-8 sm:pl-9 pr-7 sm:pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Hapus kata pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <nav
            aria-label="Navigasi utama"
            className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 shrink-0"
          >
            <a
              href="#katalog"
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Katalog
            </a>
            <a
              href="#batch-jastip"
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Batch Jastip
            </a>
            <a
              href="#ongkir"
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Ongkir
            </a>
            <a
              href="#faq"
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Zone 3: Primary cart action with tabular item count */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang belanja (${totalCartItems} item)`}
            className="relative inline-flex items-center gap-2 h-10 px-3.5 sm:px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Keranjang</span>
            <span
              data-testid="cart-badge-count"
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md bg-white text-teal-800 text-xs font-bold tabular-nums"
            >
              {totalCartItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
