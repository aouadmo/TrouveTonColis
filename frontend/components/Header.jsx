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

  const isHome = ['HomeScreen', 'HistoireRelais', 'FAQScreen'].includes(route.name);

  const backgroundColor = role === 'pro' ? '#FFFAF5' : role === 'client' ? '#FFFCE9' : '#FDFBFF';
  const titleColor = role === 'pro' ? '#4F378A' : role === 'client' ? '#D0BCFF' : '#BFA8F1';

  const handleLogout = () => {
    dispatch(logout());
    // C'est tout ! Laissez Navigation.jsx gérer automatiquement le changement
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor }]}>
      <View style={[styles.container, { backgroundColor }]}>
        {isHome ? (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome5 name="bars" size={24} color="#444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={24} color="#444" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <View style={styles.centerBox}>
            <Image
              source={require('../assets/logoTTC_sansTexte.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: titleColor }]}>TROUVE TON COLIS</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.iconBox}>
          {userToken ? (
            <TouchableOpacity onPress={handleLogout}>
              <FontAwesome name="sign-out" size={28} style={styles.logoLogout}color="#EC6E5B" />
              <Text style={styles.hint}>Déconnexion</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <FontAwesome name="user-circle-o" size={28} color="#555" />
              </TouchableOpacity>
              <Text style={styles.hint}>Connexion</Text>
            </>
          )}
        </View>
      </View>
      <SignInModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconBox: {
    flexDirection: 'column',
    marginTop: 18,
    alignItems: 'center',
    marginLeft: 8,
    justifyContent: 'center',
  },
  logoLogout: {
    marginRight: 18,
  },
  hint: {
    fontSize: 10,
    marginLeft: 2,
    color: '#888',
    marginTop: 1,
  },
});

export default Header;
