import { useMemo, useState } from 'react';
import { fmt } from '../data/seed';
import { useLanguage } from '../context/LanguageContext';

export default function PricingGrid({
  prices,
  selectedCounty,
  onSelectCounty,
  jurisdictionStatus,
  onJurisdictionChange,
}) {
  const { t } = useLanguage();
  const [q, setQ] = useState('');
  const [internalJur, setInternalJur] = useState('Domestic');

  const jur = jurisdictionStatus !== undefined ? jurisdictionStatus : internalJur;

  const setJur = (val) => {
    setInternalJur(val);
    if (onJurisdictionChange) onJurisdictionChange(val);
  };

  const rows = useMemo(
    () => prices.filter((p) => p.county.toLowerCase().includes(q.toLowerCase())),
    [prices, q]
  );

  const priceFor = (p) => (jur === 'Foreign' && p.priceForeign != null ? p.priceForeign : p.price);

  const handleCountyClick = (countyName) => {
    if (onSelectCounty) {
      onSelectCounty(countyName, jur);
    }
    const orderEl = document.getElementById('order');
    if (orderEl) {
      orderEl.scrollIntoView({ behavior: 'smooth' });
    }
    const selectEl = document.getElementById('countySelect');
    if (selectEl) {
      setTimeout(() => selectEl.focus(), 350);
    }
  };

  return (
    <>
      <div className="section-head pricing-head">
        <div>
          <div className="eyebrow">{t('pricing', 'eyebrow')}</div>
          <h2 className="display navy">
            {t('pricing', 'heading1')} <span className="italic">{t('pricing', 'heading2')}</span>
          </h2>
          <p className="pricing-sub">
            {t('pricing', 'sub')}
          </p>
          <fieldset className="jurisdiction-toggle">
            <div className="jurisdiction-toggle-options">
              <label>
                <input
                  type="radio"
                  name="pricing_jurisdiction_status"
                  value="Domestic"
                  checked={jur === 'Domestic'}
                  onChange={() => setJur('Domestic')}
                />
                <span>{t('pricing', 'domestic')}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="pricing_jurisdiction_status"
                  value="Foreign"
                  checked={jur === 'Foreign'}
                  onChange={() => setJur('Foreign')}
                />
                <span>{t('pricing', 'foreign')}</span>
              </label>
            </div>
          </fieldset>
        </div>
        <input
          type="search"
          id="countySearch"
          placeholder={t('pricing', 'searchPlaceholder')}
          aria-label={t('pricing', 'searchPlaceholder')}
          className="county-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="county-grid" id="countyGrid" role="list">
        {rows.map((p) => {
          const isSelected = selectedCounty === p.county;
          return (
            <div
              className={`county-row ${isSelected ? 'is-selected' : ''}`}
              role="button"
              tabIndex={0}
              key={p.county}
              onClick={() => handleCountyClick(p.county)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCountyClick(p.county);
                }
              }}
              title={`Click to select ${p.county} for your order`}
              aria-label={`Select ${p.county} for ${fmt(priceFor(p))}`}
            >
              <span className="county-name">{p.county}</span>
              <div className="county-price-wrap">
                <span className="county-price">{fmt(priceFor(p))}</span>
                <span className="county-select-hint">{t('pricing', 'selectHint')}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pricing-foot">
        {t('pricing', 'notice')}
      </div>
    </>
  );
}
