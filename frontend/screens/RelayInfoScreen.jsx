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
  
  // Récupération de l'ID du point relais depuis les paramètres
  const relayId = route.params?.relayId || route.params?.relais?.id;
  
  // States
  const [relayData, setRelayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showHoraires, setShowHoraires] = useState(false);

  // Récupération des données du pro/point relais depuis la DB
  useEffect(() => {
    const fetchRelayData = async () => {
      try {
        setLoading(true);
        
        // Appel à votre API Express
        const response = await fetch(`http://VOTRE_IP:3000/pros/info/${relayId}`); // Remplacez par votre IP/URL
        const result = await response.json();
        
        if (result.result && result.data) {
          setRelayData(result.data);
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
      Alert.alert("Erreur", "Point relais non spécifié");
      navigation.goBack();
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
        // Pas d'alerte, la géolocalisation est optionnelle
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
          onPress: () => navigation.navigate('Register') // Adaptez selon votre navigation
        },
        { 
          text: "Se connecter", 
          onPress: () => navigation.navigate('Login') // Adaptez selon votre navigation
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
    <View style={{ flex: 1 }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📍 Infos Point Relais</Text>

        <View style={styles.card}>
          {/* Nom du point relais */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>🏠 Point Relais</Text>
            <Text style={styles.value}>{relayData.nomRelais}</Text>
          </View>

          {/* Adresse complète */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>📍 Adresse</Text>
            <Text style={styles.value}>{relayData.adresseComplete}</Text>
          </View>

          {/* Téléphone (seulement phone2 disponible) */}
          {relayData.phone2 && (
            <View style={styles.infoBox}>
              <Text style={styles.label}>📞 Téléphone</Text>
              <TouchableOpacity onPress={() => {
                const phoneNumber = `tel:${relayData.phone2}`;
                Linking.openURL(phoneNumber);
              }}>
                <Text style={[styles.value, styles.phoneLink]}>{relayData.phone2}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Horaires - Pour l'instant statiques car pas dans le schema */}
          <View style={styles.infoBox}>
            <TouchableOpacity 
              style={styles.horaireToggle}
              onPress={() => setShowHoraires(!showHoraires)}
            >
              <Text style={styles.label}>🕒 Horaires</Text>
              <Text style={styles.toggleIcon}>{showHoraires ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {showHoraires && (
              <View style={styles.horaireContent}>
                <Text style={styles.horaireText}>
                  Lundi - Vendredi : 9h00 - 18h00{'\n'}
                  Samedi : 9h00 - 12h00{'\n'}
                  Dimanche : Fermé{'\n\n'}
                  📞 Contactez le {relayData.phone2 || "point relais"} pour des horaires spéciaux
                </Text>
              </View>
            )}
          </View>

          {/* Infos pratiques */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>ℹ️ Infos pratiques</Text>
            <Text style={styles.value}>
              • Pièce d'identité obligatoire{'\n'}
              • SMS 10 min avant d'arriver{'\n'}
              • Colis gardé 15 jours maximum{'\n'}
              • Confirmation SMS après dépôt
            </Text>
          </View>

          {/* Chargement géolocalisation */}
          {locationLoading && (
            <View style={styles.geoLoading}>
              <Text style={styles.geoLoadingText}>📍 Calcul de l'itinéraire...</Text>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            {/* Bouton Itinéraire */}
            <TouchableOpacity
              style={styles.buttonItineraire}
              onPress={handleItineraire}
            >
              <Text style={styles.buttonText}>
                🗺️ {distanceInfo ? 'Itinéraire' : 'Voir sur la carte'}
              </Text>
            </TouchableOpacity>

            {/* Bouton Prise de RDV */}
            <TouchableOpacity
              style={styles.buttonRDV}
              onPress={handlePriseRDV}
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
    color: "#333",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#222",
    lineHeight: 22,
  },
  phoneLink: {
    color: "#5E4AE3",
    textDecorationLine: "underline",
  },
  horaireToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleIcon: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  horaireContent: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#5E4AE3",
  },
  horaireText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  geoLoading: {
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  geoLoadingText: {
    color: "#666",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  buttonItineraire: {
    backgroundColor: "#5E4AE3",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2,
  },
  buttonRDV: {
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
});

export default RelayInfoScreen;