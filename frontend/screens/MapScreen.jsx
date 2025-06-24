import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRoute, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header.jsx';
import { Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
//dotenv.config();
const OPENROUTESERVICE_API_KEY = process.env.OPENROUTESERVICE_API_KEY; //'5b3ce3597851110001cf6248d0b7b3ff939b4f9c8f75934127de1d06';//


export default function MapScreen() {
  // States pour la gestion de la carte
  const [currentPosition, setCurrentPosition] = useState(null);
  const [relayPoints, setRelayPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prAdresse, setPrAdresse] = useState('');
  const navigation = useNavigation();

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
  // redirection vers la page infos point relais
  // 1ere partie: convertir ladresse (string) en coordonnees (latitude, longitude)
  const handleInforPr = async () => {
    navigation.navigate('RelayInfoScreen');
  };
  const getPrAdresse = async () => {
    try {
      const response = await fetch('http://192.168.18.102:3006/pros/adressepro');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.adresse);
      setPrAdresse(data.adresse);
    } catch (error) {
      console.error('Error fetching the address of the relay point:', error);
    }
  }
  // 2eme partie: generer l'itineraire entre deux points
  const getRoute = async (startCoords, endCoords) => {
    try {
      const body = {
        coordinates: [
          [startCoords.longitude, startCoords.latitude],
          [endCoords.longitude, endCoords.latitude],
        ],
      };

      const response = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTESERVICE_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data.features[0].geometry.coordinates; // list of [lon, lat]
    } catch (error) {
      console.error("Error fetching route:", error);
      return [];
    }
  };
  // formater les coordonnees de la polyligne
  const formatPolylineCoords = (coords) =>
    coords.map(coord => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

  // recuperation de la position du point relais && appeler les fonctions precedentes pour afficher l'itineraire
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTESERVICE_API_KEY}&text=${encodeURIComponent(address)}`);
      const data = await response.json();
      const coords = data.features[0].geometry.coordinates; // [lon, lat]
      return { latitude: coords[1], longitude: coords[0] };
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  const handleItinerary = async () => {
    console.log('handleItinerary called');
    getPrAdresse();
    if (!currentPosition || !prAdresse) return;
    console.log('Current Position:', currentPosition);
    console.log('Point Relais Adresse:', prAdresse);
    const destination = await geocodeAddress(prAdresse);
    if (!destination) return;
    console.log('Destination Coordinates:', destination);
    const routeCoords = await getRoute(currentPosition, destination);
    const formattedCoords = formatPolylineCoords(routeCoords);
    setTempCoordinates(destination);  // optional, for marker
    setPolylineCoords(formattedCoords); // this is a new state you'll add
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
          {polylineCoords.length > 0 && (
            <Polyline
              coordinates={polylineCoords}
              strokeColor="#4F89E6"
              strokeWidth={4}
            />
          )}
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