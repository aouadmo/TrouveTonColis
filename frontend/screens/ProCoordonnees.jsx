import { View, StyleSheet, Text} from 'react-native';
import Header from '../components/Header';


export default function ProCoordonneesScreen(){
   
    return (
        <View style={styles.container}>
            <Header role="pro" />
            <Text style={styles.title}>Coordonnées du Point Relais</Text>
        </View>
        )
}



const styles = StyleSheet.create({
container: {
padding: 20,
paddingBottom: 40,
backgroundColor: "#fff",
flexGrow: 1,
justifyContent: "flex-start",
}
});