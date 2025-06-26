import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setColis, updateColisStatus } from '../reducers/colis';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';
import moment from 'moment';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function MonStockScreen() {
  const dispatch = useDispatch();
  const colis = useSelector(state => state.colis.value);

  const [selectedColis, setSelectedColis] = useState([]);
  const [filtreActif, setFiltreActif] = useState('tous');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configuration moment en français
  moment.locale('fr');

  // Récupération des colis
  useEffect(() => {
    fetch(`${API_URL}/colis`) 
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const today = moment();
          // On ajoute chaque colis avec un champ "computedStatus"
          const enrichedColis = data.stock.map(item => {
            if (item.status === 'réservé') {
              return { ...item, computedStatus: 'réservé' }; // Partie colis réservés à dynamiser plus tard en fonction de la prise de RDV client
            }
  
            const arrival = moment(item.arrivalDate); // Date d'arrivée du colis
            const days = today.diff(arrival, 'days'); // Calcul du nombre de jours écoulés
            // Attribution du statut dynamique selon l'ancienneté
            let computedStatus = 'en attente';
            if (days >= 7) {
              computedStatus = 'relance possible';
            } else if (days >= 5) {
              computedStatus = 'j+5';
            }
  
            return { ...item, computedStatus };
          });
        // Envoi des colis avec leur statut dans le store Redux
          dispatch(setColis(enrichedColis));
        }
        setLoading(false);
      })
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchColis();
  };

  // Statistiques
  const getStats = () => {
    return {
      total: colis.length,
      enAttente: colis.filter(c => c.computedStatus === 'en attente').length,
      reserve: colis.filter(c => c.computedStatus === 'réservé').length,
      relance: colis.filter(c => c.computedStatus === 'relance possible').length,
    };
  };

  const stats = getStats();

  // Sélection d'un colis
  const colisSelection = (trackingNumber) => {
    setSelectedColis((prev) =>
      prev.includes(trackingNumber)
        ? prev.filter(item => item !== trackingNumber)
        : [...prev, trackingNumber]
    );
  };

  // Action de suppression d'un colis
  const handleDeleteColis = (trackingNumber, clientName) => {
    Alert.alert(
      '🗑️ Supprimer le colis',
      `Êtes-vous sûre de vouloir supprimer le colis de ${clientName} ?\n\nRéférence : ${trackingNumber}`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // TODO: Ajouter la route DELETE dans le backend
            // fetch(`${API_URL}/colis/${trackingNumber}`, { method: 'DELETE' })
            console.log(`TODO: Supprimer le colis ${trackingNumber} via API`);
            
            // Pour l'instant, on supprime juste du store local
            const colisUpdated = colis.filter(c => c.trackingNumber !== trackingNumber);
            dispatch(setColis(colisUpdated));
            
            // Retirer de la sélection si il était sélectionné
            setSelectedColis(prev => prev.filter(t => t !== trackingNumber));
          },
        },
      ]
    );
  };

  // Action de relance
  const handleRelance = () => {
    selectedColis.forEach(trackingNumber => {
      dispatch(updateColisStatus({ trackingNumber, nouveauStatut: 'relance possible' }));
    });
    setSelectedColis([]);
  };

  // Filtrage des colis
  const colisFiltres = filtreActif === 'tous' ? colis : colis.filter(c => c.computedStatus === filtreActif);

  // Couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'réservé': return '#059669';
      case 'en attente': return '#D97706';
      case 'j+5': return '#DC2626';
      case 'relance possible': return '#7C2D12';
      default: return '#4F378A';
    }
  };

  // Icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'réservé': return 'calendar-check';
      case 'en attente': return 'clock';
      case 'j+5': return 'exclamation-triangle';
      case 'relance possible': return 'bell';
      default: return 'box';
    }
  };

  // Rendu d'un colis
  const renderItem = ({ item }) => (
    <View style={[styles.item, selectedColis.includes(item.trackingNumber) && styles.itemSelected]}>
      <TouchableOpacity 
        style={styles.itemClickable}
        onPress={() => colisSelection(item.trackingNumber)}
        activeOpacity={0.8}
      >
        <View style={styles.itemHeader}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, selectedColis.includes(item.trackingNumber) && styles.checkboxSelected]}>
              {selectedColis.includes(item.trackingNumber) && (
                <FontAwesome5 name="check" size={12} color="#FFFFFF" />
              )}
            </View>
          </View>
          
          <View style={styles.itemContent}>
            <Text style={styles.clientName}>{item.nom} {item.prenom}</Text>
            <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.computedStatus) }]}>
            <FontAwesome5 
              name={getStatusIcon(item.computedStatus)} 
              size={12} 
              color="#FFFFFF" 
            />
          </View>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <FontAwesome5 name="shipping-fast" size={14} color="#D0BCFF" />
            <Text style={styles.detailText}>Transporteur : {item.transporteur}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <FontAwesome5 name="calendar" size={14} color="#D0BCFF" />
            <Text style={styles.detailText}>
              Arrivé le {moment(item.arrivalDate).format('DD/MM/YYYY')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome5 name="hourglass-half" size={14} color="#D0BCFF" />
            <Text style={styles.detailText}>
              {item.daysInStock} jour{item.daysInStock > 1 ? 's' : ''} en stock
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: getStatusColor(item.computedStatus) }]}>
              {item.computedStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bouton de suppression - HORS de la zone cliquable */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteColis(item.trackingNumber, `${item.nom} ${item.prenom}`)}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="times" size={16} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du stock...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      
      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>📦 Mon Stock</Text>
        <Text style={styles.subtitle}>
          Gérez vos {stats.total} colis en cours
        </Text>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.enAttente}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.reserve}</Text>
            <Text style={styles.statLabel}>Réservés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.relance}</Text>
            <Text style={styles.statLabel}>À relancer</Text>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filtrer par statut :</Text>
          <View style={styles.filters}>
            {['tous', 'en attente', 'réservé', 'j+5', 'relance possible'].map(status => (
              <TouchableOpacity 
                key={status} 
                onPress={() => setFiltreActif(status)}
                style={[styles.filterTab, filtreActif === status && styles.filterTabActive]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterText, 
                  filtreActif === status && styles.filterTextActive
                ]}>
                  {status === 'tous' ? `Tous (${stats.total})` : status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Liste des colis */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {colisFiltres.length} colis {filtreActif !== 'tous' ? `(${filtreActif})` : ''}
          </Text>
          
          {colisFiltres.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="box-open" size={48} color="#D0BCFF" />
              <Text style={styles.emptyText}>
                Aucun colis {filtreActif !== 'tous' ? `en statut "${filtreActif}"` : ''}
              </Text>
            </View>
          ) : (
            <FlatList
              data={colisFiltres}
              keyExtractor={(item, index) => `${item.trackingNumber}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Bouton de relance */}
      {selectedColis.length > 0 && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.relanceButton} 
            onPress={handleRelance}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="bell" size={16} color="#FFFFFF" />
            <Text style={styles.relanceButtonText}>
              Relancer {selectedColis.length} colis
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFAF5', // Palette Pro - Fond rose très pâle
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4F378A',
  },
  
  // Header
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F378A', // Palette Pro - Texte violet foncé
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0BCFF', // Palette Pro - Mauve clair
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#D0BCFF',
    textAlign: 'center',
  },

  // Filtres
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F378A',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterTabActive: {
    backgroundColor: '#D0BCFF',
    borderColor: '#D0BCFF',
  },
  filterText: {
    fontSize: 14,
    color: '#4F378A',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#4F378A',
  },

  // Liste
  listContainer: {
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#D0BCFF',
    marginTop: 16,
    textAlign: 'center',
  },

  // Items de colis
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  itemSelected: {
    borderColor: '#4F378A',
    borderWidth: 2,
  },
  itemClickable: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D0BCFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4F378A',
    borderColor: '#4F378A',
  },
  itemContent: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 14,
    color: '#D0BCFF',
    fontFamily: 'monospace',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#4F378A',
    marginLeft: 8,
  },
  statusRow: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // Bouton de relance
  actionContainer: {
    padding: 20,
    backgroundColor: '#FFFAF5',
    borderTopWidth: 1,
    borderTopColor: '#D0BCFF',
  },
  relanceButton: {
    backgroundColor: '#D0BCFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  relanceButtonText: {
    color: '#4F378A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});