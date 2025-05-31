import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchScreen = () => {
  const [searchMode, setSearchMode] = useState("tracking");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    // Si on est en mode "tracking", on appelle la route GET pour chercher le colis.
      if (searchMode === "tracking") {
        const response = await fetch(
          `http://192.168.1.10:3000/colis/search/${trackingNumber}`
        );
        const data = await response.json();

        if (data.found) {
          setResult(`✅ Colis bien livré pour ${data.colis.nom} ${data.colis.prenom}`);
        } else {
          setResult("❌ Colis non trouvé.");
        }
      } else {
        const response = await fetch(
          "http://192.168.1.10:3000/colis/search/name",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom }),
          }
        );
        const data = await response.json();

        if (data.found) {
          setResult(`✅ ${data.colis.length} Colis bien livré pour ${nom} ${prenom}`);
        } else {
          setResult("❌ Aucun colis à ce nom et prenom.");
        }
      }

  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <Text style={styles.title}>🔍 Rechercher un colis</Text>

      {/* Choix mode */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "tracking" && styles.active]}
          onPress={() => setSearchMode("tracking")}
        >
          <Text style={styles.switchText}>Numéro de suivi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, searchMode === "name" && styles.active]}
          onPress={() => setSearchMode("name")}
        >
          <Text style={styles.switchText}>Nom + Prénom</Text>
        </TouchableOpacity>
      </View>

      {/* Formulaire selon le mode */}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  active: {
    backgroundColor: "#0F58B8",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "blue",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SearchScreen;
