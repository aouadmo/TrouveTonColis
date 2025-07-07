import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function CustomDrawerContent({ navigation }) {
  
  // Récupération du statut utilisateur
  const { token, isPro } = useSelector(state => state.user.value);

  // Ouverture du client email
  const handleSendEmail = () => {
    const email = 'support@trouvetoncolis.fr';
    const subject = 'Message depuis l\'application';
    const body = 'Bonjour, je souhaite vous contacter concernant : ';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  // Navigation vers l'espace utilisateur selon le statut
  const handleBackToProfile = () => {
    if (isPro) {
      navigation.navigate('TabNavigatorPro', { screen: 'TableauBord' });
    } else {
      navigation.navigate('TabNavigatorClient', { screen: 'ProfilClient' });
    }
  };

  // Navigation conditionnelle selon le statut utilisateur
  const handleNavigation = () => {
    if (token) {
      // Si connecté, rediriger selon le type
      handleBackToProfile();
    } else {
      // Si pas connecté, rediriger vers connexion
      navigation.navigate('Login');
    }
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

      {/* Navigation conditionnelle selon statut utilisateur */}
      {token ? (
        // Si utilisateur connecté - Lien de retour stylé
        <TouchableOpacity
          style={[styles.item, styles.backItem]}
          onPress={handleBackToProfile}
          activeOpacity={0.8}
        >
          <FontAwesome5 
            name={isPro ? "chart-bar" : "user"} 
            size={18} 
            color="#fff" 
            style={styles.icon} 
          />
          <Text style={[styles.label, styles.backLabel]}>
            {isPro ? "Retour au tableau de bord" : "Retour à mon profil"}
          </Text>
        </TouchableOpacity>
      ) : (
        // Si utilisateur non connecté - Lien vers connexion
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sign-in-alt" size={18} color="#5E4AE3" style={styles.icon} />
          <Text style={styles.label}>Se connecter</Text>
        </TouchableOpacity>
      )}

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
        onPress={() => navigation.navigate('FAQ')}
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

      {/* Si utilisateur connecté, option de déconnexion */}
      {token && (
        <TouchableOpacity
          style={[styles.item, styles.logoutItem]}
          onPress={() => {
            console.log('Déconnexion');
          }}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sign-out-alt" size={18} color="#D32F2F" style={styles.icon} />
          <Text style={[styles.label, styles.logoutLabel]}>Se déconnecter</Text>
        </TouchableOpacity>
      )}

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
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  
  // Titre du menu
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444444',
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
    color: '#444444',
    fontWeight: '500',
  },
  
  // Item de retour spécial (pro/client)
  backItem: {
    backgroundColor: '#79B4C4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  backLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Item de contact spécial
  mailItem: {
    backgroundColor: '#B48DD3',
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
  
  // Item de déconnexion
  logoutItem: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  
  logoutLabel: {
    color: '#D32F2F',
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
    color: '#79B4C4',
    textAlign: 'center',
    lineHeight: 18,
  },
});