import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

export default function MyParcelsScreen() {
    return (
<<<<<<< HEAD
        <KeyboardAvoidingView style={styles.container}>
        <Text>Page MyParcelsScreen</Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF4ED', // couleur de fond si tu veux respecter ta charte
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });
  
=======
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text>Page MyParcelsScreen</Text>
        </KeyboardAvoidingView>
    );
}
>>>>>>> mohamed-codebarscan-feature
