import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { fetchMesColis } from '../reducers/colis';
import { navigate } from "../navigation/navigationRef";

export default function MyParcelsScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    // Redux state
    const { value: colis, loading, error } = useSelector(state => state.colis);
    const userInfo = useSelector(state => state.user.value);

    // Récupérer les colis du client connecté
    useEffect(() => {
        if (userInfo && userInfo.nom && userInfo.prenom) {
            console.log("🔍 Récupération des colis pour:", userInfo.nom, userInfo.prenom);
            dispatch(fetchMesColis({ 
                nom: userInfo.nom, 
                prenom: userInfo.prenom 
            }));
        }
    }, [dispatch, userInfo]);

    // ✅ AJOUTE ÇA - Recharger quand on revient sur la page
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (userInfo && userInfo.nom && userInfo.prenom) {
                console.log("🔄 Rechargement des colis (retour sur page)");
                dispatch(fetchMesColis({ 
                    nom: userInfo.nom, 
                    prenom: userInfo.prenom 
                }));
            }
        });

        return unsubscribe;
    }, [navigation, userInfo, dispatch]);

    // Fonctions utilitaires
    const getStatusIcon = (status) => {
        switch (status) {
            case "RDV réservé": return "calendar-check";
            case "Arrivé chez Cécile": 
            case "en attente": return "check-circle";
            case "Récupéré": return "handshake";
            default: return "box"; // ✅ CORRIGÉ
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "RDV réservé": return "#8B5CF6";
            case "Arrivé chez Cécile":
            case "en attente": return "#059669";
            case "Récupéré": return "#6B7280";
            default: return "#0E56B4";
        }
    };

    const getTransporteurColor = (transporteur) => {
        const transporteurClean = transporteur?.toLowerCase().trim() || '';
        console.log("🎨 Transporteur pour couleur:", transporteurClean); // Debug
        
        if (transporteurClean.includes('ups')) return "#8B4513";
        if (transporteurClean.includes('dhl')) return "#FFD700";
        if (transporteurClean.includes('colissimo')) return "#1E3A8A";
        if (transporteurClean.includes('colis privé') || transporteurClean.includes('colis prive')) return "#4C1A85";
        
        return "#6B7280"; // Couleur par défaut
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "—";
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('fr-FR') + " à " + 
               date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const isExpiringSoon = (dateArrivee) => {
        if (!dateArrivee) return false;
        const today = new Date();
        const arrivee = new Date(dateArrivee);
        const diffTime = today - arrivee;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 6; // Expire dans 2 jours (délai général 8 jours)
    };

    // Gestion des actions
    const handleReserverRdv = (colis) => {
        console.log("📅 Réservation RDV pour:", colis.trackingNumber);
        navigate('ClientCrenauxScreen', { 
            relayId: colis.rdvRelayId || "6841e0438bc7de726f971515", // ID par défaut
            trackingNumber: colis.trackingNumber
        });
    };

    const handleModifierRdv = (colis) => {
        Alert.alert(
            "Modifier RDV",
            `Voulez-vous modifier votre RDV du ${formatDateTime(colis.rdvDate)} ?`,
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Modifier", 
                    onPress: () => {
                        navigate('ClientCrenauxScreen', { 
                            relayId: colis.rdvRelayId || "6841e0438bc7de726f971515",
                            trackingNumber: colis.trackingNumber,
                            modificationRdv: true
                        });
                    }
                }
            ]
        );
    };

    // Calculer les stats
    const colisARecuperer = colis.filter(c => c.status !== "Récupéré").length;
    const colisRecuperes = colis.filter(c => c.status === "Récupéré").length;
    const totalColis = colis.length;

    // Gestion du loading et erreurs
    if (loading) {
        return (
            <SafeAreaView style={styles.wrapper}>
                <Header />
                <View style={styles.loadingContainer}>
                    <FontAwesome5 name="spinner" size={24} color="#0E56B4" />
                    <Text style={styles.loadingText}>Chargement de vos colis...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <Header />
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>📦 Mes Colis</Text>
                <Text style={styles.subtitle}>
                    Suivez l'état de vos livraisons chez Cécile
                </Text>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{colisARecuperer}</Text>
                        <Text style={styles.statLabel}>À récupérer</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{colisRecuperes}</Text>
                        <Text style={styles.statLabel}>Récupérés</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{totalColis}</Text>
                        <Text style={styles.statLabel}>Total chez Cécile</Text>
                    </View>
                </View>

                {/* Message si pas de colis */}
                {colis.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <FontAwesome5 name="box-open" size={48} color="#95C9D8" />
                        <Text style={styles.emptyTitle}>Aucun colis trouvé</Text>
                        <Text style={styles.emptySubtitle}>
                            Vos colis apparaîtront ici une fois qu'ils seront arrivés chez Cécile
                        </Text>
                    </View>
                )}

                {/* Liste des colis */}
                {colis.map((parcel) => (
                    <View key={parcel._id || parcel.trackingNumber} style={styles.parcelCard}>
                        {/* En-tête avec transporteur */}
                        <View style={[styles.parcelHeader, { 
                            backgroundColor: getTransporteurColor(parcel.transporteur) 
                        }]}>
                            <View style={styles.transporterInfo}>
                                <FontAwesome5 name="shipping-fast" size={16} color="#FFFFFF" />
                                <Text style={styles.transporterName}>
                                    {parcel.transporteur || 'Transporteur'}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { 
                                backgroundColor: getStatusColor(parcel.status) 
                            }]}>
                                <FontAwesome5 
                                    name={getStatusIcon(parcel.status)} 
                                    size={12} 
                                    color="#FFFFFF" 
                                />
                                <Text style={styles.statusText}>{parcel.status}</Text>
                            </View>
                        </View>

                        {/* Corps de la carte */}
                        <View style={styles.parcelBody}>
                            <Text style={styles.reference}>
                                Réf: {parcel.trackingNumber}
                            </Text>
                            
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <FontAwesome5 name="calendar-check" size={14} color="#0E56B4" />
                                    <Text style={styles.infoLabel}>Arrivée</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(parcel.date)}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <FontAwesome5 name="weight-hanging" size={14} color="#0E56B4" />
                                    <Text style={styles.infoLabel}>Poids</Text>
                                    <Text style={styles.infoValue}>
                                        {parcel.poids ? `${parcel.poids}kg` : "N/A"}
                                    </Text>
                                </View>
                            </View>

                            {/* RDV confirmé */}
                            {parcel.rdvConfirmed && parcel.rdvDate && (
                                <View style={styles.appointmentBox}>
                                    <FontAwesome5 name="clock" size={14} color="#059669" />
                                    <Text style={styles.appointmentText}>
                                        RDV réservé : {formatDateTime(parcel.rdvDate)}
                                    </Text>
                                </View>
                            )}

                            {/* Boutons d'action */}
                            {parcel.status !== "Récupéré" && (
                                <View style={styles.actionContainer}>
                                    {!parcel.rdvConfirmed ? (
                                        <TouchableOpacity 
                                            style={styles.actionButton}
                                            onPress={() => handleReserverRdv(parcel)}
                                        >
                                            <FontAwesome5 name="calendar-plus" size={14} color="#FFFFFF" />
                                            <Text style={styles.actionButtonText}>Réserver un créneau</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.modifyButton]}
                                            onPress={() => handleModifierRdv(parcel)}
                                        >
                                            <FontAwesome5 name="edit" size={14} color="#FFFFFF" />
                                            <Text style={styles.actionButtonText}>Modifier RDV</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Alerte expiration */}
                        {isExpiringSoon(parcel.date) && parcel.status !== "Récupéré" && (
                            <View style={styles.warningBanner}>
                                <FontAwesome5 name="exclamation-triangle" size={14} color="#DC2626" />
                                <Text style={styles.warningText}>
                                    ⚠️ Expire bientôt ! Pensez à récupérer votre colis
                                </Text>
                            </View>
                        )}
                    </View>
                ))}

                <View style={styles.helpBox}>
                    <FontAwesome5 name="info-circle" size={16} color="#0E56B4" />
                    <Text style={styles.helpText}>
                        💡 Vos colis apparaissent ici uniquement quand Cécile les a reçus et scannés. 
                        Délais de conservation : UPS (8j), DHL/Colissimo (14j), Colis Privé (10j)
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFFCE9',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFCE9',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0E56B4',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#95C9D8',
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    
    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#0E56B4',
    },
    
    // Empty state
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0E56B4',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#95C9D8',
        textAlign: 'center',
    },
    
    // Stats
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#95C9D8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0E56B4',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#95C9D8',
        textAlign: 'center',
    },
    
    // Cartes colis
    parcelCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    parcelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    transporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    transporterName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    
    // Corps des cartes
    parcelBody: {
        padding: 16,
    },
    reference: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        fontFamily: 'monospace',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 16,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: '#95C9D8',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: '#0E56B4',
        fontWeight: '600',
    },
    
    // RDV confirmé
    appointmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#059669',
        marginBottom: 12,
    },
    appointmentText: {
        color: '#059669',
        fontWeight: '600',
        fontSize: 14,
    },
    
    // Actions
    actionContainer: {
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#0E56B4',
        padding: 12,
        borderRadius: 8,
    },
    modifyButton: {
        backgroundColor: '#8B5CF6',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    
    // Alerte expiration
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FEF2F2',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#FECACA',
    },
    warningText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },
    
    // Aide
    helpBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#F0F8FF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#95C9D8',
        marginTop: 8,
    },
    helpText: {
        flex: 1,
        fontSize: 14,
        color: '#0E56B4',
        lineHeight: 20,
    },
});