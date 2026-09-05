/**
 * Seed core occasions for CMS + product tags.
 * Run: node prisma/seed-occasions.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const slugify = require('../src/utils/slugify');

const prisma = new PrismaClient();

const CORE_OCCASION_NAMES = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Congratulations',
  'New Baby',
  'Get Well Soon',
  'Sympathy',
  'Housewarming',
  'Corporate',
  'Romance & Apology',
  'Farewell',
  'Just Because',
];

// Slug overrides for names whose default slugify() output wouldn't match the
// slug we want on the storefront.
const SLUG_OVERRIDES = {
  'Romance & Apology': 'romance-apology',
};

const resolveSlug = (name) => SLUG_OVERRIDES[name] || slugify(name);

async function main() {
  console.log('🎁 Seeding core occasions...\n');

  const coreSlugs = CORE_OCCASION_NAMES.map((name) => resolveSlug(name));
  let created = 0;
  let updated = 0;

  for (let i = 0; i < CORE_OCCASION_NAMES.length; i += 1) {
    const name = CORE_OCCASION_NAMES[i];
    const slug = resolveSlug(name);
    const existing = await prisma.occasion.findUnique({ where: { slug } });

    if (existing) {
      const patch = { isActive: true, sortOrder: i };
      const unchanged = existing.isActive && existing.sortOrder === i;
      if (!unchanged) {
        await prisma.occasion.update({ where: { slug }, data: patch });
        updated += 1;
      }
      continue;
    }

    await prisma.occasion.create({
      data: {
        name,
        slug,
        sortOrder: i,
        isActive: true,
      },
    });
    created += 1;
  }

  const deactivateResult = await prisma.occasion.updateMany({
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
