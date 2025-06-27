import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  SafeAreaView, 
  Modal, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import Header from "../components/Header";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
const BACKEND_ADDRESS = `${API_URL}/colis`;

export default function CameraScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);

  // États de la caméra
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flashStatus, setFlashStatus] = useState("off");
  
  // États de la modal d'édition
  const [showEditModal, setShowEditModal] = useState(false);
  const [editColisData, setEditColisData] = useState({
    _id: null,
    nom: '',
    prenom: '',
    trackingNumber: '',
    transporteur: '',
    phone: '',
    poids: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Demande de permission caméra au montage
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  // Empêcher plusieurs caméras en arrière-plan
  if (!hasPermission || !isFocused) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Header />
        <View style={styles.permissionContainer}>
          <FontAwesome5 name="camera-retro" size={64} color="#D0BCFF" />
          <Text style={styles.permissionText}>
            {!hasPermission ? "Permission caméra requise" : "Caméra en pause"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Basculer entre caméra avant/arrière
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Basculer le flash
  const toggleFlashStatus = () => {
    setFlashStatus((current) => (current === "off" ? "on" : "off"));
  };

  // Prendre une photo et traiter l'OCR
  const takePicture = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
      
      if (!photo?.uri) {
        Alert.alert("❌ Erreur", "Impossible de capturer la photo");
        return;
      }

      const formData = new FormData();
      formData.append("url", {
        uri: photo.uri,
        name: "colis_scan.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${BACKEND_ADDRESS}/ocr`, {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();

      if (data.success) {
        Alert.alert("✅ Scan réussi", "Données extraites ! Vérifiez et complétez les informations.");
        
        setEditColisData({
          _id: data.colisId,
          nom: data.extractedData.nom || '',
          prenom: data.extractedData.prenom || '',
          phone: data.extractedData.telephone || '',
          trackingNumber: data.extractedData.trackingNumber || '',
          transporteur: data.extractedData.transporteur || '',
          poids: data.extractedData.poids || '',
          date: data.extractedData.date ? 
            new Date(data.extractedData.date).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
        });
        
        setShowEditModal(true);
        
        // Optionnel : sauvegarder l'image si nécessaire
        if (data.url) {
          dispatch(addPhoto(data.url));
        }
      } else {
        Alert.alert("❌ Extraction échouée", data.message || "Erreur inconnue lors de l'extraction des données.");
      }
    } catch (error) {
      console.error("Erreur lors de la capture ou du traitement :", error);
      Alert.alert("❌ Erreur", "Impossible de traiter l'image. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Gérer les changements dans les champs de la modal
  const handleModalInputChange = (field, value) => {
    setEditColisData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Sauvegarder les données du colis
  const handleUpdateColis = async () => {
    if (!editColisData._id) {
      Alert.alert("❌ Erreur", "ID du colis introuvable pour la mise à jour.");
      return;
    }

    // Validation basique
    if (!editColisData.nom.trim() || !editColisData.prenom.trim()) {
      Alert.alert("⚠️ Champs requis", "Le nom et prénom sont obligatoires.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_ADDRESS}/${editColisData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: editColisData.nom.trim(),
          prenom: editColisData.prenom.trim(),
          trackingNumber: editColisData.trackingNumber.trim(),
          transporteur: editColisData.transporteur.trim(),
          phone: editColisData.phone.trim(),
          poids: editColisData.poids ? parseFloat(editColisData.poids) : undefined,
          date: editColisData.date || undefined,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        Alert.alert("✅ Succès", "Colis mis à jour avec succès !");
        handleCancelEdit();
      } else {
        Alert.alert("❌ Mise à jour échouée", data.message || "Impossible de mettre à jour le colis.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("❌ Erreur", "Échec de la mise à jour. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditColisData({ 
      _id: null, 
      nom: '', 
      prenom: '', 
      trackingNumber: '', 
      transporteur: '', 
      phone: '', 
      poids: '', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      
      <View style={styles.container}>
        <Text style={styles.title}>📷 Scanner un Colis</Text>
        <Text style={styles.subtitle}>
          Scannez l'étiquette pour extraire automatiquement les informations
        </Text>

        {/* Vue de la caméra */}
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing={facing}
            flash={flashStatus}
            ref={cameraRef}
          />
          
          {/* Boutons de réglages */}
          <View style={styles.settingContainer}>
            <TouchableOpacity 
              style={styles.settingButton} 
              onPress={toggleFlashStatus}
              activeOpacity={0.8}
            >
              <FontAwesome5 
                name="bolt" 
                size={20} 
                color={flashStatus === "on" ? "#FFD700" : "#FFFFFF"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingButton} 
              onPress={toggleCameraFacing}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="sync-alt" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Overlay de guidage simple */}
          <View style={styles.scanOverlay}>
            <Text style={styles.scanText}>
              Positionnez l'étiquette dans le cadre de la caméra
            </Text>
          </View>
        </View>

        {/* Bouton de capture */}
        <View style={styles.captureContainer}>
          <TouchableOpacity 
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]} 
            onPress={takePicture}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#4F378A" />
            ) : (
              <View style={styles.captureInner}>
                <FontAwesome5 name="camera" size={24} color="#4F378A" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.captureText}>
            {isProcessing ? "Traitement en cours..." : "Appuyez pour scanner"}
          </Text>
        </View>
      </View>

      {/* Modal d'édition des données */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={handleCancelEdit}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={modalStyles.modalTitle}>✏️ Vérifier les Données</Text>
              <Text style={modalStyles.modalSubtitle}>
                Complétez ou corrigez les informations extraites
              </Text>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Prénom *</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Prénom du destinataire"
                  placeholderTextColor="#D0BCFF"
                  value={editColisData.prenom}
                  onChangeText={(text) => handleModalInputChange('prenom', text)}
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Nom *</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Nom du destinataire"
                  placeholderTextColor="#D0BCFF"
                  value={editColisData.nom}
                  onChangeText={(text) => handleModalInputChange('nom', text)}
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Téléphone</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="06 12 34 56 78"
                  placeholderTextColor="#D0BCFF"
                  keyboardType="phone-pad"
                  value={editColisData.phone}
                  onChangeText={(text) => handleModalInputChange('phone', text)}
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Numéro de Suivi</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Référence transporteur"
                  placeholderTextColor="#D0BCFF"
                  value={editColisData.trackingNumber}
                  onChangeText={(text) => handleModalInputChange('trackingNumber', text)}
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.inputLabel}>Transporteur</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="UPS, DHL, Colissimo, Colis Privé..."
                  placeholderTextColor="#D0BCFF"
                  value={editColisData.transporteur}
                  onChangeText={(text) => handleModalInputChange('transporteur', text)}
                />
              </View>

              <View style={modalStyles.row}>
                <View style={[modalStyles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={modalStyles.inputLabel}>Poids (g)</Text>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="1500"
                    placeholderTextColor="#D0BCFF"
                    keyboardType="numeric"
                    value={editColisData.poids ? String(editColisData.poids) : ''}
                    onChangeText={(text) => handleModalInputChange('poids', text)}
                  />
                </View>

                <View style={[modalStyles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={modalStyles.inputLabel}>Date</Text>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#D0BCFF"
                    value={editColisData.date}
                    onChangeText={(text) => handleModalInputChange('date', text)}
                  />
                </View>
              </View>

              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton} 
                  onPress={handleCancelEdit}
                  activeOpacity={0.8}
                >
                  <Text style={modalStyles.cancelButtonText}>❌ Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[modalStyles.saveButton, isLoading && modalStyles.buttonDisabled]} 
                  onPress={handleUpdateColis} 
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#4F378A" />
                  ) : (
                    <Text style={modalStyles.saveButtonText}>💾 Sauvegarder</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFAF5', // Palette Pro - Fond rose très pâle
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  
  // Header
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F378A', // Palette Pro - Texte violet foncé
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0BCFF', // Palette Pro - Mauve clair
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },

  // Permission
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  permissionText: {
    fontSize: 18,
    color: '#4F378A',
    textAlign: 'center',
  },

  // Caméra
  cameraWrapper: {
    width: "90%",
    aspectRatio: 4 / 5, // Ratio moins haut pour éviter débordement
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  
  // Boutons de réglages
  settingContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: "center",
    justifyContent: "center",
  },

  // Overlay de guidage
  scanOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // Bouton de capture
  captureContainer: {
    marginTop: 24, // Réduit pour éviter débordement
    alignItems: "center",
    paddingBottom: 20, // Ajoute un padding en bas
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D0BCFF',
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: '#4F378A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4F378A',
    fontWeight: '600',
    textAlign: 'center',
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F378A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#D0BCFF',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F378A',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D0BCFF',
    borderRadius: 10,
    fontSize: 16,
    color: '#4F378A',
    backgroundColor: '#FFFAF5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  // Boutons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#D0BCFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#4F378A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#4F378A',
    fontSize: 16,
    fontWeight: '600',
  },
});