import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    Alert,
} from 'react-native';
import { navigate } from "../navigation/navigationRef";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { setHoraires } from '../reducers/horaires';
import { setRdv } from '../reducers/rdv';
import { reserverRdv } from '../reducers/colis'; 
import { useNavigation, useRoute } from '@react-navigation/native'; 
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const timeSlots = [
    '10h00 - 10h30',
    '10h30 - 11h00',
    '11h00 - 11h30',
    '11h30 - 12h00',
    '12h00 - 13h00',
    '13h00 - 13h30',
    '13h30 - 14h00',
    '14h00 - 14h30',
    '14h30 - 15h00',
    '15h00 - 15h30',
    '15h30 - 16h00',
];

export default function ClientCrenauxScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Param navigation
    const { relayId, trackingNumber } = route.params || {};

    useEffect(() => {
        
        if (relayId) {
            fetch(`${API_URL}/pros/info/${relayId}`) 
              .then(res => res.json())
              .then(data => {
                if (data.result && data.data?.horaires) {
                  dispatch(setHoraires(data.data.horaires));
                }
              })
              .catch(err => console.error("Erreur récupération horaires:", err));
        }
    }, [relayId]);

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
        }
    };

    //  Fonction conversion heures
    const convertTimeSlotToDateTime = (date, timeSlot) => {
        const [startTime] = timeSlot.split(' - ');
        const [hour, minute] = startTime.replace('h', ':').split(':');
        
        const rdvDate = new Date(date);
        rdvDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        
        return rdvDate.toISOString();
    };

    const handleValidate = async () => {
        if (!selectedTimeSlot) {
            Alert.alert('Erreur', 'Veuillez choisir un créneau horaire.');
            return;
        }

        if (!trackingNumber) {
            Alert.alert('Erreur', 'Numéro de tracking manquant.');
            return;
        }

        try {
            // utiliser reserverRdv au lieu de setRdv
            const rdvDateTime = convertTimeSlotToDateTime(selectedDate, selectedTimeSlot);

            const result = await dispatch(reserverRdv({
                trackingNumber: trackingNumber,
                rdvDate: rdvDateTime,
                relayId: relayId || "6841e0438bc7de726f971515"
            }));

            if (result.type.includes('fulfilled')) {
                const rendezVous = {
                    date: selectedDate.toLocaleDateString(),
                    time: selectedTimeSlot,
                    trackingNumber: trackingNumber
                };
                dispatch(setRdv(rendezVous));

                Alert.alert(
                    'Confirmation',
                    'Votre rendez-vous a bien été pris. Merci !',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('TabNavigatorClient', {screen: 'MyParcelsScreen'}),
                        },
                    ]
                );
            } else {
                Alert.alert('Erreur', 'Impossible de réserver le RDV. Veuillez réessayer.');
            }
        } catch (error) {
            console.error(" Erreur réservation:", error);
            Alert.alert('Erreur', 'Impossible de réserver le RDV. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>

            {trackingNumber && (
                <View style={styles.debugInfo}>
                    <Text style={styles.debugText}>Colis: {trackingNumber}</Text>
                </View>
            )}
            
            <Text style={styles.title}>Choisissez une date</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.title}>Choisissez un créneau horaire</Text>

            <FlatList
                data={timeSlots}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.timeSlot, selectedTimeSlot === item && styles.selectedSlot,]}
                        onPress={() => setSelectedTimeSlot(item)}>
                        <Text style={[styles.slotText, selectedTimeSlot === item && styles.selectedText,]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {selectedTimeSlot && (
                <View style={styles.summary}>
                    <Text style={styles.confirmText}>
                        Vous avez choisi le {selectedDate.toLocaleDateString()} entre {selectedTimeSlot}
                    </Text>
                </View>
            )}
            
            <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
                <Text style={styles.validateButtonText}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    
    // STYLE POUR DEBUG
    debugInfo: {
        backgroundColor: '#f0f8ff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    debugText: {
        fontSize: 14,
        color: '#0E56B4',
        fontWeight: 'bold',
    },
    
    dateButton: {
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
    },
    dateText: { fontSize: 16 },
    timeSlot: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    selectedSlot: {
        backgroundColor: '#0E56B4',
    },
    slotText: {
        fontSize: 16,
        textAlign: 'center',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    summary: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#b4deff',
        borderRadius: 8,
    },
    confirmText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#125890',
    },
    validateButton: {
        marginTop: 30,
        backgroundColor: '#0E56B4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    validateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});