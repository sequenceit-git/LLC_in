const rawApi = import.meta.env.VITE_API_URL || '';
// Guard: In production on a real domain, never call localhost
const API_BASE =
  typeof window !== 'undefined' &&
  rawApi.includes('localhost') &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? ''
    : rawApi;

export const authStorage = {
  getToken: () => localStorage.getItem('llc_admin_token') || '',
  setToken: (token) => {
    if (token) localStorage.setItem('llc_admin_token', token);
    else localStorage.removeItem('llc_admin_token');
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('llc_admin_user') || 'null');
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) localStorage.setItem('llc_admin_user', JSON.stringify(user));
    else localStorage.removeItem('llc_admin_user');
  },
  clear: () => {
    localStorage.removeItem('llc_admin_token');
    localStorage.removeItem('llc_admin_user');
  },
};

async function req(path, opts = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  health: () => req('/api/health'),
  prices: () => req('/api/prices').then((d) => d.items),
  pricesAll: () => req('/api/prices/all').then((d) => d.items),
  updatePrice: (county, body) => req(`/api/prices/${encodeURIComponent(county)}`, { method: 'PUT', body: JSON.stringify(body) }),
  bulkPrices: (items) => req('/api/prices/bulk', { method: 'POST', body: JSON.stringify({ items }) }),
  createOrder: (body) => req('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  orders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/api/orders${q ? `?${q}` : ''}`);
  },
  patchOrder: (id, body) => req(`/api/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteOrder: (id) => req(`/api/orders/${id}`, { method: 'DELETE' }),
  articles: (all = false) => req(`/api/articles${all ? '?all=1' : ''}`).then((d) => d.items),
  article: (slug) => req(`/api/articles/${slug}`).then((d) => d.item),
  createArticle: (body) => req('/api/articles', { method: 'POST', body: JSON.stringify(body) }),
  updateArticle: (id, body) => req(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteArticle: (id) => req(`/api/articles/${id}`, { method: 'DELETE' }),
  policies: () => req('/api/policies').then((d) => d.items),
  policy: (slug) => req(`/api/policies/${slug}`).then((d) => d.item),
  updatePolicy: (slug, body) => req(`/api/policies/${slug}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePolicy: (slug) => req(`/api/policies/${slug}`, { method: 'DELETE' }),
  faqs: () => req('/api/faqs').then((d) => d.items),
  faqsAll: () => req('/api/faqs/all').then((d) => d.items),
  createFaq: (body) => req('/api/faqs', { method: 'POST', body: JSON.stringify(body) }),
  updateFaq: (id, body) => req(`/api/faqs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteFaq: (id) => req(`/api/faqs/${id}`, { method: 'DELETE' }),
  login: (username, password) => req('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => req('/api/admin/me'),
  stats: () => req('/api/admin/stats'),
  comparison: () => req('/api/comparison').then((d) => d.item),
  updateComparison: (body) => req('/api/comparison', { method: 'PUT', body: JSON.stringify(body) }),
  resetComparison: () => req('/api/comparison/reset', { method: 'POST' }),
  contact: () => req('/api/contact').then((d) => d.item),
  updateContact: (body) => req('/api/contact', { method: 'PUT', body: JSON.stringify(body) }).then((d) => d.item),
  resetContact: () => req('/api/contact/reset', { method: 'POST' }).then((d) => d.item),
};
