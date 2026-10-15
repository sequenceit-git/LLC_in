import { useMemo, useState } from 'react';
import { api } from '../api';
import { fmt } from '../data/seed';

export default function OrderForm({ prices }) {
  const [form, setForm] = useState({
    llcName: '', jurisdictionStatus: 'Domestic', county: '',
    firstName: '', lastName: '', email: '', phone: '',
    discountCode: '', card: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);

  const priceMap = useMemo(() => Object.fromEntries(prices.map((p) => [p.county, p.price])), [prices]);
  const amount = form.county ? priceMap[form.county] : null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    if (!form.county) return setStatus({ type: 'err', msg: 'Please select a county.' });
    setBusy(true);
    try {
      const { card: _omit, ...payload } = form;
      const r = await api.createOrder(payload);
      setStatus({ type: 'ok', msg: `Order received for ${r.order.llcName} — ${fmt(r.order.amount)}. We will contact the newspapers within 24 hours.` });
      setForm({ llcName: '', jurisdictionStatus: 'Domestic', county: '', firstName: '', lastName: '', email: '', phone: '', discountCode: '', card: '' });
    } catch (err) {
      setStatus({ type: 'err', msg: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="order-grid container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <aside className="order-aside">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-rule"></span>Begin</div>
        <h2 className="display light">Place your <span className="italic gold">publication order.</span></h2>
        <p className="order-aside-lede" style={{ fontFamily: 'var(--sans)', color: 'rgba(250,247,241,.8)' }}>
          One form. One flat fee. Publication begins within days. We file your Certificate of Publication with the New York Department of State.
        </p>
        <div className="order-summary">
          <div className="order-summary-eyebrow">Order Summary</div>
          <div className="order-summary-county">{form.county || 'Select a county →'}</div>
          <div className="order-summary-amount">{amount ? fmt(amount) : '$—'}</div>
          <div className="order-summary-note">All-inclusive · No expedite fee · Filed with NY DOS</div>
        </div>
      </aside>
      <form className="order-form" onSubmit={submit} noValidate>
        <div className="form-section">
          <div className="form-eyebrow">1 · Your LLC</div>
          <div className="form-grid">
            <label><span>LLC Name</span><input type="text" required placeholder="Acme Holdings LLC" value={form.llcName} onChange={set('llcName')} /></label>
            <fieldset className="jurisdiction-toggle">
              <legend style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600 }}>Jurisdiction (optional)</legend>
              <div className="jurisdiction-toggle-options">
                {['Domestic', 'Foreign'].map((v) => (
                  <label key={v}><input type="radio" name="jurisdiction_status" checked={form.jurisdictionStatus === v} onChange={() => setForm({ ...form, jurisdictionStatus: v })} /><span>{v}</span></label>
                ))}
              </div>
            </fieldset>
            <label className="form-full"><span>County of Formation</span>
              <select required value={form.county} onChange={set('county')}>
                <option value="">Select county…</option>
                {prices.map((p) => <option key={p.county} value={p.county}>{p.county} — {fmt(p.price)}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="form-section">
          <div className="form-eyebrow">2 · Contact</div>
          <div className="form-grid">
            <label><span>First Name</span><input type="text" required value={form.firstName} onChange={set('firstName')} /></label>
            <label><span>Last Name</span><input type="text" required value={form.lastName} onChange={set('lastName')} /></label>
            <label><span>Email</span><input type="email" required value={form.email} onChange={set('email')} /></label>
            <label><span>Phone</span><input type="tel" required value={form.phone} onChange={set('phone')} /></label>
          </div>
        </div>
        <div className="form-section">
          <div className="form-eyebrow"><span>3 · Payment</span><span className="form-secure">🔒 Secured via Stripe · 256-bit SSL</span></div>
          <div className="form-grid">
            <label className="form-full"><span>Credit Card (processed securely at launch — recorded as pending for now)</span>
              <input type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" value={form.card} onChange={set('card')} />
            </label>
            <label className="form-full"><span>Discount Code (optional)</span>
              <input type="text" value={form.discountCode} onChange={set('discountCode')} />
            </label>
          </div>
        </div>
        <div className="form-foot">
          <button className="btn btn-gold" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Submitting…' : `Submit Order ${amount ? `— ${fmt(amount)}` : ''} →`}
          </button>
          {status.msg && <div className={`form-status ${status.type}`}>{status.msg}</div>}
          <div className="form-fine">By submitting, you authorize LLC Publication Online to charge the card above and arrange publication on your behalf. Refunds available before publication begins.</div>
        </div>
      </form>
    </div>
  );
}
