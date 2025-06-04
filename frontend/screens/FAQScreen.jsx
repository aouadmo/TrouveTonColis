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
                    color="#5E4AE3"
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
    backgroundColor: '#FFFCE9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E4AE3',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    backgroundColor: '#E6E0FF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
  },
  questionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F2FF',
    padding: 12,
    borderRadius: 6,
  },
  question: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  answer: {
    padding: 10,
    paddingTop: 6,
    fontSize: 14,
    color: '#555',
  },
});
