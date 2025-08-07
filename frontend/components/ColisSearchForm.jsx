import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.API_URL;

const ColisSearchForm = () => {
  const [searchMode, setSearchMode] = useState("tracking");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [result, setResult] = useState("");
  const [colisTrouves, setColisTrouves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Recherche par numéro ou nom/prénom
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchMode === "tracking") {
        const cleanedTracking = trackingNumber.trim();
        response = await fetch(`${API_URL}/colis/search/${cleanedTracking}`);
      } else {
        const cleanedNom = nom.trim().toLowerCase();
        const cleanedPrenom = prenom.trim().toLowerCase();
        response = await fetch(`${API_URL}/colis/searchname`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: cleanedNom, prenom: cleanedPrenom }),
        });
      }

      const data = await response.json();
      if (data.found) {
        const colisArray = Array.isArray(data.colis) ? data.colis : [data.colis];
        setResult(`${colisArray.length} colis trouvé(s)`);
        setColisTrouves(colisArray);
      } else {
        setResult("Aucun colis trouvé.");
        setColisTrouves([]);
      }
    } catch (error) {
      setResult("Erreur lors de la recherche.");
      setColisTrouves([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Basculer entre recherche tracking ou nom/prénom
  const switchSearchMode = (mode) => {
    setSearchMode(mode);
    setTrackingNumber("");
    setNom("");
    setPrenom("");
    setResult("");
    setColisTrouves([]);
  };

  return (
    <View style={styles.container}>
      {/* Mode de recherche */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "tracking" && styles.active]}
          onPress={() => switchSearchMode("tracking")}
        >
          <Text style={styles.switchText}>Numéro de suivi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "name" && styles.active]}
          onPress={() => switchSearchMode("name")}
        >
          <Text style={styles.switchText}>Nom + Prénom</Text>
        </TouchableOpacity>
      </View>

      {/* Champs de recherche */}
      {searchMode === "tracking" ? (
        <TextInput
          style={styles.input}
          placeholder="Numéro de suivi"
          placeholderTextColor="#999"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          autoCapitalize="none"
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#999"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#999"
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
          />
        </>
      )}

      {/* Bouton de recherche */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
            <Text style={styles.buttonText}>Rechercher</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Résultat de la recherche */}
      {result !== "" && <Text style={styles.result}>{result}</Text>}

      {/* Cartes de colis trouvés */}
      {colisTrouves.map((colis, index) => (
        <View key={index} style={styles.colisCard}>
          <Text style={styles.colisText}>{colis.trackingNumber}</Text>
          <Text style={styles.colisText}>{colis.nom} {colis.prenom}</Text>
          <Text style={styles.statusText}>Disponible en point relais</Text>

          <TouchableOpacity
            style={styles.relayButton}
            onPress={() => navigation.navigate("RelayInfoScreen", { 
              relayId: colis.relais || '6841e0438bc7de726f971515',
              trackingNumber: colis.trackingNumber
            })}
            activeOpacity={0.8}
          >
            <Text style={styles.relayButtonText}>
              📍 Voir les infos du point relais
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Conteneur général
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  // Onglets de mode de recherche
  switchContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  switchButton: {
    backgroundColor: "#D0BCFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#D0BCFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  active: {
    backgroundColor: "#B48DD3",
    shadowOpacity: 0.15,
    elevation: 4,
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Champs de saisie
  input: {
    width: "90%",
    borderColor: "#D0BCFF",
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  // Bouton de recherche
  button: {
    backgroundColor: "#B48DD3",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#B48DD3",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Texte du résultat
  result: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#444444",
    fontWeight: "600",
  },
  // Carte individuelle de colis
  colisCard: {
    width: "90%",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#79B4C4",
  },
  colisText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  statusText: {
    fontSize: 14,
    marginBottom: 12,
    color: "#79B4C4",
    fontStyle: "italic",
    marginBottom: 10,
  },
  // Bouton vers le point relais
  relayButton: {
    backgroundColor: "#B48DD3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  relayButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ColisSearchForm;
