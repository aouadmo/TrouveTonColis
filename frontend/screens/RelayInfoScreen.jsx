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
  const { relais } = route.params;

  const [distanceInfo, setDistanceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHoraires, setShowHoraires] = useState(false);

  // Récupération de la position de l’utilisateur dès le chargement de la page
  useEffect(() => {
    const getDistance = async () => {
      try {
        setLoading(true);

        // Demande d'autorisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission refusée", "Autorise la localisation !");
          return;
        }

        // Coordonnées actuelles
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const userCoords = `${latitude},${longitude}`;
        const destination = encodeURIComponent(relais.adresse);

        setDistanceInfo({ userCoords, destination });
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Impossible de récupérer la position.");
      } finally {
        setLoading(false);
      }
    };

    getDistance();
  }, []);

  // Ouvre Google Maps avec itinéraire
  const handleItineraire = () => {
    if (!distanceInfo) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${distanceInfo.userCoords}&destination=${distanceInfo.destination}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📍 Infos Point Relais</Text>

        <View style={styles.card}>
          {/* Nom du relais */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>🏠 Nom :</Text>
            <Text style={styles.value}>{relais.nom}</Text>
          </View>

          {/* Adresse */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>📍 Adresse :</Text>
            <Text style={styles.value}>{relais.adresse}</Text>
          </View>

          {/* Horaires affichés en toggle */}
          <View style={styles.infoBox}>
            <TouchableOpacity onPress={() => setShowHoraires(!showHoraires)}>
              <Text style={styles.label}>🕒 Horaires {showHoraires ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {showHoraires && (
              <Text style={styles.value}>
                {relais.horaires?.replace(/<br\/>/g, '\n')}
              </Text>
            )}
          </View>

          {/* Infos pratiques */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>ℹ️ Infos pratiques :</Text>
            <Text style={styles.value}>
              {relais.infos?.replace(/<br\/>/g, '\n')}
            </Text>
          </View>

          {/* Chargement de la position */}
          {loading && (
            <Text style={{ marginTop: 10, color: "#666" }}>
              ⏳ Récupération de la position...
            </Text>
          )}

          {/* Bouton Prendre RDV (inactif pour l’instant) */}
          <TouchableOpacity style={styles.buttonInactive} onPress={() => {}}>
            <Text style={styles.buttonText}>📅 Prendre RDV</Text>
          </TouchableOpacity>

          {/* Bouton vers Google Maps */}
          <TouchableOpacity
            style={styles.buttonItineraire}
            onPress={handleItineraire}
            disabled={!distanceInfo}
          >
            <Text style={styles.buttonText}>🗺️ Itinéraire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    elevation: 3,
    marginBottom: 30,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#222",
    marginTop: 4,
  },
  buttonInactive: {
    marginTop: 30,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonItineraire: {
    marginTop: 16,
    backgroundColor: "#5E4AE3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RelayInfoScreen;
