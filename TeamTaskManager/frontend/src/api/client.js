const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const token = localStorage.getItem('team-task-manager-token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload.error || { code: 'UNKNOWN_ERROR', message: 'Request failed' };
    throw new Error(error.message);
  }

  return payload.data;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  projects: {
    list: () => request('/projects'),
    create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    addMembers: (projectId, body) => request(`/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify(body) })
  },
  tasks: {
    list: () => request('/tasks'),
    create: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (taskId, body) => request(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify(body) })
  },
  dashboard: () => request('/dashboard')
};

export { API_BASE_URL };
