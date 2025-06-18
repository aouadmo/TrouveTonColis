import React, { useState, useEffect } from "react";
import * as SMS from 'expo-sms';
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';


export default function SmsReplyScreen() {
  const token = useSelector((state) => state.user.value.token);

  const [receptionMessage, setReceptionMessage] = useState("Bonjour, un colis vient d'arriver à votre nom. Merci de venir le récupérer au plus vite où ça va barder.");
  const [reminderMessage, setReminderMessage] = useState("Bonjour, votre colis est toujours en attente de retrait. Merci de venir le récupérer au plus vite, sinon je le garde pour moi !");
  const [absentUrgentMessage, setAbsentUrgentMessage] = useState("Bonjour, je suis actuellement indisponible pour des raisons urgentes. Merci de votre compréhension.");
  const [absentPlannedMessage, setAbsentPlannedMessage] = useState("Bonjour, je suis absent(e) pour une période donnée. Merci pour votre patience !");

  const [isEditingReception, setIsEditingReception] = useState(false);
  const [isEditingReminder, setIsEditingReminder] = useState(false);
  const [isEditingUrgent, setIsEditingUrgent] = useState(false);
  const [isEditingPlanned, setIsEditingPlanned] = useState(false);

  const [activeTab, setActiveTab] = useState("colis");

  // Charger le token & messages
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch("http://192.168.1.10:3005/pros/sms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.result && data.data) {
          setReceptionMessage(data.data.receptionMessage);
          setReminderMessage(data.data.reminderMessage);
          setAbsentUrgentMessage(data.data.absentUrgentMessage || absentUrgentMessage);
          setAbsentPlannedMessage(data.data.absentPlannedMessage || absentPlannedMessage);
        } else {
          console.warn("Aucun message personnalisé trouvé");
        }
      } catch (error) {
        console.error("Erreur récupération SMS :", error);
      }
    };

    fetchMessages();
  }, [token]);


  const saveMessages = async () => {
    if (!token) {
      Alert.alert("Non connecté", "Token manquant.");
      return;
    }

    // Ferme tous les modes édition avant sauvegarde
    setIsEditingReception(false);
    setIsEditingReminder(false);
    setIsEditingUrgent(false);
    setIsEditingPlanned(false);

    try {
      const response = await fetch("http://192.168.1.10:3005/pros/sms", {
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
        Alert.alert("Succès", "Messages sauvegardés !");
      } else {
        Alert.alert("Erreur", data.error || "Échec de la sauvegarde.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur réseau", "Impossible de sauvegarder les messages.");
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <Text style={styles.title}>Personnalise tes SMS !</Text>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "colis" && styles.activeTab]}
          onPress={() => setActiveTab("colis")}
        >
          <Text
            style={[styles.tabText, activeTab === "colis" && styles.activeTabText]}
          >
            COLIS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "absence" && styles.activeTab]}
          onPress={() => setActiveTab("absence")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "absence" && styles.activeTabText,
            ]}
          >
            ABSENCE
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        {activeTab === "colis" ? (
          <>
            {/* Réception colis */}
            <Text style={styles.label}>Réception colis</Text>
            <TextInput
              style={styles.textarea}
              value={receptionMessage}
              onChangeText={setReceptionMessage}
              multiline
              editable={isEditingReception}
              placeholder="Écris le message de réception"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingReception((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isEditingReception
                  ? "Valider le SMS de réception"
                  : "Modifier le SMS de réception"}
              </Text>
            </TouchableOpacity>

            {/* Relance client */}
            <Text style={[styles.label, { marginTop: 30 }]}>Relance client</Text>
            <TextInput
              style={styles.textarea}
              value={reminderMessage}
              onChangeText={setReminderMessage}
              multiline
              editable={isEditingReminder}
              placeholder="Écris le message de relance"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingReminder((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isEditingReminder
                  ? "Valider message de relance"
                  : "Modifier message de relance"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Absence urgente */}
            <Text style={styles.label}>Absence urgente</Text>
            <TextInput
              style={styles.textarea}
              value={absentUrgentMessage}
              onChangeText={setAbsentUrgentMessage}
              multiline
              editable={isEditingUrgent}
              placeholder="Écris le message d'absence urgente"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingUrgent((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isEditingUrgent
                  ? "Valider message urgence"
                  : "Modifier message urgence"}
              </Text>
            </TouchableOpacity>

            {/* Absence prévue */}
            <Text style={[styles.label, { marginTop: 30 }]}>Absence prévue</Text>
            <TextInput
              style={styles.textarea}
              value={absentPlannedMessage}
              onChangeText={setAbsentPlannedMessage}
              multiline
              editable={isEditingPlanned}
              placeholder="Écris le message d'absence prévue"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingPlanned((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isEditingPlanned
                  ? "Valider le SMS prévu"
                  : "Modifier le SMS prévu"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveMessages}>
          <Text style={styles.buttonSaveText}>SAUVEGARDER</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    color: "#4F378A",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#E4DFFF",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4F378A",
  },
  tabText: {
    color: "#4F378A",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  label: {
    color: "#4F378A",
    fontWeight: "600",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10,
  },
  textarea: {
    backgroundColor: "#D9D9D9",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 5,
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#D0BCFF",
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#4F378A",
    fontWeight: "600",
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4F378A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonSaveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});