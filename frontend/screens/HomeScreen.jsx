import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../component/Header';

export default function HomeScreen({ navigation }) {
  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const handleSearch = () => {
    navigation.navigate('SearchScreen');
  };

  const handleConnexion = () => {
    navigation.navigate('ConnexionScreen');
  };

  return (
    <View style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView
        style={styles.container}
      >
        <View style={styles.circle} />

        <Text style={styles.title}>🎯 Bienvenue sur TTC</Text>
        <Text style={styles.subtitle}>L'application de gestion de colis</Text>
        <Text style={styles.subtitle}>Voici le hub pour tester si votre page marche bien !</Text>

        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
          <Text style={styles.textButton}> Inscription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSearch}
          style={styles.button}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
          <Text style={styles.textButton}> Rechercher les colis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConnexion}
          style={styles.button}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
          <Text style={styles.textButton}> Aller sur la page Connexion</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec6e5b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 5,
  },
  textButton: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
