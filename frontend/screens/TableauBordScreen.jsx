import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBarcode, faComments, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '../navigation/navigationRef';
import { useSelector } from 'react-redux';


export default function TableauBordScreen() {
  const token = useSelector((state) => state.user.value.token);
  const [urgentMessage, setUrgentMessage] = useState('');

  const handleSmsReplysScreen = () => navigate('SmsReplyScreen');
  const handleCamScreen = () => navigate('CameraScreen');


  useEffect(() => {
    const fetchUrgentMessage = async () => {
      try {
        const response = await fetch('http://192.168.1.191:3002/pros/sms', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.result && data.data) {
          setUrgentMessage(data.data.absentUrgentMessage);
        } else {
          console.warn('Message urgence introuvable');
        }
      } catch (error) {
        console.error('Erreur fetch message urgence :', error);
      }
    };

    if (token) {
      fetchUrgentMessage();
    }
  }, [token]);

  const handleUrgence = () => {
    if (urgentMessage) {
      Alert.alert("Message d'urgence", urgentMessage);
    } else {
      Alert.alert("Erreur", "Aucun message d'urgence disponible.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.mainContainer}>
        {/* Colonne de gauche */}
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={handleCamScreen} style={styles.iconButton}>
            <FontAwesomeIcon icon={faBarcode} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSmsReplysScreen} style={styles.iconButton}>
            <FontAwesomeIcon icon={faComments} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Partie droite */}
        <View style={styles.content}>
          <Text style={styles.title}>Rendez-vous du jour</Text>
          <Text style={styles.rdv}>- 08h00 : Fetch de l'ecran Crenaux</Text>
          <Text style={styles.rdv}>- 09h00 : Ceci est écrit en brut</Text>
          <Text style={styles.rdv}>- 11h30 : C'est tout pour le moment</Text>

          <TouchableOpacity onPress={handleUrgence} style={styles.urgenceButton}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={20} color="#fff" />
            <Text style={styles.urgenceText}>Envoyer un message d'urgence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  mainContainer: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 120,
    backgroundColor: '#4B1D9A',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  iconButton: {
    marginBottom: 20,
    backgroundColor: '#6B3EFF',
    padding: 40,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rdv: {
    fontSize: 16,
    marginBottom: 10,
  },
  urgenceButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D10000',
    padding: 12,
    borderRadius: 8,
  },
  urgenceText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});
