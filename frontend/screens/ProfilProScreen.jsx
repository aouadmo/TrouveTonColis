import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // ✅ AJOUTE ÇA
import Header from '../components/Header';
import CoordonneesModal from '../components/CoordonneesModal';
import AbsenceModal from '../components/AbsenceModal';
import Constants from 'expo-constants';
import HorairesModal from '../components/HorairesModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function ProfilProScreen() {
  const navigation = useNavigation();
  const token = useSelector(state => state.user.value.token); // ✅ RÉCUPÈRE LE TOKEN
  
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [horairesModalVisible, setHorairesModalVisible] = useState(false);
  const [options, setOptions] = useState([
    { label: 'Ajouter le nom et prénom du client', checked: false },
    { label: 'Ajouter les horaires de la semaine', checked: false },
    { label: 'Ajouter le numéro du colis', checked: false },
    { label: 'Besoin du code à 4 chiffres', checked: true },
    { label: 'Lien de la page Google', checked: false },
  ]);

  const [coordonnesModal, setCoordonneesModal] = useState(false);
  const [absenceModal, setAbsenceModal] = useState(false);
  const [currentHoraires, setCurrentHoraires] = useState(null);

  // ✅ CORRIGE LA RÉCUPÉRATION DES HORAIRES
  useEffect(() => {
    const fetchHoraires = async () => {
      if (!token) return; // Attendre que le token soit disponible
      
      try {
        console.log("🔍 Récupération des horaires existantes...");
        const response = await fetch(`${API_URL}/pros/horaires`, {
          headers: {
            'Authorization': `Bearer ${token}` // ✅ AJOUTE LE TOKEN
          }
        });
        
        const data = await response.json();
        console.log("📋 Horaires récupérées:", data);
        
        if (data.result && data.horaires) {
          setCurrentHoraires(data.horaires);
          console.log("✅ Horaires stockées:", data.horaires);
        } else {
          console.log("⚠️ Pas d'horaires trouvées");
        }
      } catch (error) {
        console.log("❌ Erreur récupération horaires:", error);
      }
    };

    fetchHoraires();
  }, [token]); // ✅ DÉPEND DU TOKEN

  // ✅ FONCTION POUR OUVRIR LA MODAL AVEC LES HORAIRES
  const ouvrirModalHoraires = async () => {
    // Récupérer les horaires les plus récentes avant d'ouvrir
    if (token) {
      try {
        const response = await fetch(`${API_URL}/pros/horaires`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.result && data.horaires) {
          setCurrentHoraires(data.horaires);
        }
      } catch (error) {
        console.log("Erreur récupération horaires:", error);
      }
    }
    
    setHorairesModalVisible(true);
  };

  // ✅ CALLBACK QUAND LES HORAIRES SONT SAUVÉES
  const onHorairesSaved = (nouvellesHoraires) => {
    setCurrentHoraires(nouvellesHoraires);
    console.log("✅ Horaires mises à jour:", nouvellesHoraires);
  };
  
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
    <SafeAreaView style={styles.wrapper}>
      <Header role="pro" />
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestion de ton point relais</Text>

      {/* ✅ MODIFIE LE BOUTON POUR UTILISER LA NOUVELLE FONCTION */}
      <TouchableOpacity style={styles.mainButton} onPress={ouvrirModalHoraires}>
        <Text style={styles.mainButtonText}>Modifie les horaires de la semaine</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <TouchableOpacity style={styles.smsButton} onPress={() => navigation.navigate('EditSmsScreen')} >
          <Text style={styles.smsTitle} onPress={() => navigation.navigate('SmsReplyScreen')}>Modifie le SMS de réception d'un colis</Text>
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
      
      {/* ✅ PASSE LES HORAIRES À LA MODAL */}
      <HorairesModal 
        visible={horairesModalVisible} 
        onClose={() => setHorairesModalVisible(false)}
        horairesInitiaux={currentHoraires} // ✅ PASSE LES HORAIRES !
        onSave={onHorairesSaved} // ✅ CALLBACK POUR METTRE À JOUR
      />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFAF5', // Palette Pro - Fond rose très pâle
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5',
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
    backgroundColor: '#FFFFFF',
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