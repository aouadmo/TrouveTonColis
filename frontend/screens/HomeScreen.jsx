import React from "react";
import {
  View, 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  TouchableOpacity
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faBox, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import { navigate } from '../navigation/navigationRef';

export default function HomeScreen({ navigation }) {
  
  // Handlers de navigation
  const handleSignUp = () => navigate('SignUpScreen');
  const handleSearch = () => navigate('SearchScreen');

  return (
    <View style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView style={styles.container}>
          
          {/* Section héro avec texte d'accueil */}
          <View style={styles.heroSection}>
            <FontAwesomeIcon icon={faBox} size={48} color="#B48DD3" style={styles.heroIcon} />
            <Text style={styles.appTitle}>Trouve ton colis</Text>
            <Text style={styles.heroSubtitle}>La solution simple et efficace</Text>
          </View>

          {/* Section principale d'actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Que souhaitez-vous faire ?</Text>
            
            {/* Bouton Recherche - Action principale */}
            <View style={styles.primaryActionContainer}>
              <Text style={styles.actionDescription}>
                Vérifiez rapidement l'état et la localisation de votre colis
              </Text>
              <TouchableOpacity 
                onPress={handleSearch} 
                style={[styles.button, styles.primaryButton]} 
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
                <Text style={styles.buttonText}>Rechercher mon colis</Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Bouton Inscription - Action secondaire */}
            <View style={styles.secondaryActionContainer}>
              <Text style={styles.actionDescription}>
                Nouveau ici ? Créez un compte pour profiter de toutes nos fonctionnalités
              </Text>
              <TouchableOpacity 
                onPress={handleSignUp} 
                style={[styles.button, styles.secondaryButton]} 
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faUserPlus} size={18} color="#B48DD3" />
                <Text style={styles.secondaryButtonText}>Créer un compte</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section avantages */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Pourquoi choisir Trouve ton colis ?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <FontAwesomeIcon icon={faSearch} size={16} color="#79B4C4" />
                <Text style={styles.benefitText}>Recherche instantanée et précise</Text>
              </View>
              <View style={styles.benefitItem}>
                <FontAwesomeIcon icon={faBox} size={16} color="#79B4C4" />
                <Text style={styles.benefitText}>Suivi de tous vos colis</Text>
              </View>
            </View>
          </View>

        </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  
  // Section héro
  heroSection: {
    alignItems: 'center',
    marginBottom: 1,
    paddingVertical: 10,
  },
  heroIcon: {
    marginBottom: 0,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#444444',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#B48DD3',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  
  // Section des actions principales
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#B48DD3',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444444',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  // Actions primaires et secondaires
  primaryActionContainer: {
    marginBottom: 12,
  },
  secondaryActionContainer: {
    marginTop: 12,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  
  // Boutons
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#B48DD3',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B48DD3',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: '#B48DD3',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  
  // Séparateur
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  
  // Section avantages
  benefitsSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444444',
    textAlign: 'center',
    marginBottom: 10,
  },
  benefitsList: {
    alignItems: 'flex-start',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  benefitText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 8,
    fontWeight: '500',
  },
});