import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Linking
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function CustomDrawerContent({ navigation }) {
  const openFAQ = () => {
    navigation.navigate('FAQScreen');
  };
  const handleSendEmail = () => {
    const email = 'support@trouvetoncolis.fr';
    const subject = 'Bug signalé depuis l’application';
    const body = 'Bonjour, je souhaite signaler un bug concernant : ';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 Menu</Text>

      {/* Accueil */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <FontAwesome5 name="home" size={18} color="#5E4AE3" style={styles.icon} />
        <Text style={styles.label}>Accueil</Text>
      </TouchableOpacity>

      {/* Histoire */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('HistoireRelais')}
      >
        <FontAwesome5 name="info-circle" size={18} color="#5E4AE3" style={styles.icon} />
        <Text style={styles.label}>C’est quoi un point relais ?</Text>
      </TouchableOpacity>

      {/* FAQ */}
      <TouchableOpacity
        style={styles.item}
        onPress={openFAQ}
      >
        <FontAwesome5 name="question-circle" size={18} color="#5E4AE3" style={styles.icon} />
        <Text style={styles.label}>FAQ</Text>
      </TouchableOpacity>

      {/* Contact */}
      <TouchableOpacity
        style={[styles.item, styles.mailItem]}
        onPress={handleSendEmail}

      >
        <FontAwesome5 name="envelope" size={18} color="#fff" style={styles.icon} />
        <Text style={[styles.label, { color: '#fff' }]}>Envoyez-nous un mail</Text>
      </TouchableOpacity>

      {/* Mention de l’équipe */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>👩‍💻 Développé par 4 apprenants en formation avec ❤️ 06/25</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE9',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E4AE3',
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  mailItem: {
    backgroundColor: '#5E4AE3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14, // pour équilibrer avec les autres
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
