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
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import SignInModal from './SignInModal';

function Header({ role }) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.value.token);
  const [modalVisible, setModalVisible] = useState(false);

  // Pages d'accueil (affichent le menu burger)
  const isHome = ['HomeScreen', 'HistoireRelais', 'FAQScreen'].includes(route.name);

  // Couleurs selon l'UI Kit
  const getBackgroundColor = () => {
    if (role === 'pro') return '#FFFAF5';      // Pro - Rose très pâle
    if (role === 'client') return '#FFFCE9';   // Client - Beige très clair
    return '#FFFFFF';                          // Neutre - Fond blanc
  };

  const getTitleColor = () => {
    if (role === 'pro') return '#4F378A';      // Pro - Violet foncé
    if (role === 'client') return '#79B4C4';   // Client - Bleu clair doux
    return '#444444';                          // Neutre - Gris foncé
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    dispatch(logout());
  };

  // Navigation intelligente pour le retour
  const handleGoBack = () => {
    if (route.name === 'RelayInfoScreen') {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('TabNavigatorClient');
      }
    } else {
      navigation.goBack();
    }
  };

  const backgroundColor = getBackgroundColor();
  const titleColor = getTitleColor();

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor }]}>
      <View style={[styles.container, { backgroundColor }]}>
        
        {/* Bouton gauche : Menu ou Retour */}
        <View style={styles.leftSection}>
          {isHome ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="bars" size={24} color="#444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="arrow-left" size={24} color="#444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Centre : Logo + Titre */}
        <TouchableOpacity 
          style={styles.centerSection}
          onPress={() => navigation.navigate('HomeScreen')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/logoTTC_sansTexte.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: titleColor }]}>
            TROUVE TON COLIS
          </Text>
        </TouchableOpacity>

        {/* Bouton droit : Connexion/Déconnexion */}
        <View style={styles.rightSection}>
          {userToken ? (
            <TouchableOpacity 
              style={styles.authButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <FontAwesome 
                name="sign-out" 
                size={26} 
                color="#EC6E5B" 
              />
              <Text style={styles.authText}>Déconnexion</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <FontAwesome 
                name="user-circle-o" 
                size={26} 
                color="#555" 
              />
              <Text style={styles.authText}>Connexion</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal de connexion */}
      <SignInModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container principal
  safeContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },

  // Sections du header
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  rightSection: {
    width: 80,
    alignItems: 'center',
  },

  // Boutons
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  authButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Logo et titre
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
  },

  // Texte de connexion
  authText: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default Header;