import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
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
</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFCE9',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    color: '#5E4AE3',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
    lineHeight: 22,
  },
  bullet: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
});
