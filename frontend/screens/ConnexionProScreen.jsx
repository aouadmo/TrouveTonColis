import React, { useState } from "react";
import {KeyboardAvoidingView, TextInput, StyleSheet,
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
    const [messageError, setMessageError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignIn = () => {
        setModalVisible(true);
    };

    const handleLogin = () => {
        if (!email || !password) {
            setMessageError("Veuillez remplir tous les champs.")
            setTimeout(() => setMessageError(''), 5000);
            return;
        }

        fetch('http://localhost:3000/pros/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    dispatch(login({ token: data.token, email: email }));
                    setModalVisible(false);
                    setEmail('');
                    setPassword('');
                    setMessageError('');
                    navigation.navigate('TabNavigator', { screen: 'TableauBord' });
                } 
            })
    };


    const handleSignUp = () => {
        navigation.navigate('SignUpProScreen');
    };

    return (
        <KeyboardAvoidingView style={styles.container} >
            <Text style={styles.title}>Trouve ton colis</Text>
            <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <KeyboardAvoidingView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Connexion</Text>
                        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                        <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} />

                        <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
                            {messageError ? (<Text style={styles.errorMessage}> Retentez votre chance ! {messageError} </Text>) : null}
                            <Text style={styles.textButton}>Se connecter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttonCancel} activeOpacity={0.8}>
                            <Text style={styles.textButton}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
    errorMessage: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
});