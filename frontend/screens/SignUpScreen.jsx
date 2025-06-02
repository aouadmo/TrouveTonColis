import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const [userType, setUserType] = useState("client");
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  const handleSubmit = async () => {
    console.log("Formulaire soumis :", { ...form, type: userType });

    const url = userType === 'client' ? 'http://192.168.1.191:3000/users/signup' : 'http://192.168.1.191:3000/pros/signup';
    console.log(url);
    const payload = userType === 'client' ?
      {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        phone: form.phone,

      } : {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        phone: form.phone,
        phone2: form.phone2,
        nomRelais: form.nom_relais,
        adresse: form.adresse,
        ville: form.ville,
        codePostal: form.codePostal,
      };
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      
    const data = await response.json();
    console.log(data);
    if (response.ok && data.token) {
      dispatch(login({ token: data.token, role: userType }));
      // navigation.reset sert à vider l'historique afin que si l'utilisateur utilise le bouton retour, qu'il reste dans la route nommée
      if (userType === "client") {
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigationClient' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigationPro' }],
        });
      }
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Switch boutons */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, userType === "client" && styles.active]}
          onPress={() => setUserType("client")}
        >
          <Text style={styles.switchText}>Client</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, userType === "pro" && styles.active]}
          onPress={() => setUserType("pro")}
        >
          <Text style={styles.switchText}>Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Champs communs */}
      <TextInput style={styles.input} placeholder="Nom" value={form.nom} onChangeText={(v) => handleChange("nom", v)} />
      <TextInput style={styles.input} placeholder="Prénom" value={form.prenom} onChangeText={(v) => handleChange("prenom", v)} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(v) => handleChange("email", v)} />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={form.password} onChangeText={(v) => handleChange("password", v)} />
      <TextInput style={styles.input} placeholder="Téléphone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => handleChange("phone", v)} />

      {/* Champs PRO */}
      {userType === "pro" && (
        <>
          <TextInput style={styles.input} placeholder="Téléphone pro" value={form.phone2} onChangeText={(v) => handleChange("phone2", v)} />
          <TextInput style={styles.input} placeholder="Nom du relais" value={form.nom_relais} onChangeText={(v) => handleChange("nom_relais", v)} />
          <TextInput style={styles.input} placeholder="Adresse" value={form.adresse} onChangeText={(v) => handleChange("adresse", v)} />
          <TextInput style={styles.input} placeholder="Ville" value={form.ville} onChangeText={(v) => handleChange("ville", v)} />
          <TextInput style={styles.input} placeholder="Code Postal" keyboardType="numeric" value={form.codePostal} onChangeText={(v) => handleChange("codePostal", v)} />
        </>
      )}

      {/* Bouton (juste l'apparence) */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <FontAwesomeIcon icon={faUserPlus} size={20} color="#fff" />
        <Text style={styles.buttonText}> Créer un compte </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#fff",
    alignItems: "center",
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
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
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
    backgroundColor: "#ec6e5b",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SignUpScreen;
