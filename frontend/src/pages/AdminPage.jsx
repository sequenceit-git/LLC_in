import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { fmt, FALLBACK_POLICIES, FALLBACK_COMPARISON, FAQS } from '../data/seed';
import RowMenu from '../components/RowMenu';

const NAV = [
  { id: 'orders', label: 'Orders', icon: '▤' },
  { id: 'pricing', label: 'County Pricing', icon: '$' },
  { id: 'articles', label: 'Articles', icon: '✎' },
  { id: 'statements', label: 'Statements', icon: '§' },
  { id: 'comparison', label: 'Comparison', icon: '⇄' },
  { id: 'faqs', label: 'FAQs', icon: '?' },
];

const TAB_IDS = NAV.map((n) => n.id);

export default function AdminPage() {
  const { tab: tabParam } = useParams();
  const isValidTab = TAB_IDS.includes(tabParam);
  const tab = isValidTab ? tabParam : 'orders';

  const [stats, setStats] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.stats().then(setStats).catch(() => setStats(null));
  }, [tab]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);

  const current = NAV.find((n) => n.id === tab);

  // Unknown admin path -> canonical orders route
  if (!isValidTab) return <Navigate to="/admin/orders" replace />;

  return (
    <div className="admin-wrap">
      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">L</span>
          <span className="admin-brand-text">
            <span className="admin-brand-name">LLC Publication</span>
            <span className="admin-brand-tag">Admin Console</span>
          </span>
        </Link>
        <nav className="admin-nav">
          <div className="admin-nav-label">Manage</div>
          {NAV.map((n) => (
            <Link
              key={n.id}
              to={`/admin/${n.id}`}
              className={tab === n.id ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              <span className="admin-nav-icon" aria-hidden="true">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-side-link">← View live site</Link>
          <div className="admin-auth-note">No-auth mode · add auth before launch</div>
        </div>
      </aside>

      {menuOpen && <div className="admin-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="admin-main">
        <div className="admin-topbar">
          <button
            type="button"
            className="admin-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle admin navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <div>
            <h1 className="admin-page-title">{current?.label || 'Dashboard'}</h1>
            <div className="admin-page-sub">Admin console · LLC Publication Online</div>
          </div>
        </div>

        {stats && (
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-num">{stats.totalOrders}</div>
              <div className="stat-label">Total orders</div>
            </div>
            <div className="stat">
              <div className="stat-num">{stats.newOrders}</div>
              <div className="stat-label">New (unprocessed)</div>
            </div>
            <div className="stat">
              <div className="stat-num">{fmt(stats.pipelineRevenue)}</div>
              <div className="stat-label">Pipeline revenue</div>
            </div>
            <div className="stat">
              <div className="stat-num">{stats.publishedArticles}</div>
              <div className="stat-label">Published articles · {stats.counties} counties live</div>
            </div>
          </div>
        )}

        {tab === 'orders' && <OrdersPanel />}
        {tab === 'pricing' && <PricingPanel />}
        {tab === 'articles' && <ArticlesPanel />}
        {tab === 'statements' && <StatementsPanel />}
        {tab === 'comparison' && <ComparisonPanel />}
        {tab === 'faqs' && <FaqsPanel />}
      </main>
    </div>
  );
}

function OrdersPanel() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = () => api.orders({ q, status, page, limit: 20 }).then(setData).catch(() => {});
  useEffect(() => {
    load();
  }, [page]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      api.orders({ q, status, page: 1, limit: 20 }).then(setData).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [q, status]);

  const patch = async (id, body) => {
    await api.patchOrder(id, body);
    load();
  };

  return (
    <div className="panel">
      <h3>Publication orders ({data.total})</h3>
      <div className="toolbar">
        <input
          placeholder="Search name, LLC, email, county…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['new', 'processing', 'publishing', 'filed', 'completed', 'cancelled'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="small-btn" onClick={load}>
          Refresh
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>LLC / County</th>
              <th>Contact</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((o) => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <strong>{o.llcName}</strong>
                  <br />
                  {o.county} · {o.jurisdictionStatus}
                  <br />
                  <span style={{ color: '#666' }}>{o.discountCode ? `coupon: ${o.discountCode}` : ''}</span>
                </td>
                <td>
                  {o.firstName} {o.lastName}
                  <br />
                  {o.email}
                  <br />
                  {o.phone}
                </td>
                <td>
                  <strong>{fmt(o.amount)}</strong>
                  <br />
                  <span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span>
                </td>
                <td>
                  <span className={`badge ${o.status}`}>{o.status}</span>
                </td>
                <td>
                  <RowMenu label={`Actions for ${o.llcName}`}>
                    <div className="row-menu-field">
                      <span>Order status</span>
                      <select
                        value={o.status}
                        onChange={(e) => patch(o._id, { status: e.target.value })}
                      >
                        {['new', 'processing', 'publishing', 'filed', 'completed', 'cancelled'].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row-menu-field">
                      <span>Payment</span>
                      <select
                        value={o.paymentStatus}
                        onChange={(e) => patch(o._id, { paymentStatus: e.target.value })}
                      >
                        {['pending', 'paid', 'failed', 'refunded'].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row-menu-sep" />
                    <button
                      type="button"
                      className="row-menu-item danger"
                      onClick={async () => {
                        if (confirm('Delete order?')) {
                          await api.deleteOrder(o._id);
                          load();
                        }
                      }}
                    >
                      Delete order
                    </button>
                  </RowMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="toolbar" style={{ marginTop: 12 }}>
        <button className="small-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ← Prev
        </button>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>
          Page {data.page} / {data.pages}
        </span>
        <button className="small-btn" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

function PricingPanel() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [dirty, setDirty] = useState({});
  const [msg, setMsg] = useState('');

  const load = () =>
    api
      .pricesAll()
      .then(setItems)
      .catch(() => setMsg('API offline — showing fallback. Start backend.'));
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => items.filter((p) => p.county.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

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
        <button
          className="small-btn"
          onClick={saveAll}
          disabled={!Object.keys(dirty).length}
        >
          Save all edited ({Object.keys(dirty).length})
        </button>
        <button className="small-btn" onClick={load}>
          Refresh
        </button>
        {msg && <span style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>{msg}</span>}
      </div>
      <div className="price-edit-grid">
        {filtered.map((p) => (
          <div className="price-cell" key={p.county}>
            <span style={{ flex: 1 }}>{p.county}</span>
            <span>$</span>
            <input
              type="number"
              min="0"
              value={dirty[p.county] ?? p.price}
              onChange={(e) => setDirty({ ...dirty, [p.county]: e.target.value })}
            />
            <button className="small-btn" onClick={() => saveOne(p)}>
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    tag: 'Service',
    contentHtml: '',
    readingTime: '8 minutes',
    status: 'draft',
    featured: false,
  });

  const load = () => api.articles(true).then(setItems).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing('new');
    setForm({
      slug: '',
      title: '',
      excerpt: '',
      tag: 'Service',
      contentHtml: '',
      readingTime: '8 minutes',
      status: 'draft',
      featured: false,
    });
  };
  const startEdit = (a) => {
    setEditing(a._id);
    setForm({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      tag: a.tag,
      contentHtml: a.contentHtml,
      readingTime: a.readingTime,
      status: a.status,
      featured: !!a.featured,
    });
  };

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
        <div className="toolbar">
          <button className="small-btn" onClick={startNew}>
            + New article
          </button>
          <button className="small-btn" onClick={load}>
            Refresh
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id}>
                <td>
                  <strong>{a.title}</strong>
                  <br />
                  <span style={{ color: '#666' }}>
                    {a.tag} · {a.readingTime}
                  </span>
                </td>
                <td>
                  <code>/{a.slug}</code>
                </td>
                <td>
                  <span className={`badge ${a.status}`}>{a.status}</span>
                </td>
                <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
                <td>
                  <RowMenu label={`Actions for ${a.title}`}>
                    <button type="button" className="row-menu-item" onClick={() => startEdit(a)}>
                      Edit article
                    </button>
                    <a
                      className="row-menu-item"
                      href={`/resources/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View live
                    </a>
                    <div className="row-menu-sep" />
                    <button
                      type="button"
                      className="row-menu-item danger"
                      onClick={async () => {
                        if (confirm('Delete article?')) {
                          await api.deleteArticle(a._id);
                          load();
                        }
                      }}
                    >
                      Delete article
                    </button>
                  </RowMenu>
                </td>
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
              <input
                placeholder="slug (e.g. my-guide)"
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                  })
                }
                required
              />
              <input
                placeholder="Tag (Service, Compliance, …)"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </div>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="Excerpt (card subtitle)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              required
            />
            <div className="two-col">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
              <input
                placeholder="Reading time"
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
              />
            </div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />{' '}
              Featured
            </label>
            <textarea
              placeholder="<p>Article HTML…</p>"
              value={form.contentHtml}
              onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
              required
            />
            <div className="toolbar">
              <button className="btn btn-navy" type="submit">
                Save &amp; {form.status === 'published' ? 'publish' : 'save draft'}
              </button>
              <button className="small-btn" type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function StatementsPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ slug: '', title: '', meta: '', contentHtml: '', category: 'legal' });
  const [msg, setMsg] = useState('');

  const load = () => {
    api
      .policies()
      .then((data) => {
        if (data && data.length) setItems(data);
        else setItems(FALLBACK_POLICIES);
      })
      .catch(() => setItems(FALLBACK_POLICIES));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item) => {
    setEditing(item.slug);
    setForm({
      slug: item.slug,
      title: item.title,
      meta: item.meta || 'Last updated: May 2026 · LLC Publication Online',
      contentHtml: item.contentHtml || '',
      category: item.category || 'legal',
    });
    setMsg('');
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.updatePolicy(form.slug, form);
      setMsg(`✓ Successfully saved statement: ${form.title}`);
      setEditing(null);
      load();
    } catch (err) {
      setMsg(`Error saving: ${err.message}`);
    }
  };

  return (
    <>
      <div className="panel">
        <h3>Resource Column Statements ({items.length})</h3>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#666', marginTop: 4 }}>
          Manage and edit the 5 legal statements and resource pages linked in the footer. Changes persist to MongoDB.
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <button className="small-btn" onClick={load}>
            Refresh
          </button>
          {msg && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#137333', fontWeight: 600 }}>
              {msg}
            </span>
          )}
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>URL Path</th>
              <th>Meta / Updated Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.slug}>
                <td>
                  <strong>{p.title}</strong>
                </td>
                <td>
                  <code>/{p.slug}</code>
                </td>
                <td>
                  <span style={{ color: '#666' }}>{p.meta}</span>
                </td>
                <td>
                  <span className="badge new">{p.category || 'legal'}</span>
                </td>
                <td>
                  <RowMenu label={`Actions for ${p.title}`}>
                    <button type="button" className="row-menu-item" onClick={() => startEdit(p)}>
                      Edit &amp; save
                    </button>
                    <a className="row-menu-item" href={`/${p.slug}`} target="_blank" rel="noreferrer">
                      View live
                    </a>
                  </RowMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3>Edit Statement: {form.title}</h3>
          <form className="admin-form" onSubmit={save} style={{ marginTop: 16 }}>
            <div className="two-col">
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  URL Slug (read-only)
                </label>
                <input value={`/${form.slug}`} disabled style={{ background: '#eee' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Meta Line
              </label>
              <input
                value={form.meta}
                onChange={(e) => setForm({ ...form, meta: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Content HTML (supports &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;)
              </label>
              <textarea
                style={{ minHeight: 280, fontFamily: 'monospace', fontSize: 13 }}
                value={form.contentHtml}
                onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                required
              />
            </div>
            <div className="toolbar">
              <button className="btn btn-navy" type="submit">
                Save Statement to Database
              </button>
              <button className="small-btn" type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function FaqsPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ q: '', a: '', order: 0, isActive: true });
  const [msg, setMsg] = useState('');

  const load = () => {
    api
      .faqsAll()
      .then((data) => {
        if (data && data.length) setItems(data);
        else setItems(FAQS);
      })
      .catch(() => setItems(FAQS));
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing('new');
    setForm({ q: '', a: '', order: items.length + 1, isActive: true });
    setMsg('');
  };

  const startEdit = (f) => {
    setEditing(f._id || f.q);
    setForm({
      _id: f._id,
      q: f.q,
      a: f.a,
      order: f.order ?? 0,
      isActive: f.isActive ?? true,
    });
    setMsg('');
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === 'new' || !form._id) {
        await api.createFaq(form);
        setMsg('✓ Successfully added new FAQ');
      } else {
        await api.updateFaq(form._id, form);
        setMsg('✓ Successfully updated FAQ');
      }
      setEditing(null);
      load();
    } catch (err) {
      setMsg(`Error saving FAQ: ${err.message}`);
    }
  };

  const remove = async (f) => {
    if (!f._id) {
      setItems(items.filter((x) => x.q !== f.q));
      return;
    }
    if (confirm('Delete this FAQ question?')) {
      await api.deleteFaq(f._id);
      load();
    }
  };

  const update = async (f, patch) => {
    if (!f._id) {
      setItems(items.map((x) => (x.q === f.q ? { ...x, ...patch } : x)));
      return;
    }
    try {
      await api.updateFaq(f._id, {
        q: f.q,
        a: f.a,
        order: f.order ?? 0,
        isActive: f.isActive ?? true,
        ...patch,
      });
      load();
    } catch (err) {
      setMsg(`Error updating FAQ: ${err.message}`);
    }
  };

  return (
    <>
      <div className="panel">
        <h3>Frequently Asked Questions ({items.length})</h3>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#666', marginTop: 4 }}>
          Manage the FAQ accordions shown on the homepage. Questions and answers support HTML formatting.
        </p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <button className="small-btn" onClick={startNew}>
            + Add New FAQ
          </button>
          <button className="small-btn" onClick={load}>
            Refresh
          </button>
          {msg && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#137333', fontWeight: 600 }}>
              {msg}
            </span>
          )}
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Order</th>
              <th>Question</th>
              <th>Answer Preview</th>
              <th style={{ width: 80 }}>Status</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f, idx) => (
              <tr key={f._id || f.q}>
                <td>
                  <strong>{f.order ?? idx + 1}</strong>
                </td>
                <td>
                  <strong>{f.q}</strong>
                </td>
                <td>
                  <div
                    style={{
                      maxHeight: 60,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#555',
                    }}
                  >
                    {f.a.replace(/<[^>]+>/g, '')}
                  </div>
                </td>
                <td>
                  <span className={`badge ${f.isActive !== false ? 'published' : 'cancelled'}`}>
                    {f.isActive !== false ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <RowMenu label={`Actions for ${f.q}`}>
                    <button type="button" className="row-menu-item" onClick={() => startEdit(f)}>
                      Edit FAQ
                    </button>
                    <button
                      type="button"
                      className="row-menu-item"
                      onClick={() => update(f, { isActive: f.isActive === false })}
                    >
                      {f.isActive !== false ? 'Hide from site' : 'Show on site'}
                    </button>
                    <div className="row-menu-sep" />
                    <button type="button" className="row-menu-item danger" onClick={() => remove(f)}>
                      Delete FAQ
                    </button>
                  </RowMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3>{editing === 'new' ? 'Add New FAQ' : 'Edit FAQ'}</h3>
          <form className="admin-form" onSubmit={save} style={{ marginTop: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Question
              </label>
              <input
                placeholder="e.g. Is LLC publication in New York really required?"
                value={form.q}
                onChange={(e) => setForm({ ...form, q: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Answer (HTML and links allowed)
              </label>
              <textarea
                placeholder="e.g. Yes. Section 206 requires..."
                value={form.a}
                onChange={(e) => setForm({ ...form, a: e.target.value })}
                style={{ minHeight: 140 }}
                required
              />
            </div>
            <div className="two-col">
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>
                <label style={{ fontFamily: 'var(--sans)', fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />{' '}
                  Active (show on homepage)
                </label>
              </div>
            </div>
            <div className="toolbar">
              <button className="btn btn-navy" type="submit">
                Save FAQ
              </button>
              <button className="small-btn" type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function ComparisonPanel() {
  const [form, setForm] = useState(FALLBACK_COMPARISON);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const apply = (item) => {
    if (!item) return;
    setForm({
      eyebrow: item.eyebrow ?? '',
      heading: item.heading ?? '',
      headingAccent: item.headingAccent ?? '',
      columns: item.columns?.length ? item.columns : FALLBACK_COMPARISON.columns,
      rows: (item.rows || []).map((r) => ({ label: r.label || '', us: r.us || '', them: r.them || '' })),
      ctaLabel: item.ctaLabel ?? '',
      ctaHref: item.ctaHref ?? '',
    });
  };

  const load = () =>
    api
      .comparison()
      .then((item) => apply(item))
      .catch((err) => setError(err.message || 'Could not load'))
      .finally(() => setLoaded(true));

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setColumn = (i, v) =>
    setForm((f) => {
      const columns = [...(f.columns || [])];
      columns[i] = v;
      return { ...f, columns };
    });

  const setRow = (i, k, v) =>
    setForm((f) => ({
      ...f,
      rows: f.rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)),
    }));

  const addRow = () =>
    setForm((f) => ({ ...f, rows: [...f.rows, { label: '', us: '', them: '' }] }));

  const removeRow = (i) =>
    setForm((f) => ({ ...f, rows: f.rows.filter((_, idx) => idx !== i) }));

  const moveRow = (i, dir) =>
    setForm((f) => {
      const rows = [...f.rows];
      const j = i + dir;
      if (j < 0 || j >= rows.length) return f;
      [rows[i], rows[j]] = [rows[j], rows[i]];
      return { ...f, rows };
    });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setError('');
    try {
      const payload = {
        ...form,
        rows: form.rows.filter((r) => r.label.trim().length > 0),
      };
      const res = await api.updateComparison(payload);
      apply(res.item);
      setMsg('✓ Comparison section saved — live on the home page.');
    } catch (err) {
      setError(`Error saving: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!confirm('Restore the shipped default comparison content?')) return;
    try {
      const res = await api.resetComparison();
      apply(res.item);
      setMsg('✓ Restored defaults.');
      setError('');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  if (!loaded) {
    return (
      <div className="panel">
        <h3>Comparison section</h3>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#666' }}>Loading…</p>
      </div>
    );
  }

  const cols = form.columns || ['', '', ''];
  const previewRows = form.rows.filter((r) => `${r.label}${r.us}${r.them}`.trim().length > 0);

  return (
    <div className="panel">
      <h3>Home page · “The Comparison” section</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#666', marginTop: 4 }}>
        Edit the comparison table shown on the home page. Column 2 is your highlighted column, column 3 is
        the competitors. The preview below updates live as you type.
      </p>

      {/* Live preview — uses the exact markup and classes of the home page section */}
      <div className="compare-preview">
        <div className="compare-preview-bar">
          <span className="compare-preview-title">Live preview</span>
          <span className="compare-preview-hint">
            Exactly how the section renders on the home page — unsaved edits included.
          </span>
        </div>
        <div className="compare compare-preview-stage">
          <div className="section-head section-head-center">
            <div className="eyebrow">{form.eyebrow}</div>
            <h2 className="display navy">
              {form.heading} <span className="italic">{form.headingAccent}</span>
            </h2>
          </div>
          <div className="compare-table" role="table">
            <div className="compare-row compare-head" role="row">
              {cols.map((c, i) => (
                <div key={i} className={i === 1 ? 'compare-us' : ''} role="columnheader">
                  {c}
                </div>
              ))}
            </div>
            {previewRows.map((r, i) => (
              <div className="compare-row" role="row" key={i}>
                <div>{r.label || <em className="compare-preview-empty">row label</em>}</div>
                <div className="compare-us-cell">
                  {r.us || <em className="compare-preview-empty">your value</em>}
                </div>
                <div>{r.them || <em className="compare-preview-empty">competitor value</em>}</div>
              </div>
            ))}
            {previewRows.length === 0 && (
              <div className="compare-row" role="row">
                <div>
                  <em className="compare-preview-empty">Add a row below to see it here</em>
                </div>
                <div className="compare-us-cell" />
                <div />
              </div>
            )}
          </div>
          <div className="cta-row">
            <a
              href={form.ctaHref || '#order'}
              className="btn btn-cta-navy"
              onClick={(e) => e.preventDefault()}
            >
              {form.ctaLabel || 'Get Started Now →'}
            </a>
          </div>
        </div>
      </div>

      <form className="admin-form" onSubmit={save} style={{ marginTop: 16 }}>
        <div className="two-col">
          <input
            placeholder="Eyebrow — e.g. The Comparison"
            value={form.eyebrow}
            onChange={(e) => set('eyebrow', e.target.value)}
          />
          <input
            placeholder="CTA link — e.g. #order"
            value={form.ctaHref}
            onChange={(e) => set('ctaHref', e.target.value)}
          />
        </div>

        <div className="two-col">
          <input
            placeholder="Heading — e.g. Lower prices. Faster filings."
            value={form.heading}
            onChange={(e) => set('heading', e.target.value)}
          />
          <input
            placeholder="Heading accent (italic) — e.g. No surprises."
            value={form.headingAccent}
            onChange={(e) => set('headingAccent', e.target.value)}
          />
        </div>

        <div className="two-col">
          <input
            placeholder="CTA button label — e.g. Get Started Now →"
            value={form.ctaLabel}
            onChange={(e) => set('ctaLabel', e.target.value)}
          />
          <input
            placeholder="Column 1 header (usually blank)"
            value={cols[0] || ''}
            onChange={(e) => setColumn(0, e.target.value)}
          />
        </div>

        <div className="two-col">
          <input
            placeholder="Column 2 header — your brand"
            value={cols[1] || ''}
            onChange={(e) => setColumn(1, e.target.value)}
          />
          <input
            placeholder="Column 3 header — competitors"
            value={cols[2] || ''}
            onChange={(e) => setColumn(2, e.target.value)}
          />
        </div>

        <div className="compare-editor">
          <div className="compare-editor-head">
            <span>Row label</span>
            <span>{cols[1] || 'Ours'}</span>
            <span>{cols[2] || 'Competitors'}</span>
            <span />
          </div>
          {form.rows.map((r, i) => (
            <div className="compare-editor-row" key={i}>
              <input
                placeholder="Starting price (most counties)"
                value={r.label}
                onChange={(e) => setRow(i, 'label', e.target.value)}
              />
              <input placeholder="$349" value={r.us} onChange={(e) => setRow(i, 'us', e.target.value)} />
              <input
                placeholder="$395–$499"
                value={r.them}
                onChange={(e) => setRow(i, 'them', e.target.value)}
              />
              <div className="compare-editor-tools">
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => moveRow(i, -1)}
                  disabled={i === 0}
                  aria-label="Move row up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => moveRow(i, 1)}
                  disabled={i === form.rows.length - 1}
                  aria-label="Move row down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="small-btn danger"
                  onClick={() => removeRow(i)}
                  aria-label="Remove row"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <button type="button" className="small-btn" onClick={addRow}>
            + Add row
          </button>
          <button className="btn btn-navy" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save comparison'}
          </button>
          <button type="button" className="small-btn" onClick={reset}>
            Restore defaults
          </button>
          {msg && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#137333', fontWeight: 600 }}>
              {msg}
            </span>
          )}
          {error && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#c5221f', fontWeight: 600 }}>
              {error}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
