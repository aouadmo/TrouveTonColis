import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute();

  const isHome = route.name === 'HomeScreen';

  return (
    <View style={styles.container}>
      {/* Flèche retour à gauche si pas sur l'accueil */}
      {!isHome ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#444" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // pour équilibrer à gauche
      )}

      {/* Logo + Titre centré */}
      <View style={styles.centerBox}>
        <Image
          source={require('../assets/logoTTC_sansTexte.png')} 

          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>TROUVE TON COLIS</Text>
      </View>

      {/* Icône de connexion à droite (uniquement sur la Home) */}
      {isHome ? (
        <TouchableOpacity onPress={() => console.log('Connexion')}>
          <FontAwesome name="user-circle-o" size={28} color="#555" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: 100,
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
    gap: 8,
  },
  logo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E4AE3',
  },
});
