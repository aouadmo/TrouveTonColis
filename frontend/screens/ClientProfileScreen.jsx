import React from "react";
import {
  View, 
  Image,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header.jsx';

export default function ClientProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <KeyboardAvoidingView style={styles.container}>
        <Text>Page ClientProfileScreen</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
