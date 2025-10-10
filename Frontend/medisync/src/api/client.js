export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };
  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(path, opts);
  const contentType = res.headers.get('content-type') || '';
  const parseJson = contentType.includes('application/json');
  const data = parseJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = parseJson ? data?.message || 'Request failed' : 'Request failed';
    throw new Error(message);
  }
  return data;
}

// Backend base path is proxied by Vite dev server (configure in vite.config if needed)
export const API = {
  get: (url) => apiRequest(url, { method: 'GET' }),
  post: (url, body) => apiRequest(url, { method: 'POST', body }),
  put: (url, body) => apiRequest(url, { method: 'PUT', body }),
  del: (url) => apiRequest(url, { method: 'DELETE' }),
};
