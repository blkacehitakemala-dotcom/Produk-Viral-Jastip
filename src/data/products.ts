// ============================================================================
// KONFIGURASI UTAMA BY SAWADHEE
// Ubah nomor WhatsApp, jadwal batch PO, atau daftar produk di file ini.
// Format nomor WhatsApp harus menggunakan kode negara tanpa tanda '+' (contoh: 62858...)
// ============================================================================

export const ADMIN_WHATSAPP = '6285836137886';

export const BRAND_CONFIG = {
  name: 'By Sawadhee',
  tagline: 'Kurasi Produk Viral & Jastip Terpercaya',
  announcement:
    'OPEN PO JASTIP BATCH #14! Pengiriman ke Seluruh Indonesia | Bisa COD & Transfer',
  heroImage: '/src/assets/images/hero_sawadhee_jastip_1795602068161.jpg',
  socials: {
    tiktok: 'https://www.tiktok.com/',
    instagram: 'https://www.instagram.com/',
    shopee: 'https://shopee.co.id/',
    tokopedia: 'https://www.tokopedia.com/',
  },
};

export interface BatchSchedule {
  batchCode: string;
  statusLabel: string;
  openPoDates: string;
  shoppingRestockDates: string;
  shippingEstimate: string;
  note: string;
}

export const BATCH_INFO: BatchSchedule = {
  batchCode: 'Batch #14',
  statusLabel: 'Open PO Aktif',
  openPoDates: '25 – 30 Nov 2026',
  shoppingRestockDates: '1 – 3 Des 2026',
  shippingEstimate: 'Mulai 5 Des 2026',
  note: 'Item bertanda Ready Stock langsung dikirim H+1 setelah konfirmasi.',
};

export type ProductCategory =
  | 'Skincare & Kecantikan'
  | 'Makanan & Minuman Viral'
  | 'Kebutuhan Rumah & Gaya Hidup';

export type ProductAvailability = 'Ready Stock' | 'Open PO';

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  availability: ProductAvailability;
  badgeLabel: 'Viral' | 'Ready Stock' | 'Open PO';
  isViral: boolean;
  price: number;
  weightGrams: number;
  soldCountLabel: string;
  rating: number;
  shortDesc: string;
  fullDesc: string;
  image: string;
  variants: string[];
  reviews: ProductReview[];
}

// ============================================================================
// DATA KATALOG PRODUK (const products)
// Anda dapat menambah, menghapus, atau mengubah nama, harga, dan foto di bawah ini.
// ============================================================================
export const products: ProductItem[] = [
  {
    id: 'glow-niacinamide-serum',
    name: 'Aura Skn Brightening Radiance Serum 30ml',
    category: 'Skincare & Kecantikan',
    availability: 'Ready Stock',
    badgeLabel: 'Viral',
    isViral: true,
    price: 165000,
    weightGrams: 180,
    soldCountLabel: 'Terjual 240+',
    rating: 4.9,
    shortDesc:
      'Serum Vitamin C & Niacinamide ringan untuk kulit tampak cerah merata tanpa lengket.',
    fullDesc:
      'Formulasi cepat meresap dengan kombinasi Vitamin C stabil dan Niacinamide 5%. Nyaman dipakai pagi maupun malam di iklim tropis, cocok untuk pemula hingga kulit kusam.',
    image: '/src/assets/images/prod_serum_glow_1795602068549.jpg',
    variants: ['30ml (Full Size)', '15ml (Travel Size)'],
    reviews: [
      {
        id: 'r1',
        author: 'Nadia Kusuma',
        city: 'Jakarta Selatan',
        rating: 5,
        comment:
          'Teksturnya enteng banget, cepat meresap dan bikin muka kelihatan lebih segar dalam 2 minggu.',
      },
      {
        id: 'r2',
        author: 'Ibu Dewi Hartati',
        city: 'Surabaya',
        rating: 5,
        comment:
          'Packing sangat aman pakai bubble wrap tebal, barang original dan pengiriman cepat.',
      },
    ],
  },
  {
    id: 'lumiere-velvet-cushion',
    name: 'Lumiere Matte Velvet Cushion SPF 35',
    category: 'Skincare & Kecantikan',
    availability: 'Open PO',
    badgeLabel: 'Open PO',
    isViral: true,
    price: 235000,
    weightGrams: 160,
    soldCountLabel: 'Terjual 180+',
    rating: 4.9,
    shortDesc:
      'Cushion medium-to-full coverage dengan hasil velvet natural, tahan lembap hingga 12 jam.',
    fullDesc:
      'Cushion favorit jastip Bangkok dengan puff lembut dan formula tahan keringat. Menyamarkan pori tanpa terasa berat atau cakey seharian.',
    image: '/src/assets/images/prod_cushion_velvet_1795602068926.jpg',
    variants: ['01 Ivory Fair', '02 Warm Beige', '03 Honey Sand'],
    reviews: [
      {
        id: 'r3',
        author: 'Clarissa Wijaya',
        city: 'Bandung',
        rating: 5,
        comment:
          'Shade 02 Warm Beige pas banget di kulit sawo matang cerah, hasilnya halus dan tidak oksidasi.',
      },
      {
        id: 'r4',
        author: 'Ibu Sari Rahayu',
        city: 'Semarang',
        rating: 5,
        comment:
          'Praktis dibawa kondangan, tidak geser walau cuaca panas. Sudah repeat order kedua kali.',
      },
    ],
  },
  {
    id: 'lumin-gloss-lip-tint',
    name: 'Lumin Glassy Velvet Lip Tint',
    category: 'Skincare & Kecantikan',
    availability: 'Ready Stock',
    badgeLabel: 'Ready Stock',
    isViral: false,
    price: 118000,
    weightGrams: 90,
    soldCountLabel: 'Terjual 310+',
    rating: 4.8,
    shortDesc:
      'Lip tint glossy lembap dengan stain tahan lama, tidak membuat bibir kering atau pecah.',
    fullDesc:
      'Diperkaya squalane nabati untuk menjaga kelembapan bibir sepanjang hari. Memberi kilau sehat saat dioles dan meninggalkan warna alami yang tahan makan ringan.',
    image: '/src/assets/images/prod_lip_tint_1795602069610.jpg',
    variants: ['01 Coral Peach', '02 Rosewood Mauve'],
    reviews: [
      {
        id: 'r5',
        author: 'Tasya Permata',
        city: 'Yogyakarta',
        rating: 5,
        comment:
          'Warna Rosewood-nya elegan banget buat kerja maupun kuliah, tidak bikin garis bibir kelihatan.',
      },
      {
        id: 'r6',
        author: 'Rani Putri',
        city: 'Medan',
        rating: 5,
        comment:
          'Beli dua shade sekaligus karena sering kehabisan, stain-nya awet sampai sore.',
      },
    ],
  },
  {
    id: 'momo-ceremonial-matcha',
    name: 'Momo Ceremonial Grade Matcha Tin 40g',
    category: 'Makanan & Minuman Viral',
    availability: 'Open PO',
    badgeLabel: 'Viral',
    isViral: true,
    price: 195000,
    weightGrams: 150,
    soldCountLabel: 'Terjual 150+',
    rating: 5.0,
    shortDesc:
      'Bubuk matcha ceremonial murni tanpa gula, warna hijau pekat dan aroma umami lembut.',
    fullDesc:
      'Dipetik dari daun teh hijau pilihan gilingan batu. Cocok untuk es matcha latte kekinian di rumah maupun campuran dessert. Dikemas dalam kaleng kedap cahaya.',
    image: '/src/assets/images/prod_matcha_tin_1795602069606.jpg',
    variants: ['Kaleng 40g', 'Refill Pouch 80g'],
    reviews: [
      {
        id: 'r7',
        author: 'Kevin Pratama',
        city: 'Jakarta Barat',
        rating: 5,
        comment:
          'Rasanya creamy dan tidak pahit getir, tinggal campur susu oat dingin sudah mirip kafe.',
      },
      {
        id: 'r8',
        author: 'Ibu Maya Lestari',
        city: 'Tangerang',
        rating: 5,
        comment:
          'Anak saya suka banget dibuatin es matcha pakai ini, lebih hemat daripada jajan di luar terus.',
      },
    ],
  },
  {
    id: 'aura-freeze-dried-mango',
    name: 'Aura Freeze-Dried Golden Mango 100g',
    category: 'Makanan & Minuman Viral',
    availability: 'Ready Stock',
    badgeLabel: 'Ready Stock',
    isViral: false,
    price: 78000,
    weightGrams: 140,
    soldCountLabel: 'Terjual 420+',
    rating: 4.9,
    shortDesc:
      'Camilan mangga manis asli Bangkok yang renyah alami tanpa tambahan gula atau pengawet.',
    fullDesc:
      'Dibuat dari mangga Nam Dok Mai matang sempurna menggunakan teknologi freeze-dry sehingga nutrisi, rasa manis alami, dan kerenyahannya tetap terjaga.',
    image: '/src/assets/images/prod_mango_snack_1795602070136.jpg',
    variants: ['Original 100g', 'Paket Hemat 3 Pouch'],
    reviews: [
      {
        id: 'r9',
        author: 'Ibu Hendrawati',
        city: 'Bekasi',
        rating: 5,
        comment:
          'Camilan sehat favorit keluarga di rumah. Renyah dan manisnya pas dari buah asli.',
      },
      {
        id: 'r10',
        author: 'Dinda Oktavia',
        city: 'Malang',
        rating: 5,
        comment:
          'Kemasan ziplock rapi, isi potongan mangganya besar-besar tidak hancur.',
      },
    ],
  },
  {
    id: 'cha-thai-artisanal-box',
    name: 'Cha Thai Artisanal Milk Tea (Isi 10 Sachet)',
    category: 'Makanan & Minuman Viral',
    availability: 'Ready Stock',
    badgeLabel: 'Viral',
    isViral: true,
    price: 89000,
    weightGrams: 240,
    soldCountLabel: 'Terjual 360+',
    rating: 4.9,
    shortDesc:
      'Racikan Thai tea autentik praktis seduh, wangi rempah khas dan creamy seimbang.',
    fullDesc:
      'Satu kotak berisi 10 sachet racikan teh hitam Thailand premium dengan susu krimer lembut. Cukup seduh air hangat dan tambahkan es batu untuk sajian segar dalam 1 menit.',
    image: '/src/assets/images/prod_thai_tea_pack_1795602070549.jpg',
    variants: ['Original Sweet (10 Sachet)', 'Less Sugar (10 Sachet)'],
    reviews: [
      {
        id: 'r11',
        author: 'Ibu Ratna Dewi',
        city: 'Palembang',
        rating: 5,
        comment:
          'Varian Less Sugar-nya pas banget buat orang tua, wangi tehnya autentik seperti beli di Bangkok.',
      },
      {
        id: 'r12',
        author: 'Fajar Nugroho',
        city: 'Depok',
        rating: 5,
        comment:
          'Praktis banget buat stok di kantor, tinggal tambah es batu langsung segar.',
      },
    ],
  },
  {
    id: 'aura-herbal-inhaler-set',
    name: 'Aura Eucalyptus Mint Inhaler & Roll-On Set',
    category: 'Kebutuhan Rumah & Gaya Hidup',
    availability: 'Open PO',
    badgeLabel: 'Open PO',
    isViral: true,
    price: 135000,
    weightGrams: 130,
    soldCountLabel: 'Terjual 190+',
    rating: 4.9,
    shortDesc:
      'Set inhaler saku dan minyak roll-on aromaterapi eucalyptus mint untuk relaksasi instan.',
    fullDesc:
      'Desain casing brass dan sage-green yang estetik serta tahan lama. Membantu melegakan napas, mengurangi pusing saat perjalanan jauh, dan menenangkan pikiran.',
    image: '/src/assets/images/prod_aromatherapy_inhaler_1795602070510.jpg',
    variants: ['Set Inhaler + Roll-On', 'Inhaler Only'],
    reviews: [
      {
        id: 'r13',
        author: 'Ibu Veronica',
        city: 'Makassar',
        rating: 5,
        comment:
          'Wanginya menenangkan dan tidak menyengat seperti minyak angin biasa. Casingnya mewah buat kado.',
      },
      {
        id: 'r14',
        author: 'Bella Anindya',
        city: 'Jakarta Pusat',
        rating: 5,
        comment:
          'Wajib ada di tas kerja, ampuh banget pas lagi pusing di jalan macet.',
      },
    ],
  },
  {
    id: 'quilted-travel-organizer',
    name: 'Sawadhee Quilted Travel & Cosmetic Pouch',
    category: 'Kebutuhan Rumah & Gaya Hidup',
    availability: 'Ready Stock',
    badgeLabel: 'Ready Stock',
    isViral: false,
    price: 149000,
    weightGrams: 280,
    soldCountLabel: 'Terjual 115+',
    rating: 4.8,
    shortDesc:
      'Tas organizer empuk anti-percikan air dengan sekat rapi untuk skincare, makeup, atau kabel.',
    fullDesc:
      'Terbuat dari bahan nilon quilted lembut dengan resleting ganda kokoh. Muat botol skincare ukuran penuh maupun perlengkapan perjalanan keluarga agar koper tetap rapi.',
    image: '/src/assets/images/prod_organizer_pouch_1795602069917.jpg',
    variants: ['Sage Teal', 'Warm Oat'],
    reviews: [
      {
        id: 'r15',
        author: 'Ibu Melinda',
        city: 'Balikpapan',
        rating: 5,
        comment:
          'Jahitannya rapi sekali, muat banyak botol skincare dan gampang dibersihkan kalau kena bedak.',
      },
      {
        id: 'r16',
        author: 'Gita Larasati',
        city: 'Denpasar',
        rating: 5,
        comment:
          'Warna Sage Teal-nya cantik banget, sangat membantu merapikan isi koper waktu liburan.',
      },
    ],
  },
];

export interface ShippingZone {
  id: string;
  name: string;
  ratePerKg: number;
  estimateDays: string;
  note: string;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'jawa',
    name: 'Pulau Jawa (Jabodetabek, Bandung, Surabaya, dll.)',
    ratePerKg: 14000,
    estimateDays: '1 – 3 hari kerja',
    note: 'Tersedia reguler & same-day untuk area Jabodetabek.',
  },
  {
    id: 'sumatera',
    name: 'Sumatera (Medan, Palembang, Lampung, Padang, dll.)',
    ratePerKg: 24000,
    estimateDays: '2 – 5 hari kerja',
    note: 'Pengiriman udara/darat via JNE, J&T, atau SiCepat.',
  },
  {
    id: 'bali-nusra',
    name: 'Bali & Nusa Tenggara (Denpasar, Mataram, Kupang)',
    ratePerKg: 26000,
    estimateDays: '3 – 5 hari kerja',
    note: 'Packing lapis kardus & bubble wrap aman untuk botol kaca.',
  },
  {
    id: 'kalimantan',
    name: 'Kalimantan (Balikpapan, Banjarmasin, Pontianak)',
    ratePerKg: 34000,
    estimateDays: '3 – 6 hari kerja',
    note: 'Estimasi tarif reguler per kilogram (pembulatan ke atas).',
  },
  {
    id: 'sulawesi',
    name: 'Sulawesi (Makassar, Manado, Kendari, Palu)',
    ratePerKg: 38000,
    estimateDays: '4 – 7 hari kerja',
    note: 'Pengiriman prioritas untuk produk skincare & makanan.',
  },
  {
    id: 'maluku-papua',
    name: 'Maluku & Papua (Ambon, Jayapura, Sorong)',
    ratePerKg: 58000,
    estimateDays: '5 – 9 hari kerja',
    note: 'Tarif pastinya akan dikonfirmasi admin sesuai kode pos.',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara ikut Jastip atau memesan produk di By Sawadhee?',
    answer:
      'Pilih produk yang Anda inginkan lalu klik "+ Keranjang". Setelah selesai memilih, buka keranjang di pojok kanan atas, isi nama, alamat, dan metode pembayaran, lalu klik "Kirim Pesanan ke WhatsApp". Admin kami akan langsung memverifikasi stok atau kuota PO Anda.',
  },
  {
    id: 'faq-2',
    question: 'Apakah semua produk dijamin 100% original?',
    answer:
      'Ya, seluruh produk By Sawadhee dibeli langsung dari gerai resmi (official store), apotek ternama, dan distributor terverifikasi. Untuk pesanan Pre-Order Jastip, kami menyertakan bukti foto pembelanjaan dan tanggal kedaluwarsa yang jelas.',
  },
  {
    id: 'faq-3',
    question: 'Apakah bisa bayar di tempat (COD) atau harus DP dulu?',
    answer:
      'Untuk item Ready Stock tersedia opsi Transfer Bank, QRIS/E-Wallet, maupun COD ke seluruh area terjangkau kurir. Khusus produk Pre-Order Jastip bernilai di atas Rp 300.000, cukup DP 50% untuk mengamankan slot belanja dan pelunasan saat barang siap kirim.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana keamanan pengiriman untuk botol kaca atau snack?',
    answer:
      'Setiap pesanan dikemas standar ganda menggunakan bubble wrap tebal dan dus pelindung tanpa biaya tambahan. Jika terjadi kerusakan saat pengiriman, silakan rekam video unboxing dari awal paket tersegel untuk klaim penggantian atau pengembalian dana.',
  },
  {
    id: 'faq-5',
    question: 'Apakah bisa titip barang lain di luar katalog?',
    answer:
      'Bisa. Anda cukup klik tombol "Tanya Admin via WA" dan kirimkan foto atau nama produk yang dicari. Tim kami akan mengecek ketersediaan serta estimasi harga akhir sebelum jadwal belanja batch berakhir.',
  },
];
