import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

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

export default function ClientCrenauxClient() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);


    useEffect(() => {
        fetch('http://192.168.1.157:3000/pros/info/${relayId}')
          .then(res => res.json())
          .then(data => {
            if (data.result && data.data?.horaires) {
              dispatch(setHoraires(data.data.horaires));
            }
          });
      }, []);

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleValidate = () => {
        if (!selectedTimeSlot) {
          Alert.alert('Erreur', 'Veuillez choisir un créneau horaire.');
          return;
        }
      
        const rendezVous = {
          date: selectedDate.toLocaleDateString(),
          time: selectedTimeSlot,
        };
      
        dispatch(setRdv(rendezVous));


        Alert.alert(
            'Confirmation',
            'Votre rendez-vous a bien été pris. Merci !',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('TabNavigatorClient', {screen: 'SearchScreen'}),
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
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
