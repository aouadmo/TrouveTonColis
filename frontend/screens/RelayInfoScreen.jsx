import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const RelayInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { relais } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📮 Infos Point Relais</Text>

      <View style={styles.card}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>🏠 Nom :</Text>
          <Text style={styles.value}>{relais.nom}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>📍 Adresse :</Text>
          <Text style={styles.value}>{relais.adresse}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>🕒 Horaires :</Text>
          <Text style={styles.value}>{relais.horaires}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>ℹ️ Infos pratiques :</Text>
          <Text style={styles.value}>{relais.infos}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>← Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 380,
    elevation: 2,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 18,
    color: "#222",
    marginTop: 4,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RelayInfoScreen;
