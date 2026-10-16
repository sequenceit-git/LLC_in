const fs = require('fs');
const path = require('path');

let privacyContentHtml = '';
try {
  const privacyPath = path.join(__dirname, '../../../../100ffa50-eaf8-40b9-96cd-527c95b0fcfd/scratch/privacy_body_only.html');
  if (fs.existsSync(privacyPath)) {
    privacyContentHtml = fs.readFileSync(privacyPath, 'utf8');
  }
} catch (e) {
  // fallback below
}

if (!privacyContentHtml) {
  privacyContentHtml = `<h3>Introduction</h3>
<p>At LLC Publication Online (<strong>“Company”</strong> or <strong>“We”</strong>) respect your privacy and are committed to protecting it through our compliance with this policy.</p>
<p>This policy describes the types of information we may collect from you or that you may provide when you visit the website https://www.llcpublicationonline.com/ (our “<strong>Website</strong>“) and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
<h3>Information We Collect About You</h3>
<p>We collect several types of information from and about users of our Website, including information by which you may be personally identified, such as name, postal address, e-mail address, telephone number, and LLC business formation details.</p>
<h3>How We Use Your Information</h3>
<p>We use information that we collect about you or that you provide to us to present our Website and its contents to you, to provide you with information, products, or services that you request from us (such as newspaper publication and Certificate of Publication filings), and to fulfill any other purpose for which you provide it.</p>
<h3>Contact Information</h3>
<p>To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:info@llcpublicationonline.com">info@llcpublicationonline.com</a></p>`;
}

const INITIAL_POLICIES = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    meta: 'Last updated: May 2026 · LLC Publication Online',
    category: 'legal',
    contentHtml: privacyContentHtml,
  },
  {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    meta: 'Last updated: May 2026 · LLC Publication Online',
    category: 'legal',
    contentHtml: `<h3>1. Acceptance of Terms</h3>
<p>By accessing or using the website at https://www.llcpublicationonline.com/ (the “Website”) or ordering document retrieval, publication, or filing services from LLC Publication Online (“Company,” “we,” “us,” or “our”), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, you must not use our services or access this Website.</p>

<h3>2. Document Preparation & Filing Services</h3>
<p>LLC Publication Online is a document preparation and retrieval service. We specialize in coordinating newspaper publication, obtaining Affidavits of Publication, and filing Certificates of Publication with the New York State Department of State pursuant to Section 206 of the New York Limited Liability Company Law.</p>
<p><strong>Non-Legal Service:</strong> We are not an attorney, law firm, or substitute for legal counsel. We do not offer legal advice, legal opinions, recommendations, or referrals. Use of our services does not create an attorney-client relationship. If you require legal advice regarding your LLC formation or operating agreement, please consult a licensed attorney.</p>

<h3>3. Client Responsibilities & Accuracy of Information</h3>
<p>You represent and warrant that:</p>
<ul>
  <li>You have the legal authority to order publication and filing services on behalf of the named limited liability company.</li>
  <li>All information provided in your order form (including LLC legal name, county of office, contact details, and formation dates) is accurate and matches the records on file with the New York Department of State.</li>
  <li>You understand that county clerk designations and newspaper advertising charges are determined by statutory regulations based on the LLC’s official county.</li>
</ul>

<h3>4. Publication Scheduling & Turnaround</h3>
<p>Upon receipt of an order and confirmation of payment, LLC Publication Online submits notices to the designated daily and weekly newspapers in accordance with county clerk requirements. Newspaper notices run for six consecutive weeks. Once publication completes and affidavits are received from the publishers, we prepare and submit the Certificate of Publication to the New York Department of State.</p>

<h3>5. Fees & Payments</h3>
<p>All fees are flat, all-inclusive rates covering newspaper advertising fees, affidavit procurement, Certificate of Publication document preparation, and state filing fees. Payment is processed securely at the time of order submission via encrypted payment gateways.</p>

<h3>6. Limitation of Liability</h3>
<p>To the fullest extent permitted by applicable law, LLC Publication Online and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, punitive, special, or consequential damages resulting from errors in client-provided information, newspaper printing delays, Department of State processing times, or administrative suspensions caused by missing state deadlines outside of our direct control.</p>

<h3>7. Governing Law</h3>
<p>These Terms of Use and any disputes arising out of or related to our services shall be governed by and construed in accordance with the laws of the State of New York, without giving effect to any choice or conflict of law provision.</p>

<h3>8. Contact Information</h3>
<p>For questions or comments regarding these Terms of Use, please contact us at: <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a> or call (888) 484-2204.</p>`,
  },
  {
    slug: 'refund-cancellation-policy',
    title: 'Refund & Cancellation Policy',
    meta: 'Last updated: May 2026 · LLC Publication Online',
    category: 'legal',
    contentHtml: `<h3>1. Overview & Commitment</h3>
<p>At LLC Publication Online, we are committed to complete transparency in our pricing and policies. We understand that business circumstances can change, and we have outlined our cancellation and refund terms clearly below.</p>

<h3>2. Cancellations Before Newspaper Submission (100% Refund)</h3>
<p>If you cancel your order <strong>before</strong> our team has submitted and booked your publication notice with the designated county newspapers, you are entitled to a <strong>full 100% refund</strong> with no questions asked. To request a pre-publication cancellation, email us immediately at <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a> with your order details.</p>

<h3>3. Cancellations After Publication Has Commenced</h3>
<p>Because the county clerk-designated newspapers charge non-refundable advertising placement fees immediately upon reservation and publication run, once notices have been submitted to and confirmed by the newspapers, newspaper publication charges cannot be recalled or refunded.</p>
<p>If publication has already commenced and you choose to cancel before state filing, we will refund the portion corresponding to the unexpended Department of State filing fee and document preparation fee.</p>

<h3>4. Rejection & Resubmission Guarantee</h3>
<p>We guarantee 100% Department of State acceptance of our Certificate of Publication filings. In the rare event that the New York Department of State rejects a Certificate of Publication due to a clerical or drafting error on our part, we will correct the error and re-file the paperwork at <strong>no additional cost</strong> to you.</p>

<h3>5. Processing of Refunds</h3>
<p>Approved refunds are processed back to the original credit card or payment method used during checkout within 3 to 5 business days, subject to your card issuer’s standard processing timeframe.</p>

<h3>6. How to Request Assistance</h3>
<p>To request a cancellation, refund, or status update on your order, please contact our support team:</p>
<ul>
  <li>Email: <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a></li>
  <li>Phone: (888) 484-2204 (Monday – Friday, 8:00 AM – 6:00 PM ET)</li>
</ul>`,
  },
  {
    slug: 'accessibility-statement',
    title: 'Accessibility Statement',
    meta: 'Last updated: May 2026 · LLC Publication Online',
    category: 'legal',
    contentHtml: `<h3>1. Commitment to Accessibility</h3>
<p>LLC Publication Online is dedicated to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to make our online LLC publication and filing service easy to navigate and use.</p>

<h3>2. Conformance Standards</h3>
<p>Our website aims to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA standards. These guidelines outline best practices for making web content accessible to a wider range of people with disabilities, including accommodations for blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, and photosensitivity.</p>

<h3>3. Key Accessibility Features</h3>
<p>We incorporate accessible design practices throughout our platform, including:</p>
<ul>
  <li><strong>High-Contrast Typography:</strong> Optimized color palettes and font weights for legibility across devices.</li>
  <li><strong>Keyboard Navigation:</strong> All critical order forms, menus, and controls are navigable via keyboard inputs.</li>
  <li><strong>Semantic HTML:</strong> Proper landmark elements, headings, lists, and ARIA labels to support screen-reader technologies.</li>
  <li><strong>Descriptive Form Inputs:</strong> Explicit labels, instructions, and error notifications on all checkout fields.</li>
  <li><strong>Assistive Tools:</strong> Integration of third-party assistive widgets to provide user-customizable text sizing, contrast modes, and spacing.</li>
</ul>

<h3>4. Continuous Assessment & Testing</h3>
<p>We regularly audit our platform and review customer feedback to identify and resolve potential accessibility barriers in our ordering process and resource library.</p>

<h3>5. Feedback & Contact</h3>
<p>We welcome your feedback on the accessibility of LLC Publication Online. If you encounter accessibility barriers or have difficulty using any part of our website, please let us know:</p>
<ul>
  <li>Email: <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a></li>
  <li>Phone: (888) 484-2204</li>
  <li>Mailing Address: LLC Publication Online, New York, NY</li>
</ul>
<p>We strive to respond to accessibility inquiries within two business days.</p>`,
  },
  {
    slug: 'sitemap',
    title: 'Sitemap',
    meta: 'Last updated: May 2026 · LLC Publication Online',
    category: 'navigation',
    contentHtml: `<p>Welcome to the LLC Publication Online sitemap. Use the links below to quickly locate any section, informational guide, or policy document on our platform.</p>

<h3>Main Website</h3>
<ul>
  <li><a href="/">Home</a> — Overview of Section 206 NY LLC Law compliance, 4-step process, and starting rates.</li>
  <li><a href="/#how">How It Works</a> — Four-step managed publication and Department of State filing timeline.</li>
  <li><a href="/#pricing">County Pricing</a> — Complete list of publication rates across all 62 New York counties.</li>
  <li><a href="/#order">Order Now</a> — Easy online form to place your New York LLC publication order.</li>
  <li><a href="/#faq">Frequently Asked Questions</a> — Common questions about NY publication deadlines, costs, and affidavits.</li>
  <li><a href="/resources">Resources & Guides</a> — Library of educational articles and legal compliance guides.</li>
</ul>

<h3>Resources & Informational Articles</h3>
<ul>
  <li><a href="/resources/how-much-does-llc-publication-cost-in-new-york">How Much Does LLC Publication Cost in New York?</a></li>
  <li><a href="/resources/ny-llc-publication-notice-example">NY LLC Publication Notice Example: What Should the Notice Include?</a></li>
  <li><a href="/resources/new-york-entity-search">New York Entity Search Guide</a></li>
  <li><a href="/resources/cheap-llc-publication-ny">Cheap LLC Publication NY: How to Publish Your LLC for Less</a></li>
  <li><a href="/resources/ny-llc-publication-service">New York LLC Publication Service Overview</a></li>
  <li><a href="/resources/what-is-a-certificate-of-publication-ny">What is a Certificate of Publication NY?</a></li>
  <li><a href="/resources/ny-foreign-llc-publication-requirements">Complete Guide to NY Foreign LLC Publication Requirements</a></li>
  <li><a href="/resources/what-happens-if-you-dont-publish">What Happens If You Don't Publish Your LLC in New York?</a></li>
  <li><a href="/resources/how-to-publish-an-llc-in-new-york">How to Publish an LLC in New York (Step-by-Step)</a></li>
</ul>

<h3>Legal & Policy Statements</h3>
<ul>
  <li><a href="/privacy-policy">Privacy Policy</a> — How we collect, handle, and protect your personal and business data.</li>
  <li><a href="/terms-of-use">Terms of Use</a> — Terms governing website access and document preparation services.</li>
  <li><a href="/refund-cancellation-policy">Refund & Cancellation Policy</a> — Full money-back guarantee terms and cancellation timeline.</li>
  <li><a href="/accessibility-statement">Accessibility Statement</a> — WCAG 2.1 Level AA conformance and assistive tools.</li>
  <li><a href="/sitemap">Sitemap</a> — Complete directory of all pages and resources.</li>
</ul>

<h3>Client & Administrative Portals</h3>
<ul>
  <li><a href="https://portal.llcpublicationonline.com/" target="_blank" rel="noopener noreferrer">Track Your Order (Client Portal)</a></li>
  <li><a href="/admin">Admin Panel</a> — Order management, county pricing editor, articles, statements, and FAQ editor.</li>
</ul>`,
  },
];

module.exports = { INITIAL_POLICIES };
