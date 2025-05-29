import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';

export default function ConnexionScreen({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        navigation.navigate('');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUpScreen');
    };

    return (
        // Header à placer
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image style={styles.image} source={require('../assets/logo.jpg')} />
            <Text style={styles.title}>Trouve ton colis</Text>

            <TouchableOpacity onPress={() => handleSignIn()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSignUp()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'enregistrer</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}