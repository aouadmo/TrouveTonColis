import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
import Header from '../components/Header';

export default function HistoireRelais() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />

      {/* Scroll pour s’adapter à tous les écrans */}
      <ScrollView contentContainerStyle={styles.container}>
<Text style={styles.title}>📦 Un point relais particulier, c’est quoi ?</Text>

<Text style={styles.paragraph}>
  Grâce à des plateformes comme <Text style={styles.bold}>Welco</Text>, <Text style={styles.bold}>Pickme</Text> ou <Text style={styles.bold}>CosyColis</Text>,
  des particuliers comme vous et moi peuvent aujourd’hui devenir <Text style={styles.bold}>point relais</Text> depuis chez eux. Oui, oui… depuis leur salon 🛋️ !
</Text>

<Text style={styles.paragraph}>
  Le but ? <Text style={styles.bold}>Donner un coup de main</Text> à ses voisins en réceptionnant leurs colis 📬.
  Ces personnes ne sont pas salariées : elles gèrent leurs dispos à leur rythme 🕐, tout en respectant les règles fixées par les transporteurs ou plateformes partenaires.
</Text>

<Text style={styles.title}>📲 Pourquoi cette appli ?</Text>

<Text style={styles.paragraph}>
  Quand un colis est marqué “en cours de livraison”, c’est souvent flou : est-il encore dans le camion 🚚 ? Ou déjà chez le relais ? 
  Résultat : des allers-retours pour rien… et une petite montée de stress 😤.
</Text>

<Text style={styles.paragraph}>
  <Text style={styles.bold}>Trouve Ton Colis</Text> est née pour simplifier tout ça.
  Une appli pensée pour être claire, rapide et super intuitive. Pas besoin d’être geek pour l’utiliser 🤓.
</Text>

{/* Avantages de l’appli */}
<Text style={styles.bullet}>✅ Voir si un colis est bien arrivé, dans quel relais, avec toutes les infos à jour</Text>
<Text style={styles.bullet}>🛑 Éviter les déplacements inutiles (bye-bye les trajets pour rien)</Text>
<Text style={styles.bullet}>📆 Prendre un rendez-vous ou faire une procuration en 2 clics</Text>

<Text style={styles.title}>👩‍💻 Une appli faite maison, avec passion</Text>

<Text style={styles.paragraph}>
  Cette appli a été développée par <Text style={styles.bold}>une petite team de 4 personnes en formation</Text> 👨‍💻👩‍💻.
  Ce n’est pas encore du niveau NASA 🚀, mais elle a été conçue avec 💜 et beaucoup d’énergie.
</Text>

<Text style={styles.paragraph}>
  Si tu repères un bug 🐛, ou si tu as une idée brillante 💡 pour l’améliorer : n’hésite pas ! 😉
  <Text style={styles.paragraph}>
  Un coup de main ? Vous pouvez aussi <Text style={styles.bold}>laisser un petit avis</Text> sur notre page Google pour soutenir le relais 👀  
  {' '}<Text style={styles.link} onPress={() => Linking.openURL('https://g.co/kgs/yXawQuK')}>
    ➤ ici
  </Text>
</Text>
</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFAF2', // fond neutre très doux
  },
  container: {
    padding: 24,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 14,
    lineHeight: 28,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4D4A63',
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#C9B7FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bullet: {
    fontSize: 15,
    color: '#3E3A6D',
    marginLeft: 8,
    marginBottom: 10,
    paddingLeft: 14,
    paddingVertical: 10,
    backgroundColor: '#F6F3FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DAD5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  bold: {
    fontWeight: 'bold',
    color: '#4F378A',
  },
  link: {
    color: '#0E56B4',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  });
