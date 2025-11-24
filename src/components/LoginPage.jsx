import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import logoPaositra from '../assets/logo-paositra.jpg'

function LoginPage({ onNavigateHome }) {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères requis'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
  
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      setServerError('')
  
      try {
        const response = await fetch('/api/utilisateurs/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            mot_de_passe: formData.password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Identifiants incorrects')
        }

        const data = await response.json()

        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirection automatique selon la fonction
        if (data.user.fonction === 'directeur') {
          navigate('/dashboard/directeur', { replace: true })
        } else if (data.user.fonction === 'responsable') {
          navigate('/dashboard', { replace: true })
        }
        
      } catch (error) {
        setServerError(
          error.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.'
        )
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100 flex items-center justify-center px-4 py-8">
      <div className="bg-yellow-50 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-yellow-200">
        
        {/* En-tête avec logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden animate-bounce-slow p-2.5 border-2 border-yellow-300">
              <img 
                src={logoPaositra}
                alt="Paositra Malagasy" 
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paositra Malagasy
          </h1>
          <p className="text-gray-500 text-sm">
            Gestion des Matériels Informatiques
          </p>
        </div>
        
        <style>{`
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
        `}</style>

        {/* Alerte d'erreur serveur */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start space-x-3 animate-pulse">
            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="exemple@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                Se souvenir de moi
              </span>
            </label>
            <button 
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
              disabled={loading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              if (onNavigateHome) {
                onNavigateHome()
              } else {
                navigate('/')
              }
            }}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors disabled:text-gray-400 hover:gap-3 gap-2"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 transition-transform" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
