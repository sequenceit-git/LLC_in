import { useMemo, useState } from 'react';
import { api } from '../api';
import { fmt } from '../data/seed';

export default function OrderForm({ prices }) {
  const [form, setForm] = useState({
    llcName: '',
    jurisdictionStatus: 'Domestic',
    county: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    discountCode: '',
    card: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);

  const priceMap = useMemo(() => {
    const map = {};
    for (const p of prices) {
      map[p.county] = form.jurisdictionStatus === 'Foreign' && p.priceForeign != null ? p.priceForeign : p.price;
    }
    return map;
  }, [prices, form.jurisdictionStatus]);

  const amount = form.county ? priceMap[form.county] : null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    if (!form.llcName.trim()) return setStatus({ type: 'err', msg: 'Please enter your LLC name.' });
    if (!form.county) return setStatus({ type: 'err', msg: 'Please select a county.' });
    if (!form.firstName.trim() || !form.lastName.trim()) return setStatus({ type: 'err', msg: 'Please enter your name.' });
    if (!form.email.trim()) return setStatus({ type: 'err', msg: 'Please enter your email.' });
    if (!form.phone.trim()) return setStatus({ type: 'err', msg: 'Please enter your phone number.' });

    setBusy(true);
    try {
      const { card: _omit, ...payload } = form;
      const r = await api.createOrder(payload);
      setStatus({
        type: 'ok',
        msg: `Order received for ${r.order.llcName} — ${fmt(r.order.amount)}. We will contact the newspapers within 24 hours.`,
      });
      setForm({
        llcName: '',
        jurisdictionStatus: 'Domestic',
        county: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        discountCode: '',
        card: '',
      });
    } catch (err) {
      setStatus({ type: 'err', msg: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container order-grid">
      <aside className="order-aside">
        <div className="eyebrow eyebrow-light">Start Your Order</div>
        <h2 className="display light">
          Begin your required <span className="italic gold">LLC publication.</span>
        </h2>
        <p className="order-aside-lede">
          One streamlined form. Transparent flat pricing. Press placements confirmed within days and your official Certificate of Publication delivered directly upon Department of State recording.
        </p>
        <div className="order-summary">
          <div className="order-summary-eyebrow">Filing Overview</div>
          <div className="order-summary-county" id="summaryCounty">
            {form.county ? `${form.county} County` : 'Select a county →'}
          </div>
          <div className="order-summary-amount" id="summaryAmount">
            {amount ? fmt(amount) : '$—'}
          </div>
          <div className="order-summary-note">All-Inclusive · No Rush Fees · Includes $50 NY DOS Fee</div>
        </div>
      </aside>

      <form className="order-form" id="orderForm" onSubmit={submit} noValidate>
        <div className="form-section">
          <div className="form-eyebrow">1 · Entity Particulars</div>
          <div className="form-grid form-grid-2">
            <label>
              <span>LLC Name</span>
              <input
                type="text"
                name="llc_name"
                required
                placeholder="Acme Holdings LLC"
                value={form.llcName}
                onChange={set('llcName')}
              />
            </label>
            <fieldset className="jurisdiction-toggle">
              <legend>Jurisdiction (optional)</legend>
              <div className="jurisdiction-toggle-options">
                <label>
                  <input
                    type="radio"
                    name="jurisdiction_status"
                    value="Domestic"
                    checked={form.jurisdictionStatus === 'Domestic'}
                    onChange={() => setForm({ ...form, jurisdictionStatus: 'Domestic' })}
                  />
                  <span>Domestic</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="jurisdiction_status"
                    value="Foreign"
                    checked={form.jurisdictionStatus === 'Foreign'}
                    onChange={() => setForm({ ...form, jurisdictionStatus: 'Foreign' })}
                  />
                  <span>Foreign</span>
                </label>
              </div>
            </fieldset>
            <label className="form-full">
              <span>County of Formation</span>
              <select
                name="county"
                id="countySelect"
                required
                value={form.county}
                onChange={set('county')}
              >
                <option value="">Select a county…</option>
                {prices.map((p) => {
                  const itemPrice = form.jurisdictionStatus === 'Foreign' && p.priceForeign != null ? p.priceForeign : p.price;
                  return (
                    <option key={p.county} value={p.county}>
                      {p.county} — {fmt(itemPrice)}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-eyebrow">2 · Authorized Representative</div>
          <div className="form-grid form-grid-2">
            <label>
              <span>First Name</span>
              <input
                type="text"
                name="first_name"
                required
                value={form.firstName}
                onChange={set('firstName')}
              />
            </label>
            <label>
              <span>Last Name</span>
              <input
                type="text"
                name="last_name"
                required
                value={form.lastName}
                onChange={set('lastName')}
              />
            </label>
            <label>
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={set('email')}
              />
            </label>
            <label>
              <span>Contact Phone</span>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={set('phone')}
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-eyebrow form-eyebrow-row">
            <span>3 · Billing Authorization</span>
            <span className="form-secure">🔒 Encrypted via Stripe · 256-bit SSL</span>
          </div>
          <div className="form-grid">
            <label className="form-full">
              <span>Payment Details</span>
              <div className="stripe-card-element">
                <input
                  type="text"
                  placeholder="Card number  MM / YY  CVC"
                  value={form.card}
                  onChange={set('card')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontFamily: 'var(--sans)',
                    fontSize: '15px',
                    color: 'var(--navy)',
                    outline: 'none',
                  }}
                />
              </div>
            </label>
            <label className="form-full">
              <span>Promotional / Discount Code (optional)</span>
              <input
                type="text"
                name="discount_code"
                value={form.discountCode}
                onChange={set('discountCode')}
              />
            </label>
          </div>
        </div>

        <div className="form-foot">
          <button type="submit" className="btn btn-submit" id="submitBtn" disabled={busy}>
            {busy ? 'Processing Filing…' : `Authorize & File Order ${amount ? `— ${fmt(amount)}` : ''} →`}
          </button>
        </div>
        <div className="form-fine">
          By submitting, you authorize LLC Publication Online to arrange designated print notices and file your Certificate of Publication with the NY Department of State. Full cancellation available prior to initial press run.
        </div>
        {status.msg && (
          <div className={`form-status ${status.type}`} id="formStatus" role="status" aria-live="polite">
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}
