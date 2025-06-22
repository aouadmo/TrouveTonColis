import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CustomDrawerContent({ navigation }) {
  
  // Navigation vers FAQ
  const openFAQ = () => {
    navigation.navigate('FAQScreen');
  };

  // Ouverture du client email
  const handleSendEmail = () => {
    const email = 'support@trouvetoncolis.fr';
    const subject = 'Message depuis l\'application';
    const body = 'Bonjour, je souhaite vous contacter concernant : ';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Menu</Text>

      {/* Navigation Accueil */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('HomeScreen')}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="home" size={18} color="#B48DD3" style={styles.icon} />
        <Text style={styles.label}>Accueil</Text>
      </TouchableOpacity>

      {/* Navigation Histoire */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('HistoireRelais')}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="info-circle" size={18} color="#B48DD3" style={styles.icon} />
        <Text style={styles.label}>C'est quoi un point relais ?</Text>
      </TouchableOpacity>

      {/* Navigation FAQ */}
      <TouchableOpacity
        style={styles.item}
        onPress={openFAQ}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="question-circle" size={18} color="#B48DD3" style={styles.icon} />
        <Text style={styles.label}>FAQ</Text>
      </TouchableOpacity>

      {/* Bouton Contact par email */}
      <TouchableOpacity
        style={[styles.item, styles.mailItem]}
        onPress={handleSendEmail}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="envelope" size={18} color="#fff" style={styles.icon} />
        <Text style={[styles.label, styles.mailLabel]}>Envoyez-nous un mail</Text>
      </TouchableOpacity>

      {/* Footer équipe */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💻 Développé avec passion par 4 apprenants motivés ❤️ {'\n'}
          06/25
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  
  // Titre du menu
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444444', // Palette Neutre - Texte principal
    marginBottom: 30,
    textAlign: 'center',
  },
  
  // Items de navigation
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 4,
  },
  
  // Icônes
  icon: {
    marginRight: 14,
    width: 20,
    textAlign: 'center',
  },
  
  // Labels des items
  label: {
    fontSize: 16,
    color: '#444444', // Palette Neutre - Texte principal
    fontWeight: '500',
  },
  
  // Item de contact spécial
  mailItem: {
    backgroundColor: '#B48DD3', // Palette Neutre - Boutons principaux
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 30,
    marginBottom: 8,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  mailLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    marginTop: 50,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#79B4C4', // Palette Neutre - Accent secondaire
    textAlign: 'center',
    lineHeight: 18,
  },
});