import axios from 'axios'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('📤 Requête API:', config.method.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('❌ Erreur requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('❌ Erreur réponse:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ========================================
// AUTHENTIFICATION
// ========================================
export const loginUser = async (credentials) => {
  try {
    console.log('🔐 Tentative de connexion avec:', { email: credentials.email })
    const response = await api.post('/utilisateurs/login', credentials)
    console.log('✅ Connexion réussie:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Erreur login:', error.response?.data || error.message)
    throw error
  }
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

// ========================================
// ÉQUIPEMENTS
// ========================================
export const getEquipments = async () => {
  const response = await api.get('/equipments')
  return response.data
}

export const getEquipmentById = async (id) => {
  // ❌ AVANT: const response = await api.get`/equipments/${id}`)
  // ✅ APRÈS:
  const response = await api.get(`/equipments/${id}`)
  return response.data
}

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipments', equipmentData)
  return response.data
}

export const updateEquipment = async (id, equipmentData) => {
  // ❌ AVANT: const response = await api.put`/equipments/${id}`, equipmentData)
  // ✅ APRÈS:
  const response = await api.put(`/equipments/${id}`, equipmentData)
  return response.data
}

export const deleteEquipment = async (id) => {
  // ❌ AVANT: const response = await api.delete`/equipments/${id}`)
  // ✅ APRÈS:
  const response = await api.delete(`/equipments/${id}`)
  return response.data
}

// ========================================
// RÉGIONS
// ========================================
export const getRegions = async () => {
  const response = await api.get('/regions')
  return response.data
}

export const getRegionById = async (id) => {
  // ❌ AVANT: const response = await api.get`/regions/${id}`)
  // ✅ APRÈS:
  const response = await api.get(`/regions/${id}`)
  return response.data
}

export const createRegion = async (data) => {
  const response = await api.post('/regions', data)
  return response.data
}

export const updateRegion = async (id, data) => {
  // ❌ AVANT: const response = await api.put`/regions/${id}`, data)
  // ✅ APRÈS:
  const response = await api.put(`/regions/${id}`, data)
  return response.data
}

export const deleteRegion = async (id) => {
  // ❌ AVANT: const response = await api.delete`/regions/${id}`)
  // ✅ APRÈS:
  const response = await api.delete(`/regions/${id}`)
  return response.data
}

export const getAgencesByRegion = async (id) => {
  // ❌ AVANT: const response = await api.get`/regions/${id}/agences`)
  // ✅ APRÈS:
  const response = await api.get(`/regions/${id}/agences`)
  return response.data
}

// ========================================
// UTILISATEURS
// ========================================

/**
 * Récupérer tous les utilisateurs
 */
export const getUtilisateurs = async () => {
  const response = await api.get('/utilisateurs')
  return response.data
}

/**
 * Créer un nouvel utilisateur
 */
export const createUtilisateur = async (data) => {
  const response = await api.post('/utilisateurs', data)
  return response.data
}

/**
 * Modifier un utilisateur
 * Note: Le backend ne permet peut-être pas la modification, à vérifier
 */
export const updateUtilisateur = async (matricule, data) => {
  const response = await api.put(`/utilisateurs/${matricule}`, data)
  return response.data
}

/**
 * Supprimer un utilisateur
 */
export const deleteUtilisateur = async (matricule) => {
  const response = await api.delete(`/utilisateurs/${matricule}`)
  return response.data
}

// ========================================
// AGENCES
// ========================================

/**
 * Récupérer toutes les agences avec leurs régions
 */
export const getAgences = async () => {
  const response = await api.get('/agences')
  return response.data
}

/**
 * Récupérer une agence par son code
 */
export const getAgenceById = async (code) => {
  const response = await api.get(`/agences/${code}`)
  return response.data
}

/**
 * Créer une nouvelle agence
 * data: { code_agence, nom_agence, adresse, id_region }
 */
export const createAgence = async (data) => {
  const response = await api.post('/agences', data)
  return response.data
}

/**
 * Modifier une agence existante
 * data: { nom_agence, adresse, id_region }
 */
export const updateAgence = async (code, data) => {
  const response = await api.put(`/agences/${code}`, data)
  return response.data
}

/**
 * Supprimer une agence
 */
export const deleteAgence = async (code) => {
  const response = await api.delete(`/agences/${code}`)
  return response.data
}


export const getLogiciels = async () => {
  const response = await api.get('/logiciels');
  return response.data;
};

/**
 * Récupérer un logiciel par son ID
 */
export const getLogicielById = async (id) => {
  const response = await api.get(`/logiciels/${id}`);
  return response.data;
};

/**
 * Créer un nouveau logiciel
 * data: { id_logiciel, nom_logiciel, version, date_installation }
 */
export const createLogiciel = async (data) => {
  const response = await api.post('/logiciels', data);
  return response.data;
};

export const updateLogiciel = async (id, data) => {
  const response = await api.put(`/logiciels/${id}`, data);
  return response.data;
};

/**
 * Supprimer un logiciel
 */
export const deleteLogiciel = async (id) => {
  const response = await api.delete(`/logiciels/${id}`);
  return response.data;
};

// Récupérer les agences utilisant un logiciel
export const getAgencesByLogiciel = async (id_logiciel) => {
  const response = await api.get(`/utilise-logiciel/logiciel/${id_logiciel}/agences`);
  return response.data;
};

// Associer une agence à un logiciel
export const addAgenceToLogiciel = async (code_agence, id_logiciel) => {
  const response = await api.post('/utilise-logiciel', { code_agence, id_logiciel });
  return response.data;
};

// Dissocier une agence d'un logiciel
export const removeAgenceFromLogiciel = async (code_agence, id_logiciel) => {
  const response = await api.delete(`/utilise-logiciel/${code_agence}/${id_logiciel}`);
  return response.data;
};

// ========================================
// MATÉRIELS
// ========================================

/**
 * Récupérer tous les matériels avec leurs agences
 */
export const getMateriels = async () => {
  const response = await api.get('/materiels');
  return response.data;
};

/**
 * Récupérer un matériel par son ID
 */
export const getMaterielById = async (id) => {
  const response = await api.get(`/materiels/${id}`);
  return response.data;
};

/**
 * Créer un nouveau matériel
 */
export const createMateriel = async (data) => {
  const response = await api.post('/materiels', data);
  return response.data;
};

/**
 * Modifier un matériel existant
 */
export const updateMateriel = async (id, data) => {
  const response = await api.put(`/materiels/${id}`, data);
  return response.data;
};

/**
 * Supprimer un matériel
 */
export const deleteMateriel = async (id) => {
  const response = await api.delete(`/materiels/${id}`);
  return response.data;
};

// ========================================
// MAINTENANCES
// ========================================

/**
 * Récupérer toutes les maintenances
 */
export const getMaintenances = async () => {
  const response = await api.get('/maintenances');
  return response.data;
};

/**
 * Récupérer une maintenance par son ID
 */
export const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenances/${id}`);
  return response.data;
};

/**
 * Créer une nouvelle maintenance
 */
export const createMaintenance = async (data) => {
  const response = await api.post('/maintenances', data);
  return response.data;
};

/**
 * Modifier une maintenance existante
 */
export const updateMaintenance = async (id, data) => {
  const response = await api.put(`/maintenances/${id}`, data);
  return response.data;
};

/**
 * Supprimer une maintenance
 */
export const deleteMaintenance = async (id) => {
  const response = await api.delete(`/maintenances/${id}`);
  return response.data;
};



export default api