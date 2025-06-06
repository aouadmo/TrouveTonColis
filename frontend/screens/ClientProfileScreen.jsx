import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux'; // 🔐 Pour récupérer le token
import Header from '../components/Header.jsx'; 

export default function ClientProfileScreen() {
  // 🔐 On récupère le token du user connecté depuis Redux
  const token = useSelector(state => state.user.value.token);
  console.log('📦 token récupéré :', token);

  // 🧠 On initialise les infos de l'utilisateur (état local)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    spouseName: '',
    email: '',
    loginEmail: '',
  });
useEffect(() => {
    if (!token) {
    console.log('❗ Aucun token, fetch annulé');
    return;
  }

  console.log('🎯 useEffect lancé avec token :', token);

  fetch(`http://192.168.1.10:3001/users/client/${token}`)
    .then(res => res.json())
    .then(data => {
      console.log('✅ Données reçues :', data);
      if (data.result && data.client) {
        const client = data.client;
        setUserData({
          firstName: client.prenom || '',
          lastName: client.nom || '',
          phone: client.phone || '',
          spouseName: client.spouseName || '',
          email: client.email || '',
          loginEmail: client.loginEmail || '',
        });
      }
    })
    .catch(err => {
      console.log('❌ Erreur lors du fetch :', err);
    });
}, []); // ⬅️ très important : ne pas mettre {} ici
    
  // 📤 Quand on clique sur "sauvegarder", on envoie les nouvelles données au backend
  const handleSave = () => {
    fetch('http://192.168.1.157:3001/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 🔐 Encore une fois, le token
      },
      body: JSON.stringify(userData), // On envoie toutes les infos modifiées
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert('✅ Succès', 'Modifications enregistrées !');
      })
      .catch(err => {
        Alert.alert('❌ Erreur', "Impossible d'enregistrer les modifications.");
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header /> {/* En-tête haut de page */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>👤 Profil Client</Text>

          {/* Nom et prénom côte à côte */}
          <View style={styles.row}>
            <View style={styles.block}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{userData.lastName}</Text>
            </View>
            <View style={styles.block}>
              <Text style={styles.label}>Prénom</Text>
              <Text style={styles.value}>{userData.firstName}</Text>
            </View>
          </View>

          {/* Téléphone modifiable */}
          <View style={styles.blockFull}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="06 01 02 03 04"
              value={userData.phone}
              onChangeText={text => setUserData({ ...userData, phone: text })}
            />
          </View>

          {/* Nom d'épouse modifiable */}
          <View style={styles.blockFull}>
            <Text style={styles.label}>Nom d'épouse (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Dupont"
              value={userData.spouseName}
              onChangeText={text => setUserData({ ...userData, spouseName: text })}
            />
          </View>

          {/* Email de contact modifiable */}
          <View style={styles.blockFull}>
            <Text style={styles.label}>Email de contact</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              keyboardType="email-address"
              value={userData.email}
              onChangeText={text => setUserData({ ...userData, email: text })}
            />
          </View>

          {/* Email de connexion modifiable */}
          <View style={styles.blockFull}>
            <Text style={styles.label}>Changer l'email de connexion</Text>
            <TextInput
              style={styles.input}
              placeholder="nouvel.email@connexion.com"
              keyboardType="email-address"
              value={userData.loginEmail}
              onChangeText={text => setUserData({ ...userData, loginEmail: text })}
            />
          </View>

          {/* Bouton de sauvegarde */}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>💾 Sauvegarder</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE9',
    padding: 16,
  },
  scroll: {
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  block: {
    flex: 1,
  },
  blockFull: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#4F378A',
  },
  value: {
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4F89E6',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
