import { MessageCircle, Plus, Star } from 'lucide-react';
import { ADMIN_WHATSAPP, ProductItem } from '../data/products';
import { buildQuickBuyWhatsAppUrl, formatRupiah } from '../utils/catalog';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  const quickBuyUrl = buildQuickBuyWhatsAppUrl(ADMIN_WHATSAPP, product);

  const badgeStyle =
    product.badgeLabel === 'Viral'
      ? 'bg-amber-500 text-white'
      : product.badgeLabel === 'Open PO'
        ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
        : 'bg-teal-600 text-white';

  return (
    <article className="group bg-white/95 backdrop-blur-xs border border-teal-900/10 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs shadow-teal-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-teal-950/10 hover:border-teal-700/25">
      {/* Top: Image & Clickable Detail Trigger */}
      <div>
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          aria-label={`Lihat detail ${product.name}`}
          className="relative block w-full aspect-[4/3] bg-stone-100 overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-600"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold tracking-tight shadow-xs ${badgeStyle}`}
          >
            {product.badgeLabel === 'Viral' ? 'Viral' : product.badgeLabel}
          </span>
        </button>

        {/* Body Info */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
            <span className="truncate">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0 font-medium text-slate-600">
              {product.availability}
            </span>
          </div>

          <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-slate-900 leading-snug">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="text-left hover:text-teal-700 transition-colors line-clamp-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
            >
              {product.name}
            </button>
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {product.shortDesc}
          </p>
        </div>
      </div>

      {/* Bottom: Price, Social Proof & Actions */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1 flex flex-col gap-3">
        <div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tabular-nums tracking-tight">
            {formatRupiah(product.price)}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
            <span>{product.soldCountLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
              <Star
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="inline-flex items-center justify-center gap-1.5 h-10 sm:h-10 min-h-[40px] px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Keranjang</span>
          </button>

          <a
            href={quickBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Beli ${product.name} via WhatsApp`}
            className="inline-flex items-center justify-center gap-1.5 h-10 sm:h-10 min-h-[40px] px-3 rounded-lg bg-white hover:bg-teal-50/70 text-teal-800 border border-teal-600/35 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Beli via WA</span>
          </a>
        </div>
      </div>
    </article>
  );
}
