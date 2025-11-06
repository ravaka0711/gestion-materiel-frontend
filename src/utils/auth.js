// Utilitaires pour la gestion de l'authentification

export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return token !== null
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = (token) => {
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

export const logout = () => {
  removeToken()
  removeUser()
}

// Vérifier si le token est expiré (si vous utilisez JWT)
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    return true
  }
}

// Formater les dates
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

// Valider l'email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valider le mot de passe
export const validatePassword = (password) => {
  // Au moins 6 caractères
  return password.length >= 6
}