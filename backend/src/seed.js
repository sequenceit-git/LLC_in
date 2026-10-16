const CountyPrice = require('./models/CountyPrice');
const Article = require('./models/Article');
const Policy = require('./models/Policy');
const Faq = require('./models/Faq');
const { INITIAL_POLICIES } = require('./data/initialPolicies');

// 1:1 county pricing extracted from the live site (flat all-inclusive fees)
const COUNTIES = [
  ['Albany', 349], ['Allegany', 349], ['Bronx', 1149], ['Broome', 349],
  ['Cattaraugus', 349], ['Cayuga', 349], ['Chautauqua', 349], ['Chemung', 349],
  ['Chenango', 349], ['Clinton', 349], ['Columbia', 399], ['Cortland', 349],
  ['Delaware', 349], ['Dutchess', 399], ['Erie', 399], ['Essex', 399],
  ['Franklin', 349], ['Fulton', 349], ['Genesee', 399], ['Greene', 399],
  ['Hamilton', 349], ['Herkimer', 399], ['Jefferson', 349], ['Kings (Brooklyn)', 1149],
  ['Lewis', 349], ['Livingston', 349], ['Madison', 349], ['Monroe', 449],
  ['Montgomery', 349], ['Nassau', 499], ['New York (Manhattan)', 1299], ['Niagara', 349],
  ['Oneida', 349], ['Onondaga', 349], ['Ontario', 399], ['Orange', 349],
  ['Orleans', 349], ['Oswego', 349], ['Otsego', 349], ['Putnam', 499],
  ['Queens', 999], ['Rensselaer', 349], ['Richmond (Staten Island)', 749], ['Rockland', 499],
  ['Saratoga', 349], ['Schenectady', 349], ['Schoharie', 349], ['Schuyler', 349],
  ['Seneca', 349], ['St. Lawrence', 349], ['Steuben', 349], ['Suffolk', 649],
  ['Sullivan', 399], ['Tioga', 349], ['Tompkins', 399], ['Ulster', 349],
  ['Warren', 349], ['Washington', 399], ['Wayne', 349], ['Westchester', 499],
  ['Wyoming', 349], ['Yates', 349],
];

const ARTICLES = [
  {
    slug: 'how-much-does-llc-publication-cost-in-new-york',
    title: 'How Much Does LLC Publication Cost in New York?',
    excerpt: 'The cost of LLC publication in New York depends mainly on the county where your LLC is required to publish, the newspapers assigned for that county, and the length of your notice.',
    tag: 'Service',
    readingTime: '11 minutes',
    status: 'published',
    featured: true,
    contentHtml: `<p><strong>The cost of LLC publication in New York depends mainly on the county where your LLC is required to publish</strong>, the newspapers assigned or designated for that county, the length of your notice, and whether you handle the process yourself or use a publication service.</p><div class="callout">For many New York counties, LLC publication can be completed for a few hundred dollars. At LLC Publication Online, pricing starts at <strong>$349 flat for most NY counties</strong>, including newspaper coordination through Certificate of Publication filing.</div><h2>Quick Answer: Typical Cost</h2><table><thead><tr><th>Option</th><th>Typical Cost</th><th>Notes</th></tr></thead><tbody><tr><td><strong>DIY (lower-cost counties)</strong></td><td>A few hundred dollars</td><td>You handle newspapers, affidavits, filing</td></tr><tr><td><strong>Managed service</strong></td><td>$349–$499+</td><td>Newspapers, affidavits, Certificate support</td></tr><tr><td><strong>NYC counties</strong></td><td>Often much higher</td><td>Premium legal advertising rates</td></tr><tr><td><strong>Attorney-managed</strong></td><td>Often higher</td><td>Appropriate if legal advice needed</td></tr><tr><td><strong>LLC Publication Online</strong></td><td>From $349 flat</td><td>Fully managed, no expedite fee, filing included</td></tr></tbody></table><h2>Why Costs Vary by County</h2><p>Your LLC must publish in the county listed as its office county, in newspapers designated by the county clerk — one daily and one weekly, for six consecutive weeks. Each newspaper sets its own legal advertising rates, so NYC counties (Bronx, Kings, New York, Queens, Richmond) cost more than most upstate counties.</p><h2>What Is Included</h2><ul><li>Daily + weekly newspaper publication (6 weeks)</li><li>Affidavits of Publication from both papers</li><li>Certificate of Publication preparation + $50 NY DOS filing fee handling</li><li>Service fee (we charge one flat fee — no expedite upsell)</li></ul><p>When comparing providers ask: are both papers included? Six weeks? Affidavits? Certificate filing? $50 state fee? Any expedite or hidden fees? Will you receive final proof?</p>`,
  },
  { slug: 'ny-llc-publication-notice-example', title: 'NY LLC Publication Notice Example: What Should the Notice Include?', excerpt: 'See a NY LLC publication notice example and learn what information your notice must include, where to publish, and mistakes to avoid.', tag: 'Compliance', readingTime: '7 minutes', status: 'published', contentHtml: '<p>A compliant NY LLC publication notice identifies the LLC name, date and county of formation, street address of the office, registered agent details, and the purpose statement. Your publication partner drafts this from your Articles of Organization — accuracy matters because newspapers charge by length and the DOS checks consistency.</p><h2>Common mistakes</h2><ul><li>Wrong county (must match Articles of Organization)</li><li>Missing foreign-LLC details (formation state/date, authority date)</li><li>Publishing in non-designated papers</li><li>Running fewer than six consecutive weeks</li></ul>' },
  { slug: 'new-york-entity-search', title: 'New York Entity Search', excerpt: 'Look up any business entity registered with the NY Department of State, Division of Corporations.', tag: 'Tools', readingTime: '5 minutes', status: 'published', contentHtml: '<p>New York Entity Search is a lookup in the public database of business entities registered with the NY Department of State. Every domestic LLC and every foreign entity authorized in NY has a record. Use it to verify name availability, check status, and confirm your office county before ordering publication.</p>' },
  { slug: 'cheap-llc-publication-ny', title: 'Cheap LLC Publication NY: How to Publish Your New York LLC for Less?', excerpt: 'Under New York law, new LLCs must publish in two newspapers for six weeks and file a Certificate of Publication.', tag: 'Service', readingTime: '8 minutes', status: 'published', contentHtml: '<p>Cheap does not have to mean incomplete. Reduce cost with efficient workflows — correct county, accurate notice, designated papers, six full weeks, both affidavits collected, Certificate filed — not by skipping steps. Our flat-fee model starts at $349 for most counties with no expedite fee.</p>' },
  { slug: 'ny-llc-publication-service', title: 'New York LLC Publication Service', excerpt: 'Fast, affordable help with NY LLC newspaper publication — affidavits and Certificate filing included.', tag: 'Service', readingTime: '6 minutes', status: 'published', contentHtml: '<p>LLC Publication Online arranges your two clerk-designated newspapers, monitors six weeks of publication, collects affidavits, prepares and files the Certificate of Publication with NY DOS, and delivers a digital completion packet.</p>' },
  { slug: 'what-is-a-certificate-of-publication-ny', title: 'What is a Certificate of Publication NY?', excerpt: 'The document every new NY LLC files with the Department of State after completing newspaper publication.', tag: 'Legal Basis', readingTime: '6 minutes', status: 'published', contentHtml: '<p>After the six-week run, each newspaper issues an Affidavit of Publication. Those are attached to a Certificate of Publication filed with the NY Department of State ($50 fee) within 120 days of formation. Without this filing, publication alone is not complete.</p>' },
  { slug: 'ny-foreign-llc-publication-requirements', title: 'Complete Guide to NY Foreign LLC Publication Requirements', excerpt: 'Formed outside NY but registered to do business here? You likely still must publish.', tag: 'Compliance', readingTime: '9 minutes', status: 'published', contentHtml: '<p>Foreign LLCs that file an Application for Authority in NY must generally publish in the same way as domestic LLCs. Foreign notices are often longer (original state, formation date, authority date), so newspaper charges can be higher. Tell your provider you are Foreign before quoting.</p>' },
  { slug: 'what-happens-if-you-dont-publish', title: "What Happens If You Don't Publish Your LLC in New York?", excerpt: 'The 120-day deadline, what suspension means, and how to fix late publication — even years later.', tag: 'Legal Basis', readingTime: '8 minutes', status: 'published', contentHtml: '<p>Missing the 120-day window suspends your authority to transact business in NY — but it is reversible. Complete publication late, file the Certificate, and the LLC is reinstated. We handle late filings at the same flat rates.</p>' },
  { slug: 'how-to-publish-an-llc-in-new-york', title: 'How to Publish an LLC in New York', excerpt: 'Step-by-step: clerk designations, six-week run, affidavits, and DOS filing.', tag: 'Core Process', readingTime: '10 minutes', status: 'published', contentHtml: '<p>1) Confirm office county. 2) Get clerk-designated papers. 3) Draft notice. 4) Run six consecutive weeks in both papers. 5) Collect affidavits. 6) File Certificate of Publication with NY DOS. Or place one order and we do all six for you.</p>' },
];

const FAQS = [
  {
    q: 'Is LLC publication in New York really required?',
    a: 'Yes. Section 206 of the New York Limited Liability Company Law requires every domestic and foreign LLC to publish notice in two newspapers designated by the county clerk for six successive weeks. Failure to comply within 120 days suspends your authority to do business in New York.',
    order: 1,
    isActive: true,
  },
  {
    q: 'Why does NYC cost more than other counties?',
    a: 'The five NYC counties (Bronx, Kings, New York, Queens, Richmond) have court-set publication rates significantly higher than the rest of the state. We pass through the actual newspaper invoices plus our flat service fee — no markup.',
    order: 2,
    isActive: true,
  },
  {
    q: 'How long does the entire process take?',
    a: 'Publication runs six consecutive weeks. We typically begin the first week of your order. Once complete, we file the Certificate of Publication with NY DOS — total turnaround is usually 7–9 weeks from order to filing.',
    order: 3,
    isActive: true,
  },
  {
    q: 'Do you charge extra to expedite?',
    a: 'No. Every order is treated as expedited. We contact the newspapers within 24 hours and begin publication at the earliest available issue date.',
    order: 4,
    isActive: true,
  },
  {
    q: 'What if I miss the 120-day window?',
    a: 'You can still publish — the suspension is automatic but reversible. Once publication is complete and the Certificate is filed, your LLC is reinstated. We handle late filings at the same flat rates.',
    order: 5,
    isActive: true,
  },
  {
    q: 'What do I receive when it’s done?',
    a: 'You receive (1) copies of both newspaper Affidavits of Publication, (2) the filed Certificate of Publication with the NY DOS receipt stamp, and (3) tearsheets of the published notices — delivered as a digital packet.',
    order: 6,
    isActive: true,
  },
];

async function seed() {
  for (const [county, price] of COUNTIES) {
    await CountyPrice.updateOne(
      { county },
      { $set: { county, price, isActive: true } },
      { upsert: true }
    );
  }
  for (const a of ARTICLES) {
    await Article.updateOne({ slug: a.slug }, { $set: a }, { upsert: true });
  }
  for (const p of INITIAL_POLICIES) {
    await Policy.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }
  for (const f of FAQS) {
    await Faq.updateOne({ q: f.q }, { $set: f }, { upsert: true });
  }
  console.log(`Seeded ${COUNTIES.length} counties + ${ARTICLES.length} articles + ${INITIAL_POLICIES.length} policies + ${FAQS.length} FAQs`);
}

module.exports = { seed, COUNTIES, ARTICLES, INITIAL_POLICIES, FAQS };

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  connectDB(process.env.DB_URI || process.env.MONGODB_URI)
    .then(seed)
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
}
