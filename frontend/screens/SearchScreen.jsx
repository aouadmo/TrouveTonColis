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
      <Header />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Rechercher un colis</Text>
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
    backgroundColor: "#FFFFFF", // Palette Neutre - Fond blanc
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#444444", // Palette Neutre - Texte principal
  },
});

export default SearchScreen;