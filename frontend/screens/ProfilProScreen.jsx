import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import CoordonneesModal from '../components/CoordonneesModal';
import AbsenceModal from '../components/AbsenceModal';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function ProDashboardScreen() {
  const navigation = useNavigation();
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [options, setOptions] = useState([
    { label: 'Ajouter le nom et prénom du client', checked: false },
    { label: 'Ajouter les horaires de la semaine', checked: false },
    { label: 'Ajouter le numéro du colis', checked: false },
    { label: 'Besoin du code à 4 chiffres', checked: true },
    { label: 'Lien de la page Google', checked: false },
    { label: 'Paragraphe en anglais', checked: false, hasTranslate: true },
  ]);

  const [coordonnesModal, setCoordonneesModal] = useState(false);
  const [absenceModal, setAbsenceModal] = useState(false);


  
  const checkOptions = (index) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index].checked = !newOptions[index].checked;
      return newOptions;
    });
  };  
  
  const handleUrgence = () => {
    fetch(`${API_URL}/pros/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: false }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setIsUnavailable(true);
          Alert.alert('Statut mis à jour', 'Le point relais est maintenant indisponible pour les clients.');
        } 
      })
  };

  return (
    <ScrollView style={styles.container}>
      <Header role="pro" />
      <Text style={styles.title}>Gestion de ton point relais</Text>

      <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('ProHorairesScreen')}>
        <Text style={styles.mainButtonText}>Modifie les horaires de la semaine</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <TouchableOpacity style={styles.smsButton} onPress={() => navigation.navigate('EditSmsScreen')} >
          <Text style={styles.smsTitle}>Modifie le SMS de réception d’un colis</Text>
        </TouchableOpacity>
        {options.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listeRow} onPress={() => checkOptions(index)}>
          <Text style={styles.listeItem}>
        {item.checked ? '☑' : '☐'} {item.label}
      </Text>
    </TouchableOpacity>
  ))}
      </View>

      <TouchableOpacity onPress={() => setAbsenceModal(true)}>
        <Text style={styles.link}>Absence programmée</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => setCoordonneesModal(true)}>
        <Text style={styles.link}>Modifier coordonnées du relais</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => navigation.navigate('AccueilMessageScreen')}>
        <Text style={styles.link}>Ajouter un message en page d’accueil</Text>
      </TouchableOpacity>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.urgenceButton} onPress={handleUrgence}>
          <Text style={styles.urgenceText}>URGENCE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statsButton} onPress={() => navigation.navigate('StatScreen')} >
          <Text style={styles.statsText}>Voir mes statistiques</Text>
        </TouchableOpacity>
      </View>

      {isUnavailable && (
        <Text style={styles.alertMessage}> Ce point relais est momentanément indisponible.</Text>
      )}
        <CoordonneesModal visible={coordonnesModal} onClose={() => setCoordonneesModal(false)} />
        <AbsenceModal visible={absenceModal} onClose={() => setAbsenceModal(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#4F378A',
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#F1E6DE',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  mainButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  listeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  listeItem: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  link: {
    fontSize: 15,
    marginBottom: 10,
    color: '#4B1D9A',
    textDecorationLine: 'underline',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  urgenceButton: {
    backgroundColor: '#FF9999',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  urgenceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsButton: {
    backgroundColor: '#A8C7FF',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  statsText: {
    color: '#3D2C8D',
    fontWeight: 'bold',
  },
  alertMessage: {
    marginTop: 20,
    textAlign: 'center',
    color: '#D43F00',
    fontWeight: '600',
  },
});

