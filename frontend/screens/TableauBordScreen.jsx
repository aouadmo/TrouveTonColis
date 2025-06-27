import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRetro, faComments, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function TableauBordScreen() {
  const token = useSelector((state) => state.user.value.token);
  const rdvList = useSelector((state) => state.rdv.value) ?? [];
  const navigation = useNavigation();

  const [urgentMessage, setUrgentMessage] = useState('');
  const [isUrgenceActive, setIsUrgenceActive] = useState(false);

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
      title: "Fermeture du relais",
      icon: "boxes",
      action: () => handleUrgence(),
      description: "Etat d'urgence",
    },
    {
      id: 4,
      title: "Mes horaires",
      icon: "clock",
      action: () => navigation.navigate('ProHorairesScreen'),
      description: "Gérer les créneaux",
    },
  ];

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

  const getTodayRdvList = (rdvs) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rdvs.filter((rdv) => {
      const [day, month, year] = rdv.date.split('/');
      const rdvDate = new Date(`${year}-${month}-${day}`);
      rdvDate.setHours(0, 0, 0, 0);
      return rdvDate.getTime() === today.getTime();
    });
  };

  const todayRdvList = getTodayRdvList(rdvList);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Tableau de bord</Text>
        <Text style={styles.subtitle}>Bonjour Cécile ! Voici un aperçu de votre activité</Text>

        {/* Rendez-vous */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📅 Rendez-vous du jour</Text>
          {todayRdvList.length > 0 ? (
            todayRdvList.map((rdv, index) => (
              <Text key={index} style={styles.rdv}>
                - {rdv.time} : {rdv.client ?? 'Client'}
              </Text>
            ))
          ) : (
            <Text style={styles.rdv}>- Pas de rendez-vous pour aujourd'hui</Text>
          )}
        </View>

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

        {/* Statistiques générales */}
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

        {/* Actions rapides */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>🚀 Actions rapides</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={styles.actionIcon}>
                  <FontAwesome5 name={action.icon} size={20} color="#4F378A" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={16} color="#D0BCFF" />
              </TouchableOpacity>
            ))}
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5', // Fond rose pâle
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
  actionsSection: {
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

  // RDV
  rdv: {
    fontSize: 14,
    color: '#4F378A',
    marginBottom: 6,
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

  // Actions rapides
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#D0BCFF',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#D0BCFF',
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
});