import React from "react";
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import ColisSearchForm from "../components/ColisSearchForm"; 

const SearchScreen = () => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>🔍 Rechercher un colis</Text>
      <ColisSearchForm />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default SearchScreen;
