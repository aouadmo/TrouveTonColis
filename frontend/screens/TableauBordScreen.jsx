import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRetro, faComments, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '../navigation/navigationRef';
import { useSelector } from 'react-redux';


export default function TableauBordScreen() {
  const token = useSelector((state) => state.user.value.token);
  const rdvList = useSelector((state) => state.rdv.value) ?? []; //Opérateur de coalescence nulle 

  const [urgentMessage, setUrgentMessage] = useState('');
  const [isUrgenceActive, setIsUrgenceActive] = useState(false);

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
          console.error('Message urgence introuvable');
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
    if (!isUrgenceActive) {
      if (urgentMessage) {
        Alert.alert("Urgence Activée", urgentMessage);
        setIsUrgenceActive(true);
      } else {
        Alert.alert("Erreur", "Aucun message d'urgence disponible.");
      }
    } else {
      Alert.alert("Urgence Désactivée", "Le message d'urgence a été retiré.");
      setIsUrgenceActive(false);
    }
  };

  //Dans le cas ou le rdv est dépassé
  const getTodayRdvList = (rdvList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rdvList.filter((rdv) => {
      const [day, month, year] = rdv.date.split('/');
      const rdvDate = new Date(`${year}-${month}-${day}`);
      rdvDate.setHours(0, 0, 0, 0);
      return rdvDate.getTime() === today.getTime();
    });
  };

  const todayRdvList = getTodayRdvList(rdvList);

  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.mainContainer}>
        {/* Colonne de gauche */}
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={handleCamScreen} style={styles.iconButton}>
            <FontAwesomeIcon icon={faCameraRetro} size={40} color="#fff" />
            <Text style={styles.iconLabel}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSmsReplysScreen} style={styles.iconButton}>
            <FontAwesomeIcon icon={faComments} size={40} color="#fff" />
            <Text style={styles.iconLabel}>Messages Persos</Text>
          </TouchableOpacity>
        </View>

        {/* Partie droite */}
        <View style={styles.content}>
          <Text style={styles.title}>Tableau de bord</Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Rendez-vous du jour</Text>
            {todayRdvList.length > 0 ? (
              todayRdvList.map((rdv, index) => (
                <Text key={index} style={styles.rdv}>
                  - {rdv.time} : {rdv.client ?? 'Client'}
                </Text>
              ))
            ) : (
              <Text style={styles.rdv}>- Pas de rendez-vous pour aujourd'hui</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleUrgence}
            style={[
              styles.urgenceButton,
              isUrgenceActive && styles.urgenceButtonActive
            ]}
          >
            <FontAwesomeIcon
              icon={isUrgenceActive ? faTimesCircle : faExclamationTriangle}
              size={20}
              color="#fff"
            />
            <Text style={styles.urgenceText}>
              {isUrgenceActive ? 'Mettre fin à l\'urgence' : 'Envoyer un message d\'urgence'}
            </Text>
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
    width: 80,
    height: 100,
    backgroundColor: '#6B3EFF',
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
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
  iconLabel: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  urgenceButtonActive: {
    backgroundColor: '#751414',
  },
  urgenceText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});
