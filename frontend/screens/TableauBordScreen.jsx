import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Header from '../components/Header';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { navigate } from '../navigation/navigationRef';

export default function TableauBordScreen() {
const handleCamScreen = () => navigate('CameraScreen');

return (
<View style={styles.wrapper}>
<Header />
<KeyboardAvoidingView style={styles.container}>
<View style={styles.textContainer}>
<Text style={styles.title}>Tableau de bord</Text>
</View>

    <TouchableOpacity onPress={handleCamScreen} style={styles.button} activeOpacity={0.8}>
      <FontAwesomeIcon icon={faBarcode} size={18} color="#fff" />
      <Text style={styles.textButton}>Aller vers la page Camera</Text>
    </TouchableOpacity>
  </KeyboardAvoidingView>
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
textContainer: {
alignItems: "center",
},
textButton: {
fontSize: 16,
fontWeight: "bold",
marginLeft: 10,
color: "#fff",
},
button: {
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
backgroundColor: "#4B1D9A",
paddingVertical: 12,
borderRadius: 8,
marginBottom: 20,
},
});
