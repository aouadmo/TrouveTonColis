import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';
import ClientSmsModal from '../components/ClientSmSModal';
import { updateClientProfile } from '../reducers/userProfile';
import { navigate } from '../navigation/navigationRef';

export default function ClientProfileScreen() {
  const token = useSelector(state => state.user.value.token);
  const userData = useSelector(state => state.userProfile.value);
  const dispatch = useDispatch();

  const [editedData, setEditedData] = useState(userData);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalColis: 0,
    colisRecuperes: 0,
    dernierColis: null,
  });
  const [showSmsModal, setShowSmsModal] = useState(false);

  const goToClientCrenaux = () => navigate('ClientCrenauxScreen');

  useEffect(() => {
     if (!token) return;

    fetch(`http://192.168.1.191:3006/users/client/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data?.result && data?.client) {
          const { prenom, nom, phone, email, loginEmail } = data.client;

          const newProfile = {
            firstName: prenom || '',
            lastName: nom || '',
            phone: phone?.toString() || '',
            email: email || '',
            loginEmail: loginEmail || '',
          };

          dispatch(updateClientProfile(newProfile));
          setEditedData(newProfile);
        } else {
          console.log(' Erreur fetch client :', data);
        }
      })
      .catch(err => {
        console.log(' Erreur fetch client :', err);
        Alert.alert(' Erreur', 'Impossible de charger votre profil');
      });

    // Fetch statistiques (factices pour l'instant)
    setStats({
      totalColis: 12,
      colisRecuperes: 10,
      dernierColis: "2024-06-20",
    });
  }, [token, dispatch]);

  const handleSave = () => {
    fetch('http://192.168.1.191:3006/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          Alert.alert(' Succès', 'Modifications enregistrées avec succès !');
          dispatch(updateClientProfile(editedData));
          setIsEditable(false);
        } else {
          Alert.alert(' Erreur', data.error || 'Une erreur est survenue');
        }
      })
      .catch(err => {
        Alert.alert(' Erreur réseau', "Impossible de contacter le serveur.");
        console.log('Erreur lors de la sauvegarde :', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditable(false);
  };

  const handleMainButton = () => {
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
    }
  };

  const handleContactCecile = () => {
    setShowSmsModal(true);
  };

  const handleEmailSupport = () => {
    const email = 'support@trouvetoncolis.fr';
    const subject = 'Question depuis mon profil';
    const body = `Bonjour,\n\nJe suis ${editedData.firstName} ${editedData.lastName} et j'ai une question :\n\n`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>👤 Mon Profil</Text>
          <Text style={styles.subtitle}>
            Bonjour {editedData.firstName || 'cher client'} !
          </Text>

          {/* Statistiques personnelles */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Mes statistiques</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <FontAwesome5 name="box" size={20} color="#0E56B4" />
                <Text style={styles.statNumber}>{stats.totalColis}</Text>
                <Text style={styles.statLabel}>Colis total</Text>
              </View>
              <View style={styles.statCard}>
                <FontAwesome5 name="check-circle" size={20} color="#059669" />
                <Text style={styles.statNumber}>{stats.colisRecuperes}</Text>
                <Text style={styles.statLabel}>Récupérés</Text>
              </View>
              <View style={styles.statCard}>
                <FontAwesome5 name="clock" size={20} color="#D97706" />
                <Text style={styles.statNumber}>{stats.totalColis - stats.colisRecuperes}</Text>
                <Text style={styles.statLabel}>En attente</Text>
              </View>
            </View>
          </View>

          {/* Informations personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✏️ Mes informations</Text>
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.block}>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput
                    style={[styles.input, !isEditable && styles.readOnly]}
                    value={editedData.lastName}
                    editable={isEditable}
                    placeholder="Votre nom"
                    onChangeText={text => setEditedData({ ...editedData, lastName: text })}
                  />
                </View>
                <View style={styles.block}>
                  <Text style={styles.label}>Prénom</Text>
                  <TextInput
                    style={[styles.input, !isEditable && styles.readOnly]}
                    value={editedData.firstName}
                    editable={isEditable}
                    placeholder="Votre prénom"
                    onChangeText={text => setEditedData({ ...editedData, firstName: text })}
                  />
                </View>
              </View>

              <View style={styles.blockFull}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={[styles.input, !isEditable && styles.readOnly]}
                  keyboardType="phone-pad"
                  value={editedData.phone}
                  editable={isEditable}
                  placeholder="06 12 34 56 78"
                  onChangeText={text => setEditedData({ ...editedData, phone: text })}
                />
              </View>

              <View style={styles.blockFull}>
                <Text style={styles.label}>Email de contact</Text>
                <TextInput
                  style={[styles.input, !isEditable && styles.readOnly]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={editedData.email}
                  editable={isEditable}
                  placeholder="votre@email.com"
                  onChangeText={text => setEditedData({ ...editedData, email: text })}
                />
              </View>

              {editedData.loginEmail && (
                <View style={styles.blockFull}>
                  <Text style={styles.label}>Email de connexion</Text>
                  <TextInput
                    style={[styles.input, styles.readOnly]}
                    value={editedData.loginEmail}
                    editable={false}
                    placeholder="Email de connexion (non modifiable)"
                  />
                  <Text style={styles.helperText}>
                    Cet email ne peut pas être modifié
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={handleMainButton}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? '⏳ Sauvegarde...' : 
                   isEditable ? '💾 Sauvegarder' : '✏️ Modifier mon profil'}
                </Text>
              </TouchableOpacity>

              {isEditable && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={handleCancel}
                  disabled={isLoading}
                >
                  <Text style={styles.secondaryButtonText}>❌ Annuler</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Actions rapides */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Actions rapides</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleContactCecile}
            >
              <FontAwesome5 name="clock" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>J'arrive dans 10 minutes ⏰</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryActionButton]}
              onPress={handleEmailSupport}
            >
              <FontAwesome5 name="envelope" size={16} color="#0E56B4" />
              <Text style={styles.secondaryActionButtonText}>Contacter le support</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#0E56B4" />
            </TouchableOpacity>
          </View>

          {/* Informations pratiques */}
          <View style={styles.infoBox}>
            <FontAwesome5 name="info-circle" size={16} color="#0E56B4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>💡 Le saviez-vous ?</Text>
              <Text style={styles.infoText}>
                Vos colis sont conservés gratuitement chez Cécile selon les délais légaux. 
                Pensez à réserver un créneau pour éviter les déplacements inutiles !
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Composant Modal SMS */}
      <ClientSmsModal
        visible={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        clientName={editedData.firstName}
        nbColisEnAttente={stats.totalColis - stats.colisRecuperes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFCE9', // Palette Client - Fond crème
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCE9',
    padding: 20,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0E56B4',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#95C9D8',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E56B4',
    marginBottom: 16,
  },

  // Statistiques
  statsSection: {
    marginBottom: 32,
  },
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
    borderColor: '#95C9D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E56B4',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#95C9D8',
    textAlign: 'center',
  },

  // Formulaire
  form: {
    backgroundColor: '#FFFAF5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  block: {
    flex: 1,
  },
  blockFull: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E56B4',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#95C9D8',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#0E56B4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  readOnly: {
    backgroundColor: '#F0F8FF',
    color: '#95C9D8',
    borderColor: '#D6E9F5',
  },
  helperText: {
    fontSize: 12,
    color: '#95C9D8',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Boutons
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#0E56B4',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#95C9D8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#0E56B4',
    fontWeight: '600',
    fontSize: 16,
  },

  // Actions rapides
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E56B4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#95C9D8',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  secondaryActionButtonText: {
    color: '#0E56B4',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#95C9D8',
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0E56B4',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0E56B4',
    lineHeight: 20,
  },
});