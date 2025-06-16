import React, { useState, useEffect } from "react";
import {View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faBarcode } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import { navigate } from '../navigation/navigationRef';
import { useSelector } from 'react-redux';

export default function HomeScreen({ navigation }) {
  const { token, isPro } = useSelector(state => state.user.value);

  const handleSignUp = () => navigate('SignUpScreen');
  const handleSearch = () => navigate('SearchScreen');
  const gotocamerascreen = () => navigate('CameraScreen');
  const gotomapScreen = () => navigate('MapScreen');

  return (
    <View style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>🎯 Bienvenue sur TTC</Text>
          <Text style={styles.subtitle}>L’application simple et rapide pour vos colis</Text>
          <Text style={styles.paragraphe}>👋 Vous attendez un colis ? Vous êtes au bon endroit.</Text>
          <Text style={styles.paragraphe}>📦 Points relais et clients, tout le monde est le bienvenu !</Text>
        </View>

        <Text style={styles.buttonDescription}>🔍 Consultez si votre colis est arrivé</Text>
        <TouchableOpacity onPress={handleSearch} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faSearch} size={18} color="#fff" />
          <Text style={styles.textButton}>Rechercher un colis</Text>
        </TouchableOpacity>

        <Text style={styles.buttonDescription}>📝 Créez un compte client ou pro</Text>
        <TouchableOpacity onPress={handleSignUp} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
          <Text style={styles.textButton}>Inscription</Text>
        </TouchableOpacity>

        <Text style={styles.buttonDescription}>📷 Scannez vos colis pour les enregistrer</Text>
        <TouchableOpacity onPress={gotocamerascreen} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faBarcode} size={18} color="#fff" />
          <Text style={styles.textButton}>Scanner un colis</Text>
        </TouchableOpacity>

        <Text style={styles.buttonDescription}>📷 Trouver votre itinéraire pour rejoindre le point relais</Text>
        <TouchableOpacity onPress={gotomapScreen} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faBarcode} size={18} color="#fff" />
          <Text style={styles.textButton}>Trouver l'itinéraire optimal</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// 🔥 STYLES D'ANNIVERSAIRE À SUPPRIMER LE 07/06 UNIQUEMENT
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFCE9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#4F378A',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  paragraphe: {
    fontSize: 12,
    color: '#4F378A',
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonDescription: {
    fontSize: 12,
    color: '#4F378A',
    marginTop: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F89E6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  textButton: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  birthdayCard: {
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#FF9AA2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  birthdayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C94F7C',
    marginBottom: 6,
    textAlign: 'center',
  },
  birthdaySubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressBar: {
    width: '100%',
    height: 14,
    backgroundColor: '#FFE5E5',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBugged: {
    width: '17%',
    height: '100%',
    backgroundColor: '#FF9AA2',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  fakeButton: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  fakeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    fontSize: 11,
    color: '#A00',
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
