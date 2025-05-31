import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Header() {
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
    
            fetch('http://localhost:3000/users/signin', {
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
    
                        console.log("Connexion réussie, redirection vers SearchScreen");
                        navigation.navigate('TabNavigator', { screen: 'SearchScreen' });
                    } else {
                        setMessageError(data.error || "Connexion échouée.");
                        setTimeout(() => setMessageError(''), 5000);
                    }
                })
        };
  
  return (
    <View style={styles.container}>
      {/* Logo à gauche */}
      <Image
        source={require('../assets/adaptive-icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Titre au centre */}
      <Text style={styles.title}>TROUVE TON COLIS</Text>

      {/* Icône de connexion à droite */}
      <TouchableOpacity onPress={() => console.log('Connexion')}>
        <FontAwesome name="user-circle-o" size={28} color="#555" />
      </TouchableOpacity>
    </View>
  );
}