import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';

export default function MyParcelsScreen() {
    
    // Données factices pour l'habillage
    const mockParcels = [
        {
            id: 1,
            reference: "UPS123456789FR",
            transporteur: "UPS",
            status: "Arrivé chez Cécile",
            dateArrivee: "2024-06-20",
            dateExpiration: "2024-06-28", // 8 jours
            creneauReserve: null,
            couleur: "#8B4513", // Marron UPS
        },
        {
            id: 2,
            reference: "DHL987654321FR",
            transporteur: "DHL",
            status: "Arrivé chez Cécile",
            dateArrivee: "2024-06-18",
            dateExpiration: "2024-07-02", // 14 jours
            creneauReserve: "2024-06-23 15:30",
            couleur: "#FFD700", // Jaune DHL
        },
        {
            id: 3,
            reference: "COL456789123FR",
            transporteur: "Colissimo",
            status: "Récupéré",
            dateArrivee: "2024-06-15",
            dateRecuperation: "2024-06-17",
            dateExpiration: null,
            creneauReserve: null,
            couleur: "#1E3A8A", // Bleu Colissimo
        },
        {
            id: 4,
            reference: "CP789123456FR",
            transporteur: "Colis Privé",
            status: "Arrivé chez Cécile",
            dateArrivee: "2024-06-19",
            dateExpiration: "2024-06-29", // 10 jours
            creneauReserve: "2024-06-22 14:00",
            couleur: "#4C1A85", // Violet/Noir officiel Colis Privé
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Arrivé chez Cécile": return "check-circle";
            case "Récupéré": return "handshake";
            default: return "package";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Arrivé chez Cécile": return "#059669";
            case "Récupéré": return "#6B7280";
            default: return "#0E56B4";
        }
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

    const isExpiringSoon = (dateExpiration) => {
        if (!dateExpiration) return false;
        const today = new Date();
        const expiry = new Date(dateExpiration);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2;
    };

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

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>À récupérer</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>1</Text>
                        <Text style={styles.statLabel}>Récupérés</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>4</Text>
                        <Text style={styles.statLabel}>Total chez Cécile</Text>
                    </View>
                </View>

                {mockParcels.map((parcel) => (
                    <View key={parcel.id} style={styles.parcelCard}>
                        {/* En-tête avec transporteur */}
                        <View style={[styles.parcelHeader, { backgroundColor: parcel.couleur }]}>
                            <View style={styles.transporterInfo}>
                                <FontAwesome5 name="shipping-fast" size={16} color="#FFFFFF" />
                                <Text style={styles.transporterName}>{parcel.transporteur}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(parcel.status) }]}>
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
                            <Text style={styles.reference}>Réf: {parcel.reference}</Text>
                            
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <FontAwesome5 name="calendar-check" size={14} color="#0E56B4" />
                                    <Text style={styles.infoLabel}>Arrivée</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(parcel.dateArrivee)}
                                    </Text>
                                </View>
                                
                            {parcel.status === "Récupéré" ? (
                                <View style={styles.infoItem}>
                                    <FontAwesome5 name="handshake" size={14} color="#059669" />
                                    <Text style={styles.infoLabel}>Récupéré le</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(parcel.dateRecuperation)}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.infoItem}>
                                    <FontAwesome5 name="calendar-times" size={14} color="#DC2626" />
                                    <Text style={styles.infoLabel}>Expiration</Text>
                                    <Text style={[
                                        styles.infoValue,
                                        isExpiringSoon(parcel.dateExpiration) && styles.expiringText
                                    ]}>
                                        {formatDate(parcel.dateExpiration)}
                                    </Text>
                                </View>
                            )}
                            </View>

                            {parcel.creneauReserve && (
                                <View style={styles.appointmentBox}>
                                    <FontAwesome5 name="clock" size={14} color="#059669" />
                                    <Text style={styles.appointmentText}>
                                        RDV réservé : {formatDateTime(parcel.creneauReserve)}
                                    </Text>
                                </View>
                            )}

                            {parcel.status === "Arrivé chez Cécile" && !parcel.creneauReserve && (
                                <TouchableOpacity style={styles.actionButton}>
                                    <FontAwesome5 name="calendar-plus" size={14} color="#FFFFFF" />
                                    <Text style={styles.actionButtonText}>Réserver un créneau</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Alerte expiration */}
                        {isExpiringSoon(parcel.dateExpiration) && (
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
        backgroundColor: '#FFFCE9', // Palette Client - Fond crème
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
        color: '#0E56B4', // Palette Client - Bleu principal
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#95C9D8', // Palette Client - Bleu clair
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    
    // Stats en haut
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
    expiringText: {
        color: '#DC2626',
        fontWeight: 'bold',
    },
    
    // RDV réservé
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
    
    // Bouton d'action
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#0E56B4',
        padding: 12,
        borderRadius: 8,
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
    
    // Aide en bas
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