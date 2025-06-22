import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';
import { navigate } from '../navigation/navigationRef';

export default function TableauBordScreen() {
  
  // États pour les statistiques (factices pour l'instant)
  const [stats, setStats] = useState({
    colisArrivesAujourdhui: 8,
    colisRecuperesAujourdhui: 5,
    totalColisEnStock: 23,
    colisExpiresBientot: 3,
    derniereCo: "09:15",
  });

  const handleSmsReplysScreen = () => navigate('SmsReplyScreen');
  const handleCamScreen = () => navigate('CameraScreen');

  // Actions rapides
  const quickActions = [
    {
      id: 1,
      title: "Scanner un colis",
      icon: "qrcode",
      color: "#4F378A",
      action: handleCamScreen,
      description: "Enregistrer un nouveau colis"
    },
    {
      id: 2,
      title: "Répondre aux SMS",
      icon: "sms",
      color: "#6B46C1",
      action: handleSmsReplysScreen,
      description: "Gérer les messages clients"
    },
    {
      id: 3,
      title: "Mon stock",
      icon: "boxes",
      color: "#8B5CF6",
      action: () => navigate('MonStock'),
      description: "Voir tous les colis"
    },
    {
      id: 4,
      title: "Mes horaires",
      icon: "clock",
      color: "#A78BFA",
      action: () => navigate('ProHorairesScreen'),
      description: "Gérer les créneaux"
    }
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>📊 Tableau de bord</Text>
        <Text style={styles.subtitle}>
          Bonjour Cécile ! Voici un aperçu de votre activité
        </Text>

        {/* Statistiques du jour */}
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
              <Text style={[
                styles.statNumber,
                stats.colisExpiresBientot > 0 && styles.alertNumber
              ]}>
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
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <FontAwesome5 name={action.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={16} color="#CDF6FF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informations rapides */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ℹ️ Infos utiles</Text>
          
          <View style={styles.infoCard}>
            <FontAwesome5 name="clock" size={16} color="#4F378A" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Dernière connexion</Text>
              <Text style={styles.infoText}>Aujourd'hui à {stats.derniereCo}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <FontAwesome5 name="calendar-day" size={16} color="#4F378A" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Horaires aujourd'hui</Text>
              <Text style={styles.infoText}>
                {new Date().getDay() === 2 ? "10h-20h puis 21h45-22h" : "10h-16h puis 21h45-22h"}
              </Text>
            </View>
          </View>

          {stats.colisExpiresBientot > 0 && (
            <View style={[styles.infoCard, styles.alertInfo]}>
              <FontAwesome5 name="exclamation-triangle" size={16} color="#DC2626" />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, styles.alertText]}>⚠️ Attention !</Text>
                <Text style={styles.infoText}>
                  {stats.colisExpiresBientot} colis expire(nt) dans moins de 2 jours
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F378A', // Palette Pro - Texte violet foncé
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0BCFF', // Palette Pro - Mauve clair
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
    color: '#4F378A', // Palette Pro - Texte violet foncé
    marginBottom: 16,
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
    borderColor: '#D0BCFF', // Palette Pro - Bordure mauve clair
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCard: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A', // Palette Pro - Texte violet foncé
    marginVertical: 8,
  },
  alertNumber: {
    color: '#DC2626',
  },
  statLabel: {
    fontSize: 12,
    color: '#D0BCFF', // Palette Pro - Mauve clair
    textAlign: 'center',
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
    borderLeftColor: '#D0BCFF', // Palette Pro - Bordure gauche mauve
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
    backgroundColor: '#D0BCFF', // Palette Pro - Fond icône mauve
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F378A', // Palette Pro - Texte violet foncé
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#D0BCFF', // Palette Pro - Mauve clair
  },

  // Informations
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4F378A',
  },
  alertInfo: {
    borderColor: '#DC2626',
    backgroundColor: '#2A1A1A',
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
  alertText: {
    color: '#DC2626',
  },
  infoText: {
    fontSize: 14,
    color: '#4F378A',
    lineHeight: 20,
  },
});