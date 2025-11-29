import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Package, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import MaterielTable from '../tables/MaterielTable';
import MaterielForm from '../forms/MaterielForm';
import ConfirmDialog from '../common/ConfirmDialog';
import {
    getMateriels,
    createMateriel,
    updateMateriel,
    deleteMateriel
} from '../../services/api';
import logoSrc from '../../assets/logo-paositra.jpg';


const MaterielPage = () => {
    // Récupérer le rôle utilisateur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDirecteur = user.fonction === 'directeur';
    const isResponsable = user.fonction === 'responsable';


    const [materiels, setMateriels] = useState([]);
    const [filteredMateriels, setFilteredMateriels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedMateriel, setSelectedMateriel] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);


    // Récupérer tous les matériels
    const fetchMateriels = async () => {
        setLoading(true);
        try {
            const data = await getMateriels();
            // Trier par ID croissant
            const sortedData = data.sort((a, b) => a.id_materiel - b.id_materiel);
            setMateriels(sortedData);
            setFilteredMateriels(sortedData);
        } catch (error) {
            showNotification('Erreur lors du chargement des matériels', 'error');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMateriels();
    }, []);


    // Filtrer les matériels
    useEffect(() => {
        const filtered = materiels.filter(materiel =>
            materiel.nom_materiel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            materiel.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            materiel.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            materiel.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            materiel.Agence?.nom_agence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            materiel.id_materiel.toString().includes(searchTerm)
        );
        // Trier les résultats filtrés par ID croissant
        const sortedFiltered = filtered.sort((a, b) => a.id_materiel - b.id_materiel);
        setFilteredMateriels(sortedFiltered);
    }, [searchTerm, materiels]);


    // Afficher une notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };


    // Fonction d'exportation PDF par agence
    const exportPDFByAgency = async (selectedAgency = null) => {
        try {
            // Charger le logo et le convertir en base64
            const loadImage = (url) => {
                return new Promise((resolve, reject) => {
                    const img = new window.Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/jpeg'));
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            };

            let logoBase64 = null;
            try {
                logoBase64 = await loadImage(logoSrc);
            } catch (error) {
                console.warn('Impossible de charger le logo :', error);
            }

            const materielsByAgency = materiels.reduce((acc, materiel) => {
                const agenceName = materiel.Agence?.nom_agence || 'Sans agence';
                if (!acc[agenceName]) acc[agenceName] = [];
                acc[agenceName].push(materiel);
                return acc;
            }, {});

            const agenciesToExport = selectedAgency
                ? { [selectedAgency]: materielsByAgency[selectedAgency] }
                : materielsByAgency;

            let exportCount = 0;

            Object.keys(agenciesToExport).forEach((agenceName) => {
                const agenceMateriels = agenciesToExport[agenceName];
                if (!agenceMateriels || agenceMateriels.length === 0) return;

                const doc = new jsPDF('portrait');

                // Logo
                if (logoBase64) {
                    doc.addImage(logoBase64, 'JPEG', 14, 10, 20, 20);
                }

                // Titre centré
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.text('Liste des Matériels', 105, 20, { align: 'center' });

                doc.setFontSize(15);
                doc.setTextColor(30, 64, 175);
                doc.text(`${agenceName}`, 105, 35, { align: 'center' });
                doc.setTextColor(0);

                // Date et stats
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const today = new Date().toLocaleDateString('fr-FR');
                doc.text(`Date d'export : ${today}`, 14, 58);

                const stats = {
                    total: agenceMateriels.length,
                    utilisable: agenceMateriels.filter(m => m.etat === 'utilisable').length,
                    enPanne: agenceMateriels.filter(m => m.etat === 'en panne').length,
                    nonUtilisable: agenceMateriels.filter(m => m.etat === 'non utilisable').length,
                };

                doc.text(
                    `Total : ${stats.total} | Utilisables : ${stats.utilisable} | En panne : ${stats.enPanne} | Non utilisables : ${stats.nonUtilisable}`,
                    14,
                    66
                );

                // Préparer le tableau
                const tableData = agenceMateriels
                    .sort((a, b) => a.id_materiel - b.id_materiel)
                    .map(materiel => [
                        materiel.id_materiel || '-',
                        materiel.numero_serie || '-',
                        materiel.nom_materiel || '-',
                        materiel.marque || '-',
                        materiel.modele || '-',
                        materiel.etat || '-',
                        materiel.date_acquisition ? new Date(materiel.date_acquisition).toLocaleDateString('fr-FR') : '-',
                        materiel.description || '-'
                    ]);

                autoTable(doc, {
                    startY: 72,
                    head: [[
                        'ID',
                        'N° Série',
                        'Désignation',
                        'Marque',
                        'Modèle',
                        'État',
                        'Date acquisition',
                        'Description'
                    ]],
                    body: tableData,
                    headStyles: {
                        fillColor: [37, 99, 235], // Bleu Paositra
                        textColor: 255,
                        fontStyle: 'bold',
                        fontSize: 7,
                        halign: 'center'
                    },
                    styles: {
                        fontSize: 7,
                        cellPadding: 3,
                    },
                    columnStyles: {
                        0: { cellWidth: 10, halign: 'center' },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 25 },
                        3: { cellWidth: 18 },
                        4: { cellWidth: 18 },
                        5: { cellWidth: 18, halign: 'center' },
                        6: { cellWidth: 28, halign: 'center' },
                        7: { cellWidth: 'auto' }
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250] // Light background for even rows
                    },
                    didParseCell: function (data) {
                        // État coloré
                        if (data.column.index === 5 && data.section === 'body') {
                            const etat = data.cell.raw;
                            if (etat === 'utilisable') {
                                data.cell.styles.textColor = [22, 163, 74];
                                data.cell.styles.fontStyle = 'bold';
                            } else if (etat === 'en panne') {
                                data.cell.styles.textColor = [220, 38, 38];
                                data.cell.styles.fontStyle = 'bold';
                            } else if (etat === 'non utilisable') {
                                data.cell.styles.textColor = [107, 114, 128];
                                data.cell.styles.fontStyle = 'bold';
                            }
                        }
                    },
                    margin: { top: 72, right: 14, bottom: 20, left: 14 },
                    didDrawPage: function (data) {
                        // Pied de page avec pagination
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setTextColor(128);
                        doc.text(
                            `Page ${data.pageNumber} sur ${pageCount}`,
                            doc.internal.pageSize.width / 2,
                            doc.internal.pageSize.height - 10,
                            { align: 'center' }
                        );
                    }
                });

                // Sauvegarder le PDF
                const fileName = `Materiels_${agenceName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(fileName);
                exportCount++;
            });

            setShowExportMenu(false);

            if (exportCount === 0) {
                showNotification('Aucun matériel à exporter pour cette agence', 'error');
            } else if (exportCount === 1) {
                showNotification('PDF exporté avec succès');
            } else {
                showNotification(`${exportCount} PDF(s) exporté(s) avec succès`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'exportation PDF:', error);
            showNotification('Erreur lors de l\'exportation PDF', 'error');
        }
    };



    // Obtenir la liste unique des agences
    const getUniqueAgencies = () => {
        const agencies = materiels.map(m => m.Agence?.nom_agence || 'Sans agence');
        return [...new Set(agencies)].sort();
    };


    // Créer ou mettre à jour un matériel
    const handleSubmit = async (formData) => {
        try {
            if (selectedMateriel) {
                await updateMateriel(selectedMateriel.id_materiel, formData);
                showNotification('Matériel mis à jour avec succès');
            } else {
                await createMateriel(formData);
                showNotification('Matériel créé avec succès');
            }
            setShowForm(false);
            setSelectedMateriel(null);
            fetchMateriels();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
            showNotification(errorMsg, 'error');
        }
    };


    // Supprimer un matériel
    const handleDelete = async () => {
        try {
            await deleteMateriel(selectedMateriel.id_materiel);
            showNotification('Matériel supprimé avec succès');
            setShowDeleteDialog(false);
            setSelectedMateriel(null);
            fetchMateriels();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
            showNotification(errorMsg, 'error');
        }
    };


    // Ouvrir le formulaire pour modifier
    const handleEdit = (materiel) => {
        setSelectedMateriel(materiel);
        setShowForm(true);
    };


    // Ouvrir la dialog de suppression
    const handleDeleteClick = (materiel) => {
        setSelectedMateriel(materiel);
        setShowDeleteDialog(true);
    };


    // Fermer le formulaire
    const handleCancel = () => {
        setShowForm(false);
        setSelectedMateriel(null);
    };


    // Statistiques
    const stats = {
        total: materiels.length,
        utilisable: materiels.filter(m => m.etat === 'utilisable').length,
        enPanne: materiels.filter(m => m.etat === 'en panne').length,
        nonUtilisable: materiels.filter(m => m.etat === 'non utilisable').length,
    };


    return (
        <>
            <style>{`
        body::-webkit-scrollbar, html::-webkit-scrollbar { display: none; }
        body, html { scrollbar-width: none; -ms-overflow-style: none; overflow: hidden; }
      `}</style>
            <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>


            {/* Badge lecture seule directeur */}
            {isDirecteur}


            {/* Notification améliorée */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        {notification.message}
                    </div>
                </div>
            )}


            <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
                <div className="h-full flex flex-col p-1">
                    {/* En-tête */}
                    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isDirecteur ? "Liste des Matériels" : "Gestion des Matériels"}
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {materiels.length} matériel{materiels.length > 1 ? 's' : ''} affiché{materiels.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>


                    {/* Barre d'actions */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 mb-2 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, N° série, marque, agence..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchMateriels}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Actualiser
                                </button>

                                {/* Menu d'exportation PDF */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                        disabled={loading || materiels.length === 0}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Exporter en PDF"
                                    >
                                        <FileDown size={16} />
                                        Exporter PDF
                                    </button>

                                    {/* Menu déroulant */}
                                    {showExportMenu && (
                                        <>
                                            {/* Overlay pour fermer le menu */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowExportMenu(false)}
                                            />

                                            {/* Menu */}
                                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-y-auto">
                                                <div className="p-2">
                                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                                                        Sélectionner une agence
                                                    </div>

                                                    {/* Option: Toutes les agences */}
                                                    <button
                                                        onClick={() => exportPDFByAgency(null)}
                                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex items-center gap-2"
                                                    >
                                                        <FileDown size={14} className="text-blue-600 dark:text-blue-400" />
                                                        <span className="font-medium">Toutes les agences</span>
                                                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                                            ({getUniqueAgencies().length})
                                                        </span>
                                                    </button>

                                                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                                                    {/* Liste des agences */}
                                                    {getUniqueAgencies().map((agency) => {
                                                        const count = materiels.filter(m =>
                                                            (m.Agence?.nom_agence || 'Sans agence') === agency
                                                        ).length;

                                                        return (
                                                            <button
                                                                key={agency}
                                                                onClick={() => exportPDFByAgency(agency)}
                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center justify-between"
                                                            >
                                                                <span>{agency}</span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded">
                                                                    {count}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Bouton ajouter : uniquement pour responsable */}
                                {isResponsable && (
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                        Ajouter
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total matériels</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Utilisables</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.utilisable}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">En panne</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.enPanne}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Non utilisables</p>
                            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{stats.nonUtilisable}</p>
                        </div>
                    </div>


                    {/* Table */}
                    <div className="flex-1 min-h-0 overflow-visible">
                        {loading ? (
                            <div className="h-full bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
                                <RefreshCw className="animate-spin mb-4 text-blue-600 dark:text-blue-400" size={36} />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des matériels...</p>
                            </div>
                        ) : (
                            <MaterielTable
                                materiels={filteredMateriels}
                                onEdit={isResponsable ? handleEdit : undefined}
                                onDelete={isResponsable ? handleDeleteClick : undefined}
                            />
                        )}
                    </div>


                    {/* Formulaire visible seulement pour responsable */}
                    {showForm && isResponsable && (
                        <MaterielForm
                            materiel={selectedMateriel}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}


                    {/* Dialog suppression seulement pour responsable */}
                    {showDeleteDialog && selectedMateriel && isResponsable && (
                        <ConfirmDialog
                            isOpen={showDeleteDialog}
                            onClose={() => {
                                setShowDeleteDialog(false);
                                setSelectedMateriel(null);
                            }}
                            onConfirm={handleDelete}
                            title="Confirmer la suppression"
                            message={
                                <>
                                    Êtes-vous sûr de vouloir supprimer ce matériel ?
                                    <span className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded block">
                                        <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                            <span className="font-medium">ID:</span> {selectedMateriel.id_materiel}
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                            <span className="font-medium">N° Série:</span> {selectedMateriel.numero_serie}
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                            <span className="font-medium">Désignation:</span> {selectedMateriel.nom_materiel}
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                            <span className="font-medium">Agence:</span> {selectedMateriel.Agence?.nom_agence}
                                        </span>
                                    </span>
                                </>
                            }
                            confirmText="Supprimer"
                            type="danger"
                        />
                    )}
                </div>
            </div>
        </>
    );
};


export default MaterielPage;
