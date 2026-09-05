/**
 * Seed core flower types for CMS + product tags.
 * Run: npm run seed:flower-types
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const slugify = require('../src/utils/slugify');
const { CORE_FLOWER_TYPE_NAMES } = require('./core-flower-types');

const prisma = new PrismaClient();

// Slug overrides for names whose default slugify() output wouldn't match the
// short, storefront-friendly slug we want (e.g. "Mixed / Assorted" -> "mixed").
const SLUG_OVERRIDES = {
  'Mixed / Assorted': 'mixed',
};

const resolveSlug = (name) => SLUG_OVERRIDES[name] || slugify(name);

async function main() {
  console.log('🌸 Seeding core flower types...\n');

  const coreSlugs = CORE_FLOWER_TYPE_NAMES.map((name) => resolveSlug(name));
  let created = 0;
  let updated = 0;

  for (let i = 0; i < CORE_FLOWER_TYPE_NAMES.length; i += 1) {
    const name = CORE_FLOWER_TYPE_NAMES[i];
    const slug = resolveSlug(name);
    const existing = await prisma.flowerType.findUnique({ where: { slug } });

    if (existing) {
      const patch = { isActive: true, sortOrder: i };
      const unchanged = existing.isActive && existing.sortOrder === i;
      if (!unchanged) {
        await prisma.flowerType.update({ where: { slug }, data: patch });
        updated += 1;
      }
      continue;
    }

    await prisma.flowerType.create({
      data: {
        name,
        slug,
        sortOrder: i,
        isActive: true,
      },
    });
    created += 1;
  }

  const deactivateResult = await prisma.flowerType.updateMany({
    where: { slug: { notIn: coreSlugs } },
    data: { isActive: false },
  });

  console.log(
    `  Created: ${created} | Updated: ${updated} | Deactivated extras: ${deactivateResult.count}\n`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
