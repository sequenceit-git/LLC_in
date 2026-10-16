/**
 * Demo order seeder — sample data for the admin dashboard.
 *
 * Deliberately kept OUT of seed.js: `npm run seed` must stay safe to run
 * against production, whereas this script exists purely to give the admin
 * console something to display during development / client review.
 *
 * Every demo order is created with a reserved `@example.com` address, so
 * `--clear` can never delete a real customer order (RFC 2606 reserves
 * example.com — it cannot belong to an actual customer).
 *
 * Usage:
 *   npm run seed:orders              # insert or refresh the demo orders
 *   npm run seed:orders -- --clear   # remove every demo order
 *
 * Amounts are resolved from CountyPrice using the same rules as
 * POST /api/orders, so the figures match real pricing exactly and the
 * currency-per-county logic is never duplicated here.
 */
const Order = require('./models/Order');
const CountyPrice = require('./models/CountyPrice');

const DEMO_DOMAIN = 'example.com';
const DEMO_FILTER = { email: new RegExp(`@${DEMO_DOMAIN.replace('.', '\\.')}$`, 'i') };

const AREA_CODES = ['212', '718', '917', '516', '631', '914', '845', '518', '585', '315', '607', '716'];

// county names must match the seeded CountyPrice documents exactly.
const DEMO_ORDERS = [
  { firstName: 'Marcus', lastName: 'Delgado', llcName: 'Delgado Consulting LLC', county: 'New York (Manhattan)', status: 'filed', paymentStatus: 'paid', daysAgo: 71, adminNotes: 'Certificate of Publication filed with NY DOS — acknowledgment emailed.' },
  { firstName: 'Priya', lastName: 'Raman', llcName: 'Raman Analytics LLC', county: 'Kings (Brooklyn)', status: 'completed', paymentStatus: 'paid', daysAgo: 66, adminNotes: 'Completion packet delivered. Client left a 5-star review.' },
  { firstName: 'Anthony', lastName: 'Rizzo', llcName: 'Rizzo & Sons Landscaping LLC', county: 'Nassau', status: 'completed', paymentStatus: 'paid', daysAgo: 62 },
  { firstName: 'Jasmine', lastName: 'Whitfield', llcName: 'Whitfield Wellness LLC', county: 'Westchester', status: 'filed', paymentStatus: 'paid', daysAgo: 58 },
  { firstName: 'Dmitri', lastName: 'Volkov', llcName: 'Volkov Logistics LLC', county: 'Queens', status: 'publishing', paymentStatus: 'paid', daysAgo: 44, jurisdictionStatus: 'Foreign', adminNotes: 'Foreign LLC — notice includes Delaware formation date. Week 4 of 6.' },
  { firstName: 'Hannah', lastName: 'Lindqvist', llcName: 'Lindqvist Design Studio LLC', county: 'Suffolk', status: 'publishing', paymentStatus: 'paid', daysAgo: 41, adminNotes: 'Daily paper confirmed run start. Weekly paper pending first insertion.' },
  { firstName: 'Omar', lastName: 'Haddad', llcName: 'Haddad Foods LLC', county: 'Erie', status: 'filed', paymentStatus: 'paid', daysAgo: 38 },
  { firstName: 'Rachel', lastName: 'Nkemdirim', llcName: 'Nkemdirim Legal Nurse Consulting LLC', county: 'Monroe', status: 'processing', paymentStatus: 'paid', daysAgo: 33, adminNotes: 'Awaiting affidavit from the weekly newspaper.' },
  { firstName: 'Thomas', lastName: 'Bianchi', llcName: 'Bianchi Masonry LLC', county: 'Bronx', status: 'processing', paymentStatus: 'pending', daysAgo: 29, discountCode: 'NYC50', adminNotes: 'Called about NYC rate — sending cost breakdown before payment.' },
  { firstName: 'Elena', lastName: 'Petrova', llcName: 'Petrova Interiors LLC', county: 'Albany', status: 'filed', paymentStatus: 'paid', daysAgo: 26 },
  { firstName: 'Kwame', lastName: 'Boateng', llcName: 'Boateng Transport LLC', county: 'Onondaga', status: 'publishing', paymentStatus: 'paid', daysAgo: 24 },
  { firstName: 'Sofia', lastName: 'Marchetti', llcName: 'Marchetti Culinary LLC', county: 'Richmond (Staten Island)', status: 'processing', paymentStatus: 'pending', daysAgo: 21, adminNotes: 'Second follow-up sent re: payment.' },
  { firstName: 'Daniel', lastName: "O'Sullivan", llcName: "O'Sullivan Plumbing LLC", county: 'Dutchess', status: 'completed', paymentStatus: 'paid', daysAgo: 19 },
  { firstName: 'Aisha', lastName: 'Rahman', llcName: 'Rahman Bookkeeping LLC', county: 'Ulster', status: 'new', paymentStatus: 'pending', daysAgo: 15 },
  { firstName: 'Victor', lastName: 'Castellanos', llcName: 'Castellanos Auto Repair LLC', county: 'Saratoga', status: 'publishing', paymentStatus: 'paid', daysAgo: 13 },
  { firstName: 'Grace', lastName: 'Kim', llcName: 'Kim Acupuncture LLC', county: 'Tompkins', status: 'processing', paymentStatus: 'paid', daysAgo: 11, discountCode: 'SPRING25' },
  { firstName: 'Nathan', lastName: 'Fletcher', llcName: 'Fletcher Carpentry LLC', county: 'Oneida', status: 'new', paymentStatus: 'pending', daysAgo: 9 },
  { firstName: 'Marta', lastName: 'Kowalski', llcName: 'Kowalski Tailoring LLC', county: 'Schenectady', status: 'cancelled', paymentStatus: 'refunded', daysAgo: 17, adminNotes: 'Client relocated out of state — order cancelled and refunded.' },
  { firstName: 'Lucia', lastName: 'Ferreira', llcName: 'Ferreira Cleaning Services LLC', county: 'Niagara', status: 'new', paymentStatus: 'pending', daysAgo: 7 },
  { firstName: 'Ibrahim', lastName: 'Al-Sayed', llcName: 'Al-Sayed Import Export LLC', county: 'Orange', status: 'processing', paymentStatus: 'paid', daysAgo: 6, jurisdictionStatus: 'Foreign', adminNotes: 'Foreign LLC — confirmed New Jersey formation details.' },
  { firstName: 'Chloe', lastName: 'Barrett', llcName: 'Barrett Pet Care LLC', county: 'Rockland', status: 'new', paymentStatus: 'pending', daysAgo: 5 },
  { firstName: 'Samuel', lastName: 'Adeyemi', llcName: 'Adeyemi Tax Services LLC', county: 'Broome', status: 'new', paymentStatus: 'pending', daysAgo: 4, discountCode: 'SAVE25' },
  { firstName: 'Vincent', lastName: 'Duarte', llcName: 'Duarte Electric LLC', county: 'Ontario', status: 'processing', paymentStatus: 'failed', daysAgo: 12, adminNotes: 'Card declined — payment link re-sent.' },
  { firstName: 'Rebecca', lastName: 'Tannenbaum', llcName: 'Tannenbaum Event Planning LLC', county: 'Chautauqua', status: 'completed', paymentStatus: 'paid', daysAgo: 46 },
];

const DAY = 86400000;

function demoEmail(firstName, lastName) {
  const local = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, '');
  return `${local}@${DEMO_DOMAIN}`;
}

function demoPhone(i) {
  const area = AREA_CODES[i % AREA_CODES.length];
  return `(${area}) 555-${String(100 + i).padStart(4, '0')}`; // reserved 555-01xx range
}

async function clearDemoOrders() {
  const res = await Order.deleteMany(DEMO_FILTER);
  console.log(`Removed ${res.deletedCount} demo order(s).`);
  return res.deletedCount;
}

async function seedDemoOrders() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED !== '1') {
    throw new Error(
      'Refusing to insert demo orders with NODE_ENV=production. Set ALLOW_DEMO_SEED=1 to override.'
    );
  }

  const prices = await CountyPrice.find({ isActive: true }).lean();
  if (!prices.length) {
    throw new Error('No active county prices found. Run `npm run seed` first.');
  }
  const byCounty = new Map(prices.map((p) => [String(p.county).toLowerCase(), p]));

  const now = Date.now();
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < DEMO_ORDERS.length; i++) {
    const o = DEMO_ORDERS[i];
    const priceDoc = byCounty.get(o.county.toLowerCase());
    if (!priceDoc) {
      throw new Error(`County "${o.county}" not found in CountyPrice. Run \`npm run seed\` first.`);
    }

    // Identical pricing rule to POST /api/orders.
    const jurisdictionStatus = o.jurisdictionStatus || 'Domestic';
    const amount =
      jurisdictionStatus === 'Foreign' && priceDoc.priceForeign != null
        ? priceDoc.priceForeign
        : priceDoc.price;

    const createdAt = new Date(now - o.daysAgo * DAY + i * 3600000);
    const updatedAt =
      o.status === 'new' ? createdAt : new Date(Math.min(now, createdAt.getTime() + 1.5 * DAY));

    const res = await Order.updateOne(
      { email: demoEmail(o.firstName, o.lastName) },
      {
        $set: {
          llcName: o.llcName,
          jurisdictionStatus,
          county: o.county,
          firstName: o.firstName,
          lastName: o.lastName,
          email: demoEmail(o.firstName, o.lastName),
          phone: demoPhone(i),
          discountCode: o.discountCode || '',
          amount,
          paymentStatus: o.paymentStatus,
          status: o.status,
          adminNotes: o.adminNotes || '',
          createdAt,
          updatedAt,
        },
      },
      // timestamps:false so the explicit createdAt/updatedAt above are honoured.
      { upsert: true, timestamps: false, runValidators: true }
    );

    if (res.upsertedCount) inserted += 1;
    else updated += 1;
  }

  const total = await Order.countDocuments({});
  console.log(
    `Demo orders: ${inserted} inserted, ${updated} refreshed (${DEMO_ORDERS.length} total). Orders now in DB: ${total}.`
  );
  return { inserted, updated };
}

module.exports = {
  seedDemoOrders,
  clearDemoOrders,
  DEMO_ORDERS,
  DEMO_FILTER,
  DEMO_DOMAIN,
};

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  const shouldClear = process.argv.includes('--clear');

  // Fail fast — before opening a connection to a production database.
  if (!shouldClear && process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED !== '1') {
    console.error(
      'Refusing to insert demo orders with NODE_ENV=production. Set ALLOW_DEMO_SEED=1 to override.'
    );
    process.exit(1);
  }

  connectDB(process.env.DB_URI || process.env.MONGODB_URI)
    .then(() => (shouldClear ? clearDemoOrders() : seedDemoOrders()))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`\nSeed failed: ${err.message}\n`);
      process.exit(1);
    });
}
