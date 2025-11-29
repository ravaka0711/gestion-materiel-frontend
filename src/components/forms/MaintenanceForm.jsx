import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAgences, getMateriels, getUtilisateurs } from '../../services/api';
import api from '../../services/api';


const MaintenanceForm = ({ maintenance, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_maintenance: '',
    code_agence: '',
    id_materiel: '',
    id_logiciel: '',
    matricule: '',
    type_intervention: '',
    date_debut: '',
    date_fin: '',
    status: 'en cours',
    description: '',
    numero_or: '',
    outils: '',
    solution_appliquee: ''
  });

  const [autoGenerateId, setAutoGenerateId] = useState(true);
  const [agences, setAgences] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [logiciels, setLogiciels] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  
  // États pour les listes filtrées
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [filteredLogiciels, setFilteredLogiciels] = useState([]);

  // Fonction pour générer un ID unique
  const generateMaintenanceId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `MAINT-${timestamp}-${random}`;
  };

  // Générer l'ID automatiquement au chargement (mode création uniquement)
  useEffect(() => {
    if (!maintenance && autoGenerateId) {
      setFormData(prev => ({
        ...prev,
        id_maintenance: generateMaintenanceId()
      }));
    }
  }, [maintenance, autoGenerateId]);


 // Charger les données
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('🔄 Chargement des données...');
      
      const [agencesData, materielsData, utilisateursData] = await Promise.all([
        getAgences(),
        getMateriels(),
        getUtilisateurs()
      ]);
      
      console.log('✅ Agences:', agencesData);
      console.log('✅ Matériels:', materielsData);
      console.log('✅ Utilisateurs:', utilisateursData);
      
      setAgences(agencesData);
      setMateriels(materielsData);
      setUtilisateurs(utilisateursData);
      
      // Récupérer les logiciels depuis /utilise-logiciel
      try {
        const response = await api.get('/utilise-logiciel');
        console.log('📥 Données utilise-logiciel brutes:', response.data);
        
        // ⭐ Utiliser un Map pour éliminer les doublons
        const logicielsMap = new Map();
        
        response.data.forEach(item => {
          if (item.Logiciel && item.Logiciel.id_logiciel) {
            // Créer une clé unique : id_logiciel + code_agence
            const cle = `${item.Logiciel.id_logiciel}-${item.code_agence}`;
            
            // Ajouter seulement si la clé n'existe pas déjà
            if (!logicielsMap.has(cle)) {
              logicielsMap.set(cle, {
                id_logiciel: item.Logiciel.id_logiciel,
                nom_logiciel: item.Logiciel.nom_logiciel,
                version: item.Logiciel.version,
                date_installation: item.Logiciel.date_installation,
                code_agence: item.code_agence
              });
            }
          }
        });
        
        // Convertir le Map en tableau
        const logicielsUniques = Array.from(logicielsMap.values());
        
        console.log('✅ Logiciels uniques (après déduplication):', logicielsUniques);
        console.log(`📊 ${response.data.length} entrées brutes → ${logicielsUniques.length} uniques`);
        
        setLogiciels(logicielsUniques);
      } catch (error) {
        console.error('❌ Erreur récupération logiciels:', error);
        setLogiciels([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    }
  };
  fetchData();
}, []);


  // Filtrer les matériels et logiciels quand l'agence change
useEffect(() => {
  if (formData.code_agence) {
    // Convertir en chaîne pour comparaison uniforme
    const agenceCode = String(formData.code_agence).trim();
    
    console.log('🔍 Filtrage pour agence:', agenceCode);
    
    // Filtrer les matériels
    const filtered = materiels.filter(m => {
      const mCode = String(m.code_agence || m.Agence?.code_agence || '').trim();
      return mCode === agenceCode;
    });
    
    // Filtrer les logiciels
    const filteredLog = logiciels.filter(l => {
      const lCode = String(l.code_agence || '').trim();
      return lCode === agenceCode;
    });
    
    console.log(`📦 ${filtered.length} matériel(s) trouvé(s)`);
    console.log(`💻 ${filteredLog.length} logiciel(s) trouvé(s)`);
    
    setFilteredMateriels(filtered);
    setFilteredLogiciels(filteredLog);
  } else {
    setFilteredMateriels(materiels);
    setFilteredLogiciels(logiciels);
  }
}, [formData.code_agence, materiels, logiciels]);


  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (maintenance) {
      setFormData({
        id_maintenance: maintenance.id_maintenance || '',
        code_agence: maintenance.code_agence || '',
        id_materiel: maintenance.id_materiel || '',
        id_logiciel: maintenance.id_logiciel || '',
        matricule: maintenance.matricule || '',
        type_intervention: maintenance.type_intervention || '',
        date_debut: maintenance.date_debut ? maintenance.date_debut.split('T')[0] : '',
        date_fin: maintenance.date_fin ? maintenance.date_fin.split('T')[0] : '',
        status: maintenance.status || 'en cours',
        description: maintenance.description || '',
        numero_or: maintenance.numero_or || '',
        outils: maintenance.outils || '',
        solution_appliquee: maintenance.solution_appliquee || ''
      });
      setAutoGenerateId(false); // Désactiver l'auto-génération en mode édition
    }
  }, [maintenance]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion de l'exclusivité mutuelle entre matériel et logiciel
    if (name === 'id_materiel' && value) {
      setFormData(prev => ({
        ...prev,
        id_materiel: value,
        id_logiciel: ''
      }));
    } else if (name === 'id_logiciel' && value) {
      setFormData(prev => ({
        ...prev,
        id_logiciel: value,
        id_materiel: ''
      }));
    } else if (name === 'type_intervention') {
      // Réinitialiser numero_or et outils quand le type change
      setFormData(prev => ({
        ...prev,
        type_intervention: value,
        numero_or: value === 'par mission' ? prev.numero_or : '',
        outils: value === 'à distance' ? prev.outils : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Réinitialiser matériel/logiciel si on change d'agence
        ...(name === 'code_agence' && {
          id_materiel: '',
          id_logiciel: ''
        })
      }));
    }
  };

  const handleAutoGenerateToggle = () => {
    const newAutoGenerate = !autoGenerateId;
    setAutoGenerateId(newAutoGenerate);
    
    if (newAutoGenerate && !maintenance) {
      setFormData(prev => ({
        ...prev,
        id_maintenance: generateMaintenanceId()
      }));
    } else if (!newAutoGenerate) {
      setFormData(prev => ({
        ...prev,
        id_maintenance: ''
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données avant de les envoyer
    const cleanedData = {
      ...formData,
      // Convertir les chaînes vides en null pour les champs optionnels
      date_fin: formData.date_fin && formData.date_fin.trim() !== '' ? formData.date_fin : null,
      numero_or: formData.numero_or && formData.numero_or.trim() !== '' ? formData.numero_or : null,
      outils: formData.outils && formData.outils.trim() !== '' ? formData.outils : null,
      solution_appliquee: formData.solution_appliquee && formData.solution_appliquee.trim() !== '' ? formData.solution_appliquee : null,
      description: formData.description && formData.description.trim() !== '' ? formData.description : null,
      // Convertir les chaînes vides en null pour id_materiel et id_logiciel
      id_materiel: formData.id_materiel && formData.id_materiel !== '' ? formData.id_materiel : null,
      id_logiciel: formData.id_logiciel && formData.id_logiciel !== '' ? formData.id_logiciel : null
    };

    console.log('📤 Données nettoyées à envoyer:', cleanedData);
    onSubmit(cleanedData);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-white">
            {maintenance ? 'Modifier la maintenance' : 'Nouvelle maintenance'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors text-white"
            title="Fermer"
          >
            <X size={24} />
          </button>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ID Maintenance */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID Maintenance *
                </label>
                {!maintenance && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={autoGenerateId}
                      onChange={handleAutoGenerateToggle}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Auto-générer
                  </label>
                )}
              </div>
              <input
                type="text"
                name="id_maintenance"
                value={formData.id_maintenance}
                onChange={handleChange}
                disabled={autoGenerateId && !maintenance}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                placeholder={autoGenerateId ? "ID généré automatiquement" : "Saisir un ID unique"}
              />
              {!autoGenerateId && !maintenance && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Saisissez un ID unique pour cette maintenance
                </p>
              )}
            </div>

            {/* Agence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agence *
              </label>
              <select
                name="code_agence"
                value={formData.code_agence}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une agence</option>
                {agences.map(agence => (
                  <option key={agence.code_agence} value={agence.code_agence}>
                    {agence.nom_agence}
                  </option>
                ))}
              </select>
            </div>


            {/* Matériel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matériel {formData.id_logiciel && <span className="text-xs text-gray-500">(désactivé car logiciel sélectionné)</span>}
              </label>
              <select
                name="id_materiel"
                value={formData.id_materiel}
                onChange={handleChange}
                disabled={!formData.code_agence || !!formData.id_logiciel}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!formData.code_agence ? 'Choisir d\'abord une agence' : 
                   formData.id_logiciel ? 'Désélectionner le logiciel d\'abord' :
                   'Sélectionner un matériel'}
                </option>
                {filteredMateriels.map(materiel => (
                  <option key={materiel.id_materiel} value={materiel.id_materiel}>
                    {materiel.nom_materiel} ({materiel.etat})
                  </option>
                ))}
              </select>
              {filteredMateriels.length === 0 && formData.code_agence && !formData.id_logiciel && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Aucun matériel disponible pour cette agence
                </p>
              )}
            </div>


           {/* Logiciel */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Logiciel {formData.id_materiel && <span className="text-xs text-gray-500">(désactivé car matériel sélectionné)</span>}
  </label>
  <select
    name="id_logiciel"
    value={formData.id_logiciel}
    onChange={handleChange}
    disabled={!formData.code_agence || !!formData.id_materiel}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <option value="">
      {!formData.code_agence ? 'Choisir d\'abord une agence' : 
       formData.id_materiel ? 'Désélectionner le matériel d\'abord' :
       'Sélectionner un logiciel'}
    </option>
    {filteredLogiciels.map((logiciel, index) => (
      <option 
        key={`${logiciel.id_logiciel}-${logiciel.code_agence}-${index}`}
        value={logiciel.id_logiciel}
      >
        {logiciel.nom_logiciel} (v{logiciel.version})
      </option>
    ))}
  </select>
  {filteredLogiciels.length === 0 && formData.code_agence && !formData.id_materiel && (
    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
      ⚠️ Aucun logiciel disponible pour cette agence
    </p>
  )}
</div>



            {/* Technicien */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technicien *
              </label>
              <select
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un technicien</option>
                {utilisateurs.map(user => (
                  <option key={user.matricule} value={user.matricule}>
                    {user.nom} {user.prenom} ({user.matricule})
                  </option>
                ))}
              </select>
            </div>


            {/* Type d'intervention */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'intervention *
              </label>
              <select
                name="type_intervention"
                value={formData.type_intervention}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner le type</option>
                <option value="en directe">En directe</option>
                <option value="par mission">Par mission</option>
                <option value="à distance">À distance</option>
              </select>
            </div>


            {/* Date début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date début *
              </label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* Date fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date fin
              </label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                min={formData.date_debut}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="en cours">En cours</option>
                <option value="réparé">Réparé</option>
                <option value="non réparé">Non réparé</option>
              </select>
            </div>


            {/* N° OR - Affiché uniquement si type_intervention = "par mission" */}
            {formData.type_intervention === 'par mission' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  N° OR
                </label>
                <input
                  type="text"
                  name="numero_or"
                  value={formData.numero_or}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Numéro d'ordre de réparation"
                />
              </div>
            )}


            {/* Outils - Affiché uniquement si type_intervention = "à distance" */}
            {formData.type_intervention === 'à distance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Outils utilisés
                </label>
                <input
                  type="text"
                  name="outils"
                  value={formData.outils}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: TeamViewer, AnyDesk..."
                />
              </div>
            )}


            {/* Solution appliquée */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solution appliquée
              </label>
              <textarea
                name="solution_appliquee"
                value={formData.solution_appliquee}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Décrire la solution appliquée..."
              />
            </div>


            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Description du problème..."
              />
            </div>
          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {maintenance ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default MaintenanceForm;
