import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, Building2, Monitor, Eye, 
  TrendingUp, BarChart3, AlertCircle 
} from 'lucide-react'

export default function DirecteurDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalAgences: 0,
    totalRegions: 0,
    totalMateriels: 0,
  })
  const [regionsData, setRegionsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Vérifier que c'est bien un directeur
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.fonction !== 'directeur') {
      navigate('/dashboard') // Rediriger si ce n'est pas un directeur
      return
    }

    fetchAllData()
  }, [navigate])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Récupérer les régions
      const regionsResponse = await fetch('/api/regions', { headers })
      if (!regionsResponse.ok) throw new Error('Erreur lors du chargement des régions')
      const regions = await regionsResponse.json()
      
      // Récupérer les agences
      const agencesResponse = await fetch('/api/agences', { headers })
      if (!agencesResponse.ok) throw new Error('Erreur lors du chargement des agences')
      const agences = await agencesResponse.json()
      
      // Récupérer les matériels
      const materielsResponse = await fetch('/api/materiels', { headers })
      if (!materielsResponse.ok) throw new Error('Erreur lors du chargement des matériels')
      const materiels = await materielsResponse.json()
      
      // Calculer statistiques par région
      const statsParRegion = regions.map(region => {
        const agencesDansRegion = agences.filter(a => a.id_region === region.id_region)
        return {
          id: region.id_region,
          nom: region.nom_region,
          nombreAgences: agencesDansRegion.length
        }
      })
      
      setRegionsData(statsParRegion)
      setStats({
        totalAgences: agences.length,
        totalRegions: regions.length,
        totalMateriels: materiels.length,
      })
      setError('')
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistiques globales - 3 cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Régions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                Total Régions
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.totalRegions}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                {regionsData.length} régions actives
              </p>
            </div>
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <MapPin className="text-purple-600 dark:text-purple-400" size={32} />
            </div>
          </div>
        </div>

        {/* Carte Agences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                Total Agences
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.totalAgences}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Sur {stats.totalRegions} régions
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
          </div>
        </div>

        {/* Carte Matériels */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                Total Matériels
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.totalMateriels}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Équipements informatiques
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Monitor className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par région */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-purple-600 dark:text-purple-400" size={28} />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Statistiques des agences par région
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Répartition nationale des agences
              </p>
            </div>
          </div>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
            {regionsData.length} régions
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regionsData.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune donnée disponible
            </div>
          ) : (
            regionsData.map((region) => (
              <div 
                key={region.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 line-clamp-2">
                    {region.nom}
                  </p>
                  <TrendingUp className="text-purple-500 dark:text-purple-400 flex-shrink-0 ml-2" size={18} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {region.nombreAgences}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {region.nombreAgences === 0 ? 'aucune agence' : 
                     region.nombreAgences === 1 ? 'agence' : 'agences'}
                  </p>
                </div>
                
                {/* Barre de progression visuelle */}
                <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-500 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalAgences > 0 ? (region.nombreAgences / stats.totalAgences) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info supplémentaire */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Astuce :</strong> Utilisez le menu latéral pour consulter les détails des régions, agences et matériels.
        </p>
      </div>
    </div>
  )
}
