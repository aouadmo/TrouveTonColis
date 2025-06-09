import React from "react";
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import ColisSearchForm from "../components/ColisSearchForm";

const SearchScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* En-tête toujours visible */}
      <Header />

      {/* Contenu décalé proprement en cas d'ouverture du clavier */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>🔍 Rechercher un colis</Text>
          {/* Formulaire de recherche */}
          <ColisSearchForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default SearchScreen;
