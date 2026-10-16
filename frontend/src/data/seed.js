// Fallback seed (1:1 with live site) used when API is unreachable; API is source of truth.
export const FALLBACK_PRICES = [
  { county: 'Albany', price: 349 }, { county: 'Allegany', price: 349 },
  { county: 'Bronx', price: 1149 }, { county: 'Broome', price: 349 },
  { county: 'Cattaraugus', price: 349 }, { county: 'Cayuga', price: 349 },
  { county: 'Chautauqua', price: 349 }, { county: 'Chemung', price: 349 },
  { county: 'Chenango', price: 349 }, { county: 'Clinton', price: 349 },
  { county: 'Columbia', price: 399 }, { county: 'Cortland', price: 349 },
  { county: 'Delaware', price: 349 }, { county: 'Dutchess', price: 399 },
  { county: 'Erie', price: 399 }, { county: 'Essex', price: 399 },
  { county: 'Franklin', price: 349 }, { county: 'Fulton', price: 349 },
  { county: 'Genesee', price: 399 }, { county: 'Greene', price: 399 },
  { county: 'Hamilton', price: 349 }, { county: 'Herkimer', price: 399 },
  { county: 'Jefferson', price: 349 }, { county: 'Kings (Brooklyn)', price: 1149 },
  { county: 'Lewis', price: 349 }, { county: 'Livingston', price: 349 },
  { county: 'Madison', price: 349 }, { county: 'Monroe', price: 449 },
  { county: 'Montgomery', price: 349 }, { county: 'Nassau', price: 499 },
  { county: 'New York (Manhattan)', price: 1299 }, { county: 'Niagara', price: 349 },
  { county: 'Oneida', price: 349 }, { county: 'Onondaga', price: 349 },
  { county: 'Ontario', price: 399 }, { county: 'Orange', price: 349 },
  { county: 'Orleans', price: 349 }, { county: 'Oswego', price: 349 },
  { county: 'Otsego', price: 349 }, { county: 'Putnam', price: 499 },
  { county: 'Queens', price: 999 }, { county: 'Rensselaer', price: 349 },
  { county: 'Richmond (Staten Island)', price: 749 }, { county: 'Rockland', price: 499 },
  { county: 'Saratoga', price: 349 }, { county: 'Schenectady', price: 349 },
  { county: 'Schoharie', price: 349 }, { county: 'Schuyler', price: 349 },
  { county: 'Seneca', price: 349 }, { county: 'St. Lawrence', price: 349 },
  { county: 'Steuben', price: 349 }, { county: 'Suffolk', price: 649 },
  { county: 'Sullivan', price: 399 }, { county: 'Tioga', price: 349 },
  { county: 'Tompkins', price: 399 }, { county: 'Ulster', price: 349 },
  { county: 'Warren', price: 349 }, { county: 'Washington', price: 399 },
  { county: 'Wayne', price: 349 }, { county: 'Westchester', price: 499 },
  { county: 'Wyoming', price: 349 }, { county: 'Yates', price: 349 },
];

export const FALLBACK_ARTICLES = [
  { slug: 'ny-llc-publication-notice-example', tag: 'Compliance', title: 'NY LLC Publication Notice Example: What Should the Notice Include?', excerpt: 'See a NY LLC publication notice example and learn what information your New York LLC public notice must include, where to publish it, and common mistakes to avoid.' },
  {
    slug: 'how-much-does-llc-publication-cost-in-new-york',
    tag: 'Service',
    title: 'How Much Does LLC Publication Cost in New York?',
    excerpt: 'The cost of LLC publication in New York depends mainly on the county where your LLC is required to publish, the newspapers assigned or designated for that county, the length of your notice.',
    readingTime: '11 minutes',
    updatedAt: '2026-01-01',
    contentHtml: '<p><strong>The cost of LLC publication in New York depends mainly on the county where your LLC is required to publish</strong>, the newspapers assigned or designated for that county, the length of your notice, and whether you handle the process yourself or use a publication service.</p><div class=article-callout> For many New York counties, LLC publication can be completed for a few hundred dollars when using an efficient publication service. At LLC Publication Online, pricing starts at <strong>$349 flat for most New York counties</strong>, and our service is designed to include the full publication process from newspaper coordination through Certificate of Publication filing.<p></p></div><p>However, not every county costs the same. Some counties have lower newspaper advertising rates, while others, especially New York City counties, can be significantly more expensive. That is why one LLC may complete publication at a relatively low cost, while another LLC may pay much more for the same legal requirement.</p><p>The important thing to understand is this: New York does not set one single publication price for every LLC. The state sets the requirement, but the publication cost is largely driven by newspaper rates.</p><h2>Quick Answer: What Is the Typical Cost to Publish an LLC in NY?</h2><p>The typical cost to publish an LLC in New York can range from the low hundreds to well over one thousand dollars depending on the county and provider.</p><p>A general pricing breakdown looks like this:</p><table class=article-table><thead><tr><th>Publication Option</th><th align=right>Typical Cost Range</th><th>Notes</th></tr></thead><tbody><tr><td><strong>DIY publication in lower-cost counties</strong></td><td align=right>Varies, often a few hundred dollars</td><td>You handle newspapers, affidavits, and filing yourself</td></tr><tr><td><strong>Managed publication service in many counties</strong></td><td align=right>Around $349 to $499+</td><td>Often includes newspapers, affidavits, and Certificate filing support</td></tr><tr><td><strong>NYC county publication</strong></td><td align=right>Often much higher</td><td>Newspaper legal advertising rates are usually more expensive</td></tr><tr><td><strong>Attorney-managed publication</strong></td><td align=right>Often higher than filing services</td><td>May be appropriate if legal advice is needed</td></tr><tr><td><strong>LLC Publication Online</strong></td><td align=right>Starting at $349 flat for most NY counties</td><td>Fully managed process, no expedite fee, Certificate filing included</td></tr></tbody></table><p>The lowest price is not always the best value. A publication service should be judged by the total cost, what is included, how fast the process starts, and whether the final Certificate of Publication filing is handled correctly.</p>',
  },
  { slug: 'new-york-entity-search', tag: 'Tools', title: 'New York Entity Search', excerpt: 'New York Entity Search is a lookup in the public database of business entities registered with the New York Department of State, Division of Corporations.' },
  { slug: 'cheap-llc-publication-ny', tag: 'Service', title: 'Cheap LLC Publication NY: How to Publish Your New York LLC for Less?', excerpt: 'Under New York law, new domestic and foreign LLCs must publish notice of their formation or authorization in two newspapers for six consecutive weeks, and file a Certificate of Publication.' },
  { slug: 'ny-llc-publication-service', tag: 'Service', title: 'New York LLC Publication Service', excerpt: 'Fast, Affordable Help With NY LLC Newspaper Publication – LLC Publication Online helps with newspaper publication, affidavits, and Certificate of Publication filing for New York LLCs.' },
  { slug: 'what-is-a-certificate-of-publication-ny', tag: 'Legal Basis', title: 'What is a Certificate of Publication NY?', excerpt: 'A Certificate of Publication NY is the document that every new New York LLC files with the New York Department of State after completing the state’s LLC newspaper publication requirement.' },
  { slug: 'ny-foreign-llc-publication-requirements', tag: 'Compliance', title: 'Complete Guide to NY Foreign LLC Publication Requirements', excerpt: 'If your LLC was formed outside New York but has registered to do business in New York, you may have one more compliance step to complete.' },
  { slug: 'what-happens-if-you-dont-publish', tag: 'Legal Basis', title: "What Happens If You Don't Publish Your LLC in New York?", excerpt: 'The 120-day deadline, what suspension actually means, what protections remain intact, and exactly how to fix late publication — even years after you have missed it.' },
  { slug: 'how-to-publish-an-llc-in-new-york', tag: 'Core Process', title: 'How to Publish an LLC in New York', excerpt: 'A step-by-step walk-through: county clerk designations, the six-week publication run, collecting affidavits, and filing your Certificate of Publication.' },
];

export const FAQS = [
  { q: 'Is LLC publication in New York really required?', a: 'Yes. Section 206 of the New York Limited Liability Company Law requires every domestic and foreign LLC to publish notice in two newspapers designated by the county clerk for six successive weeks. Failure to comply within 120 days suspends your authority to do business in New York.' },
  { q: 'Why does NYC cost more than other counties?', a: 'The five NYC counties (Bronx, Kings, New York, Queens, Richmond) have court-set publication rates significantly higher than the rest of the state. We pass through the actual newspaper invoices plus our flat service fee — no markup.' },
  { q: 'How long does the entire process take?', a: 'Publication runs six consecutive weeks. We typically begin the first week of your order. Once complete, we file the Certificate of Publication with NY DOS — total turnaround is usually 7–9 weeks from order to filing.' },
  { q: 'Do you charge extra to expedite?', a: 'No. Every order is treated as expedited. We contact the newspapers within 24 hours and begin publication at the earliest available issue date.' },
  { q: 'What if I miss the 120-day window?', a: 'You can still publish — the suspension is automatic but reversible. Once publication is complete and the Certificate is filed, your LLC is reinstated. We handle late filings at the same flat rates.' },
  { q: 'What do I receive when it’s done?', a: 'You receive (1) copies of both newspaper Affidavits of Publication, (2) the filed Certificate of Publication with the NY DOS receipt stamp, and (3) tearsheets of the published notices — delivered as a digital packet.' },
];

export const FALLBACK_COMPARISON = {
  eyebrow: 'The Comparison',
  heading: 'Lower prices. Faster filings.',
  headingAccent: 'No surprises.',
  columns: ['', 'LLC Publication Online', 'Other Competitors'],
  rows: [
    { label: 'Starting price (most counties)', us: '$349', them: '$395–$499' },
    { label: 'Expedite fee', us: 'None', them: '+$75–$99' },
    { label: 'Newspapers arranged for you', us: 'Yes', them: 'Yes' },
    { label: 'Certificate of Publication filed', us: 'Yes', them: 'Sometimes / add-on' },
    { label: 'Publication starts', us: 'Same week', them: '1–3 weeks' },
    { label: 'Lowest-price guarantee', us: 'Yes', them: 'No' },
  ],
  ctaLabel: 'Get Started Now →',
  ctaHref: '#order',
};

export const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US');

export { INITIAL_POLICIES as FALLBACK_POLICIES } from './initialPoliciesData.js';
