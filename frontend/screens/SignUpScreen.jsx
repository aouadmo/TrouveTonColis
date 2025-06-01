import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header.jsx";

const SignUpScreen = () => {
  const [userType, setUserType] = useState("client");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    phone: "",
    phone2: "",
    nom_relais: "",
    adresse: "",
    ville: "",
    codePostal: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log("Formulaire soumis :", { ...form, type: userType });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ flex: 1 }}
      >
        <View style={styles.formWrapper}>
          {/* Switch client/pro */}
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                userType === "client" && styles.active,
              ]}
              onPress={() => setUserType("client")}
            >
              <Text style={styles.switchText}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchButton,
                userType === "pro" && styles.active,
              ]}
              onPress={() => setUserType("pro")}
            >
              <Text style={styles.switchText}>Pro</Text>
            </TouchableOpacity>
          </View>

          {/* Champs communs */}
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={form.nom}
            onChangeText={(v) => handleChange("nom", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={form.prenom}
            onChangeText={(v) => handleChange("prenom", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />

          {/* Champs pro */}
          {userType === "pro" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Téléphone pro"
                value={form.phone2}
                onChangeText={(v) => handleChange("phone2", v)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Nom du relais"
                value={form.nom_relais}
                onChangeText={(v) => handleChange("nom_relais", v)}
              />
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                value={form.adresse}
                onChangeText={(v) => handleChange("adresse", v)}
              />
              <TextInput
                style={styles.input}
                placeholder="Ville"
                value={form.ville}
                onChangeText={(v) => handleChange("ville", v)}
              />
              <TextInput
                style={styles.input}
                placeholder="Code Postal"
                keyboardType="numeric"
                value={form.codePostal}
                onChangeText={(v) => handleChange("codePostal", v)}
              />
            </>
          )}

          {/* Bouton */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <FontAwesomeIcon icon={faUserPlus} size={20} color="#fff" />
            <Text style={styles.buttonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  formWrapper: {
    flexGrow: 1,
    minHeight: Dimensions.get("window").height - 140, // pour forcer hauteur
    justifyContent: "flex-start", // ou "space-between" si bouton en bas
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  switchButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  active: {
    backgroundColor: "#ec6e5b",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SignUpScreen;
