import React, { useState } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import { login } from '../reducers/user';
import { useNavigation } from '@react-navigation/native';

export default function SignInModal({ visible, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Validation basique
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');
  
    try {
      let response = await fetch('http://192.168.1.10:3002/pros/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
  
      let data = await response.json();
      console.log('Réponse Pro :', data);
  
      if (response.ok && data.result) {
        dispatch(login({ ...data, isPro: true }));
        resetForm();
        onClose();
        // La navigation se fera automatiquement via Navigation.js
        return;
      }

      response = await fetch('http://192.168.1.10:3002/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
  
      data = await response.json();
      console.log('Réponse Client :', data);
  
      if (response.ok && data.result) {
        dispatch(login({ ...data, isPro: false }));
        resetForm();
        onClose();
        // La navigation se fera automatiquement via Navigation.js
        return;
      }
  
      // Aucune connexion réussie
      setError(data.error || 'Email ou mot de passe incorrect');
  
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent 
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>🔐 Connexion</Text>
              <Text style={styles.subtitle}>
                Accédez à votre espace personnel
              </Text>
            </View>

            {/* Formulaire */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={16} color="#79B4C4" style={styles.inputIcon} />
                <TextInput
                  placeholder="Votre email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#999999"
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={16} color="#79B4C4" style={styles.inputIcon} />
                <TextInput
                  placeholder="Votre mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                  autoCapitalize="none"
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome5 
                    name={showPassword ? "eye-slash" : "eye"} 
                    size={16} 
                    color="#79B4C4" 
                  />
                </TouchableOpacity>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <FontAwesome5 name="exclamation-triangle" size={14} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Boutons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.buttonDisabled]} 
                onPress={handleLogin} 
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <Text style={styles.loginButtonText}>⏳ Connexion...</Text>
                ) : (
                  <>
                    <FontAwesome5 name="sign-in-alt" size={16} color="#FFFFFF" />
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>❌ Annuler</Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <FontAwesome5 name="info-circle" size={14} color="#79B4C4" />
              <Text style={styles.infoText}>
                💡 Clients et Pros utilisent le même formulaire. 
                Vous serez automatiquement redirigé vers votre espace.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
    borderRadius: 16,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollContent: {
    padding: 24,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444444', // Palette Neutre - Texte principal
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#79B4C4', // Palette Neutre - Accent secondaire
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Formulaire
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#444444',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  // Erreur
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },

  // Boutons
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#B48DD3', // Palette Neutre - Boutons principaux
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#444444',
    fontWeight: '600',
    fontSize: 16,
  },

  // Info
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#79B4C4',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
  },
});