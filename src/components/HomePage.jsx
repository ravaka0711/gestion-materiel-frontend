import { useNavigate } from 'react-router-dom'
import { Monitor, Server, Shield } from 'lucide-react'
import logoPaositra from '../assets/logo-paositra.jpg'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-yellow-500 flex-shrink-0">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoPaositra}
              alt="Paositra Malagasy" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">Paositra Malagasy</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md font-semibold"
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Gestion des Matériels Informatiques
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Système centralisé de suivi et de gestion du parc informatique
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Accéder au système
          </button>
        </div>

        {/* Features - avec icône et titre centrés */}
<div className="grid md:grid-cols-3 gap-x-16 gap-y-8 mt-8 max-w-7xl mx-auto px-4">
  {/* Card 1 - Inventaire Complet */}
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-yellow-500 hover:border-orange-500 text-center">
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto">
      <Monitor className="text-orange-600 w-7 h-7" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">
      Inventaire Complet
    </h3>
    <p className="text-sm text-gray-600">
      Suivez tous vos équipements informatiques en temps réel : ordinateurs, serveurs, périphériques.
    </p>
  </div>

  {/* Card 2 - Maintenance Préventive */}
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-orange-500 hover:border-red-500 text-center">
    <div className="bg-gradient-to-br from-orange-100 to-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto">
      <Server className="text-red-600 w-7 h-7" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">
      Maintenance Préventive
    </h3>
    <p className="text-sm text-gray-600">
      Planifiez et gérez les interventions de maintenance pour optimiser la durée de vie du matériel.
    </p>
  </div>

  {/* Card 3 - Sécurité Renforcée */}
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-red-500 hover:border-yellow-500 text-center">
    <div className="bg-gradient-to-br from-red-100 to-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto">
      <Shield className="text-yellow-600 w-7 h-7" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">
      Sécurité Renforcée
    </h3>
    <p className="text-sm text-gray-600">
      Contrôlez les accès et suivez l'historique de toutes les opérations sur le matériel.
    </p>
  </div>
</div>

      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 border-yellow-500 flex-shrink-0 mt-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p className="font-medium">© 2025 Paositra Malagasy - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
