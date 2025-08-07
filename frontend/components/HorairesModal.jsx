import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch, Platform, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function HorairesModal({ visible, onClose, onSave, horairesInitiaux }) {
  const token = useSelector(state => state.user.value.token);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [modeCopie, setModeCopie] = useState(false);
  const [jourSource, setJourSource] = useState(null);
  const [joursDestination, setJoursDestination] = useState(new Set());

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

  // Réinitialisation quand la modal s'ouvre/ferme
  useEffect(() => {
    if (!visible) {
      // Quand la modal se ferme, reset tout
      setModeCopie(false);
      setJourSource(null);
      setJoursDestination(new Set());
      setCurrentPicker(null);
    }
  }, [visible]);

  // Appliquer les horaires initiaux
  useEffect(() => {
    if (!horairesInitiaux) return;

    const parseTime = (timeStr) => {
      if (!timeStr) return new Date(2000, 0, 1, 9, 0);
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


  const demarrerCopie = (jour) => {
    setJourSource(jour);
    setModeCopie(true);
    setJoursDestination(new Set());
  };


  const annulerCopie = () => {
    setModeCopie(false);
    setJourSource(null);
    setJoursDestination(new Set());
  };

  const toggleJourDestination = (jour) => {
    if (jour === jourSource) return;
    
    const nouveauxJours = new Set(joursDestination);
    if (nouveauxJours.has(jour)) {
      nouveauxJours.delete(jour);
    } else {
      nouveauxJours.add(jour);
    }
    setJoursDestination(nouveauxJours);
  };

  const appliquerHoraires = () => {
    if (!jourSource || joursDestination.size === 0) return;

    const horairesSource = horaires[jourSource];
    const joursArray = Array.from(joursDestination);
    
    // Copier les horaires
    setHoraires(prev => {
      const nouveau = { ...prev };
      joursArray.forEach(jour => {
        nouveau[jour] = {
          ferme: horairesSource.ferme,
          matin: {
            ouverture: new Date(horairesSource.matin.ouverture.getTime()),
            fermeture: new Date(horairesSource.matin.fermeture.getTime()),
            ferme: horairesSource.matin.ferme,
          },
          apresMidi: {
            ouverture: new Date(horairesSource.apresMidi.ouverture.getTime()),
            fermeture: new Date(horairesSource.apresMidi.fermeture.getTime()),
            ferme: horairesSource.apresMidi.ferme,
          },
        };
      });
      return nouveau;
    });

    // Message de confirmation
    Alert.alert(
      " Horaires copiées !",
      `Les horaires de ${jourSource} ont été copiées sur : ${joursArray.join(', ')}`
    );

    // Sortir du mode copie
    annulerCopie();
  };

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

    if (modeCopie) {
      annulerCopie();
    }

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
        Alert.alert(' Succès', 'Horaires mis à jour avec succès');
        onSave && onSave(formattedHoraires);
        onClose();
      } else {
        Alert.alert(' Erreur', data.error || 'Impossible de sauvegarder');
      }
    } catch (error) {
      console.error('Erreur fetch horaires :', error);
      Alert.alert(' Erreur', 'Une erreur est survenue');
    }
  };

  const handleClose = () => {
    // Sortir du mode copie avant de fermer
    if (modeCopie) {
      annulerCopie();
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
        <View style={styles.modal}>
          <Text style={styles.title}>Horaires d'ouverture</Text>

          {modeCopie && (
            <View style={styles.copySection}>
              <Text style={styles.copyTitle}>
                📋 Copier les horaires de <Text style={styles.jourSource}>{jourSource}</Text>
              </Text>
              <Text style={styles.copySubtitle}>
                Sélectionnez les jours de destination :
              </Text>
              
              {joursDestination.size > 0 && (
                <View style={styles.selectedDays}>
                  {Array.from(joursDestination).map(jour => (
                    <Text key={jour} style={styles.selectedDay}>{jour}</Text>
                  ))}
                </View>
              )}

              <View style={styles.copyActions}>
                <TouchableOpacity 
                  style={[styles.copyBtn, styles.applyBtn]}
                  onPress={appliquerHoraires}
                  disabled={joursDestination.size === 0}
                >
                  <Text style={styles.copyBtnText}>
                    ✅ Appliquer ({joursDestination.size})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.copyBtn, styles.cancelBtn]}
                  onPress={annulerCopie}
                >
                  <Text style={styles.copyBtnText}>❌ Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {jours.map(jour => (
            <View key={jour} style={[
              styles.jourContainer,
              modeCopie && jour === jourSource && styles.jourSource,
              modeCopie && joursDestination.has(jour) && styles.jourDestination
            ]}>
              <View style={styles.jourHeader}>
                <View style={styles.jourTitleContainer}>
                  <Text style={styles.jourTitle}>
                    {jour.charAt(0).toUpperCase() + jour.slice(1)}
                  </Text>
                  
                  <View style={styles.jourActions}>
                    {/* Bouton copier (si pas en mode copie) */}
                    {!modeCopie && (
                      <TouchableOpacity 
                        style={styles.copyButton}
                        onPress={() => demarrerCopie(jour)}
                      >
                        <Text style={styles.copyButtonText}>📋</Text>
                      </TouchableOpacity>
                    )}
                    
                    {/* Bouton sélection (si en mode copie et pas le jour source) */}
                    {modeCopie && jour !== jourSource && (
                      <TouchableOpacity 
                        style={[
                          styles.selectButton,
                          joursDestination.has(jour) && styles.selectButtonActive
                        ]}
                        onPress={() => toggleJourDestination(jour)}
                      >
                        <Text style={styles.selectButtonText}>
                          {joursDestination.has(jour) ? '✅' : '⭕'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Switch fermé */}
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Fermé</Text>
                  <Switch
                    value={!!horaires[jour]?.ferme}
                    onValueChange={() => handleJourFermeture(jour)}
                  />
                </View>
              </View>

              {/* Horaires détaillées */}
              {!horaires[jour]?.ferme && (
                <View style={styles.horaireDetails}>
                  {['matin', 'apresMidi'].map(moment => (
                    <View key={moment} style={styles.momentContainer}>
                      <View style={styles.momentHeader}>
                        <Text style={styles.momentTitle}>
                          {moment === 'matin' ? 'Matin' : 'Après-midi'} :
                        </Text>
                        <View style={styles.switchContainer}>
                          <Text style={styles.switchLabel}>Fermé</Text>
                          <Switch
                            value={!!horaires[jour]?.[moment]?.ferme}
                            onValueChange={() => toggleFermetureMoment(jour, moment)}
                          />
                        </View>
                      </View>

                      {!horaires[jour][moment].ferme && (
                        <View style={styles.timeButtons}>
                          <TouchableOpacity 
                            style={styles.timeButton}
                            onPress={() => showPicker(jour, moment, 'ouverture')}
                          >
                            <Text style={styles.timeButtonText}>
                              Ouverture: {horaires[jour][moment].ouverture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            style={styles.timeButton}
                            onPress={() => showPicker(jour, moment, 'fermeture')}
                          >
                            <Text style={styles.timeButtonText}>
                              Fermeture: {horaires[jour][moment].fermeture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Boutons principaux */}
          <View style={styles.mainActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>💾 Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>❌ Fermer</Text>
            </TouchableOpacity>
          </View>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  copySection: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  copyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 5,
  },
  jourSource: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  copySubtitle: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 10,
  },
  selectedDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
    fontSize: 12,
  },
  copyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  copyBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  applyBtn: {
    backgroundColor: '#4CAF50',
  },
  cancelBtn: {
    backgroundColor: '#F44336',
  },
  copyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  jourContainer: {
    marginBottom: 15,
    backgroundColor: '#F1E6DE',
    borderRadius: 8,
    padding: 12,
  },
  jourSource: {
    borderWidth: 2,
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  jourDestination: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  jourHeader: {
    marginBottom: 8,
  },
  jourTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jourTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2C8D',
    flex: 1,
  },
  jourActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  copyButton: {
    padding: 5,
    marginRight: 5,
  },
  copyButtonText: {
    fontSize: 18,
  },
  selectButton: {
    padding: 5,
    borderRadius: 15,
    minWidth: 30,
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#4CAF50',
  },
  selectButtonText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  horaireDetails: {
    marginTop: 8,
  },
  momentContainer: {
    marginBottom: 12,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  momentTitle: {
    fontWeight: 'bold',
    color: '#3D2C8D',
    fontSize: 14,
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeButton: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    minWidth: 120,
  },
  timeButtonText: {
    color: '#4B1D9A',
    textAlign: 'center',
    fontSize: 12,
  },
  mainActions: {
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#4B1D9A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});