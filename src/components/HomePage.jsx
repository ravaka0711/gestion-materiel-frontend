import { useNavigate } from 'react-router-dom'
import { Monitor, Package, Server, Shield } from 'lucide-react'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="text-blue-600 w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-800">Paositra Malagasy</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Gestion des Matériels Informatiques
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Système centralisé de suivi et de gestion du parc informatique
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Accéder au système
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Monitor className="text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Inventaire Complet
            </h3>
            <p className="text-gray-600">
              Suivez tous vos équipements informatiques en temps réel : ordinateurs, serveurs, périphériques.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Server className="text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Maintenance Préventive
            </h3>
            <p className="text-gray-600">
              Planifiez et gérez les interventions de maintenance pour optimiser la durée de vie du matériel.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Sécurité Renforcée
            </h3>
            <p className="text-gray-600">
              Contrôlez les accès et suivez l'historique de toutes les opérations sur le matériel.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8 border-t">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 Paositra Malagasy - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage