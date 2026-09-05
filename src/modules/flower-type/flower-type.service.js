const prisma = require('../../config/db');
const slugify = require('../../utils/slugify');
const { getOrSetCache, invalidateNamespace } = require('../../utils/cache');

const CACHE_TTL = 300;
const invalidateFlowerTypeCache = () => invalidateNamespace('flowertype');

const mapType = (row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
});

const getAllTypes = async ({ activeOnly = false } = {}) => {
    const rows = await prisma.flowerType.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map(mapType);
};

const getPublicTypes = async () =>
    getOrSetCache(['flowertype'], ['public'], CACHE_TTL, () => getAllTypes({ activeOnly: true }));

const getTypeById = async (id) => {
    const row = await prisma.flowerType.findUnique({ where: { id } });
    if (!row) {
        const err = new Error('Flower type not found');
        err.statusCode = 404;
        throw err;
    }
    return mapType(row);
};

const createType = async ({ name, slug, imageUrl, sortOrder, isActive }) => {
    const resolvedSlug = slugify(slug || name);
    const existing = await prisma.flowerType.findUnique({ where: { slug: resolvedSlug } });
    if (existing) {
        const err = new Error('A flower type with this slug already exists');
        err.statusCode = 409;
        throw err;
    }

    const maxOrder = await prisma.flowerType.aggregate({ _max: { sortOrder: true } });
    const row = await prisma.flowerType.create({
        data: {
            name,
            slug: resolvedSlug,
            imageUrl: imageUrl || null,
            sortOrder: sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
            isActive: isActive ?? true,
        },
    });
    await invalidateFlowerTypeCache();
    return mapType(row);
};

const updateType = async (id, data) => {
    await getTypeById(id);

    if (data.name && !data.slug) {
        data.slug = slugify(data.name);
    } else if (data.slug) {
        data.slug = slugify(data.slug);
    }

    if (data.slug) {
        const clash = await prisma.flowerType.findFirst({
            where: { slug: data.slug, NOT: { id } },
        });
        if (clash) {
            const err = new Error('A flower type with this slug already exists');
            err.statusCode = 409;
            throw err;
        }
    }

    const row = await prisma.flowerType.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.slug !== undefined ? { slug: data.slug } : {}),
            ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
            ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
            ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
    });
    await invalidateFlowerTypeCache();
    return mapType(row);
};

const deleteType = async (id) => {
    await getTypeById(id);
    await prisma.flowerType.delete({ where: { id } });
    await invalidateFlowerTypeCache();
};

const reorderTypes = async (orderedIds) => {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        const err = new Error('orderedIds must be a non-empty array');
        err.statusCode = 400;
        throw err;
    }

    await prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.flowerType.update({
                where: { id },
                data: { sortOrder: index },
            }),
        ),
    );

    await invalidateFlowerTypeCache();

    return getAllTypes();
};

module.exports = {
    getAllTypes,
    getPublicTypes,
    getTypeById,
    createType,
    updateType,
    deleteType,
    reorderTypes,
};
