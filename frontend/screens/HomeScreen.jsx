import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch, faUserPlus, faBox } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import { navigate } from "../navigation/navigationRef";

export default function HomeScreen() {
  const handleSignUp = () => navigate("SignUpScreen");
  const handleSearch = () => navigate("SearchScreen");

  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.container}>
        {/* Logo + Titre */}
        <View style={styles.headerSection}>
          <Image
            source={require("../assets/logoTTC_sansTexte.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Trouve ton colis</Text>
          <Text style={styles.subtitle}>La solution simple et efficace</Text>
        </View>

        {/* Avantages */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Pourquoi choisir Trouve ton colis ?</Text>
          <View style={styles.benefitItem}>
            <FontAwesomeIcon icon={faSearch} size={16} color="#79B4C4" />
            <Text style={styles.benefitText}>Recherche instantanée et précise</Text>
          </View>
          <View style={styles.benefitItem}>
            <FontAwesomeIcon icon={faBox} size={16} color="#79B4C4" />
            <Text style={styles.benefitText}>Suivi de tous vos colis</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Que souhaitez-vous faire ?</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSearch}>
            <FontAwesomeIcon icon={faSearch} size={18} color="#fff" />
            <Text style={styles.primaryText}>Rechercher mon colis</Text>
          </TouchableOpacity>

          <Text style={styles.or}>ou</Text>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp}>
            <FontAwesomeIcon icon={faUserPlus} size={16} color="#B48DD3" />
            <Text style={styles.secondaryText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerSection: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B48DD3",
  },
  benefitsCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 13,
    marginLeft: 8,
    color: "#666",
    fontWeight: "500",
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    maxWidth: 340,
    borderLeftWidth: 4,
    borderLeftColor: "#B48DD3",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#444",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B48DD3",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
  or: {
    textAlign: "center",
    fontSize: 12,
    fontStyle: "italic",
    color: "#999",
    marginVertical: 6,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#B48DD3",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
  },
  secondaryText: {
    color: "#B48DD3",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
});
