import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const faqData = [
    {
      category: '📦 Comprendre le point relais particulier',
      questions: [
        {
          question: 'Qu\'est-ce qu\'un point relais particulier ?',
          answer: 'Un point relais particulier est une personne qui, depuis son domicile, réceptionne et garde temporairement vos colis. C\'est une alternative aux points relais traditionnels (tabacs, supermarchés) via des plateformes comme Welco, Pickme ou CosyColis.',
        },
        {
          question: 'Pourquoi mon colis est livré chez un particulier ?',
          answer: 'C\'est le transporteur (UPS, DHL, Colissimo...) qui décide seul où déposer votre colis selon ses contraintes logistiques. Cécile n\'a aucun contrôle sur cette décision.',
        },
        {
          question: 'Est-ce légal et sécurisé ?',
          answer: 'Oui, totalement ! Cécile est référencée et validée par des plateformes agréées. Elle est formée pour la gestion des colis et respecte des protocoles stricts de sécurité et de stockage.',
        },
      ],
    },
    {
      category: '⏰ Récupération et horaires',
      questions: [
        {
          question: 'Comment savoir si mon colis est arrivé ?',
          answer: 'Utilisez notre application ! Recherchez votre colis sur la page d\'accueil. Vous verrez en temps réel s\'il est arrivé et chez Cécile.',
        },
        {
          question: 'Puis-je venir sans rendez-vous ?',
          answer: 'NON ! Règle d\'or : SMS 10 minutes avant d\'arriver, PAS PLUS TÔT. Pas "j\'arrive demain à 16h", pas "je passe dans 30 minutes environ". Exactement 10 minutes avant. Cécile peut avoir un entretien, un RDV médical...',
        },
        {
          question: 'Pourquoi exactement 10 minutes avant ?',
          answer: 'Cécile jongle entre études et point relais. Elle peut avoir un entretien important à 14h30, un RDV médical à 11h... Si elle reçoit "j\'arrive dans 30 min" à 10h45 pour un RDV à 11h15, c\'est la catastrophe !',
        },
        {
          question: 'Pourquoi ces horaires compliqués ?',
          answer: 'Cécile jongle entre ses études et le point relais. Par exemple : ouverte 10h-16h entre les cours, fermée pour aller en cours 16h30-21h45, puis réouverture 21h45-22h. C\'est un vrai casse-tête d\'organisation !',
        },
        {
          question: 'Pourquoi Cécile ferme parfois en journée ?',
          answer: 'Elle a cours ! Exemple typique : ouverte 10h-16h, puis cours 16h30-21h45, puis réouverture 21h45-22h. Le samedi après les cours du matin, réouverture 14h-17h. Elle est étudiante avant tout.',
        },
        {
          question: 'Puis-je venir le soir ou le week-end ?',
          answer: 'Respectez les horaires ! Après 22h c\'est fini, et le dimanche c\'est repos. Non, vous ne pouvez pas "juste passer 5 minutes" à 21h un vendredi. Cécile a aussi une vie privée.',
        },
      ],
    },
    {
      category: '🔐 Procuration et délégation',
      questions: [
        {
          question: 'Quelqu\'un d\'autre peut-il récupérer mon colis ?',
          answer: 'Oui ! Envoyez un SMS à Cécile : "Je suis [Votre nom et prénom], j\'autorise [Nom Prénom] à récupérer mon colis"(+ photo de votre piece d\'identitée si pas confié a la perssone). La personne doit avoir votre pièce d\'identité originale et la sienne. Cécile vérifiera les deux pièces d\'identité.',
        },
        {
          question: 'Comment faire une procuration ?',
          answer: 'SMS à Cécile : "Je suis Marie Martin, j\'autorise Paul Dupont à récupérer mon colis [photo piece identité si pas confiée à la personne]." La personne présente sa CNI + votre CNI originale .',
        },
        {
          question: 'Cécile peut-elle refuser une procuration ?',
          answer: 'Non, si elle est claire avec nom/prénom et que la personne a sa pièce d\'identité. C\'est un droit du destinataire de déléguer la récupération.',
        },
      ],
    },
    {
      category: '💰 Rémunération et respect',
      questions: [
        {
          question: 'Cécile est-elle bien payée pour ce service ?',
          answer: 'Honnêtement, non. 0,20€ par colis (0,40€ pour Colis Privé) pour réceptionner, scanner, stocker, envoyer des SMS et gérer les récupérations. C\'est avant tout un service rendu à la communauté.',
        },
        {
          question: 'Pourquoi Cécile semble parfois débordée ?',
          answer: 'Entre 10h-16h, elle gère : livreurs qui sonnent, clients qui viennent, SMS/appels incessants... tout en essayant de coder, réviser ou gérer ses papiers. Puis à 16h30 : cours jusqu\'à 21h45. Imaginez ce rythme !',
        },
        {
          question: 'Cécile peut-elle prendre des congés ?',
          answer: 'Bien sûr ! Mais même avec 1 mois de préavis, affiches sur la fenêtre, annonces Facebook/Google et SMS aux clients, certains sonnent quand même sur une étiquette "FERMÉ". Respectez les fermetures annoncées !',
        },
        {
          question: 'Où trouver les horaires et infos importantes ?',
          answer: 'À côté de la sonnette, sur l\'application, Facebook, Google. LISEZ avant de sonner ! Si c\'est marqué "FERMÉ", n\'insistez pas. Cécile a le droit aux vacances comme tout le monde.',
        },
        {
          question: 'Pourquoi Cécile ne répond plus aux messages parfois ?',
          answer: 'Quand on prévient 1 mois à l\'avance d\'une fermeture et qu\'on reçoit quand même "Vous êtes ouverte ?" pendant les congés... Parfois elle décroche mentalement. C\'est humain ! Si elle n\'est pas ouverte, c\'est qu\'elle est fermée ou elle est en cours, en rdv ...',
        },
        {
          question: 'Comment puis-je remercier Cécile ?',
          answer: 'Un simple "merci" fait plaisir ! Respecter ses horaires, prévenir avant de venir, être poli. Si le service vous satisfait, n\'hésitez pas à laisser un avis positif sur l\'application ou à lui donner un pourboir.',
        },
      ],
    },
    {
      category: '🛠️ Problèmes et solutions',
      questions: [
        {
          question: 'Mon colis a disparu, que faire ?',
          answer: 'D\'abord, vérifiez qu\'il n\'a pas été livré ailleurs. Contactez le transporteur puis contactez l\'expéditeur.',
        },
        {
          question: 'Je ne trouve pas le domicile de Cécile ?',
          answer: 'L\'adresse est dans l\'application. Si difficile à trouver, appelez poliment pour demander des indications. Ne sonnez pas chez les voisins, c\'est gênant pour elle.',
        },
        {
          question: 'Comment puis-je éviter d\'énerver Cécile ?',
          answer: 'LISEZ les informations ! Horaires à côté de la sonnette, annonces sur l\'app/Facebook. Si c\'est marqué "FERMÉ", ne sonnez pas. SMS 10/15 minutes avant. Et un simple "bonjour-merci" fait des miracles.',
        },
        {
          question: 'Un bug dans l\'application ?',
          answer: 'Notre équipe étudiante travaille dur pour corriger les bugs ! Signalez-le nous gentiment, on fera de notre mieux pour le corriger rapidement.',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>❓ Foire aux questions</Text>
        <Text style={styles.subtitle}>
          Tout ce que vous devez savoir sur les points relais particuliers
        </Text>
        
        {faqData.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.questions.map((q, j) => (
              <View key={j} style={styles.item}>
                <TouchableOpacity
                  onPress={() => toggleExpand(`${i}-${j}`)}
                  style={styles.questionBox}
                  activeOpacity={0.8}
                >
                  <Text style={styles.question}>{q.question}</Text>
                  <FontAwesome5
                    name={expandedIndex === `${i}-${j}` ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#444444"
                  />
                </TouchableOpacity>
                {expandedIndex === `${i}-${j}` && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answer}>{q.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
        
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            💡 Cette FAQ est basée sur l'expérience réelle de Cécile, votre point relais particulier. 
            Merci de votre compréhension et de votre bienveillance !
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#79B4C4',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 16,
  },
  item: {
    marginBottom: 12,
  },
  questionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#79B4C4',
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
  },
  footerNote: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});