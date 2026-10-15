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
    <div>
      <div className="jurisdiction-toggle" role="radiogroup" aria-label="Jurisdiction">
        {['Domestic', 'Foreign'].map((v) => (
          <label key={v}><input type="radio" checked={jur === v} onChange={() => setJur(v)} /><span>{v}</span></label>
        ))}
      </div>
      <br />
      <input className="county-search" type="search" placeholder="Search counties…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search counties" />
      <div className="county-grid" role="list">
        {rows.map((p) => (
          <div className="county-row" role="listitem" key={p.county}>
            <span className="county-name">{p.county}</span>
            <span className="county-price">{fmt(priceFor(p))}</span>
          </div>
        ))}
      </div>
      <div className="pricing-foot">NYC counties (Bronx, Kings, New York, Queens, Richmond) are higher because the clerk-designated newspapers there charge premium rates set by the courts.</div>
    </div>
  );
}
