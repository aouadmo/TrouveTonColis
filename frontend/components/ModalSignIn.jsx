import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { login } from '../reducers/user';

export default function ModalSignIn({visible, onClose}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messageError, setMessageError] = useState('');


  const handleLogin = () => {
    if (!email || !password) {
      setMessageError("Veuillez remplir tous les champs.")
      setTimeout(() => setMessageError(''), 5000);
      return;
    }

    fetch('http://192.168.1.191:3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ token: data.token, email: data.email, role: data.role }));
          onClose();
          setEmail('');
          setPassword('');
          setMessageError('');

          console.log("Connexion réussie, redirection selon son rôle");
        } else {
          setMessageError(data.error || "Connexion échouée.");
          setTimeout(() => setMessageError(''), 5000);
        }
      });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Connexion</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} />

          {messageError ? (<Text style={styles.errorMessage}> {messageError} </Text>) : null}

          <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.buttonCancel} activeOpacity={0.8}>
            <Text style={styles.textButton}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
});