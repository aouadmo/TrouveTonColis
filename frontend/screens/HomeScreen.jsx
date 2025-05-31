import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen({ navigation }) {
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
    <KeyboardAvoidingView
      style={styles.container}
    >
      {/* Décoration style logo */}
      <View style={styles.circle} />

      <Text style={styles.title}>🎯 Bienvenue sur TTC</Text>
      <Text style={styles.subtitle}>L'application de gestion de colis</Text>

      {/* bouton pour s'inscrire */}
      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.button}
        activeOpacity={0.8}>
        <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
        <Text style={styles.textButton}> Inscription</Text>
      </TouchableOpacity>

      {/* bouton pour rechercher les colis */}
      <TouchableOpacity
        onPress={handleSearch}
        style={styles.button}
        activeOpacity={0.8}
      >
        <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
        <Text style={styles.textButton}> Rechercher les colis</Text>
      </TouchableOpacity>
      {/* bouton pour scanner les colis */}
      <TouchableOpacity
        onPress={gotocamerascreen}
        style={styles.button}
        activeOpacity={0.8}
      >
        <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
        <Text style={styles.textButton}> Scanner les colis</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ec6e5b',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec6e5b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
