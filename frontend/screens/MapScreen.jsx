import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRoute, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header.jsx';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function MapScreen() {
  // States pour la gestion de la carte
  const [currentPosition, setCurrentPosition] = useState(null);
  const [relayPoints, setRelayPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération de la position utilisateur
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          
          setCurrentPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          // Position par défaut si géolocalisation refusée
          setCurrentPosition({
            latitude: 47.9025,
            longitude: 1.9090,
          });
        }
      } catch (error) {
        console.log('Erreur géolocalisation:', error);
        // Position par défaut en cas d'erreur
        setCurrentPosition({
          latitude: 47.9025,
          longitude: 1.9090,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  // Récupération des points relais
  useEffect(() => {
    const fetchRelayPoints = async () => {
      try {
        const response = await fetch(`${API_URL}/pros/adressepro`);
        const data = await response.json();
        
        if (data.result && data.data) {
          setRelayPoints(data.data);
        }
      } catch (error) {
        console.error('Erreur récupération points relais:', error);
        Alert.alert('Erreur', 'Impossible de charger les points relais');
      }
    };

    fetchRelayPoints();
  }, []);

  // Calcul d'itinéraire vers le point relais le plus proche
  const handleItinerary = () => {
    if (!currentPosition) {
      Alert.alert('Erreur', 'Position non disponible');
      return;
    }

    if (relayPoints.length === 0) {
      Alert.alert('Erreur', 'Aucun point relais disponible');
      return;
    }

    // TODO: Implémenter la logique de calcul du point relais le plus proche
    Alert.alert(
      'Itinéraire', 
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  };

  // Affichage des informations sur les points relais
  const handlePointRelaisInfo = () => {
    Alert.alert(
      'Points Relais',
      `${relayPoints.length} point(s) relais disponible(s) dans votre zone.`,
      [{ text: 'OK' }]
    );
  };

  // Position par défaut pendant le chargement
  const defaultRegion = {
    latitude: currentPosition?.latitude || 47.9025,
    longitude: currentPosition?.longitude || 1.9090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.mapContainer}>
        <Text style={styles.title}>Localisation des Points Relais</Text>
        
        <MapView
          style={styles.map}
          initialRegion={defaultRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Marqueur position utilisateur */}
          {currentPosition && (
            <Marker 
              coordinate={currentPosition} 
              title="Ma position" 
              pinColor="#B48DD3"
            />
          )}

          {/* Marqueurs des points relais */}
          {relayPoints.map((point, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: point.latitude || 47.9025,
                longitude: point.longitude || 1.9090,
              }}
              title={point.nomRelais || 'Point Relais'}
              description={point.adresse || 'Adresse non disponible'}
              pinColor="#79B4C4"
            />
          ))}
        </MapView>

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleItinerary} 
            style={styles.button} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faRoute} size={18} color="#fff" />
            <Text style={styles.textButton}>Calculer l'itinéraire</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handlePointRelaisInfo} 
            style={[styles.button, styles.secondaryButton]} 
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faInfoCircle} size={18} color="#fff" />
            <Text style={styles.textButton}>Infos Points Relais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
  },
  
  // Container de la carte
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  
  // Titre
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444444', // Palette Neutre - Texte principal
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Carte
  map: {
    flex: 1,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  
  // Container des boutons
  buttonContainer: {
    gap: 12,
  },
  
  // Boutons principaux
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B48DD3', // Palette Neutre - Boutons principaux
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  
  // Bouton secondaire
  secondaryButton: {
    backgroundColor: '#79B4C4', // Palette Neutre - Accent secondaire
  },
  
  // Texte des boutons
  textButton: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
});