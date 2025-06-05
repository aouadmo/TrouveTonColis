import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faBarcode } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function HomeScreen({ navigation }) {
  const { token, isPro } = useSelector(state => state.user.value);

  // ✅ Redirection automatique si connecté
  useEffect(() => {
    if (token !== null && isPro !== null) {
      navigation.reset({
        index: 0,
        routes: [
          { name: isPro ? 'TabPro' : 'TabClient' },
        ],
      });
    }
  }, [token, isPro]);

  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const handleSearch = () => {
    navigation.navigate('SearchScreen');
  };

  const gotocamerascreen = () => {
    navigation.navigate('CameraScreen');
  };

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
      </KeyboardAvoidingView>
    </View>
  );
}

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
});
