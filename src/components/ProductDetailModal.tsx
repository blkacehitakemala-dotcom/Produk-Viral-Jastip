import { useEffect, useState } from 'react';
import { MessageCircle, Minus, Plus, Scale, Star, X } from 'lucide-react';
import { ADMIN_WHATSAPP, ProductItem } from '../data/products';
import { buildQuickBuyWhatsAppUrl, formatRupiah } from '../utils/catalog';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, variant: string, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const quickBuyUrl = buildQuickBuyWhatsAppUrl(
    ADMIN_WHATSAPP,
    product,
    selectedVariant,
  );

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/55 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-[92vh] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-teal-700">{product.availability}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="p-2 -mr-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image */}
            <div className="md:col-span-5">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-slate-200/80">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 border border-slate-200/70 rounded-lg px-3 py-2">
                <span className="inline-flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                  Estimasi Berat
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {product.weightGrams} gram
                </span>
              </div>
            </div>

            {/* Product Info & Purchase Controls */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div>
                <h2
                  id="product-modal-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
                >
                  {product.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl font-bold text-teal-700 tabular-nums">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {product.soldCountLabel} ·{' '}
                    <span className="text-slate-800 font-semibold">
                      ★ {product.rating.toFixed(1)}
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {product.fullDesc}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Pilih Varian:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const active = selectedVariant === variant;
                      return (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-teal-50 border-teal-600 text-teal-800'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Action Buttons */}
              <div className="pt-1 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Kurangi jumlah"
                      className="w-10 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-50 rounded-l-lg"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span
                      className="w-10 text-center text-sm font-semibold text-slate-900 tabular-nums"
                      aria-label="Jumlah"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Tambah jumlah"
                      className="w-10 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-50 rounded-r-lg"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 h-11 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>

                <a
                  href={quickBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  <span>Beli Langsung via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Buyer Reviews */}
          <div className="mt-7 pt-5 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Ulasan Pembeli ({product.reviews.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900">
                      {review.author}{' '}
                      <span className="font-normal text-slate-500">
                        · {review.city}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 tabular-nums">
                      <Star
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                      {review.rating}.0
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
