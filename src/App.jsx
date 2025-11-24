import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { SidebarProvider } from './contexts/SidebarContext'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Import des pages
import Dashboard from './components/pages/Dashboard'
import DirecteurDashboardPage from './components/pages/DirecteurDashboardPage'
import MaintenancesPage from './components/pages/MaintenancesPage'
import MaterielsPage from './components/pages/MaterielsPage'
import LogicielsPage from './components/pages/LogicielsPage'
import AgencesPage from './components/pages/AgencesPage'
import RegionsPage from './components/pages/RegionsPage'
import UtilisateursPage from './components/pages/UtilisateursPage'

import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('token') !== null
  )

  const handleLogin = (token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
              } 
            />

            {/* Routes protégées avec Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Tableau de bord">
                    <Dashboard onLogout={handleLogout} />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* ✅ NOUVEAU : Dashboard Directeur (Consultation uniquement) */}
            <Route
              path="/dashboard/directeur"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Dashboard Directeur">
                    <DirecteurDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/maintenances"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Maintenances">
                    <MaintenancesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/materiels"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Matériels">
                    <MaterielsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logiciels"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Logiciels">
                    <LogicielsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agences"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Agences">
                    <AgencesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/regions"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Régions">
                    <RegionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/utilisateurs"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout pageTitle="Gestion des Utilisateurs">
                    <UtilisateursPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App