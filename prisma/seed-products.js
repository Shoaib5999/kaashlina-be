/**
 * Seed catalog — Bouquets, Cakes, Gift Hampers, Plants, Personalized Gifts,
 * Chocolates & Sweets, plus the two "Build Your Own Bouquet" utility categories.
 *
 * Prerequisites:
 *   - Postgres running + migrations applied
 *   - Master data: npm run seed:master
 *   - Flower types: npm run seed:flower-types
 *   - Occasions: node prisma/seed-occasions.js
 *
 * Run: npm run seed:products
 *
 * Product photography: each product gets a curated Unsplash stock photo as a
 * placeholder image, since we don't have per-product photography yet. Replace
 * with real per-product photos via the admin upload UI whenever available.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const slugify = require('../src/utils/slugify');
const { normalizeSKU } = require('../src/utils/variant-sku');
const { CATALOG_DETAILS } = require('./product-catalog-details');

const prisma = new PrismaClient();

// Storefront collection badges (stored as badge:<slug> in product tags)
const BADGE = {
  BEST_SELLERS: 'best-sellers',
  NEW_ARRIVALS: 'new-arrivals',
};

// ─── Image pools (verified Unsplash direct URLs, reused sensibly by type) ───

const unsplash = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const FLOWER_IMAGES = [
  'photo-1490750967868-88aa4486c946',
  'photo-1487070183336-b863922373d4',
  'photo-1518895949257-7621c3c786d7',
  'photo-1519378058457-4c29a0a2efac',
  'photo-1465146344425-f00d5f5c8f07',
  'photo-1509440159596-0249088772ff',
  'photo-1560184897-ae75f418493e',
  'photo-1464349095431-e9a21285b5f3',
  'photo-1478146059778-26028b07395a',
  'photo-1522673607200-164d1b6ce486',
  'photo-1571781926291-c477ebfd024b',
  'photo-1522770179533-24471fcdba45',
  'photo-1587049633312-d628ae50a8ae',
  'photo-1533038590840-1cde6e668a91',
  'photo-1519681393784-d120267933ba',
  'photo-1558636508-e0db3814bd1d',
  'photo-1464349153735-7db50ed83c84',
  'photo-1571115177098-24ec42ed204d',
].map(unsplash);

const CAKE_IMAGES = [
  'photo-1550617931-e17a7b70dce2',
  'photo-1519750783826-e2420f4d687f',
  'photo-1464195244916-405fa0a82545',
  'photo-1486427944299-d1955d23e34d',
  'photo-1587668178277-295251f900ce',
  'photo-1607478900766-efe13248b125',
].map(unsplash);

const GIFT_IMAGES = [
  'photo-1567620905732-2d1ec7ab7445',
  'photo-1517686469429-8bdb88b9f907',
  'photo-1512428813834-c702c7702b78',
  'photo-1544787219-7f47ccb76574',
  'photo-1587502537745-84b86da1204f',
  'photo-1519741497674-611481863552',
  'photo-1587393855524-087f83d95bc9',
  'photo-1523294587484-bae6cc870010',
  'photo-1531956531700-dc0ee0f1f9a5',
  'photo-1502741224143-90386d7f8c82',
  'photo-1494972308805-463bc619d34e',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1520763185298-1b434c919102',
  'photo-1425421669292-0c3da3b8f529',
].map(unsplash);

// ─── Variant helpers (variantLabel is the only thing ever shown to buyers;   ─
// ─ sortValue is purely for internal ordering, no implied unit)              ─

const bouquetVariants = (p6, p12, p24) => [
  { variantLabel: '6 Stems', sortValue: 6, price: p6 },
  { variantLabel: '12 Stems', sortValue: 12, price: p12 },
  { variantLabel: '24 Stems', sortValue: 24, price: p24 },
];

const cakeVariants = (p500g, p1kg, p2kg) => [
  { variantLabel: '500g', sortValue: 500, price: p500g },
  { variantLabel: '1kg', sortValue: 1000, price: p1kg },
  { variantLabel: '2kg', sortValue: 2000, price: p2kg },
];

const countVariants = (unitLabel, c1, c2, c3, p1, p2, p3) => [
  { variantLabel: `${unitLabel} of ${c1}`, sortValue: c1, price: p1 },
  { variantLabel: `${unitLabel} of ${c2}`, sortValue: c2, price: p2 },
  { variantLabel: `${unitLabel} of ${c3}`, sortValue: c3, price: p3 },
];

const hamperVariants = (pS, pM, pL) => [
  { variantLabel: 'Small', sortValue: 1, price: pS },
  { variantLabel: 'Medium', sortValue: 2, price: pM },
  { variantLabel: 'Large', sortValue: 3, price: pL },
];

const plantVariants = (p6in, p10in) => [
  { variantLabel: '6-inch Pot', sortValue: 6, price: p6in },
  { variantLabel: '10-inch Pot', sortValue: 10, price: p10in },
];

const personalizedVariants = (pClassic, pPremium) => [
  { variantLabel: 'Classic', sortValue: 1, price: pClassic },
  { variantLabel: 'Premium', sortValue: 2, price: pPremium },
];

const chocolateBoxVariants = (p250, p500, p1kg) => [
  { variantLabel: '250g Box', sortValue: 250, price: p250 },
  { variantLabel: '500g Box', sortValue: 500, price: p500 },
  { variantLabel: '1kg Box', sortValue: 1000, price: p1kg },
];

const singleVariant = (label, price) => [{ variantLabel: label, sortValue: 1, price }];

// ─── Product catalog ─────────────────────────────────────────────────────────
// categorySlug is the CHILD category slug (or the parent slug for categories
// with no children, e.g. chocolates-sweets and the two builder categories).

const PRODUCTS = [
  // ── BOUQUETS ──────────────────────────────────────────────────────────────
  {
    name: 'Crimson Rose Bouquet',
    categorySlug: 'rose-bouquets',
    flowerSlugs: ['rose'],
    occasionSlugs: ['romance-apology', 'birthday'],
    badge: BADGE.BEST_SELLERS,
    variants: bouquetVariants(599, 1099, 1999),
    image: FLOWER_IMAGES[0],
  },
  {
    name: 'Pastel Pink Rose Bouquet',
    categorySlug: 'rose-bouquets',
    flowerSlugs: ['rose'],
    occasionSlugs: ['anniversary'],
    variants: bouquetVariants(649, 1149, 2099),
    image: FLOWER_IMAGES[1],
  },
  {
    name: 'Rainbow Garden Bouquet',
    categorySlug: 'mixed-bouquets',
    flowerSlugs: ['mixed'],
    occasionSlugs: ['birthday'],
    badge: BADGE.NEW_ARRIVALS,
    variants: bouquetVariants(549, 999, 1799),
    image: FLOWER_IMAGES[2],
  },
  {
    name: 'Spring Meadow Mixed Bouquet',
    categorySlug: 'mixed-bouquets',
    flowerSlugs: ['mixed'],
    occasionSlugs: ['get-well-soon'],
    variants: bouquetVariants(499, 899, 1599),
    image: FLOWER_IMAGES[3],
  },
  {
    name: 'Lavish Orchid & Lily Arrangement',
    categorySlug: 'premium-bouquets',
    flowerSlugs: ['orchid', 'lily'],
    occasionSlugs: ['wedding'],
    badge: BADGE.BEST_SELLERS,
    variants: bouquetVariants(999, 1799, 3199),
    image: FLOWER_IMAGES[4],
  },
  {
    name: 'Grand Peony Luxe Bouquet',
    categorySlug: 'premium-bouquets',
    flowerSlugs: ['peony'],
    occasionSlugs: ['anniversary'],
    variants: bouquetVariants(1099, 1999, 3499),
    image: FLOWER_IMAGES[5],
  },
  {
    name: 'Everlasting Dried Bouquet',
    categorySlug: 'dried-flowers',
    flowerSlugs: ['mixed'],
    occasionSlugs: ['housewarming'],
    variants: bouquetVariants(799, 1399, 2499),
    image: FLOWER_IMAGES[6],
  },

  // ── CAKES ─────────────────────────────────────────────────────────────────
  {
    name: 'Chocolate Truffle Birthday Cake',
    categorySlug: 'birthday-cakes',
    occasionSlugs: ['birthday'],
    badge: BADGE.BEST_SELLERS,
    variants: cakeVariants(549, 949, 1749),
    image: CAKE_IMAGES[0],
  },
  {
    name: 'Rainbow Sprinkle Cake',
    categorySlug: 'birthday-cakes',
    occasionSlugs: ['birthday'],
    variants: cakeVariants(599, 999, 1849),
    image: CAKE_IMAGES[1],
  },
  {
    name: 'Red Velvet Anniversary Cake',
    categorySlug: 'anniversary-cakes',
    occasionSlugs: ['anniversary'],
    variants: cakeVariants(649, 1099, 1999),
    image: CAKE_IMAGES[2],
  },
  {
    name: 'Two-Tier Vanilla Bliss Cake',
    categorySlug: 'anniversary-cakes',
    occasionSlugs: ['anniversary'],
    badge: BADGE.NEW_ARRIVALS,
    variants: cakeVariants(699, 1199, 2199),
    image: CAKE_IMAGES[3],
  },
  {
    name: 'Custom Photo Print Cake',
    categorySlug: 'photo-cakes',
    occasionSlugs: ['birthday'],
    variants: cakeVariants(649, 1149, 2099),
    image: CAKE_IMAGES[4],
  },
  {
    name: 'Personalized Photo Cake (Chocolate)',
    categorySlug: 'photo-cakes',
    occasionSlugs: ['congratulations'],
    variants: cakeVariants(699, 1199, 2199),
    image: CAKE_IMAGES[5],
  },
  {
    name: 'Assorted Cupcake Box',
    categorySlug: 'cupcakes',
    occasionSlugs: ['birthday'],
    variants: countVariants('Box', 6, 12, 24, 349, 649, 1199),
    image: CAKE_IMAGES[0],
  },
  {
    name: 'Chocolate Jar Cake Duo',
    categorySlug: 'cupcakes',
    occasionSlugs: ['just-because'],
    badge: BADGE.NEW_ARRIVALS,
    variants: [
      { variantLabel: '2 Jars', sortValue: 2, price: 399 },
      { variantLabel: '4 Jars', sortValue: 4, price: 749 },
      { variantLabel: '6 Jars', sortValue: 6, price: 1099 },
    ],
    image: CAKE_IMAGES[1],
  },

  // ── GIFT HAMPERS ──────────────────────────────────────────────────────────
  {
    name: 'Premium Chocolate Gift Hamper',
    categorySlug: 'chocolate-hampers',
    occasionSlugs: ['congratulations'],
    badge: BADGE.BEST_SELLERS,
    variants: hamperVariants(899, 1599, 2699),
    image: GIFT_IMAGES[0],
  },
  {
    name: 'Belgian Chocolate Delight Box',
    categorySlug: 'chocolate-hampers',
    occasionSlugs: ['corporate'],
    variants: hamperVariants(799, 1399, 2399),
    image: GIFT_IMAGES[1],
  },
  {
    name: 'Relax & Rejuvenate Spa Hamper',
    categorySlug: 'spa-hampers',
    occasionSlugs: ['get-well-soon'],
    variants: hamperVariants(999, 1799, 2999),
    image: GIFT_IMAGES[2],
  },
  {
    name: 'Aroma Wellness Gift Set',
    categorySlug: 'spa-hampers',
    occasionSlugs: ['housewarming'],
    variants: hamperVariants(849, 1549, 2649),
    image: GIFT_IMAGES[3],
  },
  {
    name: 'Flowers & Cake Combo Hamper',
    categorySlug: 'combo-hampers',
    occasionSlugs: ['birthday'],
    badge: BADGE.BEST_SELLERS,
    variants: hamperVariants(1099, 1899, 3199),
    image: GIFT_IMAGES[4],
  },
  {
    name: 'Cake & Chocolates Celebration Combo',
    categorySlug: 'combo-hampers',
    occasionSlugs: ['anniversary'],
    variants: hamperVariants(999, 1749, 2949),
    image: GIFT_IMAGES[5],
  },

  // ── PLANTS ────────────────────────────────────────────────────────────────
  {
    name: 'Money Plant in Ceramic Pot',
    categorySlug: 'indoor-plants',
    occasionSlugs: ['housewarming'],
    badge: BADGE.NEW_ARRIVALS,
    variants: plantVariants(399, 699),
    image: GIFT_IMAGES[6],
  },
  {
    name: 'Areca Palm Indoor Plant',
    categorySlug: 'indoor-plants',
    occasionSlugs: ['housewarming'],
    variants: plantVariants(499, 849),
    image: GIFT_IMAGES[7],
  },
  {
    name: 'Assorted Succulent Trio',
    categorySlug: 'succulents',
    occasionSlugs: ['just-because'],
    variants: plantVariants(349, 599),
    image: GIFT_IMAGES[8],
  },
  {
    name: 'Glass Terrarium Garden',
    categorySlug: 'succulents',
    occasionSlugs: ['corporate'],
    badge: BADGE.NEW_ARRIVALS,
    variants: plantVariants(599, 999),
    image: GIFT_IMAGES[9],
  },

  // ── PERSONALIZED GIFTS ────────────────────────────────────────────────────
  {
    name: 'Personalized Photo Mug',
    categorySlug: 'photo-frames-mugs',
    occasionSlugs: ['birthday'],
    variants: personalizedVariants(399, 599),
    image: GIFT_IMAGES[10],
  },
  {
    name: 'Custom Engraved Photo Frame',
    categorySlug: 'photo-frames-mugs',
    occasionSlugs: ['anniversary'],
    variants: personalizedVariants(499, 799),
    image: GIFT_IMAGES[11],
  },
  {
    name: 'Personalized Photo Cushion',
    categorySlug: 'cushions-keepsakes',
    occasionSlugs: ['just-because'],
    variants: personalizedVariants(549, 849),
    image: GIFT_IMAGES[12],
  },
  {
    name: 'Engraved Wooden Keepsake Box',
    categorySlug: 'cushions-keepsakes',
    occasionSlugs: ['farewell'],
    badge: BADGE.NEW_ARRIVALS,
    variants: personalizedVariants(699, 1099),
    image: GIFT_IMAGES[13],
  },

  // ── CHOCOLATES & SWEETS (no sub-categories) ──────────────────────────────
  {
    name: 'Assorted Belgian Chocolate Box',
    categorySlug: 'chocolates-sweets',
    occasionSlugs: ['congratulations'],
    badge: BADGE.BEST_SELLERS,
    variants: chocolateBoxVariants(399, 699, 1299),
    image: GIFT_IMAGES[0],
  },

  // ── BOUQUET BUILDER · STEMS (single-variant, sold per stem/bunch) ────────
  {
    name: 'Red Rose (Single Stem)',
    categorySlug: 'bouquet-builder-stems',
    flowerSlugs: ['rose'],
    variants: singleVariant('1 Stem', 79),
    image: FLOWER_IMAGES[7],
  },
  {
    name: 'White Lily (Single Stem)',
    categorySlug: 'bouquet-builder-stems',
    flowerSlugs: ['lily'],
    variants: singleVariant('1 Stem', 99),
    image: FLOWER_IMAGES[8],
  },
  {
    name: 'Pink Tulip (Single Stem)',
    categorySlug: 'bouquet-builder-stems',
    flowerSlugs: ['tulip'],
    variants: singleVariant('1 Stem', 89),
    image: FLOWER_IMAGES[9],
  },
  {
    name: 'Pink Peony (Single Stem)',
    categorySlug: 'bouquet-builder-stems',
    flowerSlugs: ['peony'],
    variants: singleVariant('1 Stem', 149),
    image: FLOWER_IMAGES[10],
  },
  {
    name: 'Eucalyptus Filler',
    categorySlug: 'bouquet-builder-stems',
    variants: singleVariant('1 Bunch', 59),
    image: FLOWER_IMAGES[11],
  },
  {
    name: "Baby's Breath Filler",
    categorySlug: 'bouquet-builder-stems',
    variants: singleVariant('1 Bunch', 49),
    image: FLOWER_IMAGES[12],
  },

  // ── BOUQUET BUILDER · ADD-ONS (single-variant) ───────────────────────────
  {
    name: 'Satin Ribbon',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 49),
    image: GIFT_IMAGES[1],
  },
  {
    name: 'Premium Wrapping Paper',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 99),
    image: GIFT_IMAGES[2],
  },
  {
    name: 'Handwritten Greeting Card',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 49),
    image: GIFT_IMAGES[3],
  },
  {
    name: 'Box of Chocolates',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 299),
    image: GIFT_IMAGES[4],
  },
  {
    name: 'Small Teddy Bear',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 399),
    image: GIFT_IMAGES[5],
  },
  {
    name: 'Scented Candle',
    categorySlug: 'bouquet-builder-addons',
    variants: singleVariant('Standard', 349),
    image: GIFT_IMAGES[6],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Deterministic 40–80 placeholder stock quantity, derived from the SKU. */
const stockQtyForSku = (sku) => {
  let hash = 0;
  for (let i = 0; i < sku.length; i += 1) {
    hash = (hash * 31 + sku.charCodeAt(i)) >>> 0;
  }
  return 40 + (hash % 41);
};

const buildTags = ({ flowerSlugs = [], occasionSlugs = [], badge = null }) => {
  const parts = [];
  if (badge) parts.push(`badge:${badge}`);
  flowerSlugs.forEach((slug) => parts.push(`flower:${slug}`));
  occasionSlugs.forEach((slug) => parts.push(`occasion:${slug}`));
  return parts.join(',');
};

const resolveCatalogDetails = (slug) => {
  const details = CATALOG_DETAILS[slug];
  if (!details) {
    throw new Error(`Missing catalog details for slug "${slug}". Add an entry to product-catalog-details.js.`);
  }
  if (!details.description || !details.storefrontMeta) {
    throw new Error(`Incomplete catalog details for slug "${slug}".`);
  }
  return details;
};

/** Derive a stable, readable SKU suffix from the variant's customer-facing label. */
const variantSkuSuffix = (label) => slugify(label).toUpperCase();

const buildVariantDefs = (slug, variants) =>
  variants.map(({ variantLabel, sortValue, price }) => {
    const productPart = slug.replace(/-/g, '').toUpperCase();
    const sku = normalizeSKU(`KSH-${productPart}-${variantSkuSuffix(variantLabel)}`);
    return {
      variantLabel,
      sortValue,
      price,
      compareAtPrice: null,
      stockQty: stockQtyForSku(sku),
      sku,
    };
  });

const syncVariants = async (productId, variantDefs) => {
  for (const v of variantDefs) {
    const existing = await prisma.productVariant.findUnique({ where: { sku: v.sku } });

    if (existing) {
      if (existing.productId !== productId) {
        throw new Error(`SKU ${v.sku} already belongs to another product (${existing.productId})`);
      }
      await prisma.productVariant.update({
        where: { id: existing.id },
        data: {
          variantLabel: v.variantLabel,
          sortValue: v.sortValue,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stockQty: v.stockQty,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.productVariant.create({
      data: {
        productId,
        variantLabel: v.variantLabel,
        sortValue: v.sortValue,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stockQty: v.stockQty,
        sku: v.sku,
        isActive: true,
      },
    });
  }

  const keepSkus = variantDefs.map((v) => v.sku);
  await prisma.productVariant.updateMany({
    where: { productId, sku: { notIn: keepSkus } },
    data: { isActive: false },
  });
};

/** Assign (or refresh) the product's primary image from its curated stock photo URL. */
const ensureProductImage = async (productId, imageUrl) => {
  if (!imageUrl) return;

  const existing = await prisma.productImage.findFirst({
    where: { productId, isPrimary: true },
  });

  if (existing) {
    if (existing.url !== imageUrl) {
      await prisma.productImage.update({
        where: { id: existing.id },
        data: { url: imageUrl, cloudinaryId: imageUrl },
      });
    }
    return;
  }

  await prisma.productImage.create({
    data: {
      productId,
      cloudinaryId: imageUrl,
      url: imageUrl,
      isPrimary: true,
      sortOrder: 0,
    },
  });
};

const upsertProduct = async ({
  name,
  slug,
  categoryId,
  brandId,
  taxClassId,
  tags,
  storefrontMeta,
  description,
  variantDefs,
  image,
  sortOrder = 0,
}) => {
  let product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true },
  });

  const payload = {
    name,
    description,
    categoryId,
    brandId,
    taxClassId,
    tags,
    storefrontMeta,
    isActive: true,
    sortOrder,
  };

  if (product) {
    product = await prisma.product.update({
      where: { id: product.id },
      data: payload,
      include: { images: true, variants: true },
    });
    console.log(`  ↻  Updated : ${name}`);
  } else {
    product = await prisma.product.create({
      data: { slug, ...payload },
      include: { images: true, variants: true },
    });
    console.log(`  ✅ Created : ${name}`);
  }

  await syncVariants(product.id, variantDefs);
  await ensureProductImage(product.id, image);

  return product;
};

const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findFirst({ where: { slug } });
  if (!category) {
    throw new Error(`Category "${slug}" not found. Run npm run seed:master first.`);
  }
  return category;
};

const ensureDefaultTaxClass = async () =>
  (await prisma.taxClass.findFirst({ where: { isDefault: true } })) ||
  (await prisma.taxClass.findFirst({ where: { name: 'Exempt (Fresh Flowers)' } })) ||
  prisma.taxClass.create({
    data: { name: 'Exempt (Fresh Flowers)', rate: 0, isDefault: true, isActive: true },
  });

const ensureKaashlinaBrand = async () =>
  prisma.brand.upsert({
    where: { slug: 'kaashlina' },
    update: { name: 'Kaashlina', isActive: true, isFeatured: true },
    create: {
      name: 'Kaashlina',
      slug: 'kaashlina',
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
  });

const productSlug = (def) => def.slug || slugify(def.name);

const collectSeedSlugs = () => PRODUCTS.map(productSlug);

const archiveLegacyProducts = async (keepSlugs) => {
  const legacy = await prisma.product.findMany({
    where: { slug: { notIn: keepSlugs } },
    select: { id: true, slug: true, name: true },
  });

  if (!legacy.length) {
    console.log('  No legacy products to archive.\n');
    return 0;
  }

  console.log(`\n🗑  Archiving ${legacy.length} product(s) not in current seed...\n`);

  for (const product of legacy) {
    await prisma.productVariant.updateMany({
      where: { productId: product.id },
      data: { isActive: false },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { isActive: false },
    });
    console.log(`  ✕  Archived : ${product.name} (${product.slug})`);
  }

  return legacy.length;
};

const assertCatalogCoverage = () => {
  const seedSlugs = collectSeedSlugs();
  const missing = seedSlugs.filter((slug) => !CATALOG_DETAILS[slug]);
  if (missing.length) {
    throw new Error(`Missing catalog details for: ${missing.join(', ')}`);
  }

  const extra = Object.keys(CATALOG_DETAILS).filter((slug) => !seedSlugs.includes(slug));
  if (extra.length) {
    throw new Error(`Orphan catalog details (no seed product): ${extra.join(', ')}`);
  }
};

async function main() {
  console.log('🌸 Seeding Bouquets, Cakes, Gift Hampers, Plants, Personalized Gifts & Chocolates...\n');

  assertCatalogCoverage();

  const seedSlugs = collectSeedSlugs();
  await archiveLegacyProducts(seedSlugs);

  const [taxClass, brand] = await Promise.all([ensureDefaultTaxClass(), ensureKaashlinaBrand()]);

  console.log(`  Brand       : ${brand.name}`);
  console.log(`  Tax class   : ${taxClass.name}\n`);

  const categoryCache = new Map();
  const resolveCategory = async (slug) => {
    if (!categoryCache.has(slug)) {
      categoryCache.set(slug, await getCategoryBySlug(slug));
    }
    return categoryCache.get(slug);
  };

  let created = 0;
  let updated = 0;

  for (let index = 0; index < PRODUCTS.length; index += 1) {
    const def = PRODUCTS[index];
    const slug = productSlug(def);
    const catalog = resolveCatalogDetails(slug);
    const category = await resolveCategory(def.categorySlug);
    const before = await prisma.product.findUnique({ where: { slug } });

    await upsertProduct({
      slug,
      name: def.name,
      categoryId: category.id,
      brandId: brand.id,
      taxClassId: taxClass.id,
      tags: buildTags(def),
      storefrontMeta: catalog.storefrontMeta,
      description: catalog.description,
      variantDefs: buildVariantDefs(slug, def.variants),
      image: def.image,
      sortOrder: index + 1,
    });

    before ? updated++ : created++;
  }

  console.log('\n────────────────────────────────────────────────────');
  console.log(`✅ Done. ${created + updated} products processed.`);
  console.log(`   New: ${created} | Updated: ${updated}`);
  console.log(`   Total products in seed : ${PRODUCTS.length}`);
  console.log('   Brand                  : Kaashlina (all products)');
}

main()
  .catch((err) => {
    console.error('\n❌ seed-products failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
