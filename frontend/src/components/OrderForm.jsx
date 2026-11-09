import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { fmt } from '../data/seed';
import { useLanguage } from '../context/LanguageContext';

export default function OrderForm({
  prices,
  selectedCounty,
  selectedJurisdiction,
  onCountyChange,
}) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({
    llcName: '',
    jurisdictionStatus: selectedJurisdiction || 'Domestic',
    county: selectedCounty || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    discountCode: '',
    card: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (selectedCounty && selectedCounty !== form.county) {
      setForm((prev) => ({
        ...prev,
        county: selectedCounty,
        ...(selectedJurisdiction ? { jurisdictionStatus: selectedJurisdiction } : {}),
      }));
    }
  }, [selectedCounty, selectedJurisdiction]);

  const priceMap = useMemo(() => {
    const map = {};
    for (const p of prices) {
      map[p.county] = form.jurisdictionStatus === 'Foreign' && p.priceForeign != null ? p.priceForeign : p.price;
    }
    return map;
  }, [prices, form.jurisdictionStatus]);

  const amount = form.county ? priceMap[form.county] : null;

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm({ ...form, [k]: val });
    if (k === 'county' && onCountyChange) {
      onCountyChange(val);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    if (!form.llcName.trim()) return setStatus({ type: 'err', msg: t('order', 'errLLC') });
    if (!form.county) return setStatus({ type: 'err', msg: t('order', 'errCounty') });
    if (!form.firstName.trim() || !form.lastName.trim()) return setStatus({ type: 'err', msg: t('order', 'errName') });
    if (!form.email.trim()) return setStatus({ type: 'err', msg: t('order', 'errEmail') });
    if (!form.phone.trim()) return setStatus({ type: 'err', msg: t('order', 'errPhone') });

    setBusy(true);
    try {
      const { card: _omit, ...payload } = form;
      const r = await api.createOrder(payload);
      setStatus({
        type: 'ok',
        msg: `${t('order', 'successPrefix')} ${r.order.llcName} — ${fmt(r.order.amount)}. ${t('order', 'successSuffix')}`,
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
        <div className="eyebrow eyebrow-light">{t('order', 'eyebrow')}</div>
        <h2 className="display light">
          {t('order', 'heading1')} <span className="italic gold">{t('order', 'heading2')}</span>
        </h2>
        <p className="order-aside-lede">
          {t('order', 'lede')}
        </p>
        <div className="order-summary">
          <div className="order-summary-eyebrow">{t('order', 'summaryEyebrow')}</div>
          <div className="order-summary-county" id="summaryCounty">
            {form.county ? (lang === 'es' ? `Condado de ${form.county}` : `${form.county} County`) : t('order', 'selectCountyHint')}
          </div>
          <div className="order-summary-amount" id="summaryAmount">
            {amount ? fmt(amount) : '$—'}
          </div>
          <div className="order-summary-note">{t('order', 'summaryNote')}</div>
        </div>
      </aside>

      <form className="order-form" id="orderForm" onSubmit={submit} noValidate>
        <div className="form-section">
          <div className="form-eyebrow">{t('order', 's1Title')}</div>
          <div className="form-grid form-grid-2">
            <label>
              <span>{t('order', 'llcName')}</span>
              <input
                type="text"
                name="llc_name"
                required
                placeholder={t('order', 'llcNamePlaceholder')}
                value={form.llcName}
                onChange={set('llcName')}
              />
            </label>
            <fieldset className="jurisdiction-toggle">
              <legend>{t('order', 'jurisdiction')}</legend>
              <div className="jurisdiction-toggle-options">
                <label>
                  <input
                    type="radio"
                    name="jurisdiction_status"
                    value="Domestic"
                    checked={form.jurisdictionStatus === 'Domestic'}
                    onChange={() => setForm({ ...form, jurisdictionStatus: 'Domestic' })}
                  />
                  <span>{t('order', 'jurisdictionDomestic')}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="jurisdiction_status"
                    value="Foreign"
                    checked={form.jurisdictionStatus === 'Foreign'}
                    onChange={() => setForm({ ...form, jurisdictionStatus: 'Foreign' })}
                  />
                  <span>{t('order', 'jurisdictionForeign')}</span>
                </label>
              </div>
            </fieldset>
            <label className="form-full">
              <span>{t('order', 'county')}</span>
              <select
                name="county"
                id="countySelect"
                required
                value={form.county}
                onChange={set('county')}
              >
                <option value="">{t('order', 'countyPlaceholder')}</option>
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
          <div className="form-eyebrow">{t('order', 's2Title')}</div>
          <div className="form-grid form-grid-2">
            <label>
              <span>{t('order', 'firstName')}</span>
              <input
                type="text"
                name="first_name"
                required
                value={form.firstName}
                onChange={set('firstName')}
              />
            </label>
            <label>
              <span>{t('order', 'lastName')}</span>
              <input
                type="text"
                name="last_name"
                required
                value={form.lastName}
                onChange={set('lastName')}
              />
            </label>
            <label>
              <span>{t('order', 'email')}</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={set('email')}
              />
            </label>
            <label>
              <span>{t('order', 'phone')}</span>
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
            <span>{t('order', 's3Title')}</span>
            <span className="form-secure">🔒 {t('order', 'secureNote')}</span>
          </div>
          <div className="form-grid">
            <label className="form-full">
              <span>{lang === 'es' ? 'Detalles de Pago' : 'Payment Details'}</span>
              <div className="stripe-card-element">
                <input
                  type="text"
                  placeholder={lang === 'es' ? 'Número de tarjeta  MM / AA  CVC' : 'Card number  MM / YY  CVC'}
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
              <span>{lang === 'es' ? 'Código Promocional / Descuento (opcional)' : 'Promotional / Discount Code (optional)'}</span>
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
            {busy ? t('order', 'submitting') : (lang === 'es' ? `Autorizar y Radicar Orden ${amount ? `— ${fmt(amount)}` : ''} →` : `Authorize & File Order ${amount ? `— ${fmt(amount)}` : ''} →`)}
          </button>
        </div>
        <div className="form-fine">
          {lang === 'es'
            ? 'Al enviar este formulario, usted autoriza a LLC Publications a coordinar los avisos impresos y radicar su Certificado de Publicación ante el Departamento de Estado de NY. Cancelación completa disponible antes de la primera publicación.'
            : 'By submitting, you authorize LLC Publications to arrange designated print notices and file your Certificate of Publication with the NY Department of State. Full cancellation available prior to initial press run.'}
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
