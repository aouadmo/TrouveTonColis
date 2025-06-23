import React from "react";
import {
  View, 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faBarcode, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import { navigate } from '../navigation/navigationRef';

export default function HomeScreen({ navigation }) {
  
  // Handlers de navigation
  const handleSignUp = () => navigate('SignUpScreen');
  const handleSearch = () => navigate('SearchScreen');
  const gotocamerascreen = () => navigate('CameraScreen');
  const gotomapScreen = () => navigate('MapScreen');

  return (
    <View style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView style={styles.container}>
        
        {/* Section de bienvenue */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenue sur TTC</Text>
          <Text style={styles.subtitle}>L'application simple et rapide pour vos colis</Text>
          <Text style={styles.description}>Vous attendez un colis ? Vous êtes au bon endroit.</Text>
          <Text style={styles.description}>Points relais et clients, tout le monde est le bienvenu !</Text>
        </View>

        {/* Hub des actions principales */}
        <View style={styles.hubContainer}>
          <Text style={styles.hubTitle}>Actions rapides</Text>
          <Text style={styles.hubSubtitle}>Choisissez une action pour commencer</Text>

          {/* Bouton Recherche */}
          <Text style={styles.buttonDescription}>Consultez si votre colis est arrivé</Text>
          <TouchableOpacity 
            onPress={handleSearch} 
            style={styles.button} 
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faSearch} size={18} color="#fff" />
            <Text style={styles.textButton}>Rechercher un colis</Text>
          </TouchableOpacity>

          {/* Bouton Inscription */}
          <Text style={styles.buttonDescription}>Créez un compte client ou pro</Text>
          <TouchableOpacity 
            onPress={handleSignUp} 
            style={styles.button} 
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faUserPlus} size={18} color="#fff" />
            <Text style={styles.textButton}>Inscription</Text>
          </TouchableOpacity>

          {/* Bouton Scanner */}
          <Text style={styles.buttonDescription}>Scannez vos colis pour les enregistrer</Text>
          <TouchableOpacity 
            onPress={gotocamerascreen} 
            style={styles.button} 
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faBarcode} size={18} color="#fff" />
            <Text style={styles.textButton}>Scanner un colis</Text>
          </TouchableOpacity>

          {/* Bouton Itinéraire */}
          <Text style={styles.buttonDescription}>Trouvez votre itinéraire vers le point relais</Text>
          <TouchableOpacity 
            onPress={gotomapScreen} 
            style={styles.button} 
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color="#fff" />
            <Text style={styles.textButton}>Trouver l'itinéraire</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  
  // Section de bienvenue
  textContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444444', // Palette Neutre - Texte principal
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444444',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  
  // Hub des actions
  hubContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#B48DD3', // Palette Neutre - Boutons principaux
    width: '100%',
  },
  hubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 6,
    textAlign: 'center',
  },
  hubSubtitle: {
    fontSize: 14,
    color: '#79B4C4', // Palette Neutre - Accent secondaire
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Boutons d'action
  buttonDescription: {
    fontSize: 13,
    color: '#666666',
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B48DD3', // Palette Neutre - Boutons principaux
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Animation légère au touch
    transform: [{ scale: 1 }],
  },
  textButton: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
});