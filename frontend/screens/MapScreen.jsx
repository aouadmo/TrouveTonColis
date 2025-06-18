import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRoute, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header.jsx';

//import axios from 'axios';
export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [prAdresse, setPrAdresse] = useState(null);
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
// recuperation de la position du point relais
  const handleInforPr = () => {
    fetch('https://localhost:3000/pros/adressepro')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPrAdresse(data.adresse); 
      })
      .catch(error => {
        console.error('Error fetching the adress of the relay point:', error);
      }); 
  }
  const handleItinerary = () => {
    // Logic to handle itinerary can be added here
  };
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.mapContainer}>
        <Modal visible={modalVisible} animationType="fade" transparent>
        </Modal>

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
