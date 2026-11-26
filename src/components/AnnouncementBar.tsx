import { X } from 'lucide-react';
import { BRAND_CONFIG } from '../data/products';

interface AnnouncementBarProps {
  visible: boolean;
  onDismiss: () => void;
}

export function AnnouncementBar({ visible, onDismiss }: AnnouncementBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="relative bg-teal-700 text-white text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[38px] py-1.5 flex items-center justify-between gap-3">
        <div className="w-6 hidden sm:block shrink-0" aria-hidden="true" />
        <p className="text-center flex-1 leading-snug tracking-tight">
          {BRAND_CONFIG.announcement}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pengumuman"
          className="p-1.5 -mr-1 text-teal-100 hover:text-white rounded-md transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
