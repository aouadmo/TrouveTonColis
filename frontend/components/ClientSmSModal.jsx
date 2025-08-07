import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    Linking,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ClientSmSModal({
    visible,
    onClose,
    clientName,
    nbColisEnAttente
}) {
    const [checklist, setChecklist] = useState({
        pieceIdentite: false,
        procuration: false,
        horaires: false,
    });
    const [showPieceIdentiteInfo, setShowPieceIdentiteInfo] = useState(false);

    const sendSMSAfterChecklist = () => {
        const allChecked = Object.values(checklist).every(item => item === true);

        if (!allChecked) {
            Alert.alert(' Checklist incomplète', 'Merci de cocher tous les éléments avant d\'envoyer le SMS.');
            return;
        }

        const phone = "0666593076";
        const prenom = clientName || "un client";
        const messageNbColis = nbColisEnAttente > 1 ? `${nbColisEnAttente} colis` : "1 colis";
        const message = `Bonjour, je suis ${prenom}, j'arrive dans 10 minutes chercher ${messageNbColis}.`;
        const url = `sms:${phone}?body=${encodeURIComponent(message)}`;

        Linking.openURL(url);
        closeModal();
    };

    const closeModal = () => {
        setChecklist({
            pieceIdentite: false,
            procuration: false,
            horaires: false,
        });
        setShowPieceIdentiteInfo(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>✅ Checklist avant départ</Text>
                        <Text style={styles.modalSubtitle}>
                            Vérifiez que vous avez tout avant de partir chez Cécile
                        </Text>

                        {/* Pièce d'identité */}
                        <View style={styles.checklistItem}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setChecklist({ ...checklist, pieceIdentite: !checklist.pieceIdentite })}
                            >
                                <View style={[styles.checkbox, checklist.pieceIdentite && styles.checkboxChecked]}>
                                    {checklist.pieceIdentite && (
                                        <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                                    )}
                                </View>
                                <Text style={styles.checklistText}>
                                    Pièce d'identité originale
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.infoButton}
                                onPress={() => setShowPieceIdentiteInfo(!showPieceIdentiteInfo)}
                            >
                                <FontAwesome5 name="question-circle" size={16} color="#95C9D8" />
                            </TouchableOpacity>
                        </View>

                        {showPieceIdentiteInfo && (
                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxTitle}>📄 Pièces acceptées :</Text>
                                <Text style={styles.infoBoxText}>• Carte d'identité française</Text>
                                <Text style={styles.infoBoxText}>• Permis de conduire</Text>
                                <Text style={styles.infoBoxText}>• Passeport</Text>
                                <Text style={styles.infoBoxText}>• Carte de séjour</Text>
                                <Text style={styles.infoBoxText}>• Carte étudiante, de travail ... tant qu'il y a une photo de vous</Text>
                                <Text style={styles.infoBoxText}>• Carte de bus</Text>


                                <Text style={styles.infoBoxNote}>
                                    ⚠️ Photocopies et photos non acceptées
                                </Text>
                            </View>
                        )}

                        {/* Procuration */}
                        <View style={styles.checklistItem}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setChecklist({ ...checklist, procuration: !checklist.procuration })}
                            >
                                <View style={[styles.checkbox, checklist.procuration && styles.checkboxChecked]}>
                                    {checklist.procuration && (
                                        <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                                    )}
                                </View>
                                <Text style={styles.checklistText}>
                                    Procuration si nécessaire
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoBoxTitle}>📝 Comment faire une procuration :</Text>
                            <Text style={styles.infoBoxText}>
                                1. Envoyez un SMS à Cécile : "Je suis [Votre nom et prénom], j'autorise [Nom Prénom] à récupérer mon colis" mon numero : 0666593076
                            </Text>
                            <Text style={styles.infoBoxText}>
                                2. La personne mandatée doit avoir sa pièce d'identité + la vôtre
                            </Text>
                            <Text style={styles.infoBoxText}>
                                3. si vous ne pouvez pas confiéer votre piece d'identitée, vous pouvez la joindre à la procuration
                            </Text>
                        </View>

                        {/* Horaires */}
                        <View style={styles.checklistItem}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setChecklist({ ...checklist, horaires: !checklist.horaires })}
                            >
                                <View style={[styles.checkbox, checklist.horaires && styles.checkboxChecked]}>
                                    {checklist.horaires && (
                                        <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                                    )}
                                </View>
                                <Text style={styles.checklistText}>
                                    J'ai vérifié les horaires et fermetures
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoBoxTitle}>⏰ Rappel horaires :</Text>
                            <Text style={styles.infoBoxText}>• Lundi, Mercredi, Jeudi, Vendredi : 10h-16h puis 21h45-22h</Text>
                            <Text style={styles.infoBoxText}>• Mardi : 10h-20h puis 21h45-22h</Text>
                            <Text style={styles.infoBoxText}>• Samedi : 14h-17h (après les cours)</Text>
                            <Text style={styles.infoBoxText}>• Dimanche : FERMÉ</Text>
                            <Text style={styles.infoBoxNote}>
                                ℹ️ Vérifiez les affichages pour les congés/absences
                            </Text>
                        </View>

                        {/* Boutons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={closeModal}
                            >
                                <Text style={styles.cancelButtonText}>❌ Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.sendButton]}
                                onPress={sendSMSAfterChecklist}
                            >
                                <Text style={styles.sendButtonText}>📱 Envoyer SMS</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    // Modal Checklist
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0E56B4',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#95C9D8',
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
    },

    // Checklist items
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#95C9D8',
        borderRadius: 6,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#0E56B4',
        borderColor: '#0E56B4',
    },
    checklistText: {
        fontSize: 16,
        color: '#444444',
        fontWeight: '600',
        flex: 1,
    },
    infoButton: {
        padding: 8,
    },

    // Info boxes dans la modal
    infoBox: {
        backgroundColor: '#F0F8FF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#95C9D8',
        marginBottom: 16,
    },
    infoBoxTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0E56B4',
        marginBottom: 8,
    },
    infoBoxText: {
        fontSize: 14,
        color: '#0E56B4',
        lineHeight: 20,
        marginBottom: 4,
    },
    infoBoxNote: {
        fontSize: 12,
        color: '#D97706',
        fontStyle: 'italic',
        marginTop: 8,
    },

    // Boutons modal
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#95C9D8',
    },
    sendButton: {
        backgroundColor: '#0E56B4',
    },
    cancelButtonText: {
        color: '#0E56B4',
        fontWeight: '600',
        fontSize: 16,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});