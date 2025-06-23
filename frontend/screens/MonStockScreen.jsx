import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setColis, updateColisStatus } from '../reducers/colis';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import moment from 'moment'; // Gérer les dates

export default function MonStockScreen() {
  const dispatch = useDispatch();
  const colis = useSelector(state => state.colis.value); // Récupération des colis depuis le store Redux

  const [selectedColis, setSelectedColis] = useState([]); // Colis sélectionné pour relance
  const [filtreActif, setFiltreActif] = useState('tous'); // Statut pour le filtrage

  // Récupération des colis
  useEffect(() => {
    fetch('http://192.168.1.157:3006/colis') 
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const today = moment();
          // On ajoute chaque colis avec un champ "computedStatus"
          const enrichedColis = data.stock.map(item => {
            if (item.status === 'réservé') {
              return { ...item, computedStatus: 'réservé' }; // Partie colis réservés à dynamiser plus tard en fonction de la prise de RDV client
            }
  
            const arrival = moment(item.arrivalDate); // Date d'arrivée du colis
            const days = today.diff(arrival, 'days'); // Calcul du nombre de jours écoulés
            // Attribution du statut dynamique selon l'ancienneté
            let computedStatus = 'en attente';
            if (days >= 7) {
              computedStatus = 'relance possible';
            } else if (days >= 5) {
              computedStatus = 'j+5';
            }
  
            return { ...item, computedStatus };
          });
        // Envoi des colis avec leur statut dans le store Redux
          dispatch(setColis(enrichedColis));
        }
      })
  }, []);

  // Sélection ou désélection d’un colis via son numéro de suivi
  const colisSelection = (trackingNumber) => {
    setSelectedColis((prev) =>
      prev.includes(trackingNumber)
        ? prev.filter(item => item !== trackingNumber) // On retire si déjà sélectionné
        : [...prev, trackingNumber] //sinon, on ajoute
    );
  };

  // Action suite clic sur le bouton de relance
  const handleRelance = () => {
    selectedColis.forEach(trackingNumber => {
      dispatch(updateColisStatus({ trackingNumber, nouveauStatut: 'relance possible' })); // MAJ du statut dans le store (en local uniquement pour l’instant)
    });
    setSelectedColis([]); // Reset de la sélection
  };

  // Filtrage des colis selon l’onglet sélectionné
  const colisFiltres = filtreActif === 'tous' ? colis : colis.filter(c => c.computedStatus === filtreActif);

  // Fonction de rendu pour chaque colis dans la FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => colisSelection(item.trackingNumber)} style={{ marginRight: 10 }}>
          <FontAwesome
            name={selectedColis.includes(item.trackingNumber) ? 'check-square-o' : 'square-o'}
            size={24}
            color={selectedColis.includes(item.trackingNumber) ? '#4B1D9A' : '#3D2C8D'}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.text}>{item.nom} {item.prenom} - {item.trackingNumber}</Text>
          <Text style={styles.subtext}>Transporteur : {item.transporteur}</Text>
          <Text style={styles.statusText}>Statut : {item.computedStatus || 'non défini'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
       <Header role="pro" />
      <Text style={styles.title}>Mon Stock de Colis</Text>

      <View style={styles.tabs}>
        {['tous', 'réservé', 'en attente', 'j+5', 'relance possible'].map(status => (
          <TouchableOpacity key={status} onPress={() => setFiltreActif(status)}style={[styles.tab, filtreActif === status && styles.tabActif]}>
            <Text style={[styles.tabTexte, filtreActif === status && styles.tabTexteActif]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={colisFiltres} keyExtractor={(item, index) => `${item.trackingNumber}-${index}`} renderItem={renderItem} contentContainerStyle={styles.listContent}/>

      {selectedColis.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={handleRelance}>
          <Text style={styles.buttonText}>Relancer {selectedColis.length} colis</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4ED',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: '#3D2C8D',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#F1E6DE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#3D2C8D',
    fontWeight: 'bold',
  },
  subtext: {
    color: '#3D2C8D',
    fontSize: 12,
  },
  statusText: {
    color: '#4B1D9A',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4B1D9A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF4ED',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    backgroundColor: '#F1E6DE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabActif: {
    backgroundColor: '#4B1D9A',
  },
  tabTexte: {
    color: '#3D2C8D',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTexteActif: {
    color: '#FFF4ED',
  },
});
