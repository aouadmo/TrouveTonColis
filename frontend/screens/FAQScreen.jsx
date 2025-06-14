import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental is currently a no-op',
]);
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Header from '../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental &&
  typeof LayoutAnimation.configureNext === 'function'
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const faqData = [
    {
      category: '💌 Colis et livraisons',
      questions: [
        {
          question: 'Pourquoi mon colis est en point relais ?',
          answer:
            'Les livreurs sont seuls décideurs des colis qu\'ils dépose, Les point relais ne sont pas responssable.',
        },
        {
          question: 'Comment savoir si mon colis est arrivé ?',
          answer:
            'Rendez-vous sur la page d’accueil et cliquez sur "Rechercher un colis". Vous verrez si votre colis est arrivé et dans quel point relais il se trouve.',
        },
        {
          question: 'Puis-je venir sans RDV ?',
          answer:
            'Merci de toujours prévenir avant de venir, 10-30  minutes avant par SMS. Les relais particuliers ne sont pas des commerces, ils gèrent leurs disponibilités eux-mêmes.',
        },
      ],
    },
    {
      category: '🔐 Procuration & sécurité',
      questions: [
        {
          question: 'Quelqu’un d’autre peut-il récupérer mon colis ?',
          answer:
            'Oui, à condition d’avoir une procuration avec nom/prénom de la personne autorisée (message par SMS) et d’avoir votre pièce d’identité, le récupérateur devra présenter la sienne au point relais.',
        },
        {
          question: 'Est-ce sécurisé ?',
          answer:
            'Les personnes qui gèrent les points relais sont référencées via des plateformes comme Welco ou Pickme. Vos colis sont stockés temporairement et en sécurité.',
        },

      ],
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>❓ Foire aux questions</Text>
        {faqData.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.questions.map((q, j) => (
              <View key={j} style={styles.item}>
                <TouchableOpacity
                  onPress={() => toggleExpand(`${i}-${j}`)}
                  style={styles.questionBox}
                >
                  <Text style={styles.question}>{q.question}</Text>
                  <FontAwesome5
                    name={expandedIndex === `${i}-${j}` ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#5B4E9C" // couleur texte neutre
                  />
                </TouchableOpacity>
                {expandedIndex === `${i}-${j}` && (
                  <Text style={styles.answer}>{q.answer}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFCF2', // fond neutre entre #FFFCE9 et #FFFAF5
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B4E9C', // mélange entre texte pro et client
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B4E9C',
    marginBottom: 12,
  },
  item: {
    marginBottom: 14,
  },
  questionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECE9F9', // lavande/gris très doux
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D4F3',
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3E3A6D', // plus sérieux mais doux
    flexShrink: 1,
    paddingRight: 10,
  },
  answer: {
    backgroundColor: '#F6F5FB',
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#4D4A63',
    borderWidth: 1,
    borderColor: '#E0DEF1',
  },
});
