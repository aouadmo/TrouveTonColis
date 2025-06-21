import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { Linking } from "react-native";
import Header from "../components/Header";

const RelayInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Récupération de l'ID du point relais depuis les paramètres de navigation
  const relayId = route.params?.relayId || route.params?.pointRelaisId;
  
  // States
  const [relayData, setRelayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showHoraires, setShowHoraires] = useState(false);

  console.log("RelayInfoScreen - relayId reçu:", relayId);

  // Récupération des données du pro/point relais depuis la DB
  useEffect(() => {
    const fetchRelayData = async () => {
      try {
        setLoading(true);
        
        // Appel à votre API Express avec l'ID du point relais
        const response = await fetch(`http://192.168.1.10:3005/pros/info/${relayId}`);
        const result = await response.json();
        
        console.log("Fetch result:", result);
        
        if (result.result && result.data) {
          // Formatage de l'adresse complète
          const adresseComplete = `${result.data.adresse}, ${result.data.ville} ${result.data.codePostal}`;
          
          setRelayData({
            ...result.data,
            adresseComplete: adresseComplete
          });
        } else {
          throw new Error(result.error || 'Erreur lors de la récupération des données');
        }
      } catch (error) {
        console.error("Erreur fetch pro:", error);
        Alert.alert(
          "Erreur", 
          "Impossible de charger les informations du point relais.",
          [
            { text: "Retour", onPress: () => navigation.goBack() }
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    if (relayId) {
      fetchRelayData();
    } else {
      Alert.alert("Erreur", "Point relais non spécifié", [
        { text: "Retour", onPress: () => navigation.goBack() }
      ]);
    }
  }, [relayId]);

  // Récupération de la position utilisateur pour l'itinéraire
  useEffect(() => {
    if (!relayData?.adresseComplete) return;

    const getDistance = async () => {
      try {
        setLocationLoading(true);

        // Vérifier les services de localisation
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) return;

        // Vérifier les permissions
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
          if (requestStatus !== "granted") return;
          status = requestStatus;
        }

        // Récupérer la position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000,
          maximumAge: 60000,
        });

        const { latitude, longitude } = location.coords;
        const userCoords = `${latitude},${longitude}`;
        const destination = encodeURIComponent(relayData.adresseComplete);

        setDistanceInfo({ userCoords, destination });
        
      } catch (error) {
        console.log("Géolocalisation non disponible:", error);
      } finally {
        setLocationLoading(false);
      }
    };

    getDistance();
  }, [relayData?.adresseComplete]);

  // Fonction pour appeler le point relais
  const handleCall = () => {
    if (!relayData?.phone2) {
      Alert.alert("Erreur", "Numéro de téléphone non disponible");
      return;
    }
    const phoneNumber = `tel:${relayData.phone2}`;
    Linking.openURL(phoneNumber);
  };

  // Ouvre Google Maps avec itinéraire
  const handleItineraire = () => {
    if (!relayData?.adresseComplete) {
      Alert.alert("Erreur", "Adresse non disponible");
      return;
    }

    if (distanceInfo) {
      // Avec position utilisateur
      const url = `https://www.google.com/maps/dir/?api=1&origin=${distanceInfo.userCoords}&destination=${distanceInfo.destination}&travelmode=driving`;
      Linking.openURL(url);
    } else {
      // Sans position utilisateur
      const destination = encodeURIComponent(relayData.adresseComplete);
      const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
      Linking.openURL(url);
    }
  };

  // Gestion de la prise de RDV pour les visiteurs
  const handlePriseRDV = () => {
    Alert.alert(
      "Prendre rendez-vous", 
      "Pour prendre rendez-vous, vous devez créer un compte client.",
      [
        { text: "Annuler" },
        { 
          text: "Créer un compte", 
          onPress: () => navigation.navigate('Register')
        },
        { 
          text: "Se connecter", 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  // Affichage du loading
  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>⏳ Chargement des informations...</Text>
        </View>
      </View>
    );
  }

  // Affichage d'erreur si pas de données
  if (!relayData) {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Point relais introuvable</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFCE9" }}>
      <Header />

      <View style={styles.container}>
        {/* Titre compact */}
        <Text style={styles.title}>📍 Infos Point Relais</Text>

        <View style={styles.card}>
          {/* Nom du point relais */}
          <View style={styles.compactInfoBox}>
            <Text style={styles.compactLabel}>🏠 Point Relais</Text>
            <Text style={styles.compactValue}>{relayData.nomRelais}</Text>
          </View>

          {/* Adresse complète */}
          <View style={styles.compactInfoBox}>
            <Text style={styles.compactLabel}>📍 Adresse</Text>
            <Text style={styles.compactValue}>{relayData.adresseComplete}</Text>
          </View>

          {/* Téléphone */}
          {relayData.phone2 && (
            <View style={styles.compactInfoBox}>
              <Text style={styles.compactLabel}>📞 Téléphone</Text>
              <TouchableOpacity onPress={handleCall}>
                <Text style={[styles.compactValue, styles.phoneLink]}>{relayData.phone2}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Horaires compacts */}
          <View style={styles.compactInfoBox}>
            <TouchableOpacity 
              style={styles.compactHoraireToggle}
              onPress={() => setShowHoraires(!showHoraires)}
            >
              <Text style={styles.compactLabel}>🕒 Horaires</Text>
              <Text style={styles.toggleIcon}>{showHoraires ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {!showHoraires && (
              <Text style={styles.compactValue}>Cliquez pour voir les horaires</Text>
            )}
          </View>

          {/* Détails horaires (si affiché) */}
          {showHoraires && (
            <View style={styles.horaireDetails}>
              <Text style={styles.horaireText}>
                Lundi-Vendredi : 10:00-16:00 // 21h45-22h00{'\n'}
                Mardi : 10:00-20:00{'\n'}
                Samedi : 14h00-17h00{'\n'}
                Dimanche : Fermé
              </Text>
            </View>
          )}

          {/* Infos pratiques */}
          <View style={styles.compactInfoBox}>
            <Text style={styles.compactLabel}>ℹ️ Infos pratiques</Text>
            <Text style={styles.compactValue}>
              • Pièce d'identité obligatoire ORIGINALE (pas sur photo){'\n'}
              • SMS 10 min avant d'arriver{'\n'}
              • Reçu SMS après dépôt possible{'\n'}
              • procuration si nécéssaire sur mon numéros {'\n'}
            </Text>
          </View>

          {/* Indicateur géolocalisation */}
          {locationLoading && (
            <View style={styles.geoIndicator}>
              <Text style={styles.geoText}>📍 Calcul de l'itinéraire...</Text>
            </View>
          )}

          {/* Boutons d'action en ligne */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleItineraire}
            >
              <Text style={styles.actionButtonText}>
                🗺️ {distanceInfo ? 'Y aller' : 'Localiser'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rdvButton]}
              onPress={handlePriseRDV}
            >
              <Text style={styles.actionButtonText}>📅 Prendre RDV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#5E4AE3",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginHorizontal: 4,
  },
  compactInfoBox: {
    marginBottom: 12,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5E4AE3",
    marginBottom: 4,
  },
  compactValue: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  phoneLink: {
    color: "#0E56B4",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  compactHoraireToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  toggleIcon: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  horaireDetails: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#5E4AE3",
  },
  horaireText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  geoIndicator: {
    backgroundColor: "#E8F5E8",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  geoText: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#5E4AE3",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rdvButton: {
    backgroundColor: "#0E56B4",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCE9",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCE9",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RelayInfoScreen;