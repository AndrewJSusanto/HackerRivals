import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach admin key header when present (dev/admin flow only)
api.interceptors.request.use((config) => {
  const adminKey = sessionStorage.getItem('hr_admin_key')
  if (adminKey) config.headers['x-admin-key'] = adminKey
  return config
})

export default api
