import { ArrowDownRight, Calendar, MessageCircle, PackageCheck, Truck } from 'lucide-react';
import { ADMIN_WHATSAPP, BATCH_INFO, BRAND_CONFIG } from '../data/products';
import { buildWhatsAppUrl } from '../utils/catalog';
import { ProductImage } from './ProductImage';

export function HeroSection() {
  const adminAskWaUrl = buildWhatsAppUrl(
    ADMIN_WHATSAPP,
    'Halo Admin By Sawadhee, saya ingin bertanya tentang katalog & jadwal PO Jastip terbaru.',
  );

  return (
    <section
      id="top"
      className="pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-teal-900/10 bg-gradient-to-br from-teal-50/70 via-white/55 to-amber-50/65"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Headline, CTAs & Jastip Batch Tracker Card */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-teal-700 mb-3">
                {BATCH_INFO.batchCode} · Kurasi Produk Viral & Jastip Bangkok–Asia
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-slate-900 leading-[1.15] max-w-2xl"
                style={{ textWrap: 'balance' }}
              >
                Produk Viral Pilihan & Jastip Terpercaya, Langsung ke Rumah Anda.
              </h1>

              <p className="mt-4 text-base sm:text-[17px] text-slate-600 leading-relaxed max-w-xl">
                Skincare favorit, camilan hits, dan kebutuhan rumah unik pilihan{' '}
                <span className="font-semibold text-slate-800">{BRAND_CONFIG.name}</span>.
                Harga transparan, jaminan 100% original, dan pemesanan praktis langsung via WhatsApp.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <span>Lihat Katalog Viral</span>
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={adminAskWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <MessageCircle className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  <span>Tanya Admin via WA</span>
                </a>
              </div>
            </div>

            {/* Kartu Status Batch Jastip */}
            <div
              id="batch-jastip"
              className="scroll-mt-20 bg-white/90 backdrop-blur-sm border border-teal-900/10 shadow-sm shadow-teal-950/5 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">
                  Jadwal {BATCH_INFO.batchCode} Jastip
                </h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                  {BATCH_INFO.statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5">
                <div className="flex items-start gap-2.5">
                  <Calendar
                    className="w-4 h-4 text-teal-700 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Buka Pre-Order</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      {BATCH_INFO.openPoDates}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <PackageCheck
                    className="w-4 h-4 text-teal-700 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Belanja & Restock</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      {BATCH_INFO.shoppingRestockDates}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck
                    className="w-4 h-4 text-teal-700 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Estimasi Pengiriman</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      {BATCH_INFO.shippingEstimate}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                {BATCH_INFO.note}
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Hero Media */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200/80 bg-stone-100">
              <ProductImage
                src={BRAND_CONFIG.heroImage}
                alt="Koleksi kurasi skincare, matcha ceremonial, dan perlengkapan travel By Sawadhee"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent p-4 sm:p-5">
                <p className="text-xs font-medium text-teal-200">
                  100% Original Hand-Carry & Official Store
                </p>
                <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                  Dikirim ke seluruh Indonesia dengan packing aman bergaransi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
