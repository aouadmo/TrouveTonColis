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
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header.jsx';
import { updateClientProfile } from '../reducers/userProfile';

export default function ClientProfileScreen() {
  const token = useSelector(state => state.user.value.token);
  const userData = useSelector(state => state.userProfile.value);
  const dispatch = useDispatch();

  const [editedData, setEditedData] = useState(userData);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`http://192.168.1.10:3006/users/client/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data?.result && data?.client) {
          const { prenom, nom, phone, email, loginEmail } = data.client;

          const newProfile = {
            firstName: prenom || '',
            lastName: nom || '',
            phone: phone?.toString() || '',
            email: email || '',
            loginEmail: loginEmail || '',
          };

          dispatch(updateClientProfile(newProfile));
          setEditedData(newProfile);
        } else {
          console.warn('⚠️ Données client manquantes ou format inattendu :', data);
        }
      })
      .catch(err => {
        console.log('❌ Erreur fetch client :', err);
      });
  }, []);

  const handleSave = () => {
    fetch('http://192.168.1.10:3006/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          Alert.alert('✅ Succès', 'Modifications enregistrées avec succès !');
          dispatch(updateClientProfile(editedData));
          setIsEditable(false);
        } else {
          Alert.alert('❌ Erreur', data.error || 'Une erreur est survenue');
        }
      })
      .catch(err => {
        Alert.alert('❌ Erreur réseau', "Impossible de contacter le serveur.");
        console.log('Erreur lors de la sauvegarde :', err);
      });
  };

  const handleMainButton = () => {
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>👤 Profil Client</Text>

          <View style={styles.row}>
            <View style={styles.block}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={[styles.input, !isEditable && styles.readOnly]}
                value={editedData.lastName}
                editable={isEditable}
                onChangeText={text => setEditedData({ ...editedData, lastName: text })}
              />
            </View>
            <View style={styles.block}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={[styles.input, !isEditable && styles.readOnly]}
                value={editedData.firstName}
                editable={isEditable}
                onChangeText={text => setEditedData({ ...editedData, firstName: text })}
              />
            </View>
          </View>

          <View style={styles.blockFull}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              keyboardType="phone-pad"
              value={editedData.phone}
              editable={isEditable}
              onChangeText={text => setEditedData({ ...editedData, phone: text })}
            />
          </View>

          <View style={styles.blockFull}>
            <Text style={styles.label}>Email de contact</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.readOnly]}
              keyboardType="email-address"
              value={editedData.email}
              editable={isEditable}
              onChangeText={text => setEditedData({ ...editedData, email: text })}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleMainButton}>
            <Text style={styles.buttonText}>
              {isEditable ? '💾 Sauvegarder' : '✏️ Modifier'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'FFFCE9',
    padding: 20,
  },
  scroll: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#79B4C4',
    textAlign: 'center',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  block: {
    flex: 1,
  },
  blockFull: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#79B4C4',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  readOnly: {
    backgroundColor: '#FFFAF5',
    color: '#999',
  },
  button: {
    backgroundColor: '#0E56B4',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#95C9D8',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
