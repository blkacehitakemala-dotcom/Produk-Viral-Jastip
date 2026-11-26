import { ProductItem, SHIPPING_ZONES } from '../data/products';

export type FilterTab =
  | 'Semua Produk'
  | 'Skincare & Kecantikan'
  | 'Makanan & Minuman Viral'
  | 'Kebutuhan Rumah & Gaya Hidup'
  | 'Ready Stock'
  | 'Pre-Order Jastip';

export const FILTER_TABS: FilterTab[] = [
  'Semua Produk',
  'Skincare & Kecantikan',
  'Makanan & Minuman Viral',
  'Kebutuhan Rumah & Gaya Hidup',
  'Ready Stock',
  'Pre-Order Jastip',
];

export type PaymentMethod =
  | 'Transfer Bank'
  | 'E-Wallet (QRIS / GoPay / OVO)'
  | 'COD (Bayar di Tempat)';

export interface CartItem {
  key: string;
  product: ProductItem;
  variant: string;
  quantity: number;
}

export interface CheckoutFormInput {
  buyerName: string;
  buyerAddress: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutValidationErrors {
  buyerName?: string;
  buyerAddress?: string;
}

export interface ShippingEstimateResult {
  zoneId: string;
  zoneName: string;
  weightGrams: number;
  billableKg: number;
  ratePerKg: number;
  totalCost: number;
  estimateDays: string;
  note: string;
}

export function formatRupiah(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  const formatted = safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

export function filterProducts(
  items: ProductItem[],
  query: string,
  activeTab: FilterTab,
): ProductItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    let matchesTab = true;
    if (activeTab === 'Ready Stock') {
      matchesTab = item.availability === 'Ready Stock';
    } else if (activeTab === 'Pre-Order Jastip') {
      matchesTab = item.availability === 'Open PO';
    } else if (activeTab !== 'Semua Produk') {
      matchesTab = item.category === activeTab;
    }

    if (!matchesTab) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      item.name,
      item.category,
      item.shortDesc,
      item.availability,
      ...item.variants,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getCartItemKey(productId: string, variant: string): string {
  return `${productId}::${variant}`;
}

export function calculateCartTotals(cartItems: CartItem[]): {
  totalItems: number;
  subtotal: number;
  totalWeightGrams: number;
} {
  return cartItems.reduce(
    (acc, item) => {
      const qty = Math.max(0, item.quantity);
      acc.totalItems += qty;
      acc.subtotal += item.product.price * qty;
      acc.totalWeightGrams += item.product.weightGrams * qty;
      return acc;
    },
    { totalItems: 0, subtotal: 0, totalWeightGrams: 0 },
  );
}

export function estimateShippingCost(
  zoneId: string,
  weightGrams: number,
): ShippingEstimateResult {
  const zone =
    SHIPPING_ZONES.find((z) => z.id === zoneId) ?? SHIPPING_ZONES[0];
  const safeWeight = Math.max(100, weightGrams);
  const billableKg = Math.max(1, Math.ceil(safeWeight / 1000));
  const totalCost = billableKg * zone.ratePerKg;

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    weightGrams: safeWeight,
    billableKg,
    ratePerKg: zone.ratePerKg,
    totalCost,
    estimateDays: zone.estimateDays,
    note: zone.note,
  };
}

export function validateCheckoutForm(
  input: CheckoutFormInput,
): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};
  if (!input.buyerName.trim()) {
    errors.buyerName = 'Nama pembeli wajib diisi.';
  } else if (input.buyerName.trim().length < 2) {
    errors.buyerName = 'Nama pembeli minimal 2 huruf.';
  }

  if (!input.buyerAddress.trim()) {
    errors.buyerAddress = 'Kota atau alamat tujuan wajib diisi.';
  } else if (input.buyerAddress.trim().length < 5) {
    errors.buyerAddress = 'Mohon tulis kota/alamat lebih lengkap.';
  }

  return errors;
}

export function buildWhatsAppOrderMessage(
  cartItems: CartItem[],
  buyer: CheckoutFormInput,
): string {
  const { subtotal, totalWeightGrams, totalItems } =
    calculateCartTotals(cartItems);

  const lines: string[] = [
    'Halo Admin *By Sawadhee*, saya ingin memesan produk berikut:',
    '',
  ];

  cartItems.forEach((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    lines.push(
      `${index + 1}. *${item.product.name}* (${item.variant})`,
      `   Status: ${item.product.availability} | Qty: ${item.quantity} x ${formatRupiah(item.product.price)} = *${formatRupiah(lineTotal)}*`,
    );
  });

  const weightKg = (totalWeightGrams / 1000).toFixed(2).replace('.', ',');

  lines.push(
    '',
    `Total Barang: ${totalItems} item (Estimasi berat: ${weightKg} kg)`,
    `Subtotal Produk: *${formatRupiah(subtotal)}*`,
    '',
    '*Data Pembeli:*',
    `Nama: ${buyer.buyerName.trim()}`,
    `Kota / Alamat: ${buyer.buyerAddress.trim()}`,
    `Metode Pembayaran: ${buyer.paymentMethod}`,
    '',
    'Mohon info total ongkir & ketersediaan batch ya, terima kasih!',
  );

  return lines.join('\n');
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const sanitizedPhone = phoneNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildQuickBuyWhatsAppUrl(
  phoneNumber: string,
  product: ProductItem,
  variant?: string,
): string {
  const chosenVariant = variant || product.variants[0] || 'Standard';
  const message = [
    'Halo Admin *By Sawadhee*, saya mau pesan cepat produk ini:',
    '',
    `*${product.name}*`,
    `Varian: ${chosenVariant}`,
    `Status: ${product.availability}`,
    `Harga: ${formatRupiah(product.price)}`,
    '',
    'Apakah stok/slot PO masih tersedia?',
  ].join('\n');

  return buildWhatsAppUrl(phoneNumber, message);
}
