import test from 'node:test';
import assert from 'node:assert/strict';
import { products, ADMIN_WHATSAPP } from '../data/products';
import {
  formatRupiah,
  filterProducts,
  calculateCartTotals,
  estimateShippingCost,
  validateCheckoutForm,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  getCartItemKey,
} from './catalog';

test('formatRupiah formats numbers cleanly with dot separators', () => {
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(78000), 'Rp 78.000');
  assert.equal(formatRupiah(1250000), 'Rp 1.250.000');
});

test('filterProducts filters by category, availability tab, and search query', () => {
  assert.equal(filterProducts(products, '', 'Semua Produk').length, products.length);

  const skincare = filterProducts(products, '', 'Skincare & Kecantikan');
  assert.ok(skincare.length >= 2);
  assert.ok(skincare.every((p) => p.category === 'Skincare & Kecantikan'));

  const openPo = filterProducts(products, '', 'Pre-Order Jastip');
  assert.ok(openPo.length >= 2);
  assert.ok(openPo.every((p) => p.availability === 'Open PO'));

  const matchaSearch = filterProducts(products, 'matcha', 'Semua Produk');
  assert.equal(matchaSearch.length, 1);
  assert.equal(matchaSearch[0].id, 'momo-ceremonial-matcha');
});

test('calculateCartTotals computes total items, subtotal, and weight accurately', () => {
  const itemA = products[0];
  const itemB = products[3];
  const totals = calculateCartTotals([
    { key: getCartItemKey(itemA.id, itemA.variants[0]), product: itemA, variant: itemA.variants[0], quantity: 2 },
    { key: getCartItemKey(itemB.id, itemB.variants[0]), product: itemB, variant: itemB.variants[0], quantity: 1 },
  ]);

  assert.equal(totals.totalItems, 3);
  assert.equal(totals.subtotal, itemA.price * 2 + itemB.price);
  assert.equal(totals.totalWeightGrams, itemA.weightGrams * 2 + itemB.weightGrams);
});

test('estimateShippingCost rounds up weight to minimum 1 kg and calculates total cost', () => {
  const lightJawa = estimateShippingCost('jawa', 450);
  assert.equal(lightJawa.billableKg, 1);
  assert.equal(lightJawa.totalCost, 14000);

  const heavyKalimantan = estimateShippingCost('kalimantan', 1250);
  assert.equal(heavyKalimantan.billableKg, 2);
  assert.equal(heavyKalimantan.totalCost, 68000);
});

test('validateCheckoutForm rejects empty required fields without bypassing validation', () => {
  const emptyErrors = validateCheckoutForm({
    buyerName: '  ',
    buyerAddress: '',
    paymentMethod: 'COD (Bayar di Tempat)',
  });
  assert.ok(emptyErrors.buyerName);
  assert.ok(emptyErrors.buyerAddress);

  const validErrors = validateCheckoutForm({
    buyerName: 'Ibu Rina',
    buyerAddress: 'Jl. Melati No. 12, Jakarta Selatan',
    paymentMethod: 'Transfer Bank',
  });
  assert.equal(Object.keys(validErrors).length, 0);
});

test('buildWhatsAppOrderMessage and buildWhatsAppUrl format complete order payload', () => {
  const p = products[0];
  const msg = buildWhatsAppOrderMessage(
    [{ key: getCartItemKey(p.id, p.variants[0]), product: p, variant: p.variants[0], quantity: 2 }],
    {
      buyerName: 'Nadia Kusuma',
      buyerAddress: 'Kemang, Jakarta Selatan',
      paymentMethod: 'E-Wallet (QRIS / GoPay / OVO)',
    },
  );

  assert.match(msg, /By Sawadhee/);
  assert.match(msg, /Nadia Kusuma/);
  assert.match(msg, /Kemang, Jakarta Selatan/);
  assert.match(msg, /Rp 330\.000/);

  const url = buildWhatsAppUrl(ADMIN_WHATSAPP, msg);
  assert.ok(url.startsWith(`https://wa.me/${ADMIN_WHATSAPP}?text=`));
});
