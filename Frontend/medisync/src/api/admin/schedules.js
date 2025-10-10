import { API } from '../client';

const base = '/api/admin/AdminSchedules';

export const SchedulesApi = {
  list: (params = {}) => {
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
  upcoming: (doctorId, days = 30) => API.get(`${base}/doctor/${doctorId}/upcoming?days=${days}`),
};
