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
          <div className="eyebrow">Pricing</div>
          <h2 className="display navy">
            Every county. <span className="italic">One flat fee.</span>
          </h2>
          <p className="pricing-sub">
            Pricing is set by the county clerk&apos;s designated newspapers. We pass through the actual
            newspaper rates plus a single flat service fee—no expedite fees, no add-ons.
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
                <span>Domestic</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="pricing_jurisdiction_status"
                  value="Foreign"
                  checked={jur === 'Foreign'}
                  onChange={() => setJur('Foreign')}
                />
                <span>Foreign</span>
              </label>
            </div>
          </fieldset>
        </div>
        <input
          type="search"
          id="countySearch"
          placeholder="Search counties…"
          aria-label="Search counties"
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
        NYC counties (Bronx, Kings, New York, Queens, Richmond) are higher because the clerk-designated
        newspapers there charge premium rates set by the courts.
      </div>
    </>
  );
}
