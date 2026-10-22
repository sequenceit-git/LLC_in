import { useMemo, useState } from 'react';
import { fmt } from '../data/seed';

export default function PricingGrid({ prices }) {
  const [q, setQ] = useState('');
  const [jur, setJur] = useState('Domestic');

  const rows = useMemo(
    () => prices.filter((p) => p.county.toLowerCase().includes(q.toLowerCase())),
    [prices, q]
  );

  const priceFor = (p) => (jur === 'Foreign' && p.priceForeign != null ? p.priceForeign : p.price);

  return (
    <>
      <div className="section-head pricing-head">
        <div>
          <div className="eyebrow">County Tariffs</div>
          <h2 className="display navy">
            Statewide coverage. <span className="italic">Guaranteed flat fees.</span>
          </h2>
          <p className="pricing-sub">
            Statutory rates are determined by county clerk-designated newspapers. We pass through true publisher invoices plus our single flat administration fee—with zero hidden markups or expedite charges.
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
                <span>Domestic LLC</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="pricing_jurisdiction_status"
                  value="Foreign"
                  checked={jur === 'Foreign'}
                  onChange={() => setJur('Foreign')}
                />
                <span>Foreign LLC</span>
              </label>
            </div>
          </fieldset>
        </div>
        <input
          type="search"
          id="countySearch"
          placeholder="Filter 62 NY counties…"
          aria-label="Filter 62 NY counties"
          className="county-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="county-grid" id="countyGrid" role="list">
        {rows.map((p) => (
          <div className="county-row" role="listitem" key={p.county}>
            <span className="county-name">{p.county}</span>
            <span className="county-price">{fmt(priceFor(p))}</span>
          </div>
        ))}
      </div>

      <div className="pricing-foot">
        * Notice: NYC metropolitan counties (Bronx, Kings, New York, Queens, Richmond) carry higher statutory tariffs set directly by court-designated legal newspapers.
      </div>
    </>
  );
}
