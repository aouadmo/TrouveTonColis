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
import Constants from 'expo-constants';
import { navigate } from "../navigation/navigationRef";

const API_URL = Constants.expoConfig.extra.API_URL;

const RelayInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();


  // Récupération de l'ID du point relais
  const relayId = route.params?.relayId || route.params?.relais?.id;
  const handlePriseRDV = () => {
    navigate("ClientCrenauxScreen" , {params: { relayId: relayId } });

    // navigate("ClientNavigation" , {screen: 'ClientCrenauxScreen',  params: { relayId: relayId } });
  }

  // States pour la gestion des données
  const [relayData, setRelayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showHoraires, setShowHoraires] = useState(false);

  // Récupération des données du point relais
  useEffect(() => {
    const fetchRelayData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/pros/info/${relayId}`);
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
          [{ text: "Retour", onPress: () => navigation.goBack() }]
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
  }, [relayId, navigation]);

  // Récupération de la géolocalisation pour l'itinéraire
  useEffect(() => {
    if (!relayData?.adresseComplete) return;

    const getDistance = async () => {
      try {
        setLocationLoading(true);

        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) return;

        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
          if (requestStatus !== "granted") return;
          status = requestStatus;
        }

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

  // Appel téléphonique
  const handleCall = () => {
    if (!relayData?.phone2) {
      Alert.alert("Erreur", "Numéro de téléphone non disponible");
      return;
    }
    const phoneNumber = `tel:${relayData.phone2}`;
    Linking.openURL(phoneNumber);
  };

  // Ouverture de Google Maps
  const handleItineraire = () => {
    if (!relayData?.adresseComplete) {
      Alert.alert("Erreur", "Adresse non disponible");
      return;
    }

    if (distanceInfo) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${distanceInfo.userCoords}&destination=${distanceInfo.destination}&travelmode=driving`;
      Linking.openURL(url);
    } else {
      const destination = encodeURIComponent(relayData.adresseComplete);
      const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
      Linking.openURL(url);
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <View style={styles.fullContainer}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des informations...</Text>
        </View>
      </View>
    );
  }

  // Affichage d'erreur
  if (!relayData) {
    return (
      <View style={styles.fullContainer}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Point relais introuvable</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Informations Point Relais</Text>

        <View style={styles.card}>
          {/* Nom du point relais */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Point Relais</Text>
            <Text style={styles.value}>{relayData.nomRelais}</Text>
          </View>

          {/* Adresse */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.value}>{relayData.adresseComplete}</Text>
          </View>

          {/* Téléphone */}
          {relayData.phone2 && (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Téléphone</Text>
              <TouchableOpacity onPress={handleCall} activeOpacity={0.8}>
                <Text style={[styles.value, styles.phoneLink]}>{relayData.phone2}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Horaires */}
          <View style={styles.infoBox}>
            <TouchableOpacity
              style={styles.horaireToggle}
              onPress={() => setShowHoraires(!showHoraires)}
              activeOpacity={0.8}
            >
              <Text style={styles.label}>Horaires</Text>
              <Text style={styles.toggleIcon}>{showHoraires ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showHoraires && (
              <View style={styles.horaireContent}>
                <Text style={styles.horaireText}>
                  <Text style={styles.horaireBold}>Lundi - Vendredi :</Text> 10h00 - 16h00{'\n'}
                  <Text style={styles.horaireBold}> puis :</Text> 21h45 - 22h00 (sauf vendredi){'\n'}
                  <Text style={styles.horaireBold}>Mardi :</Text> 10h00 - 20h00{'\n'}
                  <Text style={styles.horaireBold}>Samedi :</Text> 14h00 - 17h00{'\n'}
                  <Text style={styles.horaireBold}>Dimanche :</Text> Fermé{'\n\n'}
                  <Text style={styles.horaireNote}>
                    💬 Contactez le {relayData.phone2 || "point relais"} pour toute autre demande
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Informations pratiques */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Informations pratiques</Text>
            <Text style={styles.value}>
              🆔 Pièce d'identité obligatoire{'\n'}
              📱 SMS 10 min avant d'arriver{'\n'}
              📧 Reçu par SMS après dépôt possible
            </Text>
          </View>

          {/* Indicateur géolocalisation */}
          {locationLoading && (
            <View style={styles.geoLoading}>
              <Text style={styles.geoLoadingText}>📍 Calcul de l'itinéraire...</Text>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleItineraire}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                🗺️ {distanceInfo ? 'Itinéraire' : 'Voir sur la carte'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rdvButton]}
              onPress={handlePriseRDV}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>📅 Prendre RDV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container principal
  fullContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
  },

  // Titre principal
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#444444",
  },

  // Carte principale
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#B48DD3",
  },

  // Boîtes d'information
  infoBox: {
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444444",
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 22,
  },

  phoneLink: {
    color: "#B48DD3",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  // Section horaires
  horaireToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  toggleIcon: {
    fontSize: 16,
    color: "#79B4C4",
    fontWeight: "bold",
  },

  horaireContent: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#79B4C4",
  },

  horaireText: {
    fontSize: 15,
    color: "#444444",
    lineHeight: 22,
  },

  horaireBold: {
    fontWeight: "bold",
    color: "#333333",
  },

  horaireNote: {
    fontStyle: "italic",
    color: "#666666",
    fontSize: 14,
  },

  // Géolocalisation
  geoLoading: {
    padding: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },

  geoLoadingText: {
    color: "#79B4C4",
    fontSize: 14,
  },

  // Boutons d'action
  buttonContainer: {
    marginTop: 24,
    gap: 14,
  },

  actionButton: {
    backgroundColor: "#B48DD3",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  rdvButton: {
    backgroundColor: "#79B4C4",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  // États de chargement et d'erreur
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    fontSize: 16,
    color: "#666666",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 20,
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#B48DD3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default RelayInfoScreen;