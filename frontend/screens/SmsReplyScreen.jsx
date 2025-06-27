import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';
import Constants from 'expo-constants';
import MessageCard from "../components/MessageCardModal";

const API_URL = Constants.expoConfig.extra.API_URL;

export default function SmsReplyScreen() {
  const token = useSelector((state) => state.user.value.token);

  // Messages par défaut avec l'humour original !
  const [receptionMessage, setReceptionMessage] = useState("Bonjour, un colis vient d'arriver à votre nom. Merci de venir le récupérer au plus vite où ça va barder.");
  const [reminderMessage, setReminderMessage] = useState("Bonjour, votre colis est toujours en attente de retrait. Merci de venir le récupérer au plus vite, sinon je le garde pour moi !");
  const [absentUrgentMessage, setAbsentUrgentMessage] = useState("Bonjour, je suis actuellement indisponible pour des raisons urgentes. Merci de votre compréhension.");
  const [absentPlannedMessage, setAbsentPlannedMessage] = useState("Bonjour, je suis absent(e) pour une période donnée. Merci pour votre patience !");

  const [editingStates, setEditingStates] = useState({
    reception: false,
    reminder: false,
    urgent: false,
    planned: false,
  });

  const [activeTab, setActiveTab] = useState("colis");
  const [loading, setLoading] = useState(false);

  console.log("API_URL →", API_URL);
  // Charger les messages depuis l'API
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/pros/sms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        
        if (data.result && data.data) {
          setReceptionMessage(data.data.receptionMessage || receptionMessage);
          setReminderMessage(data.data.reminderMessage || reminderMessage);
          setAbsentUrgentMessage(data.data.absentUrgentMessage || absentUrgentMessage);
          setAbsentPlannedMessage(data.data.absentPlannedMessage || absentPlannedMessage);
        }
      } catch (error) {
        console.error("Erreur récupération SMS :", error);
        Alert.alert("Erreur", "Impossible de charger vos messages");
      }
    };

    fetchMessages();
  }, [token]);

  // Basculer l'état d'édition
  const toggleEditing = (messageType) => {
    setEditingStates(prev => ({
      ...prev,
      [messageType]: !prev[messageType]
    }));
  };

  // Sauvegarder tous les messages
  const saveMessages = async () => {
    if (!token) {
      Alert.alert("Erreur", "Token manquant");
      return;
    }

    // Fermer tous les modes édition
    setEditingStates({
      reception: false,
      reminder: false,
      urgent: false,
      planned: false,
    });

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/pros/sms`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receptionMessage,
          reminderMessage,
          absentUrgentMessage,
          absentPlannedMessage,
        }),
      });

      const data = await response.json();

      if (data.result) {
        Alert.alert(" Succès", "Vos messages ont été sauvegardés !");
      } else {
        Alert.alert(" Erreur", data.error || "Échec de la sauvegarde");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(" Erreur réseau", "Impossible de sauvegarder vos messages");
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser un message
  const resetMessage = (messageType) => {
    Alert.alert(
      "🔄 Réinitialiser",
      "Voulez-vous remettre le message par défaut ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          onPress: () => {
            switch (messageType) {
              case 'reception':
                setReceptionMessage("Bonjour, un colis vient d'arriver à votre nom. Merci de venir le récupérer au plus vite où ça va barder.");
                break;
              case 'reminder':
                setReminderMessage("Bonjour, votre colis est toujours en attente de retrait. Merci de venir le récupérer au plus vite, sinon je le garde pour moi !");
                break;
              case 'urgent':
                setAbsentUrgentMessage("Bonjour, je suis actuellement indisponible pour des raisons urgentes. Merci de votre compréhension.");
                break;
              case 'planned':
                setAbsentPlannedMessage("Bonjour, je suis absent(e) pour une période donnée. Merci pour votre patience !");
                break;
            }
          }
        }
      ]
    );
  };


  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      
       <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Text style={styles.title}>📱 Mes Messages SMS</Text>
        <Text style={styles.subtitle}>Personnalisez vos réponses automatiques</Text>

        {/* Onglets */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "colis" && styles.activeTab]}
            onPress={() => setActiveTab("colis")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="box"
              size={16}
              color={activeTab === "colis" ? "#4F378A" : "#D0BCFF"}
            />
            <Text style={[styles.tabText, activeTab === "colis" && styles.activeTabText]}>
              Colis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "absence" && styles.activeTab]}
            onPress={() => setActiveTab("absence")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="calendar-times"
              size={16}
              color={activeTab === "absence" ? "#4F378A" : "#D0BCFF"}
            />
            <Text style={[styles.tabText, activeTab === "absence" && styles.activeTabText]}>
              Absences
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === "colis" ? (
            <>
              <MessageCard
                title="Arrivée de colis"
                message={receptionMessage}
                setMessage={setReceptionMessage}
                messageType="reception"
                icon="box-open"
                description="Message envoyé quand un nouveau colis arrive"
                editing={editingStates.reception}
                toggleEditing={toggleEditing}
                resetMessage={resetMessage}
              />

              <MessageCard
                title="Relance client"
                message={reminderMessage}
                setMessage={setReminderMessage}
                messageType="reminder"
                icon="bell"
                description="Message de rappel pour les colis non récupérés"
                editing={editingStates.reminder}
                toggleEditing={toggleEditing}
                resetMessage={resetMessage}
              />
            </>
          ) : (
            <>
              <MessageCard
                title="Absence urgente"
                message={absentUrgentMessage}
                setMessage={setAbsentUrgentMessage}
                messageType="urgent"
                icon="exclamation-triangle"
                description="Message d'urgence en cas d'imprévu"
                editing={editingStates.urgent}
                toggleEditing={toggleEditing}
                resetMessage={resetMessage}
              />

              <MessageCard
                title="Absence prévue"
                message={absentPlannedMessage}
                setMessage={setAbsentPlannedMessage}
                messageType="planned"
                icon="calendar-alt"
                description="Message pour les congés et absences planifiées"
                editing={editingStates.planned}
                toggleEditing={toggleEditing}
                resetMessage={resetMessage}
              />
            </>
          )}
        </ScrollView>

        {/* Bouton de sauvegarde */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={saveMessages}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <Text style={styles.saveButtonText}>Sauvegarde...</Text>
            ) : (
              <>
                <FontAwesome5 name="save" size={16} color="#4F378A" />
                <Text style={styles.saveButtonText}>Sauvegarder tout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  // Onglets
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#D0BCFF',
    borderColor: '#D0BCFF',
  },
  tabText: {
    color: '#D0BCFF',
    fontWeight: "600",
    fontSize: 16,
  },
  activeTabText: {
    color: '#4F378A',
  },

  // ScrollView
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Sauvegarde
  saveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#D0BCFF',
    backgroundColor: '#FFFAF5',
  },
  saveButton: {
    backgroundColor: '#D0BCFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#4F378A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});