import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';

export default function ProSignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [pro, setPro] = useState({
    nomRelais: '',
    prenom: '',
    nom: '',
    email: '',
    emailConfirm: '',
    password: '',
    phone: '',
    adresse: '',
    ville: '',
    codePostal: '',
  });

  const handleChange = (key, value) => {
    setPro({ ...pro, [key]: value });
  };

  const handleSubmit = () => {
    if (pro.email !== pro.emailConfirm) {
      alert("Les emails ne correspondent pas.");
      return;
    }

    fetch('http://localhost:3000/pros/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pro),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ token: data.token, email: pro.email }));
          navigation.navigate('TableauBord');
        } 
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput placeholder="Nom Point Relais" style={styles.input} onChangeText={val => handleChange('nomRelais', val)} />
      
      <View style={styles.row}>
        <TextInput placeholder="First name" style={styles.inputHalf} onChangeText={val => handleChange('prenom', val)} />
        <TextInput placeholder="Last name" style={styles.inputHalf} onChangeText={val => handleChange('nom', val)} />
      </View>

      <TextInput placeholder="E-mail"  style={styles.input} onChangeText={val => handleChange('email', val)} />
      <TextInput placeholder="Confirmation E-mail"  style={styles.input} onChangeText={val => handleChange('emailConfirm', val)} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} onChangeText={val => handleChange('phone', val)} />
      <TextInput placeholder="Street" style={styles.input} onChangeText={val => handleChange('adresse', val)} />

      <View style={styles.row}>
        <TextInput placeholder="City" style={styles.inputHalf} onChangeText={val => handleChange('ville', val)} />
        <TextInput placeholder="Zip"  style={styles.inputHalf} onChangeText={val => handleChange('codePostal', val)} />
      </View>

      <TextInput placeholder="Mot de Passe" style={styles.input} onChangeText={val => handleChange('password', val)} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Inscription</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF4ED',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#3D2C8D',
  },
  input: {
    backgroundColor: '#F1E6DE',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    backgroundColor: '#F1E6DE',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
    width: '48%',
  },
  button: {
    backgroundColor: '#4B1D9A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
