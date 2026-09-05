// Command: node prisma/seed-master.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    // ─── ORDER STATUSES ─────────────────────────────────────────────
    console.log('Seeding order statuses...');
    const orderStatuses = [
        { label: 'Pending', code: 'PENDING', color: 'yellow', isDefault: true, isFinal: false, sortOrder: 1 },
        { label: 'Confirmed', code: 'CONFIRMED', color: 'blue', isDefault: false, isFinal: false, sortOrder: 2 },
        { label: 'Processing', code: 'PROCESSING', color: 'purple', isDefault: false, isFinal: false, sortOrder: 3 },
        { label: 'Shipped', code: 'SHIPPED', color: 'blue', isDefault: false, isFinal: false, sortOrder: 4 },
        { label: 'Delivered', code: 'DELIVERED', color: 'green', isDefault: false, isFinal: true, sortOrder: 5 },
        { label: 'Cancelled', code: 'CANCELLED', color: 'red', isDefault: false, isFinal: true, sortOrder: 6 },
        { label: 'Returned', code: 'RETURNED', color: 'orange', isDefault: false, isFinal: true, sortOrder: 7 },
    ];

    for (const status of orderStatuses) {
        await prisma.orderStatus.upsert({
            where: { code: status.code },
            update: {},
            create: status,
        });
    }
    console.log(`  ✅ ${orderStatuses.length} order statuses seeded`);

    const completedStatus = await prisma.orderStatus.findUnique({
        where: { code: 'COMPLETED' },
    });
    if (completedStatus) {
        const linkedOrders = await prisma.order.count({
            where: { statusId: completedStatus.id },
        });
        if (linkedOrders === 0) {
            await prisma.orderStatus.delete({ where: { id: completedStatus.id } });
            console.log('  🗑️  Removed unused COMPLETED order status');
        }
    }

    // ─── PAYMENT MODES ──────────────────────────────────────────────
    console.log('Seeding payment modes...');
    const paymentModes = [
        { label: 'Cash on Delivery', code: 'COD', isOnline: false, isActive: true, sortOrder: 1 },
        { label: 'UPI', code: 'UPI', isOnline: true, isActive: true, sortOrder: 2 },
        // Card retired — online pays via UPI mode (Razorpay shows all instruments). Keep row for historical orders.
        { label: 'Card', code: 'CARD', isOnline: true, isActive: false, sortOrder: 3 },
    ];

    for (const mode of paymentModes) {
        await prisma.paymentMode.upsert({
            where: { code: mode.code },
            update: {
                label: mode.label,
                isOnline: mode.isOnline,
                isActive: mode.isActive,
                sortOrder: mode.sortOrder,
            },
            create: mode,
        });
    }
    console.log(`  ✅ ${paymentModes.length} payment modes seeded`);

    // ─── CURRENCIES ─────────────────────────────────────────────────
    console.log('Seeding currencies...');
    await prisma.currency.upsert({
        where: { code: 'INR' },
        update: {},
        create: {
            code: 'INR',
            name: 'Indian Rupee',
            symbol: '₹',
            symbolPosition: 'before',
            decimalSeparator: '.',
            thousandSeparator: ',',
            exchangeRate: 1,
            isDefault: true,
            isActive: true,
        },
    });
    console.log('  ✅ INR currency seeded');

    // ─── UNITS ──────────────────────────────────────────────────────
    console.log('Seeding units...');
    const units = [
        { name: 'Milliliter', symbol: 'ml', type: 'volume', sortOrder: 1 },
        { name: 'Liter', symbol: 'L', type: 'volume', sortOrder: 2 },
        { name: 'Gram', symbol: 'g', type: 'weight', sortOrder: 3 },
        { name: 'Kilogram', symbol: 'kg', type: 'weight', sortOrder: 4 },
        { name: 'Piece', symbol: 'pc', type: 'count', sortOrder: 5 },
    ];

    for (const unit of units) {
        const existing = await prisma.unit.findFirst({ where: { symbol: unit.symbol } });
        if (!existing) {
            await prisma.unit.create({ data: unit });
        }
    }
    console.log(`  ✅ ${units.length} units seeded`);

    // ─── TAX CLASSES ────────────────────────────────────────────────
    console.log('Seeding tax classes...');
    const taxClasses = [
        { name: 'GST 18%', rate: 18.00, isDefault: false, isActive: true },
        { name: 'GST 12%', rate: 12.00, isDefault: false, isActive: true },
        { name: 'GST 5%', rate: 5.00, isDefault: false, isActive: true },
        { name: 'Exempt (Fresh Flowers)', rate: 0.00, isDefault: true, isActive: true },
    ];

    // Only the exempt fresh-flowers class should carry isDefault — clear any stale flag first.
    await prisma.taxClass.updateMany({
        where: { name: { not: 'Exempt (Fresh Flowers)' } },
        data: { isDefault: false },
    });

    for (const tax of taxClasses) {
        const existing = await prisma.taxClass.findFirst({ where: { name: tax.name } });
        if (!existing) {
            await prisma.taxClass.create({ data: tax });
        } else if (existing.isDefault !== tax.isDefault) {
            await prisma.taxClass.update({ where: { id: existing.id }, data: { isDefault: tax.isDefault } });
        }
    }
    console.log(`  ✅ ${taxClasses.length} tax classes seeded`);

    const legacyExempt = await prisma.taxClass.findFirst({ where: { name: 'Exempt' } });
    if (legacyExempt) {
        const linkedProducts = await prisma.product.count({ where: { taxClassId: legacyExempt.id } });
        if (linkedProducts === 0) {
            await prisma.taxClass.delete({ where: { id: legacyExempt.id } });
            console.log('  🗑️  Removed unused Exempt tax class');
        }
    }

    // ─── CATEGORIES ─────────────────────────────────────────────────
    console.log('Seeding categories...');
    const categoryTree = [
        {
            name: 'Bouquets', slug: 'bouquets', sortOrder: 1,
            children: [
                { name: 'Rose Bouquets', slug: 'rose-bouquets', sortOrder: 1 },
                { name: 'Mixed Flower Bouquets', slug: 'mixed-bouquets', sortOrder: 2 },
                { name: 'Premium & Luxury', slug: 'premium-bouquets', sortOrder: 3 },
                { name: 'Dried & Preserved', slug: 'dried-flowers', sortOrder: 4 },
            ],
        },
        {
            name: 'Cakes', slug: 'cakes', sortOrder: 2,
            children: [
                { name: 'Birthday Cakes', slug: 'birthday-cakes', sortOrder: 1 },
                { name: 'Anniversary Cakes', slug: 'anniversary-cakes', sortOrder: 2 },
                { name: 'Photo Cakes', slug: 'photo-cakes', sortOrder: 3 },
                { name: 'Cupcakes & Jars', slug: 'cupcakes', sortOrder: 4 },
            ],
        },
        {
            // Slug MUST stay "gift-set" — giftset.service.js hardcodes this slug for the bundle feature.
            name: 'Gift Hampers', slug: 'gift-set', sortOrder: 3,
            children: [
                { name: 'Chocolate Hampers', slug: 'chocolate-hampers', sortOrder: 1 },
                { name: 'Spa & Wellness', slug: 'spa-hampers', sortOrder: 2 },
                { name: 'Combo Hampers', slug: 'combo-hampers', sortOrder: 3 },
            ],
        },
        {
            name: 'Plants', slug: 'plants', sortOrder: 4,
            children: [
                { name: 'Indoor Plants', slug: 'indoor-plants', sortOrder: 1 },
                { name: 'Succulents & Terrariums', slug: 'succulents', sortOrder: 2 },
            ],
        },
        {
            name: 'Personalized Gifts', slug: 'personalized-gifts', sortOrder: 5,
            children: [
                { name: 'Photo Frames & Mugs', slug: 'photo-frames-mugs', sortOrder: 1 },
                { name: 'Cushions & Keepsakes', slug: 'cushions-keepsakes', sortOrder: 2 },
            ],
        },
        {
            name: 'Chocolates & Sweets', slug: 'chocolates-sweets', sortOrder: 6,
            children: [],
        },
        // Utility categories for the storefront "Build Your Own Bouquet" feature. Not part of
        // normal nav — the frontend fetches these two by slug directly.
        {
            name: 'Bouquet Builder – Stems', slug: 'bouquet-builder-stems', sortOrder: 100,
            children: [],
        },
        {
            name: 'Bouquet Builder – Add-ons', slug: 'bouquet-builder-addons', sortOrder: 101,
            children: [],
        },
    ];

    const upsertCategory = async ({ name, slug, sortOrder, parentId = null }) => {
        const existing = await prisma.category.findFirst({ where: { slug, parentId } });
        if (existing) {
            return prisma.category.update({
                where: { id: existing.id },
                data: { name, sortOrder, isActive: true },
            });
        }
        return prisma.category.create({
            data: { name, slug, sortOrder, parentId, isActive: true },
        });
    };

    let categoryCount = 0;
    for (const { children = [], ...parentData } of categoryTree) {
        const parent = await upsertCategory(parentData);
        categoryCount += 1;
        for (const child of children) {
            await upsertCategory({ ...child, parentId: parent.id });
            categoryCount += 1;
        }
    }
    console.log(`  ✅ ${categoryCount} categories seeded (${categoryTree.length} top-level)`);

    // ─── SHIPPING SETTINGS & METHODS ────────────────────────────────
    console.log('Seeding shipping settings...');
    await prisma.shippingSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            defaultShippingFee: 99,
            freeShippingThreshold: 999,
            isFreeShippingEnabled: true,
        },
    });
    console.log('  ✅ Shipping settings seeded');

    console.log('Seeding shipping methods...');
    const shippingMethods = [
        {
            name: 'Standard Delivery',
            code: 'standard',
            fee: 99,
            deliveryLabel: '5–7 business days',
            isDefault: true,
            isActive: true,
            sortOrder: 1,
        },
        {
            name: 'Express Delivery',
            code: 'express',
            fee: 199,
            deliveryLabel: '2–3 business days',
            isDefault: false,
            isActive: true,
            sortOrder: 2,
        },
    ];

    for (const method of shippingMethods) {
        await prisma.shippingMethod.upsert({
            where: { code: method.code },
            update: {
                name: method.name,
                fee: method.fee,
                deliveryLabel: method.deliveryLabel,
                isDefault: method.isDefault,
                isActive: method.isActive,
                sortOrder: method.sortOrder,
            },
            create: method,
        });
    }
    console.log(`  ✅ ${shippingMethods.length} shipping methods seeded`);

    console.log('\n✅ All master data seeded successfully');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });