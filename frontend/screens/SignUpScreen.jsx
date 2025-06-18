import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions,KeyboardAvoidingView, Platform,} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header.jsx";

const SignUpScreen = () => {
  const [userType, setUserType] = useState("client");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nomRelais: '',
    prenom: '',
    nom: '',
    email: '',
    phoneConfirm: '',
    password: '',
    phone: '',
    phone2:'',
    adresse: '',
    ville: '',
    codePostal: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (form.phone !== form.phoneConfirm) {
      alert("Les numéros de téléphone ne correspondent pas.");
      return;
    }

    const url = userType === 'client' ? 'http://192.168.1.10:3005/users/signup' : 'http://192.168.1.10:3005/pros/signup'; // <--- IP à modifier si besoin
    console.log(url);
    const payload = userType === 'client' ?
         {
            nom: form.nom,
            prenom: form.prenom,
            email: form.email,
            password: form.password,
            phone: form.phone,
          }
        : {
            nomRelais: form.nomRelais,
            prenom: form.prenom,
            nom: form.nom,
            email: form.email,
            password: form.password,
            phone: form.phone,
            phone2:form.phone,
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
    if (response.ok && data.token) {
      dispatch(login({ token: data.token, isPro: userType === 'pro', email: form.email }));
      if (userType === "client") {
        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigatorClient", params: { screen: "ProfilClient" } }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigatorPro", params: { screen: "TableauBord" } }],
        });        
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        <View style={styles.switchContainer}>
          <TouchableOpacity style={[styles.switchButton, userType === "client" && styles.active,]} onPress={() => setUserType("client")}>
            <Text style={styles.switchText}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.switchButton, userType === "pro" && styles.active, ]} onPress={() => setUserType("pro")}>
            <Text style={styles.switchText}>Pro</Text>
          </TouchableOpacity>
        </View>

        {userType === "pro" && (
          <TextInput style={styles.input} placeholder="Nom Point Relais" value={form.nomRelais} onChangeText={(v) => handleChange("nomRelais", v)} />)}

        <View style={styles.row}>
          <TextInput style={styles.inputHalf} placeholder="prénom" value={form.prenom} onChangeText={(v) => handleChange("prenom", v)}/>
          <TextInput style={styles.inputHalf} placeholder="Nom de Famille" value={form.nom} onChangeText={(v) => handleChange("nom", v)}/>
        </View>

        <TextInput style={styles.input} placeholder="E-mail" value={form.email} onChangeText={(v) => handleChange("email", v)} keyboardType="email-address" autoCapitalize="none"/>
        <TextInput style={styles.input} placeholder="téléphone portable" value={form.phone} onChangeText={(v) => handleChange("phone", v)} keyboardType="phone-pad"/>
        <TextInput style={styles.input} placeholder="Confirmation numéros de téléphone portable" value={form.phoneConfirm} onChangeText={(v) => handleChange("phoneConfirm", v)} keyboardType="phone-pad"/>

        {userType === "pro" && (
          <>
            <TextInput style={styles.input} placeholder="Phone Pro" value={form.phone2} onChangeText={(v) => handleChange("phone2", v)} keyboardType="phone-pad"/>
            <TextInput style={styles.input} placeholder="Adresse" value={form.adresse} onChangeText={(v) => handleChange("adresse", v)}/>
            <View style={styles.row}>
              <TextInput style={styles.inputHalf} placeholder="Ville" value={form.ville} onChangeText={(v) => handleChange("ville", v)}/>
              <TextInput style={styles.inputHalf} placeholder="Code Postal" value={form.codePostal} onChangeText={(v) => handleChange("codePostal", v)} keyboardType="numeric"/>
            </View>
          </>
        )}

        <TextInput style={styles.input} placeholder="Mot de passe" value={form.password} onChangeText={(v) => handleChange("password", v)} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <FontAwesomeIcon icon={faUserPlus} size={20} color="#fff" />
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF4ED",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D2C8D",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F1E6DE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  inputHalf: {
    backgroundColor: "#F1E6DE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    width: "48%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  active: {
    backgroundColor: "#4B1D9A",
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4B1D9A",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SignUpScreen;
