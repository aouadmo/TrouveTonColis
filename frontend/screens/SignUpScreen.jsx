import React, { useState } from "react";
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header.jsx";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const SignUpScreen = () => {
  // States pour la gestion du formulaire
  const [userType, setUserType] = useState("client");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // État du formulaire
  const [form, setForm] = useState({
    nomRelais: '',
    prenom: '',
    nom: '',
    email: '',
    phoneConfirm: '',
    password: '',
    phone: '',
    phone2: '',
    adresse: '',
    ville: '',
    codePostal: '',
  });

  // Mise à jour des champs du formulaire
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Validation des données
  const validateForm = () => {
    // Vérification des champs obligatoires
    const requiredFields = ['prenom', 'nom', 'email', 'phone', 'password'];
    for (let field of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert('Erreur', `Le champ ${field} est obligatoire`);
        return false;
      }
    }

    // Vérification de la confirmation du téléphone
    if (form.phone !== form.phoneConfirm) {
      Alert.alert('Erreur', 'Les numéros de téléphone ne correspondent pas');
      return false;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Erreur', 'Format d\'email invalide');
      return false;
    }

    // Validation mot de passe
    if (form.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    // Champs supplémentaires pour les pros
    if (userType === 'pro') {
      const proFields = ['nomRelais', 'phone2', 'adresse', 'ville', 'codePostal'];
      for (let field of proFields) {
        if (!form[field].trim()) {
          Alert.alert('Erreur', `Le champ ${field} est obligatoire pour les professionnels`);
          return false;
        }
      }
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Configuration de l'URL selon le type d'utilisateur
      const url = userType === 'client' 
        ? `${API_URL}/users/signup` 
        : `${API_URL}/pros/signup`;

      // Préparation des données selon le type
      const payload = userType === 'client' ? {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim().toString(), // Forcé en string
      } : {
        nomRelais: form.nomRelais.trim(),
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim().toString(), // Forcé en string
        phone2: form.phone2.trim().toString(), // Forcé en string
        adresse: form.adresse.trim(),
        ville: form.ville.trim(),
        codePostal: form.codePostal.trim(),
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Connexion automatique après inscription
        dispatch(login({ 
          token: data.token, 
          isPro: userType === 'pro', 
          email: form.email.trim().toLowerCase() 
        }));

        // Navigation selon le type d'utilisateur
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
      } else {
        Alert.alert('Erreur', data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Créer un compte</Text>

        {/* Sélecteur de type d'utilisateur */}
        <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={[styles.switchButton, userType === "client" && styles.active]}
            onPress={() => setUserType("client")}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>Client</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.switchButton, userType === "pro" && styles.active]}
            onPress={() => setUserType("pro")}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>Professionnel</Text>
          </TouchableOpacity>
        </View>

        {/* Champ spécifique aux pros */}
        {userType === "pro" && (
          <TextInput 
            style={styles.input} 
            placeholder="Nom du Point Relais" 
            placeholderTextColor="#999"
            value={form.nomRelais} 
            onChangeText={(v) => handleChange("nomRelais", v)}
            autoCapitalize="words"
          />
        )}

        {/* Prénom et Nom */}
        <View style={styles.row}>
          <TextInput 
            style={styles.inputHalf} 
            placeholder="Prénom" 
            placeholderTextColor="#999"
            value={form.prenom} 
            onChangeText={(v) => handleChange("prenom", v)}
            autoCapitalize="words"
          />
          <TextInput 
            style={styles.inputHalf} 
            placeholder="Nom de famille" 
            placeholderTextColor="#999"
            value={form.nom} 
            onChangeText={(v) => handleChange("nom", v)}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <TextInput 
          style={styles.input} 
          placeholder="Adresse e-mail" 
          placeholderTextColor="#999"
          value={form.email} 
          onChangeText={(v) => handleChange("email", v)} 
          keyboardType="email-address" 
          autoCapitalize="none"
          autoComplete="email"
        />

        {/* Téléphone */}
        <TextInput 
          style={styles.input} 
          placeholder="Téléphone portable" 
          placeholderTextColor="#999"
          value={form.phone} 
          onChangeText={(v) => handleChange("phone", v)} 
          keyboardType="phone-pad"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Confirmation téléphone" 
          placeholderTextColor="#999"
          value={form.phoneConfirm} 
          onChangeText={(v) => handleChange("phoneConfirm", v)} 
          keyboardType="phone-pad"
        />

        {/* Champs spécifiques aux pros */}
        {userType === "pro" && (
          <>
            <TextInput 
              style={styles.input} 
              placeholder="Téléphone du point relais (obligatoire)" 
              placeholderTextColor="#999"
              value={form.phone2} 
              onChangeText={(v) => handleChange("phone2", v)} 
              keyboardType="phone-pad"
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="Adresse complète" 
              placeholderTextColor="#999"
              value={form.adresse} 
              onChangeText={(v) => handleChange("adresse", v)}
              autoCapitalize="words"
            />
            
            <View style={styles.row}>
              <TextInput 
                style={styles.inputHalf} 
                placeholder="Ville" 
                placeholderTextColor="#999"
                value={form.ville} 
                onChangeText={(v) => handleChange("ville", v)}
                autoCapitalize="words"
              />
              <TextInput 
                style={styles.inputHalf} 
                placeholder="Code postal" 
                placeholderTextColor="#999"
                value={form.codePostal} 
                onChangeText={(v) => handleChange("codePostal", v)} 
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </>
        )}

        {/* Mot de passe */}
        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe (min. 6 caractères)" 
          placeholderTextColor="#999"
          value={form.password} 
          onChangeText={(v) => handleChange("password", v)} 
          secureTextEntry
          autoComplete="new-password"
        />

        {/* Bouton de soumission */}
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faUserPlus} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Création en cours...' : 'Créer mon compte'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF", // Palette Neutre - Fond blanc
    flexGrow: 1,
    justifyContent: "center",
  },
  
  // Titre
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444444", // Palette Neutre - Texte principal
    textAlign: "center",
    marginBottom: 24,
  },
  
  // Champs de saisie
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputHalf: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Ligne pour les champs côte à côte
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  // Sélecteur de type d'utilisateur
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
  },
  switchButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
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
  
  // Bouton principal
  button: {
    backgroundColor: "#B48DD3", // Palette Neutre - Boutons principaux
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
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
});

export default SignUpScreen;