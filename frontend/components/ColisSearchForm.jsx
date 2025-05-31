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
      if (searchMode === "tracking") {
        response = await fetch(`http://192.168.1.10:3000/colis/search/${trackingNumber}`);
      } else {
        response = await fetch("http://192.168.1.10:3000/colis/search/name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom, prenom }),
        });
      }

      data = await response.json();

      if (data.found) {
        setResult(`✅ ${Array.isArray(data.colis) ? data.colis.length : 1} colis trouvé(s)`);
        const colisArray = Array.isArray(data.colis) ? data.colis : [data.colis];
        setColisTrouves(colisArray);
      } else {
        setResult("❌ Aucun colis trouvé.");
        setColisTrouves([]);
      }

    } catch (error) {
      setResult("❌ Erreur lors de la recherche.");
      setColisTrouves([]);
    }
  };

  return (
    <View style={styles.container}>

      {/* Choix mode */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "tracking" && styles.active]}
          onPress={() => {
            setSearchMode("tracking");
            setResult("");
            setColisTrouves([]);
            setTrackingNumber(""); // facultatif mais propre
            setNom("");
            setPrenom("");
          }}
                  >
          <Text style={styles.switchText}>Numéro de suivi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "name" && styles.active]}
          onPress={() => {
            setSearchMode("name");
            setResult("");
            setColisTrouves([]);
            setTrackingNumber(""); // facultatif
            setNom("");
            setPrenom("");
          }}
                    
        >
          <Text style={styles.switchText}>Nom + Prénom</Text>
        </TouchableOpacity>
      </View>

      {/* Champs selon le mode */}
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

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        <Text style={styles.buttonText}>  Rechercher</Text>
      </TouchableOpacity>

      {result && <Text style={styles.result}>{result}</Text>}

      {colisTrouves.length > 0 && colisTrouves.map((colis, index) => (
        <View key={index} style={styles.colisCard}>
          <Text style={styles.colisText}>📦 {colis.trackingNumber}</Text>
          <Text style={styles.colisText}>👤 {colis.nom} {colis.prenom}</Text>
          <TouchableOpacity
            style={styles.relayButton}
            onPress={() => navigation.navigate("RelayInfoScreen", {
              relais: colis.relais
            })}
          >
            <Text style={styles.relayButtonText}>Voir les infos du point relais</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  active: {
    backgroundColor: "#6a0dad",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    width: '80%',
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#6a0dad",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  colisCard: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: '90%',
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  colisText: {
    fontSize: 16,
    marginBottom: 4,
  },
  relayButton: {
    backgroundColor: "#0F58B8",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  relayButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ColisSearchForm;
