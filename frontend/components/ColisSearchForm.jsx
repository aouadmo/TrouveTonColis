// ColisSearchForm.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const ColisSearchForm = () => {
  const [searchMode, setSearchMode] = useState("tracking");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [result, setResult] = useState("");
  const [colisTrouves, setColisTrouves] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    let response;
    let data;

    try {
      // Nettoyage des entrées utilisateur
      if (searchMode === "tracking") {
        const cleanedTracking = trackingNumber.trim();
        response = await fetch(`http://192.168.1.10:3005/colis/search/${cleanedTracking}`);
      } else {
        const cleanedNom = nom.trim().toLowerCase();
        const cleanedPrenom = prenom.trim().toLowerCase();
        response = await fetch(`http://192.168.1.10:3005/colis/searchname`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: cleanedNom, prenom: cleanedPrenom }),
        });
      }

      data = await response.json();
      console.log("Données reçues:", data);

      if (data.found) {
        setResult(`✅ ${Array.isArray(data.colis) ? data.colis.length : 1} colis trouvé(s)`);
        const colisArray = Array.isArray(data.colis) ? data.colis : [data.colis];
        setColisTrouves(colisArray);
      } else {
        setResult("❌ Aucun colis trouvé.");
        setColisTrouves([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setResult("⚠️ Erreur lors de la recherche.");
      setColisTrouves([]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Onglets de recherche */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "tracking" && styles.active]}
          onPress={() => {
            setSearchMode("tracking");
            setTrackingNumber("");
            setNom("");
            setPrenom("");
            setResult("");
            setColisTrouves([]);
          }}
        >
          <Text style={styles.switchText}>Numéro de suivi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, searchMode === "name" && styles.active]}
          onPress={() => {
            setSearchMode("name");
            setTrackingNumber("");
            setNom("");
            setPrenom("");
            setResult("");
            setColisTrouves([]);
          }}
        >
          <Text style={styles.switchText}>Nom + Prénom</Text>
        </TouchableOpacity>
      </View>

      {/* Champs de recherche */}
      {searchMode === "tracking" ? (
        <TextInput
          style={styles.input}
          placeholder="Numéro de suivi"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
          />
        </>
      )}

      {/* Bouton de recherche */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        <Text style={styles.buttonText}>  Rechercher</Text>
      </TouchableOpacity>

      {/* Message résultat */}
      {result && <Text style={styles.result}>{result}</Text>}

      {/* Liste des colis */}
      {colisTrouves.length > 0 && colisTrouves.map((colis, index) => (
        <View key={index} style={styles.colisCard}>
          <Text style={styles.colisText}>📦 {colis.trackingNumber}</Text>
          <Text style={styles.colisText}>👤 {colis.nom} {colis.prenom}</Text>

          {/* Statut du colis */}
          <Text style={styles.colisStatus}>
            📍 Statut: Disponible en point relais
          </Text>
          
          {/* Bouton pour voir les infos du point relais */}
          <TouchableOpacity
            style={styles.relayButton}
            onPress={() => {
              console.log("Navigation vers RelayInfoScreen avec relayId:", colis.relais || '6841e0438bc7de726f971515');
              navigation.navigate('RelayInfoScreen', {
                relayId: colis.relais || '6841e0438bc7de726f971515'
              });
            }}
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
    backgroundColor: '#FFFCF2',
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#DCD6F2",
  },
  active: {
    backgroundColor: "#A79ABF",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderColor: "#D0BCFF",
    borderWidth: 1,
    padding: 12,
    width: '85%',
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#A79ABF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  result: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 14,
    color: "#4F378A",
    fontWeight: "600",
  },
  colisCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    width: '90%',
    backgroundColor: "#F3F0FC",
    alignItems: "center",
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  colisText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#3E3A6D",
    fontWeight: "500",
  },
  colisStatus: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666",
    fontStyle: "italic",
  },
  relayButton: {
    backgroundColor: "#0E56B4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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