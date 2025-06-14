import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Header from '../components/Header';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { navigate } from '../navigation/navigationRef';

export default function TableauBordScreen() {
    const handleSmsReplysScreen = () => navigate('SmsReplyScreen');

  return (
    <View style={styles.wrapper}>
      <Header />
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>🎯 Bienvenue sur TTC</Text>
        </View>

        
        <TouchableOpacity onPress={handleSmsReplysScreen} style={styles.button} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faBarcode} size={18} color="#fff" />
          <Text style={styles.textButton}>Aller vers la page SmsReply</Text>
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
});
