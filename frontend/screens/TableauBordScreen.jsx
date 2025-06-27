import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRetro, faComments, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import HorairesModal from '../components/HorairesModal';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function TableauBordScreen() {
  const token = useSelector((state) => state.user.value.token);
  const rdvList = useSelector((state) => state.rdv.value) ?? [];
  const colisData = useSelector((state) => state.colis.value) ?? []; // ✅ AJOUTE ÇA
  const navigation = useNavigation();

  const [urgentMessage, setUrgentMessage] = useState('');
  const [isUrgenceActive, setIsUrgenceActive] = useState(false);
  const [horairesModalVisible, setHorairesModalVisible] = useState(false); // ✅ AJOUTE ÇA
  const [currentHoraires, setCurrentHoraires] = useState(null); // ✅ AJOUTE ÇA

  const [stats, setStats] = useState({
    colisArrivesAujourdhui: 8,
    colisRecuperesAujourdhui: 5,
    totalColisEnStock: 23,
    colisExpiresBientot: 3,
  });

  const quickActions = [
    {
      id: 1,
      title: "Scanner un colis",
      icon: "qrcode",
      action: () => navigation.navigate('CameraScreen'),
      description: "Enregistrer un nouveau colis",
    },
    {
      id: 2,
      title: "Gérer les SMS",
      icon: "sms",
      action: () => navigation.navigate('SmsReplyScreen'),
      description: "Gérer les messages envoyés aux clients",
    },
    {
      id: 3,
      title: "relais fermé",
      icon: "boxes",
      action: () => handleUrgence(),
      description: "Etat d'urgence",
    },
    {
      id: 4,
      title: "Mes horaires",
      icon: "clock",
      action: () => ouvrirModalHoraires(), // ✅ CORRIGÉ
      description: "Gérer les créneaux",
    },
  ];

  // ✅ FONCTION POUR OUVRIR LA MODAL HORAIRES
  const ouvrirModalHoraires = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/pros/horaires`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.result && data.horaires) {
          setCurrentHoraires(data.horaires);
        }
      } catch (error) {
        console.log("Erreur récupération horaires:", error);
      }
    }
    
    setHorairesModalVisible(true);
  };

  // ✅ CALLBACK QUAND LES HORAIRES SONT SAUVÉES
  const onHorairesSaved = (nouvellesHoraires) => {
    setCurrentHoraires(nouvellesHoraires);
    console.log("✅ Horaires mises à jour:", nouvellesHoraires);
  };

  useEffect(() => {
    const fetchUrgentMessage = async () => {
      try {
        const response = await fetch(`${API_URL}/pros/sms`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.result && data.data) {
          setUrgentMessage(data.data.absentUrgentMessage);
        }
      } catch (error) {
        console.error('Erreur fetch message urgence :', error);
      }
    };

    if (token) fetchUrgentMessage();
  }, [token]);

  const handleUrgence = () => {
    if (!isUrgenceActive) {
      if (urgentMessage) {
        Alert.alert("Urgence Activée", urgentMessage);
        setIsUrgenceActive(true);
      } else {
        Alert.alert("Erreur", "Aucun message d'urgence disponible.");
      }
    } else {
      Alert.alert("Urgence Désactivée", "Le message d'urgence a été retiré.");
      setIsUrgenceActive(false);
    }
  };

  // ✅ AMÉLIORE LA FONCTION POUR LES RDV DU JOUR
  const getTodayRdvList = () => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('fr-FR'); // Format: "DD/MM/YYYY"
    
    // Chercher dans les RDV du reducer rdv
    const rdvToday = rdvList.filter((rdv) => {
      return rdv.date === todayStr;
    });

    // Chercher aussi dans les colis avec RDV confirmés
    const colisRdvToday = colisData
      .filter(colis => colis.rdvConfirmed && colis.rdvDate)
      .filter(colis => {
        const rdvDate = new Date(colis.rdvDate);
        const rdvDateStr = rdvDate.toLocaleDateString('fr-FR');
        return rdvDateStr === todayStr;
      })
      .map(colis => ({
        time: new Date(colis.rdvDate).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        client: `${colis.prenom} ${colis.nom}`,
        trackingNumber: colis.trackingNumber
      }));

    return [...rdvToday, ...colisRdvToday];
  };

  const todayRdvList = getTodayRdvList();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.twoColumnsContainer}>

        {/* Colonne gauche - Menu vertical */}
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>🚀 Accès rapide</Text>
          
          {/* ✅ SCROLLVIEW POUR ÉVITER QUE LES BULLES SOIENT COUPÉES */}
          <ScrollView 
            contentContainerStyle={styles.actionsScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.verticalActionCard}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <FontAwesome5 name={action.icon} size={20} color="#D0BCFF" />
                <Text style={styles.verticalActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Colonne droite - Contenu principal */}
        <ScrollView contentContainerStyle={styles.rightColumn} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>📊 Tableau de bord</Text>
          <Text style={styles.subtitle}>Bonjour Cécile ! Voici un aperçu de votre activité</Text>

          {/* Statistiques */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📈 Aujourd'hui</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <FontAwesome5 name="box-open" size={20} color="#4F378A" />
                <Text style={styles.statNumber}>{stats.colisArrivesAujourdhui}</Text>
                <Text style={styles.statLabel}>Arrivés</Text>
              </View>
              <View style={styles.statCard}>
                <FontAwesome5 name="handshake" size={20} color="#059669" />
                <Text style={styles.statNumber}>{stats.colisRecuperesAujourdhui}</Text>
                <Text style={styles.statLabel}>Récupérés</Text>
              </View>
            </View>
          </View>

          {/* Vue d'ensemble */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📦 Vue d'ensemble</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <FontAwesome5 name="warehouse" size={20} color="#4F378A" />
                <Text style={styles.statNumber}>{stats.totalColisEnStock}</Text>
                <Text style={styles.statLabel}>En stock</Text>
              </View>
              <View style={[styles.statCard, stats.colisExpiresBientot > 0 && styles.alertCard]}>
                <FontAwesome5
                  name="exclamation-triangle"
                  size={20}
                  color={stats.colisExpiresBientot > 0 ? "#DC2626" : "#4F378A"}
                />
                <Text style={[styles.statNumber, stats.colisExpiresBientot > 0 && styles.alertNumber]}>
                  {stats.colisExpiresBientot}
                </Text>
                <Text style={styles.statLabel}>Expirent bientôt</Text>
              </View>
            </View>
          </View>

          {/* ✅ RENDEZ-VOUS AMÉLIORÉS */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📅 Rendez-vous du jour ({todayRdvList.length})</Text>
            {todayRdvList.length > 0 ? (
              <View style={styles.rdvContainer}>
                {todayRdvList.map((rdv, index) => (
                  <View key={index} style={styles.rdvCard}>
                    <FontAwesome5 name="clock" size={14} color="#4F378A" />
                    <View style={styles.rdvInfo}>
                      <Text style={styles.rdvTime}>{rdv.time}</Text>
                      <Text style={styles.rdvClient}>
                        {rdv.client || 'Client non spécifié'}
                        {rdv.trackingNumber && (
                          <Text style={styles.rdvTracking}> - {rdv.trackingNumber}</Text>
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyRdvCard}>
                <FontAwesome5 name="calendar-times" size={20} color="#95C9D8" />
                <Text style={styles.emptyRdvText}>Pas de rendez-vous pour aujourd'hui</Text>
              </View>
            )}
          </View>

          {/* Bouton d'urgence */}
          <TouchableOpacity
            onPress={handleUrgence}
            style={[styles.urgenceButton, isUrgenceActive && styles.urgenceButtonActive]}
          >
            <FontAwesomeIcon
              icon={isUrgenceActive ? faTimesCircle : faExclamationTriangle}
              size={20}
              color="#fff"
            />
            <Text style={styles.urgenceText}>
              {isUrgenceActive ? "Mettre fin à l'urgence" : "Envoyer un message d'urgence"}
            </Text>
          </TouchableOpacity>

          {/* Infos utiles */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>ℹ️ Infos utiles</Text>
            <View style={styles.infoCard}>
              <FontAwesome5 name="calendar-day" size={16} color="#4F378A" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Horaires aujourd'hui</Text>
                <Text style={styles.infoText}>
                  {new Date().getDay() === 2 ? "10h-20h" : "10h-16h puis 21h45-22h"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      
      <HorairesModal 
        visible={horairesModalVisible} 
        onClose={() => setHorairesModalVisible(false)}
        horairesInitiaux={currentHoraires}
        onSave={onHorairesSaved}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5', // Fond rose pâle
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F378A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0BCFF',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },

  // Sections
  statsSection: {
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 16,
  },

  // ✅ RDV AMÉLIORÉS
  rdvContainer: {
    gap: 8,
  },
  rdvCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F378A',
  },
  rdvInfo: {
    marginLeft: 10,
    flex: 1,
  },
  rdvTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F378A',
  },
  rdvClient: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  rdvTracking: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  emptyRdvCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptyRdvText: {
    fontSize: 14,
    color: '#95C9D8',
    marginLeft: 8,
    fontStyle: 'italic',
  },

  // Statistiques
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#D0BCFF',
    textAlign: 'center',
  },
  alertCard: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  alertNumber: {
    color: '#DC2626',
  },

  // Urgence
  urgenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D10000',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 20,
  },
  urgenceButtonActive: {
    backgroundColor: '#751414',
  },
  urgenceText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },

  // Infos utiles
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F378A',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CDF6FF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#D0BCFF',
    lineHeight: 20,
  },

  // ✅ LAYOUT CORRIGÉ
  twoColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#F5F3FF',
    borderRightWidth: 1,
    borderRightColor: '#E0D7F8',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  rightColumn: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFAF5',
    paddingBottom: 40,
  },

  // ✅ SCROLL CONTAINER POUR LES ACTIONS
  actionsScrollContainer: {
    paddingBottom: 20, // Espace en bas pour éviter la coupure
  },

  // ✅ ACTIONS VERTICALES AJUSTÉES
  verticalActionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#4F378A',
    paddingVertical: 24, // ✅ RÉDUIT (était 36)
    paddingHorizontal: 12,
    borderRadius: 30,
    marginBottom: 16, // ✅ RÉDUIT (était 24)
    borderLeftWidth: 4,
    borderLeftColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 8, // ✅ RÉDUIT (était 10)
  },
  verticalActionText: {
    fontSize: 11, // ✅ RÉDUIT (était 12)
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 14, // ✅ AJOUTE pour contrôler l'espacement
  },
});