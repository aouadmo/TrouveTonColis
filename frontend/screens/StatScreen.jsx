import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Header from '../components/Header';
import Constants from 'expo-constants';

const screenWidth = Dimensions.get("window").width;
const API_URL = Constants.expoConfig.extra.API_URL;

export default function StatScreen() {
  const [filter, setFilter] = useState('semaine');
  const [colisData, setColisData] = useState([0, 0, 0, 0]);
  const [clientData, setClientData] = useState([0, 0, 0, 0]);
  const [tipsData, setTipsData] = useState([0, 0, 0, 0]);
  const [labels, setLabels] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [bestColisScore, setBestColisScore] = useState(0);

  useEffect(() => {
    // Gestion des labels d'axe x
    if (filter === "semaine") setLabels(["S1", "S2", "S3", "S4"]);
    else if (filter === "mois") setLabels(["Jan", "Avr", "Jui", "Oct"]);
    else if (filter === "annee") setLabels(["2021", "2022", "2023", "2024"]);

    // Fetch stat colis
    fetch(`${API_URL}/colis/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setColisData(data.data);
          setBestColisScore(data.best);
        }
      })

    // Fetch stat clients
    fetch(`${API_URL}/users/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setClientData(data.data);
          setTotalClients(data.total);
        }
      })


    // Données pourboires (à dynamiser)
    if (filter === "semaine") setTipsData([5, 15, 10, 20]);
    else if (filter === "mois") setTipsData([20, 30, 40, 50]);
    else if (filter === "annee") setTipsData([20, 50, 80, 100]);
  }, [filter]);

  const safeArray = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((x) => (isNaN(x) ? 0 : x))
      : [0, 0, 0, 0];
  
  const data = {
    labels,
    datasets: [
      { data: safeArray(colisData), strokeWidth: 2, color: () => `#4B1D9A` },
      { data: safeArray(clientData), strokeWidth: 2, color: () => `#00B0B9` },
      { data: safeArray(tipsData), strokeWidth: 2, color: () => `#50C878` },
    ],
    legend: ["Colis", "Inscriptions", "Pourboires"]
  };

  return (
    <ScrollView style={styles.container}>
        <Header role="pro" />
      <Text style={styles.title}>Mes statistiques</Text>

      <View style={styles.buttonGroup}>
        {["mois", "semaine", "annee"].map((item) => (
          <TouchableOpacity key={item} style={[styles.filterBtn, filter === item && styles.activeFilter]} onPress={() => setFilter(item)}>
            <Text>{item[0].toUpperCase() + item.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <LineChart data={data} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart}/>

      <View style={styles.statBlock}>
        <Text>Meilleur score colis : {bestColisScore}</Text>
      </View>
      <View style={[styles.statBlock, { backgroundColor: "#D1F8D1" }]}>
        <Text>Pourboire(s) reçu(s) : {tipsData.reduce((acc, val) => acc + val, 0)} €</Text>
      </View>
      <View style={styles.statBlock}>
        <Text>Nb de Clients inscrit(s) : {totalClients}</Text>
      </View>
      <TouchableOpacity style={[styles.statBlock, { backgroundColor: "#DAD0F2" }]}>
        <Text>Voir les avis Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFF",
  backgroundGradientTo: "#FFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(75, 29, 154, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(61, 44, 141, ${opacity})`,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#4B1D9A"
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF4ED'
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    color: '#3D2C8D'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  filterBtn: {
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#F1E6DE'
  },
  activeFilter: {
    backgroundColor: '#DAD0F2'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  statBlock: {
    backgroundColor: '#F1E6DE',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10
  }
});
