import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    TextInput,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import Header from '../components/Header.jsx';

export default function MyParcelsScreen() {
    return (
        <View>      
            <Header />
        <KeyboardAvoidingView style={styles.container}>
        <Text>Page MyParcelsScreen</Text>
        </KeyboardAvoidingView>
        </View>
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
