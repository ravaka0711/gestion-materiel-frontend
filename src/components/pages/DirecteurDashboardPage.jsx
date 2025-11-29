import React, { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import { getAgences, getRegions, getMateriels } from '../../services/api'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function DashboardPage() {
  const [agences, setAgences] = useState([])
  const [regions, setRegions] = useState([])
  const [materiels, setMateriels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [agencesData, regionsData, materielsData] = await Promise.all([
          getAgences(),
          getRegions(),
          getMateriels()
        ])
        setAgences(agencesData)
        setRegions(regionsData)
        setMateriels(materielsData)
      } catch (err) {
        console.error('Erreur de chargement:', err)
        setError("Erreur de chargement des données")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Données pour le graphique en barres (répartition par région)
  const barChartData = regions.map(region => ({
    nom: region.nom_region,
    agences: agences.filter(a => 
      a.id_region === region.id_region || 
      a.Region?.id_region === region.id_region
    ).length
  })).filter(d => d.agences > 0)

  // Données pour le graphique circulaire (états des matériels)
  const materielStats = materiels.reduce((acc, mat) => {
    const etat = mat.etat || 'NON_DEFINI'
    acc[etat] = (acc[etat] || 0) + 1
    return acc
  }, {})

  const pieChartData = Object.entries(materielStats).map(([etat, count]) => ({
    name: etat,
    value: count
  }))

  const COLORS = {
    'en panne': '#ef4444',
    'non utilisable': '#f59e0b',
    'utilisable': '#10b981',
    'BON': '#10b981',
    'MOYEN': '#f59e0b',
    'MAUVAIS': '#ef4444',
    'NON_DEFINI': '#6b7280'
  }

  // Statistiques générales
  const stats = {
    total: agences.length,
    totalMateriels: materiels.length,
    byRegion: barChartData
  }

  // Coordonnées approximatives des villes principales de Madagascar
  const defaultCoordinates = {
    'Analamanga': { lat: -18.8792, lng: 47.5079 },
    'Atsinanana': { lat: -18.1443, lng: 49.4122 },
    'Haute Matsiatra': { lat: -21.4532, lng: 47.0857 },
    'Boeny': { lat: -15.7167, lng: 46.3167 },
    'Atsimo Andrefana': { lat: -23.3500, lng: 43.6667 },
    'Diana': { lat: -12.2787, lng: 49.2917 },
    'Vakinankaratra': { lat: -19.8667, lng: 47.0333 },
    'Amoron\'i Mania': { lat: -20.5667, lng: 47.0333 }
  }

  // Enrichir les agences avec des coordonnées
  const agencesWithCoords = agences.map(agence => {
    const regionName = agence.Region?.nom_region || regions.find(r => r.id_region === agence.id_region)?.nom_region
    const coords = defaultCoordinates[regionName] || { lat: -18.8792, lng: 47.5079 }
    return {
      ...agence,
      lat: coords.lat + (Math.random() - 0.5) * 0.5, // Petit décalage aléatoire
      lng: coords.lng + (Math.random() - 0.5) * 0.5
    }
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="p-4 pb-4">
        <h2 className="text-2xl font-bold dark:text-white">Tableau de bord</h2>
      </div>
      
      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Chargement...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Agences</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Matériels</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalMateriels}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">Régions Couvertes</h3>
                <p className="text-2xl font-bold text-green-600">{regions.length}</p>
              </div>
            </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Graphique en barres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-base font-semibold mb-3 dark:text-white">
                Répartition des agences par région
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nom" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                    ticks={barChartData.length > 0 ? Array.from({length: Math.max(...barChartData.map(d => d.agences)) + 1}, (_, i) => i) : [0, 1, 2, 3, 4, 5]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="agences" fill="#3b82f6" name="Nombre d'agences" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique circulaire */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-base font-semibold mb-3 dark:text-white">
                États des matériels
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '14px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Carte géographique */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-base font-semibold mb-3 dark:text-white">
              Localisation des agences
            </h3>
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <MapContainer
                center={[-18.8792, 47.5079]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {agencesWithCoords.map((agence, idx) => (
                  <Marker
                    key={agence.code_agence || idx}
                    position={[agence.lat, agence.lng]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{agence.nom_agence}</p>
                        <p className="text-gray-600">{agence.adresse || 'Adresse non disponible'}</p>
                        <p className="text-blue-600">
                          {agence.Region?.nom_region || regions.find(r => r.id_region === agence.id_region)?.nom_region}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            {/* Légende */}
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {agences.map((agence, idx) => (
                <div key={agence.code_agence || idx} className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <span className="dark:text-gray-300 truncate" title={agence.nom_agence}>
                    {agence.nom_agence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  )
}