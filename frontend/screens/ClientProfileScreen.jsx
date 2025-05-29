import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

export default function ClientProfileScreen() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text>Page ClientProfileScreen</Text>
        </KeyboardAvoidingView>
    );
}