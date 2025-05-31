import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Header() {
  
  return (
    <View style={styles.container}>
      {/* Logo à gauche */}
      <Image
        source={require('../assets/adaptive-icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Titre au centre */}
      <Text style={styles.title}>TROUVE TON COLIS</Text>

      {/* Icône de connexion à droite */}
      <TouchableOpacity onPress={() => console.log('Connexion')}>
        <FontAwesome name="user-circle-o" size={28} color="#555" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E4AE3', // violet léger
  },
});
