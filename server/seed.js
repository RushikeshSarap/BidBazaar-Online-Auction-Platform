const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const config = require('./config');

const seedPassword = process.env.SEED_USER_PASSWORD;
if (!seedPassword || seedPassword.length < 16) {
  throw new Error('SEED_USER_PASSWORD must be set to a private local password of at least 16 characters');
}

const categories = [
  { slug: 'collectibles', name: 'Collectibles', description: 'Memorabilia, records, and collector finds.' },
  { slug: 'electronics', name: 'Electronics', description: 'Cameras, audio equipment, and useful technology.' },
  { slug: 'home-decor', name: 'Home and Decor', description: 'Lighting, furniture, and decorative pieces.' },
  { slug: 'art', name: 'Art and Ceramics', description: 'Paintings, ceramics, and studio-made objects.' },
  { slug: 'sports-outdoors', name: 'Sports and Outdoors', description: 'Bicycles and equipment for outdoor pursuits.' },
  { slug: 'watches-jewelry', name: 'Watches and Jewelry', description: 'Watches, silver, and personal accessories.' },
  { slug: 'books', name: 'Books', description: 'Printed books and literary collectibles.' }
];

const accountSpecs = [
  { username: 'demo-admin', email: 'admin@bidbazaar.test', role: 'admin', firstName: 'Demo', lastName: 'Admin' },
  { username: 'demo-seller-1', email: 'seller1@bidbazaar.test', role: 'seller', firstName: 'Avery', lastName: 'Seller' },
  { username: 'demo-seller-2', email: 'seller2@bidbazaar.test', role: 'seller', firstName: 'Jordan', lastName: 'Seller' },
  { username: 'demo-seller-3', email: 'seller3@bidbazaar.test', role: 'seller', firstName: 'Morgan', lastName: 'Seller' },
  { username: 'demo-buyer-1', email: 'buyer1@bidbazaar.test', role: 'buyer', firstName: 'Casey', lastName: 'Buyer' },
  { username: 'demo-buyer-2', email: 'buyer2@bidbazaar.test', role: 'buyer', firstName: 'Riley', lastName: 'Buyer' },
  { username: 'demo-buyer-3', email: 'buyer3@bidbazaar.test', role: 'buyer', firstName: 'Taylor', lastName: 'Buyer' },
  { username: 'demo-buyer-4', email: 'buyer4@bidbazaar.test', role: 'buyer', firstName: 'Quinn', lastName: 'Buyer' }
];

const listings = [
  { slug: 'mechanical-watch', title: 'Vintage Mechanical Wristwatch', category: 'watches-jewelry', seller: 0, start: 450, reserve: 900, increment: 25, bids: 3, hue: '#304b7a' },
  { slug: 'camera-kit', title: 'Mirrorless Camera and Lens Kit', category: 'electronics', seller: 1, start: 620, reserve: 900, increment: 20, bids: 2, hue: '#2f6d72' },
  { slug: 'desk-lamp', title: 'Mid-century Desk Lamp', category: 'home-decor', seller: 2, start: 75, reserve: 150, increment: 5, bids: 2, hue: '#996c3c' },
  { slug: 'studio-vase', title: 'Signed Studio Pottery Vase', category: 'art', seller: 0, start: 120, reserve: 250, increment: 10, bids: 1, hue: '#8a5264' },
  { slug: 'road-bicycle', title: 'Classic Road Bicycle', category: 'sports-outdoors', seller: 1, start: 300, reserve: 600, increment: 10, bids: 0, hue: '#47704e' },
  { slug: 'first-edition', title: 'First Edition Science Fiction Novel', category: 'books', seller: 2, start: 45, reserve: 90, increment: 5, bids: 2, hue: '#735a8d' },
  { slug: 'woven-rug', title: 'Handwoven Persian Style Rug', category: 'home-decor', seller: 0, start: 800, reserve: 1200, increment: 25, bids: 3, hue: '#a04f3f' },
  { slug: 'film-camera', title: 'Vintage 35mm Film Camera', category: 'electronics', seller: 1, start: 180, reserve: 300, increment: 10, bids: 0, hue: '#536572' },
  { slug: 'silver-tea-set', title: 'Sterling Silver Tea Service', category: 'watches-jewelry', seller: 2, start: 260, reserve: 450, increment: 10, bids: 2, hue: '#65758c' },
  { slug: 'vinyl-collection', title: 'Limited Pressing Vinyl Collection', category: 'collectibles', seller: 0, start: 90, reserve: 160, increment: 5, bids: 1, hue: '#6c5c42' },
  { slug: 'canvas-art', title: 'Abstract Canvas Artwork', category: 'art', seller: 1, start: 350, reserve: 600, increment: 15, bids: 0, hue: '#876444', scheduled: true },
  { slug: 'telescope', title: 'Portable Observatory Telescope', category: 'electronics', seller: 2, start: 500, reserve: 900, increment: 20, bids: 0, hue: '#3e6689', scheduled: true }
];

const imageDirectory = path.join(__dirname, 'uploads', 'demo-seed');

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

function renderPreview(listing) {
  const title = escapeXml(listing.title);
  const category = escapeXml(categories.find((item) => item.slug === listing.category).name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">Illustrative local demo image for ${title}</desc>
  <defs><linearGradient id="background" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${listing.hue}"/><stop offset="1" stop-color="#172238"/></linearGradient></defs>
  <rect width="800" height="520" rx="28" fill="url(#background)"/>
  <circle cx="660" cy="115" r="92" fill="#ffffff" opacity=".08"/>
  <circle cx="620" cy="145" r="52" fill="#ffffff" opacity=".08"/>
  <path d="M0 400 Q200 330 400 410 T800 380 V520 H0Z" fill="#0d1728" opacity=".36"/>
  <rect x="52" y="48" width="188" height="38" rx="19" fill="#ffffff" opacity=".16"/>
  <text x="146" y="73" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="15" letter-spacing="2">BIDBAZAAR DEMO</text>
  <text x="58" y="344" fill="#ffffff" font-family="Arial,sans-serif" font-size="31" font-weight="700">${title}</text>
  <text x="60" y="386" fill="#ffffff" opacity=".8" font-family="Arial,sans-serif" font-size="19">${category}</text>
  <text x="60" y="462" fill="#ffffff" opacity=".62" font-family="Arial,sans-serif" font-size="14">Illustrative preview · replace with a listing photo</text>
</svg>
`;
}

function ensurePreviewImages() {
  fs.mkdirSync(imageDirectory, { recursive: true });
  for (const listing of listings) {
    const imagePath = path.join(imageDirectory, `${listing.slug}.svg`);
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, renderPreview(listing), { flag: 'wx' });
    }
  }
}

async function findOrCreateCategory(client, category) {
  const existing = await client.query('SELECT id FROM categories WHERE slug = $1', [category.slug]);
  if (existing.rowCount > 0) return existing.rows[0].id;

  const inserted = await client.query(
    'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
    [category.name, category.slug, category.description]
  );
  return inserted.rows[0].id;
}

async function findOrCreateUser(client, account) {
  const existing = await client.query(
    'SELECT id, role, email FROM users WHERE lower(username) = lower($1)',
    [account.username]
  );
  if (existing.rowCount > 0) {
    const user = existing.rows[0];
    if (user.role !== account.role || user.email.toLowerCase() !== account.email.toLowerCase()) {
      throw new Error(`Seed account conflict for ${account.username}; existing record left unchanged`);
    }
    return user.id;
  }

  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const inserted = await client.query(
    `INSERT INTO users (username, email, password_hash, role, status, first_name, last_name)
     VALUES ($1, $2, $3, $4, 'active', $5, $6) RETURNING id`,
    [account.username, account.email, passwordHash, account.role, account.firstName, account.lastName]
  );
  return inserted.rows[0].id;
}

async function findOrCreateAuction(client, listing, sellerId, categoryId) {
  const existing = await client.query(
    'SELECT id FROM auctions WHERE seller_id = $1 AND title = $2',
    [sellerId, listing.title]
  );
  if (existing.rowCount > 0) return { id: existing.rows[0].id, created: false };

  const now = Date.now();
  const startsAt = listing.scheduled ? new Date(now + 24 * 60 * 60 * 1000) : new Date(now - 2 * 60 * 60 * 1000);
  const endsAt = new Date(now + (listing.scheduled ? 24 + 72 : 8 + listings.indexOf(listing) * 2) * 60 * 60 * 1000);
  const inserted = await client.query(
    `INSERT INTO auctions
       (seller_id, category_id, title, description, start_price, reserve_price, bid_increment,
        starts_at, ends_at, status, current_price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$5)
     RETURNING id`,
    [
      sellerId,
      categoryId,
      listing.title,
      `${listing.title} is a sample listing for local development. Images are illustrative placeholders.`,
      listing.start,
      listing.reserve,
      listing.increment,
      startsAt,
      endsAt,
      listing.scheduled ? 'scheduled' : 'live'
    ]
  );
  return { id: inserted.rows[0].id, created: true };
}

async function seed() {
  ensurePreviewImages();
  const client = new Client(config.database);
  let inTransaction = false;
  try {
    await client.connect();
    await client.query('BEGIN');
    inTransaction = true;
    await client.query("SELECT pg_advisory_xact_lock(hashtext('bidbazaar-demo-seed-v1'))");

    const categoryIds = new Map();
    for (const category of categories) {
      categoryIds.set(category.slug, await findOrCreateCategory(client, category));
    }

    const userIds = new Map();
    for (const account of accountSpecs) {
      userIds.set(account.username, await findOrCreateUser(client, account));
    }

    let auctionsCreated = 0;
    let imagesCreated = 0;
    let bidsCreated = 0;
    const buyers = accountSpecs.filter((account) => account.role === 'buyer');

    for (const [index, listing] of listings.entries()) {
      const seller = accountSpecs.filter((account) => account.role === 'seller')[listing.seller];
      const auction = await findOrCreateAuction(
        client,
        listing,
        userIds.get(seller.username),
        categoryIds.get(listing.category)
      );
      if (auction.created) auctionsCreated += 1;
      const imageUrl = `/uploads/demo-seed/${listing.slug}.svg`;
      const existingImage = await client.query(
        'SELECT id FROM auction_images WHERE auction_id = $1 AND image_url = $2',
        [auction.id, imageUrl]
      );
      if (existingImage.rowCount === 0) {
        await client.query(
          'INSERT INTO auction_images (auction_id, image_url, alt_text, sort_order) VALUES ($1,$2,$3,0)',
          [auction.id, imageUrl, `Illustrative preview for ${listing.title}`]
        );
        imagesCreated += 1;
      }

      if (!auction.created) continue;

      let currentPrice = Number(listing.start);
      for (let bidIndex = 0; bidIndex < listing.bids; bidIndex += 1) {
        currentPrice += Number(listing.increment);
        const buyer = buyers[(index + bidIndex) % buyers.length];
        await client.query(
          'INSERT INTO bids (auction_id, bidder_id, amount) VALUES ($1,$2,$3)',
          [auction.id, userIds.get(buyer.username), currentPrice]
        );
        bidsCreated += 1;
      }

      if (listing.bids > 0) {
        await client.query(
          'UPDATE auctions SET current_price = $1, bid_count = $2 WHERE id = $3',
          [currentPrice, listing.bids, auction.id]
        );
      }
    }

    await client.query('COMMIT');
    inTransaction = false;
    console.info(`Seed complete: ${categories.length} categories, ${accountSpecs.length} accounts, ${listings.length} auctions.`);
    console.info(`Created on this run: ${auctionsCreated} auctions, ${imagesCreated} images, ${bidsCreated} bids.`);
    console.info('Demo accounts use the private SEED_USER_PASSWORD from server/.env; it was not displayed.');
  } catch (error) {
    if (inTransaction) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    console.error('Seed failed; code=' + (error.code || 'seed_error'));
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
