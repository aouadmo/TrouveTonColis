import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function TableauBordScreen() {
  return (
    <View style={{ flex: 1 }}>
           <Header role="pro" />
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tableau de Bord</Text>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
});
