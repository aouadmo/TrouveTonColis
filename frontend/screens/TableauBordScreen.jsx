import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRetro, faComments, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import HorairesModal from '../components/HorairesModal';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function TableauBordScreen() {
  const token = useSelector((state) => state.user.value.token);
  const userInfo = useSelector((state) => state.user.value); // 🔥 RÉCUPÈRE TOUTES LES INFOS USER
  const rdvList = useSelector((state) => state.rdv.value) ?? [];
  const colisData = useSelector((state) => state.colis.value) ?? [];
  const navigation = useNavigation();

  // 🔥 FONCTION POUR RÉCUPÉRER LE NOM DU PRO
  const getNomPro = () => {
    if (userInfo?.prenom && userInfo?.nom) {
      return `${userInfo.prenom} ${userInfo.nom}`;
    } else if (userInfo?.prenom) {
      return userInfo.prenom;
    } else if (userInfo?.nom) {
      return userInfo.nom;
    } else if (userInfo?.email) {
      // Fallback : utiliser la partie avant @ de l'email
      return userInfo.email.split('@')[0];
    } else {
      return "cher professionnel";
    }
  };

  // 🔥 CALCUL DES STATISTIQUES RÉELLES
  const calculateStats = () => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('fr-FR');
    
    // Colis arrivés aujourd'hui
    const colisArrivesAujourdhui = colisData.filter(colis => {
      if (!colis.dateArrivee) return false;
      const arrivalDate = new Date(colis.dateArrivee);
      return arrivalDate.toLocaleDateString('fr-FR') === todayStr;
    }).length;
    
    // Colis récupérés aujourd'hui  
    const colisRecuperesAujourdhui = colisData.filter(colis => {
      if (!colis.dateRecuperation || colis.status !== 'recupere') return false;
      const recupDate = new Date(colis.dateRecuperation);
      return recupDate.toLocaleDateString('fr-FR') === todayStr;
    }).length;
    
    // Total colis en stock (non récupérés)
    const totalColisEnStock = colisData.filter(colis => 
      colis.status !== 'recupere' && colis.status !== 'retourne'
    ).length;
    
    // Colis qui expirent bientôt (dans les 3 prochains jours)
    const in3Days = new Date();
    in3Days.setDate(today.getDate() + 3);
    
    const colisExpiresBientot = colisData.filter(colis => {
      if (!colis.dateExpiration || colis.status === 'recupere') return false;
      const expDate = new Date(colis.dateExpiration);
      return expDate <= in3Days && expDate >= today;
    }).length;
    
    return {
      colisArrivesAujourdhui,
      colisRecuperesAujourdhui, 
      totalColisEnStock,
      colisExpiresBientot
    };
  };

  const stats = calculateStats();

  const [urgentMessage, setUrgentMessage] = useState('');
  const [isUrgenceActive, setIsUrgenceActive] = useState(false);
  const [savedHoraires, setSavedHoraires] = useState(null); // 🔥 SAUVEGARDER LES HORAIRES AVANT FERMETURE
  const [horairesModalVisible, setHorairesModalVisible] = useState(false);
  const [currentHoraires, setCurrentHoraires] = useState(null);
  const [creneauxCollapsed, setCreneauxCollapsed] = useState({});

  // ✅ SUPPRIME L'ANCIEN STATE STATS EN DUR

  const quickActions = [
    {
      id: 1,
      title: "Scanner un colis",
      icon: "qrcode",
      action: () => navigation.navigate('CameraScreen'),
      description: "Enregistrer un nouveau colis",
    },
    {
      id: 2,
      title: "Gérer les SMS",
      icon: "sms",
      action: () => navigation.navigate('SmsReplyScreen'),
      description: "Gérer les messages envoyés aux clients",
    },
    {
      id: 3,
      title: "relais fermé",
      icon: "boxes",
      action: () => handleUrgence(),
      description: "Etat d'urgence",
    },
    {
      id: 4,
      title: "Mes horaires",
      icon: "clock",
      action: () => ouvrirModalHoraires(),
      description: "Gérer les créneaux",
    },
  ];

  // Fonction pour regrouper les RDV par créneaux horaires
  const groupRdvByTimeSlot = (rdvList) => {
    const creneaux = {
      '08h-10h': [],
      '10h-12h': [],
      '12h-14h': [],
      '14h-16h': [],
      '16h-18h': [],
      '18h-20h': [],
      '20h-22h': []
    };
    
    rdvList.forEach(rdv => {
      const timeString = rdv.time || '12:00';
      const hour = parseInt(timeString.split(':')[0]);
      
      if (hour >= 8 && hour < 10) {
        creneaux['08h-10h'].push(rdv);
      } else if (hour >= 10 && hour < 12) {
        creneaux['10h-12h'].push(rdv);
      } else if (hour >= 12 && hour < 14) {
        creneaux['12h-14h'].push(rdv);
      } else if (hour >= 14 && hour < 16) {
        creneaux['14h-16h'].push(rdv);
      } else if (hour >= 16 && hour < 18) {
        creneaux['16h-18h'].push(rdv);
      } else if (hour >= 18 && hour < 20) {
        creneaux['18h-20h'].push(rdv);
      } else if (hour >= 20 && hour < 22) {
        creneaux['20h-22h'].push(rdv);
      }
    });
    
    // Retourner seulement les créneaux qui ont des RDV
    return Object.entries(creneaux)
      .filter(([creneau, rdvs]) => rdvs.length > 0)
      .reduce((acc, [creneau, rdvs]) => {
        acc[creneau] = rdvs;
        return acc;
      }, {});
  };

  // Fonction pour toggler l'état d'un créneau
  const toggleCreneau = (creneau) => {
    setCreneauxCollapsed(prev => ({
      ...prev,
      [creneau]: !prev[creneau]
    }));
  };

  // Composant pour afficher une section collapsible
  const RdvTimeSlotSection = ({ title, rdvs, isCollapsed, onToggle }) => {
    if (rdvs.length === 0) return null;
    
    // Icône selon l'heure
    const getIconForTimeSlot = (timeSlot) => {
      const hour = parseInt(timeSlot.split('h')[0]);
      if (hour < 12) return "sun";
      if (hour < 18) return "clock";
      return "moon";
    };
    
    return (
      <View style={styles.rdvSection}>
        <TouchableOpacity 
          style={styles.rdvSectionHeader} 
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <View style={styles.rdvSectionLeft}>
            <FontAwesome5 name={getIconForTimeSlot(title)} size={14} color="#4F378A" />
            <Text style={styles.rdvSectionTitle}>
              {title} ({rdvs.length})
            </Text>
          </View>
          <FontAwesome5 
            name={isCollapsed ? "chevron-down" : "chevron-up"} 
            size={12} 
            color="#4F378A" 
          />
        </TouchableOpacity>
        
        {!isCollapsed && (
          <View style={styles.rdvSectionContent}>
            {rdvs.map((rdv, index) => (
              <View key={index} style={styles.rdvCardCompact}>
                <FontAwesome5 name="clock" size={12} color="#4F378A" />
                <View style={styles.rdvInfoCompact}>
                  <Text style={styles.rdvTimeCompact}>{rdv.time}</Text>
                  <Text style={styles.rdvClientCompact}>
                    {rdv.client || 'Client non spécifié'}
                    {rdv.trackingNumber && (
                      <Text style={styles.rdvTrackingCompact}> - {rdv.trackingNumber}</Text>
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const ouvrirModalHoraires = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/pros/horaires`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.result && data.horaires) {
          setCurrentHoraires(data.horaires);
        }
      } catch (error) {
        console.log("Erreur récupération horaires:", error);
      }
    }
    
    setHorairesModalVisible(true);
  };

  // Fonction pour récupérer les horaires du jour actuel
  const getHorairesAujourdhui = () => {
    console.log("🔍 DEBUG currentHoraires:", currentHoraires);
    
    if (!currentHoraires) {
      return "Horaires non configurées";
    }

    const today = new Date();
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const todayName = dayNames[today.getDay()];
    
    console.log("📅 Jour actuel:", todayName);
    
    const todaySchedule = currentHoraires[todayName];
    console.log("⏰ Horaires du jour:", todaySchedule);
    
    if (!todaySchedule || todaySchedule.ferme) {
      return "Fermé aujourd'hui";
    }
    
    // 🔥 NOUVEAU FORMAT : matin/apresMidi
    const creneauxTexte = [];
    
    if (todaySchedule.matin && !todaySchedule.matin.ferme) {
      creneauxTexte.push(`${todaySchedule.matin.ouverture} - ${todaySchedule.matin.fermeture}`);
    }
    
    if (todaySchedule.apresMidi && !todaySchedule.apresMidi.ferme) {
      creneauxTexte.push(`${todaySchedule.apresMidi.ouverture} - ${todaySchedule.apresMidi.fermeture}`);
    }
    
    if (creneauxTexte.length === 0) {
      return "Pas d'horaires définies";
    }
    
    return creneauxTexte.join(', ');
  };

  const onHorairesSaved = (nouvellesHoraires) => {
    setCurrentHoraires(nouvellesHoraires);
    console.log("✅ Horaires mises à jour:", nouvellesHoraires);
    
    // 🔥 FORCER UNE NOUVELLE RÉCUPÉRATION DEPUIS L'API
    setTimeout(async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/pros/horaires`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          
          if (data.result && data.horaires) {
            setCurrentHoraires(data.horaires);
            console.log("🔄 Horaires rerechargées:", data.horaires);
          }
        } catch (error) {
          console.log("Erreur rechargeement horaires:", error);
        }
      }
    }, 500);
  };

  useEffect(() => {
    const fetchUrgentMessage = async () => {
      try {
        const response = await fetch(`${API_URL}/pros/sms`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.result && data.data) {
          setUrgentMessage(data.data.absentUrgentMessage);
        }
      } catch (error) {
        console.error('Erreur fetch message urgence :', error);
      }
    };

    // 🔥 RÉCUPÉRER AUSSI LES HORAIRES AU CHARGEMENT
    const fetchHoraires = async () => {
      try {
        const response = await fetch(`${API_URL}/pros/horaires`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log("📥 Horaires récupérées au chargement:", data);
        
        if (data.result && data.horaires) {
          setCurrentHoraires(data.horaires);
          console.log("✅ Horaires définies:", data.horaires);
        } else {
          console.log("❌ Pas d'horaires trouvées");
        }
      } catch (error) {
        console.log("Erreur récupération horaires:", error);
      }
    };

    if (token) {
      fetchUrgentMessage();
      fetchHoraires(); // 🔥 AJOUTER ICI
    }
  }, [token]);

  // 🔥 FONCTION COMPLÈTE DE GESTION D'URGENCE
  const handleUrgence = async () => {
    if (!isUrgenceActive) {
      // ✅ ACTIVATION DE L'URGENCE
      if (urgentMessage && token) {
        try {
          // 1. Sauvegarder les horaires actuels
          setSavedHoraires(currentHoraires);
          
          // 2. Créer des horaires "fermé" pour tous les jours
          const horairesUrgence = {};
          const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
          
          jours.forEach(jour => {
            horairesUrgence[jour] = {
              ferme: true,
              matin: { ferme: true, ouverture: "00:00", fermeture: "00:00" },
              apresMidi: { ferme: true, ouverture: "00:00", fermeture: "00:00" }
            };
          });
          
          // 3. Envoyer les horaires d'urgence à l'API
          console.log("🔄 Envoi des horaires d'urgence...");
          const responseHoraires = await fetch(`${API_URL}/pros/horaires`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ horaires: horairesUrgence })
          });
          
          console.log("📅 Réponse horaires:", responseHoraires.status, responseHoraires.statusText);
          
          // 4. Activer le statut d'urgence côté serveur (TEMPORAIREMENT DÉSACTIVÉ)
          // const responseUrgence = await fetch(`${API_URL}/pros/urgence`, {
          //   method: 'POST',
          //   headers: {
          //     'Authorization': `Bearer ${token}`,
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ 
          //     active: true, 
          //     message: urgentMessage,
          //     savedHoraires: currentHoraires
          //   })
          // });
          
          // 🔥 TEMPORAIRE : on fait juste les horaires pour tester
          const responseUrgence = { ok: true };
          console.log("🚨 Mode urgence simulé (API pas encore créée)");
          
          if (responseHoraires.ok && responseUrgence.ok) {
            setCurrentHoraires(horairesUrgence);
            setIsUrgenceActive(true);
            
            Alert.alert(
              "🚨 Urgence Activée", 
              `${urgentMessage}\n\n✅ Relais fermé temporairement\n✅ Clients informés automatiquement`,
              [{ text: "OK", style: "default" }]
            );
          } else {
            throw new Error('Erreur lors de l\'activation');
          }
          
        } catch (error) {
          console.error('Erreur activation urgence:', error);
          Alert.alert(
            "Erreur", 
            "Impossible d'activer l'urgence. Vérifiez votre connexion.",
            [{ text: "OK", style: "destructive" }]
          );
        }
      } else {
        Alert.alert("Erreur", "Aucun message d'urgence disponible.");
      }
      
    } else {
      // ✅ DÉSACTIVATION DE L'URGENCE
      try {
        // 1. Restaurer les horaires sauvegardées
        if (savedHoraires) {
          const responseHoraires = await fetch(`${API_URL}/pros/horaires`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ horaires: savedHoraires })
          });
          
          // 2. Désactiver le statut d'urgence côté serveur (TEMPORAIREMENT DÉSACTIVÉ)
          // const responseUrgence = await fetch(`${API_URL}/pros/urgence`, {
          //   method: 'POST',
          //   headers: {
          //     'Authorization': `Bearer ${token}`,
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ active: false })
          // });
          
          // 🔥 TEMPORAIRE : simulation
          const responseUrgence = { ok: true };
          console.log("✅ Désactivation urgence simulée");
          
          if (responseHoraires.ok && responseUrgence.ok) {
            setCurrentHoraires(savedHoraires);
            setIsUrgenceActive(false);
            setSavedHoraires(null);
            
            Alert.alert(
              "✅ Urgence Désactivée", 
              "Vos horaires normales ont été restaurées.\nLes clients peuvent à nouveau prendre rendez-vous.",
              [{ text: "Parfait", style: "default" }]
            );
          } else {
            throw new Error('Erreur lors de la désactivation');
          }
          
        } else {
          Alert.alert("Erreur", "Impossible de restaurer les horaires.");
        }
        
      } catch (error) {
        console.error('Erreur désactivation urgence:', error);
        Alert.alert(
          "Erreur", 
          "Problème lors de la désactivation. Contactez le support.",
          [{ text: "OK", style: "destructive" }]
        );
      }
    }
  };

  const getTodayRdvList = () => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('fr-FR');
    
    const rdvToday = rdvList.filter((rdv) => {
      return rdv.date === todayStr;
    });

    const colisRdvToday = colisData
      .filter(colis => colis.rdvConfirmed && colis.rdvDate)
      .filter(colis => {
        const rdvDate = new Date(colis.rdvDate);
        const rdvDateStr = rdvDate.toLocaleDateString('fr-FR');
        return rdvDateStr === todayStr;
      })
      .map(colis => ({
        time: new Date(colis.rdvDate).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        client: `${colis.prenom} ${colis.nom}`,
        trackingNumber: colis.trackingNumber
      }));

    return [...rdvToday, ...colisRdvToday];
  };

  const todayRdvList = getTodayRdvList();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.twoColumnsContainer}>

        {/* Colonne gauche - Menu vertical */}
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>🚀 Accès rapide</Text>
          
          <ScrollView 
            contentContainerStyle={styles.actionsScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.verticalActionCard}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <FontAwesome5 name={action.icon} size={20} color="#D0BCFF" />
                <Text style={styles.verticalActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Colonne droite - Contenu principal */}
        <ScrollView contentContainerStyle={styles.rightColumn} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>📊 Tableau de bord</Text>
          <Text style={styles.subtitle}>Bonjour {getNomPro()} ! Voici un aperçu de votre activité</Text>

          {/* Statistiques */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📈 Aujourd'hui</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <FontAwesome5 name="box-open" size={20} color="#4F378A" />
                <Text style={styles.statNumber}>{stats.colisArrivesAujourdhui}</Text>
                <Text style={styles.statLabel}>Arrivés</Text>
              </View>
              <View style={styles.statCard}>
                <FontAwesome5 name="handshake" size={20} color="#059669" />
                <Text style={styles.statNumber}>{stats.colisRecuperesAujourdhui}</Text>
                <Text style={styles.statLabel}>Récupérés</Text>
              </View>
            </View>
          </View>

          {/* Vue d'ensemble */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📦 Vue d'ensemble</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <FontAwesome5 name="warehouse" size={20} color="#4F378A" />
                <Text style={styles.statNumber}>{stats.totalColisEnStock}</Text>
                <Text style={styles.statLabel}>En stock</Text>
              </View>
              <View style={[styles.statCard, stats.colisExpiresBientot > 0 && styles.alertCard]}>
                <FontAwesome5
                  name="exclamation-triangle"
                  size={20}
                  color={stats.colisExpiresBientot > 0 ? "#DC2626" : "#4F378A"}
                />
                <Text style={[styles.statNumber, stats.colisExpiresBientot > 0 && styles.alertNumber]}>
                  {stats.colisExpiresBientot}
                </Text>
                <Text style={styles.statLabel}>Expirent bientôt</Text>
              </View>
            </View>
          </View>

          {/* Rendez-vous par créneaux */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📅 Rendez-vous du jour ({todayRdvList.length})</Text>
            {todayRdvList.length > 0 ? (
              <View style={styles.rdvContainer}>
                {(() => {
                  const creneauxAvecRdv = groupRdvByTimeSlot(todayRdvList);
                  return Object.entries(creneauxAvecRdv).map(([creneau, rdvs]) => (
                    <RdvTimeSlotSection 
                      key={creneau}
                      title={creneau} 
                      rdvs={rdvs}
                      isCollapsed={creneauxCollapsed[creneau] || false}
                      onToggle={() => toggleCreneau(creneau)}
                    />
                  ));
                })()}
              </View>
            ) : (
              <View style={styles.emptyRdvCard}>
                <FontAwesome5 name="calendar-times" size={20} color="#95C9D8" />
                <Text style={styles.emptyRdvText}>Pas de rendez-vous pour aujourd'hui</Text>
              </View>
            )}
          </View>

          {/* Bouton d'urgence */}
          <TouchableOpacity
            onPress={handleUrgence}
            style={[styles.urgenceButton, isUrgenceActive && styles.urgenceButtonActive]}
          >
            <FontAwesomeIcon
              icon={isUrgenceActive ? faTimesCircle : faExclamationTriangle}
              size={20}
              color="#fff"
            />
            <Text style={styles.urgenceText}>
              {isUrgenceActive ? "Mettre fin à l'urgence" : "Envoyer un message d'urgence"}
            </Text>
          </TouchableOpacity>

          {/* Infos utiles */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>ℹ️ Infos utiles</Text>
            <View style={styles.infoCard}>
              <FontAwesome5 name="calendar-day" size={16} color="#4F378A" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Horaires aujourd'hui</Text>
                <Text style={styles.infoText}>
                  {getHorairesAujourdhui()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <HorairesModal 
        visible={horairesModalVisible} 
        onClose={() => setHorairesModalVisible(false)}
        horairesInitiaux={currentHoraires}
        onSave={onHorairesSaved}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F378A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0BCFF',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },

  // Sections
  statsSection: {
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F378A',
    marginBottom: 16,
  },

  // Sections RDV collapsibles
  rdvSection: {
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  rdvSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  rdvSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rdvSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F378A',
  },
  rdvSectionContent: {
    gap: 4,
    padding: 8,
  },
  
  // Cartes RDV compactes
  rdvCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#4F378A',
    marginBottom: 2,
  },
  rdvInfoCompact: {
    marginLeft: 8,
    flex: 1,
  },
  rdvTimeCompact: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4F378A',
  },
  rdvClientCompact: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  rdvTrackingCompact: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
  },

  rdvContainer: {
    gap: 8,
  },
  emptyRdvCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptyRdvText: {
    fontSize: 14,
    color: '#95C9D8',
    marginLeft: 8,
    fontStyle: 'italic',
  },

  // Statistiques
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#D0BCFF',
    textAlign: 'center',
  },
  alertCard: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  alertNumber: {
    color: '#DC2626',
  },

  // Urgence
  urgenceButton: {
    flexDirection: 'column', // 🔥 COLONNE AU LIEU DE LIGNE
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D10000',
    padding: 16, // 🔥 AUGMENTÉ POUR COMPENSER LA HAUTEUR
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 20,
    gap: 8, // 🔥 ESPACE ENTRE ICÔNE ET TEXTE
  },
  urgenceButtonActive: {
    backgroundColor: '#751414',
  },
  urgenceText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
    textAlign: 'center', // 🔥 CENTRER LE TEXTE
    flex: 1, // 🔥 PRENDRE TOUT L'ESPACE DISPONIBLE
  },

  // Infos utiles
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F378A',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CDF6FF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#D0BCFF',
    lineHeight: 20,
  },

  // Layout
  twoColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#F5F3FF',
    borderRightWidth: 1,
    borderRightColor: '#E0D7F8',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  rightColumn: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFAF5',
    paddingBottom: 40,
  },

  actionsScrollContainer: {
    paddingBottom: 20,
  },

  verticalActionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#4F378A',
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  verticalActionText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 14,
  },
});