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
import MaintenancesPage from './components/pages/MaintenancesPage'
import MaterielsPage from './components/pages/MaterielsPage'
import LogicielsPage from './components/pages/LogicielsPage'
import AgencesPage from './components/pages/AgencesPage'
import RegionsPage from './components/pages/RegionsPage'

import './App.css'

/**
 * EXPLICATION :
 * App principal avec toute la structure de routing
 * 
 * PROVIDERS :
 * 1. ThemeProvider : gère le dark mode globalement
 * 2. SidebarProvider : gère l'état du sidebar globalement
 * 3. Router : gère la navigation
 * 
 * ROUTES :
 * - Routes publiques : /, /login
 * - Routes protégées : toutes les pages après login, wrappées dans Layout
 * 
 * LAYOUT :
 * Toutes les pages authentifiées utilisent le Layout qui inclut :
 * - Sidebar
 * - Header
 * - Contenu de la page
 */

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

            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App