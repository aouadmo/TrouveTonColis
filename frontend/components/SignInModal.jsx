import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { useNavigation } from '@react-navigation/native';

export default function SignInModal({ visible, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      let response = await fetch('http://192.168.1.254:3000/pros/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(login({ ...data, isPro: true }));
        onClose();
        navigation.navigate('TabNavigator', { screen: 'TableauBord' });
        return;
       }

      response = await fetch('http://192.168.1.254:3000/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(login({ ...data, isPro: false }));
        onClose();
        navigation.navigate('TabNavigator', { screen: 'SearchScreen' });
        return;
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Connexion</Text>

          <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none"/>
          <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF4ED',
    borderRadius: 10,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2C8D',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F1E6DE',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4B1D9A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#3D2C8D',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
