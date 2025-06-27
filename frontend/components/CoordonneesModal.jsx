import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';

export default function CoordonneesModal({ visible, onClose }) {
  const user = useSelector(state => state.user.value);
  const [form, setForm] = useState({
    nomRelais: '',
    adresse: '',
    codePostal: '',
    ville: '',
    phone: '',
    indications: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    fetch('http://192.168.1.10:3006/pros/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, ...form }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          Alert.alert('Succès', 'Coordonnées mises à jour.');
          onClose();
        } else {
          Alert.alert('Erreur', data.error || 'Échec de la mise à jour.');
        }
      })
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modalStyles.overlay}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <Text style={modalStyles.title}>Coordonnées du Point Relais</Text>
          <TextInput placeholder="Nom du relais" onChangeText={v => handleChange('nomRelais', v)} style={modalStyles.input} />
          <TextInput placeholder="Adresse" onChangeText={v => handleChange('adresse', v)} style={modalStyles.input} />
          <TextInput placeholder="Code postal" onChangeText={v => handleChange('codePostal', v)} style={modalStyles.input} />
          <TextInput placeholder="Ville" onChangeText={v => handleChange('ville', v)} style={modalStyles.input} />
          <TextInput placeholder="Téléphone" onChangeText={v => handleChange('phone', v)} style={modalStyles.input} />
          
          <TouchableOpacity style={modalStyles.button} onPress={handleSubmit}>
            <Text style={modalStyles.buttonText}>VALIDER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.close}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1,
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { 
    backgroundColor: 'white', 
    margin: 20, 
    padding: 20, 
    borderRadius: 12 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 12, 
    textAlign: 'center' },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 10, 
    padding: 6 },
  button: { 
    backgroundColor: '#4B1D9A', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' },
  close: { 
    marginTop: 10, 
    textAlign: 'center', 
    color: '#4B1D9A' },
});
