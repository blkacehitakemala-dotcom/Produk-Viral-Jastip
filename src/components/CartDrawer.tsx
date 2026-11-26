import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { ADMIN_WHATSAPP } from '../data/products';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
  CartItem,
  CheckoutValidationErrors,
  formatRupiah,
  PaymentMethod,
  validateCheckoutForm,
} from '../utils/catalog';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

const PAYMENT_OPTIONS: PaymentMethod[] = [
  'Transfer Bank',
  'E-Wallet (QRIS / GoPay / OVO)',
  'COD (Bayar di Tempat)',
];

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('Transfer Bank');
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
  const [generatedOrder, setGeneratedOrder] = useState<{
    message: string;
    waUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const orderReadyRef = useRef<HTMLDivElement | null>(null);

  const totals = calculateCartTotals(cartItems);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset generated order preview if cart changes
    setGeneratedOrder(null);
  }, [cartItems]);

  useEffect(() => {
    if (generatedOrder && orderReadyRef.current) {
      orderReadyRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [generatedOrder]);

  if (!isOpen) {
    return null;
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm({
      buyerName,
      buyerAddress,
      paymentMethod,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || cartItems.length === 0) {
      return;
    }

    const message = buildWhatsAppOrderMessage(cartItems, {
      buyerName,
      buyerAddress,
      paymentMethod,
    });
    const waUrl = buildWhatsAppUrl(ADMIN_WHATSAPP, message);
    setGeneratedOrder({ message, waUrl });
  };

  const handleCopyMessage = async () => {
    if (!generatedOrder) return;
    try {
      await navigator.clipboard.writeText(generatedOrder.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-teal-700" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Keranjang Belanja
            </h2>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              ({totals.totalItems} item)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang belanja"
            className="p-2 -mr-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-7 h-7" aria-hidden="true" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                Keranjang masih kosong
              </p>
              <p className="mt-1 text-sm text-slate-500 max-w-xs">
                Pilih skincare viral, camilan hits, atau produk jastip favorit Anda dari katalog.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 h-10 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.key} className="py-3.5 first:pt-0 flex gap-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-slate-200 shrink-0">
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                          {item.product.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Hapus ${item.product.name} dari keranjang`}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.variant} · {item.product.availability}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-slate-200 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            aria-label={`Kurangi jumlah ${item.product.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            aria-label={`Tambah jumlah ${item.product.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatRupiah(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Estimasi Total Berat</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {(totals.totalWeightGrams / 1000).toFixed(2).replace('.', ',')} kg
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200/70">
                  <span>Subtotal Produk</span>
                  <span className="text-base text-teal-700 tabular-nums">
                    {formatRupiah(totals.subtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form
                id="whatsapp-checkout-form"
                onSubmit={handleSubmitOrder}
                noValidate
                className="space-y-3.5 pt-2 border-t border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Data Pengiriman
                  </h3>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Kosongkan Keranjang
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="buyer-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nama Pembeli <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="buyer-name"
                    type="text"
                    value={buyerName}
                    onChange={(e) => {
                      setBuyerName(e.target.value);
                      if (errors.buyerName) {
                        setErrors((prev) => ({ ...prev, buyerName: undefined }));
                      }
                    }}
                    placeholder="Contoh: Ibu Rina / Nadia"
                    className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.buyerName
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600/15'
                    }`}
                  />
                  {errors.buyerName && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.buyerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="buyer-address"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Kota / Alamat Tujuan <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="buyer-address"
                    rows={2}
                    value={buyerAddress}
                    onChange={(e) => {
                      setBuyerAddress(e.target.value);
                      if (errors.buyerAddress) {
                        setErrors((prev) => ({ ...prev, buyerAddress: undefined }));
                      }
                    }}
                    placeholder="Contoh: Jl. Melati No. 12, Kemang, Jakarta Selatan"
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.buyerAddress
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600/15'
                    }`}
                  />
                  {errors.buyerAddress && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.buyerAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="payment-method"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Metode Pembayaran
                  </label>
                  <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                  >
                    {PAYMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </button>
              </form>

              {/* Generated WhatsApp Order Confirmation Box */}
              {generatedOrder && (
                <div
                  ref={orderReadyRef}
                  data-testid="whatsapp-order-ready"
                  className="rounded-xl bg-teal-50/80 border border-teal-200 p-4 space-y-3"
                >
                  <div>
                    <p className="text-sm font-bold text-teal-900">
                      Format Pesanan Siap Dikirim
                    </p>
                    <p className="text-xs text-teal-800 mt-0.5">
                      Klik tombol di bawah untuk langsung membuka chat WhatsApp Admin By Sawadhee.
                    </p>
                  </div>

                  <pre className="text-[11px] leading-relaxed text-slate-700 bg-white border border-teal-200/80 rounded-lg p-3 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">
                    {generatedOrder.message}
                  </pre>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={generatedOrder.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[160px] h-10 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Buka WhatsApp Admin</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="h-10 px-3.5 rounded-lg bg-white hover:bg-slate-50 border border-teal-300 text-teal-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
