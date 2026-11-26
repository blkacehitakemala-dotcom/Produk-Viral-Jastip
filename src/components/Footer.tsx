import { ExternalLink, MessageCircle } from 'lucide-react';
import { ADMIN_WHATSAPP, BRAND_CONFIG } from '../data/products';
import { buildWhatsAppUrl } from '../utils/catalog';

export function Footer() {
  const waUrl = buildWhatsAppUrl(
    ADMIN_WHATSAPP,
    'Halo Admin By Sawadhee, saya ingin menanyakan info produk/jastip.',
  );

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <p className="text-xl font-bold tracking-tight text-white">
              {BRAND_CONFIG.name}
            </p>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm">
              Kurasi produk viral skincare, camilan hits, dan kebutuhan gaya hidup terpercaya.
              Pengiriman aman ke seluruh Indonesia dengan dukungan Transfer, E-Wallet, dan COD.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="font-semibold text-white">Navigasi Cepat</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Katalog Produk
                </a>
              </li>
              <li>
                <a href="#batch-jastip" className="hover:text-white transition-colors">
                  Jadwal Batch Jastip
                </a>
              </li>
              <li>
                <a href="#ongkir" className="hover:text-white transition-colors">
                  Estimasi Ongkir
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-sm">
            <p className="font-semibold text-white">Kanal Resmi & Admin</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={BRAND_CONFIG.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>TikTok</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href={BRAND_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href={BRAND_CONFIG.socials.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>Shopee</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href={BRAND_CONFIG.socials.tokopedia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>Tokopedia</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors pt-1"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp Admin: 0858-3613-7886</span>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. Seluruh hak cipta dilindungi.</p>
          <p>Melayani pengiriman ke seluruh Indonesia · Ready Stock & Pre-Order Jastip</p>
        </div>
      </div>
    </footer>
  );
}
