import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateEmail } from '../reducers/user';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export default function HomeScreen() {


    return (
    <ImageBackground >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image/>
            <Text>Trouve ton colis !</Text>
        </KeyboardAvoidingView>
    </ImageBackground >    
    );
}