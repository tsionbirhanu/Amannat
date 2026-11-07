// Small client for the Amannat FastAPI backend.
// Base URL comes from NEXT_PUBLIC_API_URL (see frontend/.env.local).

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const TOKEN_KEY = 'amannat_token';
const LANG_KEY = 'amannat_lang';

function storage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export const getToken = () => storage()?.getItem(TOKEN_KEY) || null;
export const setToken = (t) => storage()?.setItem(TOKEN_KEY, t);
export const clearToken = () => storage()?.removeItem(TOKEN_KEY);
export const isLoggedIn = () => !!getToken();

export const getLanguage = () => storage()?.getItem(LANG_KEY) || 'en';
export const setLanguage = (code) => storage()?.setItem(LANG_KEY, code);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function errorMessage(data, fallback) {
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  // FastAPI validation errors: [{ loc, msg, ... }]
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ');
  return fallback;
}

/**
 * Call the backend. Adds the JSON body and the Bearer token automatically.
 *   api('/safety/checkins')
 *   api('/auth/otp/request', { method: 'POST', body: { phone } })
 *   api('/safety/hotlines', { query: { country: 'UAE' } })
 */
export async function api(path, { method = 'GET', body, query, auth = true, raw = false } = {}) {
  const url = new URL(API_URL + path);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
  }

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = {};
  // For FormData the browser sets the multipart boundary itself
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(`Cannot reach the server at ${API_URL}. Is the backend running?`, 0);
  }

  if (raw && res.ok) return res;

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new ApiError(errorMessage(data, res.statusText || 'Request failed'), res.status);
  }
  return data;
}

// ---- Endpoint helpers -------------------------------------------------------

export const auth = {
  requestOtp: (phone) => api('/auth/otp/request', { method: 'POST', body: { phone }, auth: false }),
  verifyOtp: async (phone, code) => {
    const { access_token } = await api('/auth/otp/verify', { method: 'POST', body: { phone, code }, auth: false });
    setToken(access_token);
    return access_token;
  },
  me: () => api('/auth/me'),
  logout: () => clearToken(),
};

export const voice = {
  query: (text, { language = getLanguage(), agencyId } = {}) =>
    api('/voice/query', { method: 'POST', body: { text, language, agency_id: agencyId } }),
  readContract: (contractId) => api('/voice/contract/read', { method: 'POST', body: { contract_id: contractId } }),
  report: (text, language = getLanguage()) => api('/voice/report', { method: 'POST', body: { text, language } }),
};

export const agency = {
  search: (q, { limit, offset } = {}) => api('/agency/search', { query: { q, limit, offset }, auth: false }),
  get: (id) => api(`/agency/agencies/${id}`, { auth: false }),
  shortlist: () => api('/agency/shortlist'),
  addToShortlist: (agencyId) => api('/agency/shortlist', { method: 'POST', body: { agency_id: agencyId } }),
};

export const workers = {
  contracts: () => api('/workers/me/contracts'),
  addContract: (contract) => api('/workers/me/contracts', { method: 'POST', body: contract }),
  addWage: (contractId, wage) => api(`/workers/me/contracts/${contractId}/wage-log`, { method: 'POST', body: wage }),
  wageSummary: (contractId) => api(`/workers/me/contracts/${contractId}/wage-summary`),
  guardians: () => api('/workers/me/guardian-contacts'),
  addGuardian: (g) => api('/workers/me/guardian-contacts', { method: 'POST', body: g }),
  exportRecord: () => api('/workers/me/record/export'),
  uploadDocuments: (contractId, files) => {
    const form = new FormData();
    [...files].forEach((f) => form.append('files', f));
    return api(`/workers/me/contracts/${contractId}/documents`, { method: 'POST', body: form });
  },
  documents: (contractId) => api(`/workers/me/contracts/${contractId}/documents`),
  // Returns a Blob (the request needs the auth header, so a plain <a href> would not work)
  documentBlob: async (contractId, docId) =>
    (await api(`/workers/me/contracts/${contractId}/documents/${docId}`, { raw: true })).blob(),
};

export const safety = {
  checkins: () => api('/safety/checkins'),
  schedule: (frequency = 'daily', channel = 'app') =>
    api('/safety/checkins/schedule', { method: 'POST', body: { frequency, channel } }),
  confirm: (id) => api(`/safety/checkins/${id}/confirm`, { method: 'POST' }),
  panic: (coords = {}) => api('/safety/panic', { method: 'POST', body: coords }),
  hotlines: (country) => api('/safety/hotlines', { query: { country } }),
  escalations: () => api('/safety/escalations'),
};

export const report = {
  submit: ({ agencyId, category, description }) =>
    api('/report/reports', { method: 'POST', body: { agency_id: agencyId, category, description } }),
};

/**
 * "Check in safe": confirm the next pending check-in, scheduling a set first if none exist.
 */
export async function checkInNow() {
  let list = await safety.checkins();
  let pending = list.filter((c) => c.status === 'pending');
  if (pending.length === 0) {
    list = await safety.schedule('daily', 'app');
    pending = list.filter((c) => c.status === 'pending');
  }
  // The soonest pending check-in
  pending.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  return safety.confirm(pending[0].id);
}

/** Trigger the panic alert, attaching location when the browser provides it quickly. */
export function triggerPanic() {
  const send = (coords) => safety.panic(coords);
  if (typeof navigator === 'undefined' || !navigator.geolocation) return send({});
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(send({ lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => resolve(send({})),
      { timeout: 4000 }
    );
  });
}
