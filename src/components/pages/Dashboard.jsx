import React, { useEffect, useState } from 'react'
import { getAgences, getRegions } from '../../services/api'

export default function DashboardPage() {
  const [agences, setAgences] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [agencesData, regionsData] = await Promise.all([
          getAgences(),
          getRegions()
        ])
        setAgences(agencesData)
        setRegions(regionsData)
      } catch (err) {
        alert("Erreur de chargement des données")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Statistiques
  const stats = {
    total: agences.length,
    byRegion: regions.map(region => ({
      id: region.id_region,
      nom: region.nom_region,
      count: agences.filter(a =>
        a.id_region === region.id_region ||
        a.Region?.id_region === region.id_region
      ).length
    }))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Statistiques des agences par région</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Statistiques par région
            </h3>
            <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.byRegion.map(region => (
              <div key={region.id} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={region.nom}>
                  {region.nom}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {region.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
