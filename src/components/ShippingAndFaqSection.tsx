import { useState } from 'react';
import { ChevronDown, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { FAQ_ITEMS, SHIPPING_ZONES } from '../data/products';
import { estimateShippingCost, formatRupiah } from '../utils/catalog';

interface ShippingAndFaqSectionProps {
  cartWeightGrams: number;
}

export function ShippingAndFaqSection({
  cartWeightGrams,
}: ShippingAndFaqSectionProps) {
  const [selectedZoneId, setSelectedZoneId] = useState(SHIPPING_ZONES[0].id);
  const [weightKgInput, setWeightKgInput] = useState<number>(1);
  const [useCartWeight, setUseCartWeight] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  const effectiveWeightGrams =
    useCartWeight && cartWeightGrams > 0
      ? cartWeightGrams
      : Math.max(100, Math.round(weightKgInput * 1000));

  const estimate = estimateShippingCost(selectedZoneId, effectiveWeightGrams);

  return (
    <section
      id="ongkir"
      className="scroll-mt-20 py-12 sm:py-16 border-t border-teal-900/10 bg-gradient-to-br from-teal-50/45 via-white/70 to-amber-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Shipping Estimator */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm border border-teal-900/10 shadow-sm shadow-teal-950/5 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-teal-700 mb-1.5">
              <Truck className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide">
                Cek Estimasi Ongkos Kirim
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Kalkulator Ongkir Wilayah
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Cek perkiraan tarif pengiriman reguler dari gudang By Sawadhee ke kota Anda.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="shipping-zone"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Pilih Wilayah Tujuan
                </label>
                <div className="relative">
                  <MapPin
                    className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    id="shipping-zone"
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                  >
                    {SHIPPING_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="shipping-weight"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Perkiraan Berat Paket (kg)
                  </label>
                  {cartWeightGrams > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseCartWeight((prev) => !prev)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-2"
                    >
                      {useCartWeight
                        ? 'Atur berat manual'
                        : `Pakai berat keranjang (${(cartWeightGrams / 1000).toFixed(2).replace('.', ',')} kg)`}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5].map((kg) => {
                    const active = !useCartWeight && weightKgInput === kg;
                    return (
                      <button
                        key={kg}
                        type="button"
                        onClick={() => {
                          setUseCartWeight(false);
                          setWeightKgInput(kg);
                        }}
                        className={`flex-1 h-10 rounded-lg text-xs sm:text-sm font-semibold border transition-colors tabular-nums ${
                          active
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {kg} kg
                      </button>
                    );
                  })}
                  <input
                    id="shipping-weight"
                    type="number"
                    min={1}
                    max={50}
                    value={
                      useCartWeight && cartWeightGrams > 0
                        ? Math.max(1, Math.ceil(cartWeightGrams / 1000))
                        : weightKgInput
                    }
                    onChange={(e) => {
                      setUseCartWeight(false);
                      const val = Number(e.target.value);
                      setWeightKgInput(Number.isFinite(val) && val >= 1 ? val : 1);
                    }}
                    aria-label="Berat paket dalam kilogram"
                    className="w-16 h-10 px-2.5 text-center rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 tabular-nums focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div
                data-testid="shipping-estimate-result"
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Estimasi Ongkir ({estimate.billableKg} kg)
                  </span>
                  <span className="text-xl font-bold text-teal-700 tabular-nums">
                    {formatRupiah(estimate.totalCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1.5 border-t border-slate-100">
                  <span>Tarif per kg: {formatRupiah(estimate.ratePerKg)}</span>
                  <span className="font-semibold text-slate-800">
                    {estimate.estimateDays}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {estimate.note}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Accordion FAQ */}
          <div
            id="faq"
            className="scroll-mt-20 lg:col-span-7 bg-white/90 backdrop-blur-sm border border-teal-900/10 shadow-sm shadow-teal-950/5 rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 text-teal-700 mb-1.5">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide">
                Informasi & Jaminan Pembeli
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Penjelasan singkat seputar cara ikut PO Jastip, keaslian barang, dan keamanan pengiriman.
            </p>

            <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ_ITEMS.map((item) => {
                const isExpanded = openFaqId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setOpenFaqId((prev) => (prev === item.id ? null : item.id))
                      }
                      className="w-full py-4 flex items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
                    >
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-teal-700' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isExpanded && (
                      <div className="pb-4 pr-8 text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
