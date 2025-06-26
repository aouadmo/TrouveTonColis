import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const ColisSearchForm = () => {
  // States pour la recherche
  const [searchMode, setSearchMode] = useState("tracking");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [result, setResult] = useState("");
  const [colisTrouves, setColisTrouves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();

  // Gestion de la recherche
  const handleSearch = async () => {
    setIsLoading(true);
    let response;
    let data;

    try {
      if (searchMode === "tracking") {
        const cleanedTracking = trackingNumber.trim();
        response = await fetch(`http://192.168.1.10:3002/colis/search/${cleanedTracking}`);
      } else {
        const cleanedNom = nom.trim().toLowerCase();
        const cleanedPrenom = prenom.trim().toLowerCase();
        response = await fetch("http://192.168.1.10:3002/colis/searchname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: cleanedNom, prenom: cleanedPrenom }),
        });
      }

      data = await response.json();
      
      if (data.found) {
        setResult(`${Array.isArray(data.colis) ? data.colis.length : 1} colis trouvé(s)`);
        const colisArray = Array.isArray(data.colis) ? data.colis : [data.colis];
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

  // Changement de mode de recherche
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
      
      {/* Onglets de sélection */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "tracking" && styles.active]}
          onPress={() => switchSearchMode("tracking")}
          activeOpacity={0.8}
        >
          <Text style={styles.switchText}>Numéro de suivi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, searchMode === "name" && styles.active]}
          onPress={() => switchSearchMode("name")}
          activeOpacity={0.8}
        >
          <Text style={styles.switchText}>Nom + Prénom</Text>
        </TouchableOpacity>
      </View>

      {/* Champs de saisie */}
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
        activeOpacity={0.8}
      >
        <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </Text>
      </TouchableOpacity>

      {/* Résultat de la recherche */}
      {result && <Text style={styles.result}>{result}</Text>}

      {/* Liste des colis trouvés */}
      {colisTrouves.length > 0 && colisTrouves.map((colis, index) => (
        <View key={index} style={styles.colisCard}>
          <Text style={styles.colisText}>{colis.trackingNumber}</Text>
          <Text style={styles.colisText}>{colis.nom} {colis.prenom}</Text>
          <Text style={styles.statusText}>Disponible en point relais</Text>
          
          <TouchableOpacity
            style={styles.relayButton}
            onPress={() => navigation.navigate("RelayInfoScreen", { 
              relayId: colis.relais || '6841e0438bc7de726f971515' 
            })}
            activeOpacity={0.8}
          >
            <Text style={styles.relayButtonText}>📍 Voir les infos du point relais</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
    flex: 1,
  },
  
  // Onglets de sélection
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 12,
  },
  switchButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#D0BCFF", // Palette Neutre - Accent alternatif
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  active: {
    backgroundColor: "#B48DD3", // Palette Neutre - Boutons principaux
    shadowOpacity: 0.15,
    elevation: 4,
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  
  // Champs de saisie
  input: {
    borderColor: "#D0BCFF",
    borderWidth: 2,
    padding: 14,
    width: '90%',
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Bouton de recherche
  button: {
    backgroundColor: "#B48DD3", // Palette Neutre - Boutons principaux
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    minWidth: 160,
  },
  buttonDisabled: {
    backgroundColor: "#999",
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Résultat de recherche
  result: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#444444", // Palette Neutre - Texte principal
    fontWeight: "600",
  },
  
  // Cartes de colis
  colisCard: {
    marginTop: 12,
    padding: 18,
    borderRadius: 14,
    width: '95%',
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#79B4C4", // Palette Neutre - Accent secondaire
  },
  colisText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444444",
    fontWeight: "500",
  },
  statusText: {
    fontSize: 14,
    marginBottom: 12,
    color: "#79B4C4", // Palette Neutre - Accent secondaire
    fontStyle: "italic",
  },
  
  // Bouton point relais
  relayButton: {
    backgroundColor: "#B48DD3", // Palette Neutre - Boutons principaux
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  relayButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
});

export default ColisSearchForm;