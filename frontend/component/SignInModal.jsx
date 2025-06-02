import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/user'; // adapte selon ton reducer

export default function LoginModal({ visible, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

//Test Connexion est un Pro ?
    try{ 
      let response = await fetch('http://localhost:3000/pros/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
// Si c'est un pro = on sauvegarde avec le flag isPro: true
      if (response.ok) {
        const data = await response.json();
        dispatch(setUser({ ...data, isPro: true }));
        onClose()
        return;
      } else{
// Sinon test connexion client
    response = await fetch('https://localhost:3000/clients/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
// Si c'est un client → on sauvegarde avec isPro: false
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser({ ...data, isPro: false }));
    onClose();
    return;
  }
    }   
    };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
          <Text>Connexion</Text>
          <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail}style={{ borderBottomWidth: 1, marginBottom: 10 }}/>
          <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} style={{ borderBottomWidth: 1, marginBottom: 10 }}/>
            <Button title="Se connecter" onPress={handleLogin} />
            <Button title="Annuler" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}}
