import Sidebar from './Sidebar'
import Header from './Header'

/**
 * EXPLICATION :
 * Layout principal qui combine tous les éléments de structure
 * 
 * COMPOSITION :
 * - Sidebar : navigation latérale
 * - Header : barre supérieure
 * - Main : contenu de la page (children)
 * 
 * UTILISATION :
 * Wrapper toutes les pages authentifiées avec ce Layout
 * 
 * Exemple :
 * <Layout pageTitle="Gestion des Matériels">
 *   <MaterielsPage />
 * </Layout>
 * 
 * RESPONSIVE :
 * - Le margin-left (lg:ml-64) compense la largeur du sidebar sur desktop
 * - Sur mobile, pas de margin car le sidebar est en overlay
 */

export default function Layout({ children, pageTitle = 'Dashboard' }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar de navigation */}
      <Sidebar />
      
      {/* Conteneur principal avec margin pour le sidebar (desktop uniquement) */}
      <div className="min-h-screen transition-all duration-300 lg:ml-64">
        {/* Header avec titre de la page */}
        <Header pageTitle={pageTitle} />
        
        {/* Contenu de la page */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}