import { MessageCircle } from 'lucide-react';
import { ADMIN_WHATSAPP } from '../data/products';
import { buildWhatsAppUrl } from '../utils/catalog';

interface FloatingWhatsAppProps {
  embedded?: boolean;
}

export function FloatingWhatsApp({ embedded = false }: FloatingWhatsAppProps) {
  const waUrl = buildWhatsAppUrl(
    ADMIN_WHATSAPP,
    'Halo Admin By Sawadhee, saya ingin tanya seputar produk dan jastip.',
  );

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Admin By Sawadhee via WhatsApp"
      className={`${
        embedded ? '' : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 '
      }h-11 px-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700`}
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">Chat Admin WA</span>
    </a>
  );
}

