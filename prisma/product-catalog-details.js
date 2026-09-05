/**
 * Authoritative storefront copy for every seeded SKU.
 * No mock fallbacks — seed-products.js requires an entry for each slug.
 */

const CATALOG_DETAILS = {
  // ─── BOUQUETS ────────────────────────────────────────────────────────────
  'crimson-rose-bouquet': {
    description:
      'A classic bouquet of hand-tied crimson roses, wrapped in elegant paper with fresh greens. A timeless way to say "I love you" or celebrate a special day.',
    storefrontMeta: {
      highlights: ['Hand-Tied', 'Farm-Fresh Roses', 'Same-Day Delivery Available'],
      careNote: 'Trim stems at an angle and change the water every 2 days to keep blooms fresh for up to a week.',
      deliveryNote: 'Arranged fresh and delivered in a water sleeve to protect the blooms in transit.',
    },
  },
  'pastel-pink-rose-bouquet': {
    description:
      'A soft, romantic bouquet of pastel pink roses accented with baby\'s breath. Perfect for anniversaries or simply telling someone you\'re thinking of them.',
    storefrontMeta: {
      highlights: ['Soft Pastel Tones', 'Hand-Tied', 'Gift Wrapped'],
      careNote: 'Keep away from direct sunlight and re-cut stems every few days for lasting freshness.',
      deliveryNote: 'Delivered same-day in most serviceable pincodes when ordered before 4 PM.',
    },
  },
  'rainbow-garden-bouquet': {
    description:
      'A vibrant mix of seasonal blooms in every colour of the garden, arranged to bring instant cheer. A joyful pick for birthdays and celebrations of all kinds.',
    storefrontMeta: {
      highlights: ['Seasonal Mixed Blooms', 'Bright & Colourful', 'Great for Birthdays'],
      careNote: 'Keep in a cool spot away from direct heat and top up water levels daily.',
      deliveryNote: 'Each bouquet is freshly arranged to order — exact flower mix may vary by season.',
    },
  },
  'spring-meadow-mixed-bouquet': {
    description:
      'A gentle, garden-fresh mix of seasonal flowers evoking a spring meadow. A thoughtful gesture to brighten someone\'s day or wish them well.',
    storefrontMeta: {
      highlights: ['Seasonal Mixed Blooms', 'Soft & Cheerful', 'Thoughtful Gesture'],
      careNote: 'Re-cut stems on arrival and place in fresh water away from direct sunlight.',
      deliveryNote: 'Arranged fresh on the day of delivery for maximum vase life.',
    },
  },
  'lavish-orchid-lily-arrangement': {
    description:
      'An opulent arrangement pairing exotic orchids with fragrant lilies, designed to make a statement at weddings and grand celebrations. Finished with premium wrapping for a luxury feel.',
    storefrontMeta: {
      highlights: ['Premium Orchids & Lilies', 'Luxury Wrapping', 'Statement Piece'],
      careNote: 'Mist orchid blooms lightly and keep lilies away from direct sun to extend freshness.',
      deliveryNote: 'Handled with extra care in transit — a premium arrangement built to impress on arrival.',
    },
  },
  'grand-peony-luxe-bouquet': {
    description:
      'A show-stopping bouquet of full, ruffled peonies in soft blush tones. An indulgent choice for anniversaries and milestone celebrations.',
    storefrontMeta: {
      highlights: ['Premium Peonies', 'Blush Tones', 'Anniversary Favourite'],
      careNote: 'Peonies open fully over 2–3 days — keep cool and out of direct sunlight while buds unfurl.',
      deliveryNote: 'Seasonal availability — subject to peony stock at time of order.',
    },
  },
  'everlasting-dried-bouquet': {
    description:
      'A rustic, long-lasting bouquet of naturally dried and preserved flowers in warm earthy tones. Needs no water and no maintenance — a keepsake that lasts for months.',
    storefrontMeta: {
      highlights: ['Preserved & Dried', 'No Water Needed', 'Lasts for Months'],
      careNote: 'Keep away from direct sunlight and humidity to preserve colour and shape for the long term.',
      deliveryNote: 'Ships flat-packed or boxed to protect delicate dried petals in transit.',
    },
  },

  // ─── CAKES ───────────────────────────────────────────────────────────────
  'chocolate-truffle-birthday-cake': {
    description:
      'A rich, moist chocolate sponge layered with silky chocolate truffle cream and finished with a glossy ganache. A birthday favourite loved for its deep cocoa flavour.',
    storefrontMeta: {
      highlights: ['Egg & Eggless Options', 'Rich Chocolate Ganache', 'Birthday Favourite'],
      careNote: 'Refrigerate on arrival and bring to room temperature 20 minutes before serving.',
      deliveryNote: 'Delivered in a protective box — please add candles and a photo cake topper at checkout if desired.',
    },
  },
  'rainbow-sprinkle-cake': {
    description:
      'A soft vanilla sponge with layers of colourful funfetti and a smooth buttercream finish, topped generously with rainbow sprinkles. A cheerful centerpiece for any birthday table.',
    storefrontMeta: {
      highlights: ['Colourful Funfetti Layers', 'Buttercream Finish', 'Kid-Friendly Favourite'],
      careNote: 'Refrigerate on arrival and use within 2 days for best taste and texture.',
      deliveryNote: 'Delivered chilled in a sturdy box to keep the sprinkles and frosting intact.',
    },
  },
  'red-velvet-anniversary-cake': {
    description:
      'A classic red velvet sponge with a hint of cocoa, layered with cream cheese frosting. An elegant choice to mark another year of love.',
    storefrontMeta: {
      highlights: ['Cream Cheese Frosting', 'Classic Red Velvet', 'Anniversary Favourite'],
      careNote: 'Refrigerate on arrival and bring to room temperature briefly before serving for the best texture.',
      deliveryNote: 'A message card and candles can be added at checkout.',
    },
  },
  'two-tier-vanilla-bliss-cake': {
    description:
      'An elegant two-tier vanilla sponge finished with smooth whipped cream and delicate piping, built to be the centerpiece of a milestone anniversary celebration.',
    storefrontMeta: {
      highlights: ['Two-Tier Design', 'Whipped Cream Finish', 'Milestone Celebrations'],
      careNote: 'Refrigerate immediately and handle the tiers gently when transporting or displaying.',
      deliveryNote: 'Larger tiered cakes may require additional preparation time — order at least 24 hours ahead.',
    },
  },
  'custom-photo-print-cake': {
    description:
      'A soft vanilla or chocolate sponge topped with an edible print of your favourite photo. A personal touch that turns any birthday into a memorable one.',
    storefrontMeta: {
      highlights: ['Edible Photo Print', 'Vanilla or Chocolate Base', 'Fully Personalized'],
      careNote: 'Upload a clear, well-lit photo at checkout for the best print quality.',
      deliveryNote: 'Photo cakes require the image at the time of ordering — please upload before checkout.',
    },
  },
  'personalized-photo-cake-chocolate': {
    description:
      'A decadent chocolate cake finished with an edible photo print, perfect for celebrating a promotion, graduation, or any proud milestone.',
    storefrontMeta: {
      highlights: ['Edible Photo Print', 'Rich Chocolate Base', 'Great for Milestones'],
      careNote: 'Upload a clear, well-lit photo at checkout for the best print quality.',
      deliveryNote: 'Photo cakes require the image at the time of ordering — please upload before checkout.',
    },
  },
  'assorted-cupcake-box': {
    description:
      'A box of freshly baked cupcakes in a mix of classic flavours, individually frosted and finished with a light dusting of sprinkles. Great for sharing at birthdays and small gatherings.',
    storefrontMeta: {
      highlights: ['Assorted Flavours', 'Individually Frosted', 'Great for Sharing'],
      careNote: 'Refrigerate on arrival and bring to room temperature 10 minutes before serving.',
      deliveryNote: 'Packed in a compartmentalized box to keep the frosting neat in transit.',
    },
  },
  'chocolate-jar-cake-duo': {
    description:
      'Layers of moist chocolate cake and cream served in convenient dessert jars — a fuss-free, spoonable treat perfect for a small "just because" surprise.',
    storefrontMeta: {
      highlights: ['Spoonable Jar Format', 'Layered Chocolate & Cream', 'No Slicing Needed'],
      careNote: 'Keep refrigerated and consume within 2 days for the best taste.',
      deliveryNote: 'Sealed jars travel well — a great pick for surprise deliveries.',
    },
  },

  // ─── GIFT HAMPERS ──────────────────────────────────────────────────────────
  'premium-chocolate-gift-hamper': {
    description:
      'A generous hamper of assorted premium chocolates, elegantly packaged in a keepsake box. A thoughtful way to say congratulations on any achievement.',
    storefrontMeta: {
      highlights: ['Assorted Premium Chocolates', 'Keepsake Packaging', 'Ready to Gift'],
      careNote: 'Store in a cool, dry place away from direct sunlight to keep chocolates in perfect condition.',
      deliveryNote: 'Comes gift-wrapped and ready to hand over — no extra wrapping needed.',
    },
  },
  'belgian-chocolate-delight-box': {
    description:
      'A curated box of fine Belgian-style chocolates, ideal for corporate gifting or treating a valued client or colleague.',
    storefrontMeta: {
      highlights: ['Belgian-Style Chocolates', 'Corporate Gifting Favourite', 'Elegant Presentation'],
      careNote: 'Store in a cool, dry place away from direct sunlight.',
      deliveryNote: 'Bulk corporate orders can be arranged — contact us for custom branding options.',
    },
  },
  'relax-rejuvenate-spa-hamper': {
    description:
      'A calming self-care hamper with bath salts, a scented candle, and skincare essentials. A caring gift to help someone unwind and feel better soon.',
    storefrontMeta: {
      highlights: ['Self-Care Essentials', 'Calming Scents', 'Thoughtful Wellness Gift'],
      careNote: 'Store candles away from direct heat and check individual product labels for use-by dates.',
      deliveryNote: 'Packaged in a reusable gift box, ready to present as-is.',
    },
  },
  'aroma-wellness-gift-set': {
    description:
      'A soothing collection of aromatic oils, a diffuser candle, and calming teas — a warm housewarming gift for a new home filled with good energy.',
    storefrontMeta: {
      highlights: ['Aromatic Oils & Candle', 'Calming Teas Included', 'Housewarming Favourite'],
      careNote: 'Keep oils tightly capped and store the candle upright in a cool place.',
      deliveryNote: 'Comes in a decorative box suitable for gifting without additional wrapping.',
    },
  },
  'flowers-cake-combo-hamper': {
    description:
      'The best of both worlds — a fresh flower bouquet paired with a delicious cake, bundled together for a complete birthday celebration in one delivery.',
    storefrontMeta: {
      highlights: ['Bouquet + Cake Combo', 'One Convenient Delivery', 'Birthday Favourite'],
      careNote: 'Refrigerate the cake portion immediately and trim bouquet stems before placing in water.',
      deliveryNote: 'Both items are packed separately within the same delivery for freshness.',
    },
  },
  'cake-chocolates-celebration-combo': {
    description:
      'A delightful pairing of a celebration cake and a box of fine chocolates, put together for anniversaries and special milestones worth celebrating twice over.',
    storefrontMeta: {
      highlights: ['Cake + Chocolate Combo', 'Anniversary Favourite', 'One Convenient Delivery'],
      careNote: 'Refrigerate the cake on arrival; store chocolates in a cool, dry place.',
      deliveryNote: 'Both items are packed separately within the same delivery for freshness.',
    },
  },

  // ─── PLANTS ────────────────────────────────────────────────────────────────
  'money-plant-in-ceramic-pot': {
    description:
      'A low-maintenance money plant potted in a stylish ceramic planter, believed to bring good fortune to a new home. An easy, long-lasting housewarming gift.',
    storefrontMeta: {
      highlights: ['Low Maintenance', 'Ceramic Planter Included', 'Housewarming Favourite'],
      careNote: 'Water once the top inch of soil feels dry and keep in bright, indirect light.',
      deliveryNote: 'Potted and ready to display — no repotting needed on arrival.',
    },
  },
  'areca-palm-indoor-plant': {
    description:
      'A graceful areca palm that adds a lush, tropical feel to any indoor space while naturally purifying the air. A living gift that keeps giving.',
    storefrontMeta: {
      highlights: ['Air-Purifying', 'Lush Tropical Look', 'Long-Lasting Gift'],
      careNote: 'Water 2–3 times a week and keep in bright, indirect sunlight.',
      deliveryNote: 'Potted and ready to display — no repotting needed on arrival.',
    },
  },
  'assorted-succulent-trio': {
    description:
      'A trio of easy-care succulents in matching pots, perfect as a desk companion or a light-hearted "just because" gift for any plant lover.',
    storefrontMeta: {
      highlights: ['Set of 3', 'Extremely Low Maintenance', 'Great Desk Companion'],
      careNote: 'Water sparingly — once every 1–2 weeks — and keep in bright light.',
      deliveryNote: 'Potted and ready to display — no repotting needed on arrival.',
    },
  },
  'glass-terrarium-garden': {
    description:
      'A miniature garden of succulents and moss arranged inside a glass terrarium, making an elegant, modern centerpiece for a desk or office space.',
    storefrontMeta: {
      highlights: ['Self-Contained Glass Garden', 'Modern Centerpiece', 'Great Corporate Gift'],
      careNote: 'Water lightly once every 2–3 weeks and keep away from direct, harsh sunlight.',
      deliveryNote: 'Sealed and cushioned for safe transit — handle gently on arrival.',
    },
  },

  // ─── PERSONALIZED GIFTS ────────────────────────────────────────────────────
  'personalized-photo-mug': {
    description:
      'A ceramic mug printed with a photo of your choice, making an everyday cup of tea or coffee a little more special. A simple, heartfelt birthday gift.',
    storefrontMeta: {
      highlights: ['Custom Photo Print', 'Ceramic, Dishwasher-Safe', 'Simple & Heartfelt'],
      careNote: 'Hand wash recommended to preserve the print quality over time.',
      deliveryNote: 'Upload your photo at checkout — please allow extra time for personalized items.',
    },
  },
  'custom-engraved-photo-frame': {
    description:
      'A wooden photo frame with a custom engraved message, designed to hold a cherished memory. A meaningful keepsake for anniversaries.',
    storefrontMeta: {
      highlights: ['Custom Engraving', 'Solid Wood Frame', 'Anniversary Keepsake'],
      careNote: 'Wipe clean with a dry cloth and keep away from direct sunlight to preserve the finish.',
      deliveryNote: 'Add your engraving text at checkout — please allow extra time for personalized items.',
    },
  },
  'personalized-photo-cushion': {
    description:
      'A soft cushion printed with a favourite photo, blending comfort with a personal touch. A light, thoughtful "just because" gift.',
    storefrontMeta: {
      highlights: ['Custom Photo Print', 'Soft & Huggable', 'Thoughtful Everyday Gift'],
      careNote: 'Spot clean the cover gently; avoid machine washing to protect the print.',
      deliveryNote: 'Upload your photo at checkout — please allow extra time for personalized items.',
    },
  },
  'engraved-wooden-keepsake-box': {
    description:
      'A handcrafted wooden box with a custom-engraved name or message, perfect for storing small treasures. A heartfelt farewell gift to remember someone by.',
    storefrontMeta: {
      highlights: ['Custom Engraving', 'Handcrafted Wood', 'Farewell Favourite'],
      careNote: 'Wipe clean with a dry cloth and keep away from prolonged direct sunlight.',
      deliveryNote: 'Add your engraving text at checkout — please allow extra time for personalized items.',
    },
  },

  // ─── CHOCOLATES & SWEETS ────────────────────────────────────────────────────
  'assorted-belgian-chocolate-box': {
    description:
      'A generous box of assorted Belgian-style chocolates in a mix of milk, dark, and filled varieties. A crowd-pleasing way to say congratulations.',
    storefrontMeta: {
      highlights: ['Assorted Varieties', 'Belgian-Style Recipe', 'Crowd-Pleasing Gift'],
      careNote: 'Store in a cool, dry place away from direct sunlight to keep chocolates fresh.',
      deliveryNote: 'Comes gift-wrapped and ready to hand over — no extra wrapping needed.',
    },
  },

  // ─── BOUQUET BUILDER · STEMS ─────────────────────────────────────────────
  'red-rose-single-stem': {
    description: 'A single fresh red rose stem, perfect for building your own custom bouquet one stem at a time.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Stem', 'Farm-Fresh'] },
  },
  'white-lily-single-stem': {
    description: 'A single fresh white lily stem, ideal for adding an elegant, fragrant touch to your custom bouquet.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Stem', 'Farm-Fresh'] },
  },
  'pink-tulip-single-stem': {
    description: 'A single fresh pink tulip stem, great for adding a playful pop of colour to your custom bouquet.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Stem', 'Farm-Fresh'] },
  },
  'pink-peony-single-stem': {
    description: 'A single fresh pink peony stem, perfect for a soft, romantic touch in your custom bouquet.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Stem', 'Farm-Fresh'] },
  },
  'eucalyptus-filler': {
    description: 'A fragrant bunch of eucalyptus foliage, used to add texture and greenery to your custom bouquet.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Bunch', 'Adds Texture'] },
  },
  'babys-breath-filler': {
    description: "A delicate bunch of baby's breath, the classic filler flower for softening and rounding out your custom bouquet.",
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sold Per Bunch', 'Classic Filler'] },
  },

  // ─── BOUQUET BUILDER · ADD-ONS ───────────────────────────────────────────
  'satin-ribbon': {
    description: 'A length of premium satin ribbon to tie off and finish your custom bouquet with an elegant bow.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Premium Satin Finish'] },
  },
  'premium-wrapping-paper': {
    description: 'Premium textured wrapping paper to give your custom bouquet a polished, gift-ready presentation.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Gift-Ready Presentation'] },
  },
  'handwritten-greeting-card': {
    description: 'A blank greeting card, handwritten with your personal message and tucked in alongside your order.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Handwritten on Request'] },
  },
  'box-of-chocolates': {
    description: 'A small box of assorted chocolates, a sweet add-on to pair with your bouquet or gift order.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Sweet Add-On'] },
  },
  'small-teddy-bear': {
    description: 'A soft, huggable small teddy bear, a charming add-on that pairs well with any bouquet or gift.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Soft & Huggable'] },
  },
  'scented-candle': {
    description: 'A softly scented candle, a lovely add-on to bring warmth and fragrance to any gift order.',
    storefrontMeta: { highlights: ['Build-Your-Own Bouquet', 'Soft Ambient Fragrance'] },
  },
};

module.exports = { CATALOG_DETAILS };
