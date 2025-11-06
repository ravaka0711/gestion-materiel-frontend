import axios from 'axios'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: '/api', // ← ADAPTEZ selon votre backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
})

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('📤 Requête API:', config.method.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('❌ Erreur requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('❌ Erreur réponse:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ========================================
// AUTHENTIFICATION
// ========================================
export const loginUser = async (credentials) => {
  try {
    console.log('🔐 Tentative de connexion avec:', { email: credentials.email })
    const response = await api.post('/utilisateurs/login', credentials)
    console.log('✅ Connexion réussie:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Erreur login:', error.response?.data || error.message)
    throw error
  }
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

// ========================================
// ÉQUIPEMENTS
// ========================================
export const getEquipments = async () => {
  const response = await api.get('/equipments')
  return response.data
}

export const getEquipmentById = async (id) => {
  const response = await api.get(`/equipments/${id}`)
  return response.data
}

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipments', equipmentData)
  return response.data
}

export const updateEquipment = async (id, equipmentData) => {
  const response = await api.put(`/equipments/${id}`, equipmentData)
  return response.data
}

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/equipments/${id}`)
  return response.data
}

export default api