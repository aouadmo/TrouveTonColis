import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setColis, updateColisStatus } from '../reducers/colis';
import { FontAwesome } from '@expo/vector-icons';

export default function MonStockScreen() {
  const dispatch = useDispatch();
  const colis = useSelector(state => state.colis.value);

  const [selectedColis, setSelectedColis] = useState([]);
  const [filtreActif, setFiltreActif] = useState('tous');

  useEffect(() => {
    fetch('http://192.168.1.157:3002/colis') 
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          dispatch(setColis(data.stock));
        }
      })
      .catch(err => console.log('Erreur fetch colis :', err));
  }, []);

  const colisSelection = (trackingNumber) => {
    setSelectedColis((prev) =>
      prev.includes(trackingNumber)
        ? prev.filter(item => item !== trackingNumber)
        : [...prev, trackingNumber]
    );
  };

  const handleRelance = () => {
    selectedColis.forEach(trackingNumber => {
      dispatch(updateColisStatus({ trackingNumber, nouveauStatut: 'relance possible' }));
    });
    setSelectedColis([]);
  };

  const colisFiltres = filtreActif === 'tous'
    ? colis
    : colis.filter(c => c.status === filtreActif);

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
          <Text style={styles.statusText}>Statut : {item.status || 'non défini'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
