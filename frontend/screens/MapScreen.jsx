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
const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf6248d0b7b3ff939b4f9c8f75934127de1d06';//process.env.OPENROUTESERVICE_API_KEY;
export default function MapScreen() {
  const navigation = useNavigation();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [prAdresse, setPrAdresse] = useState(null);
  const [polylineCoords, setPolylineCoords] = useState([]);

  // recuperation de la position du client
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition({
              latitude: 47.9025, //   latitude: location.coords.latitude
              longitude: 1.9090, //   longitude: location.coords.longitude
            });
          });
      }
    })();
  }, []);
  // redirection vers la page infos point relais
  // 1ere partie: convertir ladresse (string) en coordonnees (latitude, longitude)
  const handleInforPr = async () => {
    navigation.navigate('RelayInfoScreen');
  };
  const getPrAdresse = async () => {
    try {
      const response = await fetch('http://192.168.18.102:3000/pros/adressepro');
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
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.mapContainer}>

        <MapView
          mapType="hybrid"
          style={styles.map}
          initialRegion={{
            latitude: 47.9025,
            longitude: 1.9090,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {currentPosition && (
            <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />
          )}
          {tempCoordinates && (
            <Marker coordinate={tempCoordinates} title="Temporary Marker" pinColor="#ec6e5b" />
          )}
          {polylineCoords.length > 0 && (
            <Polyline
              coordinates={polylineCoords}
              strokeColor="#4F89E6"
              strokeWidth={4}
            />
          )}
        </MapView>
        <TouchableOpacity onPress={handleItinerary} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faRoute} size={18} color="#fff" />
          <Text style={styles.textButton}>Trouver ton itineraire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleInforPr} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faInfoCircle} size={18} color="#fff" />
          <Text style={styles.textButton}>Détails pratiques sur le point relais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F89E6',
    paddingVertical: 24,
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
