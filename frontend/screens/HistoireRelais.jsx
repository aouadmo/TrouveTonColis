import React, { useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Linking, 
  TouchableOpacity,
  View 
} from 'react-native';
import Header from '../components/Header';

export default function HistoireRelais() {
  
  // États pour gérer l'ouverture/fermeture des sections
  const [sectionsOpen, setSectionsOpen] = useState({
    definition: true,
    fonctionnement: false,
    realite: false,
    defis: false,
    solution: false,
    humain: false,
    equipe: false
  });

  // Fonction pour toggle une section
  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Ouverture du lien Google Avis
  const handleGoogleReview = () => {
    Linking.openURL('https://g.co/kgs/yXawQuK');
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Section 1 - Définition */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('definition')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Qu'est-ce qu'un point relais particulier ?</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.definition ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.definition && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                Un <Text style={styles.bold}>point relais particulier</Text> est un service où des particuliers, depuis leur domicile, 
                réceptionnent et gardent temporairement des colis pour leurs voisins. C'est une alternative moderne aux points relais traditionnels 
                (bureaux de tabac, supermarchés).
              </Text>

              <Text style={styles.paragraph}>
                Grâce à des plateformes comme <Text style={styles.bold}>Welco</Text>, <Text style={styles.bold}>Pickme</Text> ou <Text style={styles.bold}>CosyColis</Text>,
                n'importe quel particulier peut devenir point relais après inscription et validation. Il définit ses créneaux de disponibilité 
                et reçoit une petite rémunération pour chaque colis traité.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 2 - Fonctionnement */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('fonctionnement')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comment ça fonctionne concrètement ?</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.fonctionnement ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.fonctionnement && (
            <View style={styles.sectionContent}>
              <Text style={styles.bullet}>• Le particulier s'inscrit sur une plateforme agréée</Text>
              <Text style={styles.bullet}>• Il définit ses horaires et jours de disponibilité</Text>
              <Text style={styles.bullet}>• Les transporteurs livrent les colis à son domicile</Text>
              <Text style={styles.bullet}>• Il stocke temporairement les colis dans un espace dédié</Text>
              <Text style={styles.bullet}>• Les destinataires viennent récupérer leurs colis aux horaires convenus</Text>
              <Text style={styles.bullet}>• Le gérant perçoit une commission par colis traité</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 3 - Réalité (Section importante) */}
        <TouchableOpacity 
          style={[styles.sectionContainer, styles.importantSection]}
          onPress={() => toggleSection('realite')}
          activeOpacity={0.8}
        >
          <View style={[styles.sectionHeader, styles.importantHeader]}>
            <Text style={[styles.sectionTitle, styles.importantTitle]}>La réalité d'un point relais particulier</Text>
            <Text style={[styles.toggleIcon, styles.importantToggle]}>
              {sectionsOpen.realite ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.realite && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                Soyons transparents sur la rémunération : <Text style={styles.bold}>0,20€ par colis</Text> pour UPS, DHL et Colissimo, 
                <Text style={styles.bold}>0,40€ pour Colis Privé</Text>. Pour si peu, le gérant doit réceptionner, scanner, 
                envoyer un SMS à chaque client, répondre aux questions, écrire le prénom sur chaque colis et organiser le stockage.
              </Text>

              <Text style={styles.paragraph}>
                Les contraintes sont strictes : <Text style={styles.bold}>minimum 6h par jour, 4 fois par semaine</Text>, 
                plus le samedi pour certains transporteurs. Beaucoup de gérants dépassent ces exigences par engagement envers leur communauté.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 4 - Défis */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('defis')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Les défis quotidiens du métier</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.defis ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.defis && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                Au-delà de la logistique, les gérants font face à des situations humaines difficiles : clients mécontents qui découvrent 
                la livraison chez un particulier, incompréhensions sur le service, parfois même des messages désobligeants.
              </Text>

              <Text style={styles.paragraph}>
                Imaginez : réveil 9h, petit-déjeuner, puis réunion ou entretien. 10h : ouverture du point relais. 
                Pendant 6h, vous essayez de coder, réviser, gérer vos papiers... entre les livreurs qui sonnent, 
                les clients qui passent, les SMS et appels incessants.
              </Text>

              <Text style={styles.paragraph}>
                16h : fermeture express, cours jusqu'à 21h45. Réouverture épuisé de 21h45 à 22h. 
                Puis rangement des colis, organisation des renvois, programmation des relances pour demain. 
                Et recevoir "Vous ouvrez ce soir ?" ou "Je peux venir dimanche 9h ?" 😤
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 5 - Solution */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('solution')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pourquoi notre application change la donne</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.solution ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.solution && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Trouve Ton Colis</Text> a été pensée pour soulager ces gérants dévoués ET améliorer 
                l'expérience client. Fini les appels incessants "Mon colis est-il arrivé ?", fini les incompréhensions sur les horaires.
              </Text>

              <Text style={styles.bullet}>• Information en temps réel : réduction drastique des appels "Mon colis est-il là ?"</Text>
              <Text style={styles.bullet}>• Respect des créneaux : fini les "j'arrive demain à 16h" - juste 10 minutes avant !</Text>
              <Text style={styles.bullet}>• Gestion des absences : prévenir 1 mois à l'avance ET afficher "FERMÉ" ne suffit parfois pas...</Text>
              <Text style={styles.bullet}>• Transparence des horaires : clients informés, moins de frustrations</Text>
              <Text style={styles.bullet}>• Procurations simplifiées : moins de gestion administrative pour le gérant</Text>
              <Text style={styles.bullet}>• Communication claire : réduction des malentendus et tensions</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 6 - Humain */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('humain')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Une solution humaine pour un service humain</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.humain ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.humain && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                Notre équipe a voulu créer plus qu'une simple app de tracking. Nous avons conçu un outil qui reconnaît 
                et facilite le travail remarquable des gérants de points relais particuliers, tout en éduquant les clients 
                sur cette économie collaborative de proximité.
              </Text>

              <Text style={styles.paragraph}>
                Car derrière chaque point relais particulier, il y a un étudiant qui jongle entre cours, examens, 
                entretiens d'embauche... et qui trouve quand même le temps de rendre service à sa communauté. 
                Entre les interruptions constantes en journée et les demandes hors horaires, cette dedication mérite 
                vraiment d'être reconnue.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 7 - Équipe */}
        <TouchableOpacity 
          style={styles.sectionContainer}
          onPress={() => toggleSection('equipe')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Une application faite maison, avec passion</Text>
            <Text style={styles.toggleIcon}>
              {sectionsOpen.equipe ? '▲' : '▼'}
            </Text>
          </View>
          
          {sectionsOpen.equipe && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                Cette application a été développée par <Text style={styles.bold}>une équipe de 4 personnes en formation</Text>.
                Elle a été conçue avec passion et beaucoup d'énergie pour répondre à un vrai besoin.
              </Text>

              <Text style={styles.paragraph}>
                Si vous repérez un bug, ou si vous avez une idée pour l'améliorer : n'hésitez pas à nous contacter ! 
                On développe entre les cours et les créneaux point relais, mais on fait de notre mieux.
              </Text>

              <Text style={styles.paragraph}>
                Un coup de main ? Respectez les horaires de votre gérant, lisez les infos affichées, 
                et <Text style={styles.bold}>laisser un petit avis</Text> pour soutenir le développement du projet nous ferait très plaisir !
              </Text>

              <TouchableOpacity 
                style={styles.reviewButton}
                onPress={handleGoogleReview}
                activeOpacity={0.8}
              >
                <Text style={styles.reviewButtonText}>Laisser un avis Google</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Palette Neutre - Fond blanc
  },
  
  // Container principal
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Sections collapsibles
  sectionContainer: {
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  importantSection: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: '#B48DD3',
  },
  
  // Headers des sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  importantHeader: {
    backgroundColor: '#B48DD3',
  },
  
  // Titres des sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444444',
    flex: 1,
  },
  importantTitle: {
    color: '#FFFFFF',
    fontSize: 19,
  },
  
  // Icône toggle
  toggleIcon: {
    fontSize: 18,
    color: '#79B4C4',
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  importantToggle: {
    color: '#FFFFFF',
  },
  
  // Contenu des sections
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  
  // Paragraphes
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    marginBottom: 12,
  },
  
  // Puces
  bullet: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 8,
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#79B4C4',
  },
  
  // Texte en gras
  bold: {
    fontWeight: 'bold',
    color: '#444444',
  },
  
  // Bouton de review
  reviewButton: {
    backgroundColor: '#B48DD3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  reviewButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});