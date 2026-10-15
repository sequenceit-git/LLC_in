import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { fmt } from '../data/seed';

const TABS = ['orders', 'pricing', 'articles'];

export default function AdminPage() {
  const [tab, setTab] = useState('orders');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.stats().then(setStats).catch(() => setStats(null));
  }, [tab]);

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <div className="container">
          <div>
            <Link to="/" style={{ fontFamily: 'var(--display)', fontSize: 20 }}>← LLC Publication <span style={{ color: 'var(--gold)' }}>Admin</span></Link>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, opacity: 0.7 }}>No-auth mode (add auth middleware before public launch)</div>
          </div>
          <nav>
            {TABS.map((t) => <Link key={t} to={`?tab=${t}`} onClick={(e) => { e.preventDefault(); setTab(t); }} className={tab === t ? 'active' : ''}>{t}</Link>)}
          </nav>
        </div>
      </div>
      <div className="container admin-body">
        {stats && (
          <div className="stat-grid">
            <div className="stat"><div className="stat-num">{stats.totalOrders}</div><div className="stat-label">Total orders</div></div>
            <div className="stat"><div className="stat-num">{stats.newOrders}</div><div className="stat-label">New (unprocessed)</div></div>
            <div className="stat"><div className="stat-num">{fmt(stats.pipelineRevenue)}</div><div className="stat-label">Pipeline revenue</div></div>
            <div className="stat"><div className="stat-num">{stats.publishedArticles}</div><div className="stat-label">Published articles · {stats.counties} counties live</div></div>
          </div>
        )}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'pricing' && <PricingPanel />}
        {tab === 'articles' && <ArticlesPanel />}
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = () => api.orders({ q, status, page, limit: 20 }).then(setData).catch(() => {});
  useEffect(() => { load(); }, [page]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(() => { setPage(1); api.orders({ q, status, page: 1, limit: 20 }).then(setData).catch(() => {}); }, 400); return () => clearTimeout(t); }, [q, status]);

  const patch = async (id, body) => { await api.patchOrder(id, body); load(); };

  return (
    <div className="panel">
      <h3>Publication orders ({data.total})</h3>
      <div className="toolbar">
        <input placeholder="Search name, LLC, email, county…" value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 260 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['new', 'processing', 'publishing', 'filed', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="small-btn" onClick={load}>Refresh</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Date</th><th>LLC / County</th><th>Contact</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {data.items.map((o) => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td><strong>{o.llcName}</strong><br />{o.county} · {o.jurisdictionStatus}<br /><span style={{ color: '#666' }}>{o.discountCode ? `coupon: ${o.discountCode}` : ''}</span></td>
                <td>{o.firstName} {o.lastName}<br />{o.email}<br />{o.phone}</td>
                <td><strong>{fmt(o.amount)}</strong><br /><span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                <td>
                  <div className="row-actions">
                    <select value={o.status} onChange={(e) => patch(o._id, { status: e.target.value })} className="small-btn">
                      {['new', 'processing', 'publishing', 'filed', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={o.paymentStatus} onChange={(e) => patch(o._id, { paymentStatus: e.target.value })} className="small-btn">
                      {['pending', 'paid', 'failed', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="small-btn danger" onClick={async () => { if (confirm('Delete order?')) { await api.deleteOrder(o._id); load(); } }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="toolbar" style={{ marginTop: 12 }}>
        <button className="small-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>Page {data.page} / {data.pages}</span>
        <button className="small-btn" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
}

function PricingPanel() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [dirty, setDirty] = useState({});
  const [msg, setMsg] = useState('');

  const load = () => api.pricesAll().then(setItems).catch(() => setMsg('API offline — showing nothing. Start backend.'));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((p) => p.county.toLowerCase().includes(q.toLowerCase())), [items, q]);

  const saveOne = async (p) => {
    const price = dirty[p.county] ?? p.price;
    await api.updatePrice(p.county, { county: p.county, price: Number(price) });
    setMsg(`Saved ${p.county} → ${fmt(price)}`);
    load();
  };

  const saveAll = async () => {
    const rows = Object.entries(dirty).map(([county, price]) => ({ county, price: Number(price) }));
    if (!rows.length) return;
    await api.bulkPrices(rows);
    setDirty({});
    setMsg(`Saved ${rows.length} counties`);
    load();
  };

  return (
    <div className="panel">
      <h3>County pricing (all 62 NY counties)</h3>
      <div className="toolbar">
        <input placeholder="Search counties…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="small-btn" onClick={saveAll} disabled={!Object.keys(dirty).length}>Save all edited ({Object.keys(dirty).length})</button>
        <button className="small-btn" onClick={load}>Refresh</button>
        {msg && <span style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>{msg}</span>}
      </div>
      <div className="price-edit-grid">
        {filtered.map((p) => (
          <div className="price-cell" key={p.county}>
            <span style={{ flex: 1 }}>{p.county}</span>
            <span>$</span>
            <input type="number" min="0" value={dirty[p.county] ?? p.price} onChange={(e) => setDirty({ ...dirty, [p.county]: e.target.value })} />
            <button className="small-btn" onClick={() => saveOne(p)}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ slug: '', title: '', excerpt: '', tag: 'Service', contentHtml: '', readingTime: '8 minutes', status: 'draft', featured: false });

  const load = () => api.articles(true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing('new'); setForm({ slug: '', title: '', excerpt: '', tag: 'Service', contentHtml: '', readingTime: '8 minutes', status: 'draft', featured: false }); };
  const startEdit = (a) => { setEditing(a._id); setForm({ slug: a.slug, title: a.title, excerpt: a.excerpt, tag: a.tag, contentHtml: a.contentHtml, readingTime: a.readingTime, status: a.status, featured: !!a.featured }); };

  const save = async (e) => {
    e.preventDefault();
    if (editing === 'new') await api.createArticle(form);
    else await api.updateArticle(editing, form);
    setEditing(null);
    load();
  };

  return (
    <>
      <div className="panel">
        <h3>Articles ({items.length}) — publish management</h3>
        <div className="toolbar"><button className="small-btn" onClick={startNew}>+ New article</button><button className="small-btn" onClick={load}>Refresh</button></div>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id}>
                <td><strong>{a.title}</strong><br /><span style={{ color: '#666' }}>{a.tag} · {a.readingTime}</span></td>
                <td><code>/{a.slug}</code></td>
                <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
                <td><div className="row-actions">
                  <button className="small-btn" onClick={() => startEdit(a)}>Edit</button>
                  <a className="small-btn" href={`/resources/${a.slug}`} target="_blank" rel="noreferrer">View</a>
                  <button className="small-btn danger" onClick={async () => { if (confirm('Delete article?')) { await api.deleteArticle(a._id); load(); } }}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="panel">
          <h3>{editing === 'new' ? 'New article' : 'Edit article'}</h3>
          <form className="admin-form" onSubmit={save}>
            <div className="two-col">
              <input placeholder="slug (e.g. my-guide)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} required />
              <input placeholder="Tag (Service, Compliance, …)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
            </div>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input placeholder="Excerpt (card subtitle)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
            <div className="two-col">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">draft</option><option value="published">published</option></select>
              <input placeholder="Reading time" value={form.readingTime} onChange={(e) => setForm({ ...form, readingTime: e.target.value })} />
            </div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: 13 }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <textarea placeholder="<p>Article HTML…</p>" value={form.contentHtml} onChange={(e) => setForm({ ...form, contentHtml: e.target.value })} required />
            <div className="toolbar"><button className="btn btn-navy" type="submit">Save &amp; {form.status === 'published' ? 'publish' : 'save draft'}</button><button className="small-btn" type="button" onClick={() => setEditing(null)}>Cancel</button></div>
          </form>
        </div>
      )}
    </>
  );
}
