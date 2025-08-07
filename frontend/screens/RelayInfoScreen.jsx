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
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRelayInfo,
  clearRelayData,
} from "../reducers/horaires";

const API_URL = Constants.expoConfig.extra.API_URL;

const RelayInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Récupère l'objet colis complet s’il a été passé depuis la recherche
  const colis = route.params?.relais;

  // Redux
  const { relayData, loading, error } = useSelector(
    (state) => state.horaires
  );
  const userInfo = useSelector((state) => state.user.value);

  // States locaux
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showHoraires, setShowHoraires] = useState(false);

  // Id du relais : soit contenu dans colis, soit dans les params
  const relayId =
    colis?.relais || route.params?.relayId;

  // Fonction pour formater les horaires (matin/après-midi)
  const formatHoraires = (data) => {
    if (data.ferme) return "Fermé";
    const formatCreneau = (creneau) => {
      if (
        creneau.ferme ||
        !creneau.ouverture ||
        !creneau.fermeture
      )
        return null;
      return `${creneau.ouverture} - ${creneau.fermeture}`;
    };
    const matin = formatCreneau(data.matin);
    const apresMidi = formatCreneau(data.apresMidi);
    if (matin && apresMidi) return `${matin} / ${apresMidi}`;
    if (matin) return `${matin} / Fermé l'après-midi`;
    if (apresMidi)
      return `Fermé le matin / ${apresMidi}`;
    return "Fermé";
  };

  // Gestion du clic sur le bouton "Prendre RDV"
  const handlePriseRDV = () => {
    const tracking =
      colis?.trackingNumber ||
      route.params?.trackingNumber;
    const colisId = colis?._id || route.params?.colisId;

    if (!userInfo?.token) {
      Alert.alert(
        "Connexion requise",
        "Connectez-vous pour prendre rendez-vous",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se connecter",
            onPress: () =>
              navigation.navigate("LoginScreen"),
          },
        ]
      );
    } else if (userInfo?.isPro) {
      Alert.alert(
        "Accès réservé",
        "Seuls les clients peuvent prendre rendez-vous."
      );
    } else {
      console.log(
        "🚀 Navigation vers ClientCrenauxScreen avec :",
        {
          relayId,
          trackingNumber: tracking,
          colisId,
        }
      );
      navigation.navigate("ClientCrenauxScreen", {
        relayId,
        trackingNumber: tracking,
        colisId,
      });
    }
  };

  // Charge les informations du relais via Redux
  useEffect(() => {
    if (relayId) {
      dispatch(fetchRelayInfo(relayId));
    } else {
      Alert.alert("Erreur", "Point relais non spécifié", [
        {
          text: "Retour",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
    return () => {
      dispatch(clearRelayData());
    };
  }, [relayId, dispatch]);

  // Gestion des erreurs de fetch
  useEffect(() => {
    if (error) {
      Alert.alert("Erreur", error, [
        {
          text: "Retour",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [error, navigation]);

  // Calcule la distance pour l'itinéraire
  useEffect(() => {
    if (!relayData?.adresseComplete) return;
    const getDistance = async () => {
      try {
        setLocationLoading(true);
        const serviceEnabled =
          await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) return;
        let { status } =
          await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: requestStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (requestStatus !== "granted") return;
        }
        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 15000,
            maximumAge: 60000,
          });
        const { latitude, longitude } = location.coords;
        setDistanceInfo({
          userCoords: `${latitude},${longitude}`,
          destination: encodeURIComponent(
            relayData.adresseComplete
          ),
        });
      } catch (error) {
        console.log(
          "Erreur géolocalisation:",
          error
        );
      } finally {
        setLocationLoading(false);
      }
    };
    getDistance();
  }, [relayData?.adresseComplete]);

  // Appel téléphonique
  const handleCall = () => {
    if (!relayData?.phone2) {
      Alert.alert(
        "Erreur",
        "Numéro de téléphone non disponible"
      );
      return;
    }
    Linking.openURL(`tel:${relayData.phone2}`);
  };

  // Lien Google Maps
  const handleItineraire = () => {
    if (!relayData?.adresseComplete) {
      Alert.alert(
        "Erreur",
        "Adresse non disponible"
      );
      return;
    }
    const url = distanceInfo
      ? `https://www.google.com/maps/dir/?api=1&origin=${distanceInfo.userCoords}&destination=${distanceInfo.destination}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          relayData.adresseComplete
        )}`;
    Linking.openURL(url);
  };

  // Affichage en cas de chargement
  if (loading) {
    return (
      <View style={styles.fullContainer}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Chargement des informations…
          </Text>
        </View>
      </View>
    );
  }

  // Si aucune donnée
  if (!relayData) {
    return (
      <View style={styles.fullContainer}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Point relais introuvable
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>
              Retour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Rendu principal
  return (
    <View style={styles.fullContainer}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Informations Point Relais
        </Text>

        <View style={styles.card}>
          {/* Nom du relais */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Point Relais</Text>
            <Text style={styles.label}>
              {relayData.nomRelais || "Point Relais"}
            </Text>
          </View>

          {/* Adresse */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.label}>
              {relayData.adresseComplete ||
                "84 rue Gambetta, 45140 St Jean de la Ruelle"}
            </Text>
          </View>

          {/* Téléphone */}
          {relayData.phone2 && (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Téléphone</Text>
              <TouchableOpacity onPress={handleCall}>
                <Text
                  style={[
                    styles.value,
                    styles.phoneLink,
                  ]}
                >
                  {relayData.phone2}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Horaires */}
          <View style={styles.infoBox}>
            <TouchableOpacity
              style={styles.horaireToggle}
              onPress={() =>
                setShowHoraires(!showHoraires)
              }
            >
              <Text style={styles.label}>
                Horaires
              </Text>
              <Text style={styles.toggleIcon}>
                {showHoraires ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {showHoraires &&
              relayData.horaires && (
                <View style={styles.horaireContent}>
                  {Object.entries(
                    relayData.horaires
                  ).map(([jour, data]) => (
                    <Text
                      key={jour}
                      style={styles.horaireText}
                    >
                      <Text
                        style={styles.horaireBold}
                      >
                        {jour
                          .charAt(0)
                          .toUpperCase() +
                          jour.slice(1)}
                        :
                      </Text>{" "}
                      {formatHoraires(data)}
                    </Text>
                  ))}
                </View>
              )}
          </View>

          {/* Informations pratiques */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>
              Informations pratiques
            </Text>
            <Text style={styles.value}>
              🆔 Pièce d'identité obligatoire{"\n"}
              📱 SMS 10 min avant d'arriver{"\n"}
              📧 Reçu par SMS après dépôt possible
            </Text>
          </View>

          {/* Géolocalisation en cours */}
          {locationLoading && (
            <View style={styles.geoLoading}>
              <Text style={styles.geoLoadingText}>
                📍 Calcul de l'itinéraire...
              </Text>
            </View>
          )}

          {/* Boutons actions */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleItineraire}
            >
              <Text style={styles.buttonText}>
                🗺️{" "}
                {distanceInfo ? "Itinéraire" : "Carte"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.rdvButton,
              ]}
              onPress={handlePriseRDV}
            >
              <Text style={styles.buttonText}>
                📅 Prendre RDV
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Conteneurs
  fullContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  // Textes principaux
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#444444",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  phoneLink: {
    color: "#B48DD3",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  // Carte d'informations
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#B48DD3",
  },
  infoBox: {
    marginBottom: 18,
  },
  // Horaires
  horaireToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  toggleIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#79B4C4",
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
    color: "#444",
    lineHeight: 22,
  },
  horaireBold: {
    fontWeight: "bold",
    color: "#333",
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
    fontSize: 14,
    color: "#79B4C4",
  },
  // Boutons
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
  backButton: {
    backgroundColor: "#B48DD3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  // Textes d'état
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default RelayInfoScreen;
