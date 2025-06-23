import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';

export default function AbsenceModal({ visible, onClose }) {
  const user = useSelector(state => state.user.value);
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    fetch('http://192.168.1.157:3006/pros/absence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, ...form }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          Alert.alert('Absence enregistrée');
          onClose();
        } else {
          Alert.alert('Erreur', data.error || 'Impossible d’enregistrer');
        }
      });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <Text style={modalStyles.title}>Absence programmée</Text>
          <TextInput placeholder="Date de début (JJ/MM/AAAA)" onChangeText={v => handleChange('startDate', v)} style={modalStyles.input} />
          <TextInput placeholder="Date de fin (JJ/MM/AAAA)" onChangeText={v => handleChange('endDate', v)} style={modalStyles.input} />
          <TextInput placeholder="Raison (optionnelle)" onChangeText={v => handleChange('reason', v)} style={modalStyles.input} />

          <TouchableOpacity style={modalStyles.button} onPress={handleSubmit}>
            <Text style={modalStyles.buttonText}>VALIDER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.close}>Fermer</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: 20,
    },
    modal: {
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
    textarea: {
      backgroundColor: '#F1E6DE',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingTop: 10,
      height: 80,
      marginBottom: 10,
      textAlignVertical: 'top',
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
    close: { 
        marginTop: 10, 
        textAlign: 'center', 
        color: '#4B1D9A' },
  });