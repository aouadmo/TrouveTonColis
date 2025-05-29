import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import navigation from '../navigation'; // a verifier jeudi
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen({ navigation }) {
  const handleSubmit = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Décoration style logo */}
      <View style={styles.circle} />

      <Text style={styles.title}>🎯 Bienvenue sur TTC</Text>
      <Text style={styles.subtitle}>L'application de gestion de colis</Text>

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.button}
        activeOpacity={0.8}
      >
        <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
        <Text style={styles.textButton}> Inscription</Text>
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
