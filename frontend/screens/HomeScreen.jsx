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

        <View style={styles.hubContainer}>
          <Text style={styles.hubTitle}>🛠️ Petit hub temporaire pour les tests</Text>
          <Text style={styles.hubSubtitle}>Mot de l’équipe : restez motivé, ça avance ! 💪</Text>

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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFCF2', // neutre
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
    color: '#5B4E9C', // neutre
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B4E9C',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  paragraphe: {
    fontSize: 12,
    color: '#4D4A63',
    textAlign: 'center',
    marginBottom: 5,
  },
  hubContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#D0BCFF',
    width: '100%',
  },
  hubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 6,
    textAlign: 'center',
  },
  hubSubtitle: {
    fontSize: 13,
    color: '#6B5EA4',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonDescription: {
    fontSize: 12,
    color: '#4F378A',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E56B4', // couleur bouton neutre
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
