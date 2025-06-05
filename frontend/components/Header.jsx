import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import SignInModal from './SignInModal';;

// Composant d’en-tête utilisé sur toutes les pages
function Header() {
  const navigation = useNavigation();
  const route = useRoute();
  const isMenuScreen = ['HomeScreen', 'HistoireRelais', 'FAQScreen'].includes(route.name); // au lieu de 'HomeScreen' Vérifie si on est sur la page d’accueil
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* À gauche : menu si page d’accueil, sinon flèche retour */}
        {isMenuScreen ? (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome5 name="bars" size={24} color="#444" />
          </TouchableOpacity>) : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={24} color="#444" />
          </TouchableOpacity>
        )}

        {/* Logo cliquable + titre, permet de revenir à l’accueil */}
        <TouchableOpacity onPress={() => navigation.navigate('Drawer', { screen: 'HomeScreen' })}>
          <View style={styles.centerBox}>
            <Image
              source={require('../assets/logoTTC_sansTexte.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>TROUVE TON COLIS</Text>
          </View>
        </TouchableOpacity>

        {/* À droite : bouton de connexion uniquement visible sur l’accueil */}
        {isMenuScreen ? (
          <View style={styles.iconBox}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <FontAwesome name="user-circle-o" size={28} color="#555" />
            </TouchableOpacity>
            <Text style={styles.hint}>Connexion</Text>
          </View>
        ) : (
          <View style={{ width: 28 }} />  // Garde l’alignement visuel à droite
        )}
      </View>
      <SignInModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0, // Petit espace entre logo et texte
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E4AE3', // Violet clair, couleur principale
  },
  iconBox: {
    flexDirection: 'column',
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 10,
    color: '#888',
    marginTop: 1,
  },
});

export default Header;
