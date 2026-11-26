import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { CartDrawer } from './components/CartDrawer';
import { Chatbot } from './components/Chatbot';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShippingAndFaqSection } from './components/ShippingAndFaqSection';
import { ProductItem, products } from './data/products';
import {
  calculateCartTotals,
  CartItem,
  FILTER_TABS,
  FilterTab,
  filterProducts,
  getCartItemKey,
} from './utils/catalog';

export default function App() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua Produk');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () => filterProducts(products, searchQuery, activeTab),
    [searchQuery, activeTab],
  );

  const cartTotals = useMemo(
    () => calculateCartTotals(cartItems),
    [cartItems],
  );

  const triggerToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2400);
  };

  const handleAddToCart = (
    product: ProductItem,
    variant?: string,
    quantity = 1,
  ) => {
    const chosenVariant = variant || product.variants[0] || 'Standard';
    const key = getCartItemKey(product.id, chosenVariant);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          variant: chosenVariant,
          quantity,
        },
      ];
    });

    triggerToast(`${product.name} ditambahkan ke keranjang.`);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sawadhee-mesh text-slate-900">
      <AnnouncementBar
        visible={showAnnouncement}
        onDismiss={() => setShowAnnouncement(false)}
      />

      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCartItems={cartTotals.totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <HeroSection />

        {/* Catalog Section */}
        <section id="katalog" className="scroll-mt-20 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Katalog Produk Viral & Jastip
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Klik foto atau nama produk untuk melihat detail varian, estimasi berat, dan ulasan pembeli.
                </p>
              </div>
              <p
                data-testid="product-result-count"
                className="text-xs sm:text-sm font-medium text-slate-500 tabular-nums shrink-0"
              >
                Menampilkan {filteredProducts.length} dari {products.length} produk
              </p>
            </div>

            {/* Category & Status Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter kategori produk"
              className="mt-6 flex items-center gap-2 overflow-x-auto pb-2"
            >
              {FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab)}
                    className={`h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                      isActive
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Product Grid (2 cols mobile, 4 cols desktop) */}
            {filteredProducts.length > 0 ? (
              <div
                data-testid="product-grid"
                className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 py-14 px-6 bg-white border border-slate-200 rounded-2xl text-center flex flex-col items-center">
                <SearchX className="w-10 h-10 text-slate-400 mb-3" aria-hidden="true" />
                <p className="text-base font-bold text-slate-900">
                  Produk tidak ditemukan
                </p>
                <p className="mt-1 text-sm text-slate-600 max-w-md">
                  Tidak ada produk yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo; pada kategori {activeTab}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('Semua Produk');
                  }}
                  className="mt-4 h-10 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            )}
          </div>
        </section>

        <ShippingAndFaqSection cartWeightGrams={cartTotals.totalWeightGrams} />
      </main>

      <Footer />

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5">
        <FloatingWhatsApp embedded />
        <Chatbot embedded />
      </div>

      {/* Subtle Added-to-Cart Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xl flex items-center gap-3 max-w-[92vw]"
        >
          <span className="truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-teal-300 hover:text-teal-200 font-semibold whitespace-nowrap shrink-0 underline underline-offset-2"
          >
            Lihat Keranjang
          </button>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
