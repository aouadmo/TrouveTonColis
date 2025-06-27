import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function HorairesModal({ visible, onClose, onSave, horairesInitiaux }) {
  const token = useSelector(state => state.user.value.token);
  const [currentPicker, setCurrentPicker] = useState(null);

  const [horaires, setHoraires] = useState(() => {
    return jours.reduce((acc, jour) => {
      acc[jour] = {
        matin: { ouverture: new Date(), fermeture: new Date(), ferme: false },
        apresMidi: { ouverture: new Date(), fermeture: new Date(), ferme: false },
        ferme: false,
      };
      return acc;
    }, {});
  });

  // ✅ Appliquer les horaires initiaux dès qu’ils sont chargés
  useEffect(() => {
    if (!horairesInitiaux) return;

    const parseTime = (timeStr) => {
      if (!timeStr) return new Date(2000, 0, 1, 9, 0); // fallback
      const [h, m] = timeStr.split(':');
      return new Date(2000, 0, 1, parseInt(h), parseInt(m));
    };

    const loaded = jours.reduce((acc, jour) => {
      const h = horairesInitiaux[jour] || {};
      acc[jour] = {
        ferme: h.ferme || false,
        matin: {
          ouverture: parseTime(h?.matin?.ouverture),
          fermeture: parseTime(h?.matin?.fermeture),
          ferme: h?.matin?.ferme || false,
        },
        apresMidi: {
          ouverture: parseTime(h?.apresMidi?.ouverture),
          fermeture: parseTime(h?.apresMidi?.fermeture),
          ferme: h?.apresMidi?.ferme || false,
        },
      };
      return acc;
    }, {});
    setHoraires(loaded);
  }, [horairesInitiaux]);

  const handleJourFermeture = (jour) => {
    setHoraires((prev) => ({
      ...prev,
      [jour]: { ...prev[jour], ferme: !prev[jour].ferme },
    }));
  };

  const toggleFermetureMoment = (jour, moment) => {
    setHoraires((prev) => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [moment]: {
          ...prev[jour][moment],
          ferme: !prev[jour][moment].ferme,
        },
      },
    }));
  };

  const showPicker = (jour, moment, type) => {
    setCurrentPicker({ jour, moment, type });
  };

  const onTimeChange = (event, selectedDate) => {
    if (!selectedDate || !currentPicker?.jour) return;
    const { jour, moment, type } = currentPicker;

    setHoraires((prev) => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [moment]: {
          ...prev[jour][moment],
          [type]: selectedDate,
        },
      },
    }));
    setCurrentPicker(null);
  };

  const handleSave = async () => {
    const format = (date) =>
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const formattedHoraires = {};

    for (const jour of jours) {
      formattedHoraires[jour] = {
        ferme: horaires[jour].ferme,
        matin: {
          ouverture: format(horaires[jour].matin.ouverture),
          fermeture: format(horaires[jour].matin.fermeture),
          ferme: horaires[jour].matin.ferme,
        },
        apresMidi: {
          ouverture: format(horaires[jour].apresMidi.ouverture),
          fermeture: format(horaires[jour].apresMidi.fermeture),
          ferme: horaires[jour].apresMidi.ferme,
        },
      };
    }

    try {
      const response = await fetch(`${API_URL}/pros/horaires`, {
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
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
        <View style={styles.modal}>
          <Text style={styles.title}>Horaires d’ouverture</Text>

          {jours.map(jour => (
            <View key={jour} style={styles.jourBloc}>
              <View style={styles.headerJour}>
                <Text style={styles.jourLabel}>{jour.charAt(0).toUpperCase() + jour.slice(1)}</Text>
                <View style={styles.switch}>
                  <Text style={{ marginRight: 8 }}>Fermé</Text>
                  <Switch
                    value={!!horaires[jour]?.ferme}
                    onValueChange={() => handleJourFermeture(jour)}
                  />
                </View>
              </View>

              {!horaires[jour]?.ferme && (
                <>
                  {['matin', 'apresMidi'].map(moment => (
                    <View key={moment} style={styles.timeRow}>
                      <Text style={styles.timeLabel}>{moment === 'matin' ? 'Matin :' : 'Après-midi :'}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 8 }}>Fermé</Text>
                        <Switch
                          value={!!horaires[jour]?.[moment]?.ferme}
                          onValueChange={() => toggleFermetureMoment(jour, moment)}
                        />
                      </View>

                      {!horaires[jour][moment].ferme && (
                        <>
                          <TouchableOpacity onPress={() => showPicker(jour, moment, 'ouverture')}>
                            <Text style={styles.timeBtn}>
                              Ouverture: {horaires[jour][moment].ouverture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => showPicker(jour, moment, 'fermeture')}>
                            <Text style={styles.timeBtn}>
                              Fermeture: {horaires[jour][moment].fermeture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  ))}
                </>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {currentPicker?.jour && (
        <DateTimePicker
          value={horaires[currentPicker.jour][currentPicker.moment][currentPicker.type]}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  paddingBottom: 130, // plus d’espace pour le dernier jour
},
modal: {
  backgroundColor: '#FFF4ED',
  borderRadius: 10,
  padding: 35,
  elevation: 5,
},
});
