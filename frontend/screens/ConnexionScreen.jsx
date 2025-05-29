import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';

export default function ConnexionScreen({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignIn = () => {
        setModalVisible(true);
    };

    const handleLogin = () => {
        dispatch(login(email));
        setModalVisible(false);
    };

    const handleSignUp = () => {
        navigation.navigate('SignUpScreen');
    };

    return (
        // Header à placer
        <KeyboardAvoidingView style={styles.container} >
            <Image style={styles.image} source={require('../assets/logo.jpg')} />
            <Text style={styles.title}>Trouve ton colis</Text>

            <TouchableOpacity onPress={handleSignIn} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSignUp()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'enregistrer</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Connexion</Text>

                    <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                    <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} style={styles.input} />

                    <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
                        <Text style={styles.textButton}>Se connecter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttonCancel} activeOpacity={0.8}>
                        <Text style={styles.textButton}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonCancel: {
        backgroundColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    textButton: {
        color: "#fff",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
});