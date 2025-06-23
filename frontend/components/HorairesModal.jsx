import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function HorairesModal({ visible, onClose, onSave }) {
  const token = useSelector(state => state.user.value.token); // ✅ ici et pas en dehors

  const [horaires, setHoraires] = useState(
    jours.reduce((acc, jour) => {
      acc[jour] = {
        matin: { ouverture: new Date(), fermeture: new Date() },
        apresMidi: { ouverture: new Date(), fermeture: new Date() },
        ferme: false,
      };
      return acc;
    }, {})
  );

  const [currentPicker, setCurrentPicker] = useState({ jour: null, moment: null, type: null });

  const handleFermeture = (jour) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: { ...prev[jour], ferme: !prev[jour].ferme }
    }));
  };

  const showPicker = (jour, moment, type) => {
    setCurrentPicker({ jour, moment, type });
  };

  const onTimeChange = (event, selectedDate) => {
    if (!selectedDate || !currentPicker.jour) return;

    const { jour, moment, type } = currentPicker;
    setHoraires(prev => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [moment]: {
          ...prev[jour][moment],
          [type]: selectedDate,
        }
      }
    }));

    setCurrentPicker({ jour: null, moment: null, type: null });
  };

  const handleSave = async () => {
    const format = (date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const formattedHoraires = {};

    for (let jour of jours) {
      formattedHoraires[jour] = {
        ferme: horaires[jour].ferme,
        matin: {
          ouverture: format(horaires[jour].matin.ouverture),
          fermeture: format(horaires[jour].matin.fermeture),
        },
        apresMidi: {
          ouverture: format(horaires[jour].apresMidi.ouverture),
          fermeture: format(horaires[jour].apresMidi.fermeture),
        }
      };
    }

    try {
      const response = await fetch('http://192.168.1.157:3006/pros/horaires', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ horaires: formattedHoraires }),
      });

      const data = await response.json();
      if (data.result) {
        alert('Horaires mis à jour avec succès');
        onSave && onSave(formattedHoraires);
        onClose();
      } else {
        alert('Erreur : ' + (data.error || 'Impossible de sauvegarder'));
      }
    } catch (error) {
      console.error('Erreur fetch horaires :', error);
      alert('Une erreur est survenue');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
    <ScrollView contentContainerStyle={modalStyles.scrollContent}>
    <View style={modalStyles.modal}>
      <Text style={modalStyles.title}>Horaires d’ouverture</Text>
        {jours.map(jour => (
          <View key={jour} style={modalStyles.jourBloc}>
            <View style={modalStyles.headerJour}>
              <Text style={modalStyles.jourLabel}>{jour.charAt(0).toUpperCase() + jour.slice(1)}</Text>
              <View style={modalStyles.switch}>
                <Text style={{ marginRight: 8 }}>Fermé</Text>
                <Switch
                  value={horaires[jour].ferme}
                  onValueChange={() => handleFermeture(jour)}
                />
              </View>
            </View>
            {!horaires[jour].ferme && (
              <>
                <View style={modalStyles.timeRow}>
                  <Text style={modalStyles.timeLabel}>Matin :</Text>
                  <TouchableOpacity onPress={() => showPicker(jour, 'matin', 'ouverture')}>
                    <Text style={modalStyles.timeBtn}>
                      Ouverture: {horaires[jour].matin.ouverture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showPicker(jour, 'matin', 'fermeture')}>
                    <Text style={modalStyles.timeBtn}>
                      Fermeture: {horaires[jour].matin.fermeture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={modalStyles.timeRow}>
                  <Text style={modalStyles.timeLabel}>Après-midi :</Text>
                  <TouchableOpacity onPress={() => showPicker(jour, 'apresMidi', 'ouverture')}>
                    <Text style={modalStyles.timeBtn}>
                      Ouverture: {horaires[jour].apresMidi.ouverture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showPicker(jour, 'apresMidi', 'fermeture')}>
                    <Text style={modalStyles.timeBtn}>
                      Fermeture: {horaires[jour].apresMidi.fermeture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}

        <TouchableOpacity style={modalStyles.button} onPress={handleSave}>
          <Text style={modalStyles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={modalStyles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        </View>
  </ScrollView>
  {currentPicker.jour && (
          <DateTimePicker value={horaires[currentPicker.jour][currentPicker.moment][currentPicker.type]} mode="time" is24Hour={true} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />
        )}
</Modal>
  );
}

const modalStyles = StyleSheet.create({
  modal: {
    backgroundColor: '#FFF4ED',
    borderRadius: 10,
    padding: 25,
    elevation: 5,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  jourBloc: {
    marginBottom: 15,
    backgroundColor: '#F1E6DE',
    borderRadius: 8,
    padding: 12,
  },
  headerJour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jourLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2C8D',
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'column',
    marginVertical: 6,
  },
  timeLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#3D2C8D',
  },
  timeBtn: {
    color: '#4B1D9A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#4B1D9A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#3D2C8D',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingVertical: 30,
  },
});
