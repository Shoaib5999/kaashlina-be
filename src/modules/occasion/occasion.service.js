const prisma = require('../../config/db');
const slugify = require('../../utils/slugify');
const { getOrSetCache, invalidateNamespace } = require('../../utils/cache');

const CACHE_TTL = 300;
const invalidateOccasionCache = () => invalidateNamespace('occasion');

const mapOccasion = (row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
});

const getAllOccasions = async ({ activeOnly = false } = {}) => {
    const rows = await prisma.occasion.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map(mapOccasion);
};

const getPublicOccasions = async () =>
    getOrSetCache(['occasion'], ['public'], CACHE_TTL, () => getAllOccasions({ activeOnly: true }));

const getOccasionById = async (id) => {
    const row = await prisma.occasion.findUnique({ where: { id } });
    if (!row) {
        const err = new Error('Occasion not found');
        err.statusCode = 404;
        throw err;
    }
    return mapOccasion(row);
};

const createOccasion = async ({ name, slug, imageUrl, sortOrder, isActive }) => {
    const resolvedSlug = slugify(slug || name);
    const existing = await prisma.occasion.findUnique({ where: { slug: resolvedSlug } });
    if (existing) {
        const err = new Error('An occasion with this slug already exists');
        err.statusCode = 409;
        throw err;
    }

    const maxOrder = await prisma.occasion.aggregate({ _max: { sortOrder: true } });
    const row = await prisma.occasion.create({
        data: {
            name,
            slug: resolvedSlug,
            imageUrl: imageUrl || null,
            sortOrder: sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
            isActive: isActive ?? true,
        },
    });
    await invalidateOccasionCache();
    return mapOccasion(row);
};

const updateOccasion = async (id, data) => {
    await getOccasionById(id);

    if (data.name && !data.slug) {
        data.slug = slugify(data.name);
    } else if (data.slug) {
        data.slug = slugify(data.slug);
    }

    if (data.slug) {
        const clash = await prisma.occasion.findFirst({
            where: { slug: data.slug, NOT: { id } },
        });
        if (clash) {
            const err = new Error('An occasion with this slug already exists');
            err.statusCode = 409;
            throw err;
        }
    }

    const row = await prisma.occasion.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.slug !== undefined ? { slug: data.slug } : {}),
            ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
            ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
            ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
    });
    await invalidateOccasionCache();
    return mapOccasion(row);
};

const deleteOccasion = async (id) => {
    await getOccasionById(id);
    await prisma.occasion.delete({ where: { id } });
    await invalidateOccasionCache();
};

const reorderOccasions = async (orderedIds) => {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        const err = new Error('orderedIds must be a non-empty array');
        err.statusCode = 400;
        throw err;
    }

    await prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.occasion.update({
                where: { id },
                data: { sortOrder: index },
            }),
        ),
    );

    await invalidateOccasionCache();

    return getAllOccasions();
};

module.exports = {
    getAllOccasions,
    getPublicOccasions,
    getOccasionById,
    createOccasion,
    updateOccasion,
    deleteOccasion,
    reorderOccasions,
};
