import { API } from '../client';

const base = '/api/admin/AdminSpecializations';

export const SpecializationsApi = {
  list: (includeInactive = false) => {
    const params = { includeInactive };
    // Filter out undefined/null values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    const q = new URLSearchParams(cleanParams).toString();
    return API.get(`${base}${q ? `?${q}` : ''}`);
  },
  get: (id) => API.get(`${base}/${id}`),
  create: (payload) => API.post(base, payload),
  update: (id, payload) => API.put(`${base}/${id}`, payload),
  remove: (id) => API.del(`${base}/${id}`),
  stats: () => API.get(`${base}/statistics`),
};
