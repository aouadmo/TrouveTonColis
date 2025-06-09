import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Button, SafeAreaView, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import { CameraView, CameraType, FlashMode, Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

const BACKEND_ADDRESS = "http://192.168.1.32:3000/colis";

export default function CameraScreen() {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();

	// Reference to the camera
	const cameraRef = useRef(null);

	// Permission hooks
	const [hasPermission, setHasPermission] = useState(false);
	const [facing, setFacing] = useState("back");
	const [flashStatus, setFlashStatus] = useState("off");
	// new state variables
	const [showEditModal, setShowEditModal] = useState(false);
	const [editColisData, setEditColisData] = useState({
		_id: null, // To store the MongoDB document ID
		nom: '',
		prenom: '',
		trackingNumber: '',
		transporteur: '',
		phone: '',
		poids: '',
		date: new Date().toISOString().split('T')[0],
	});
	const [isLoading, setIsLoading] = useState(false);

	// Effect hook to check permission upon each mount
	useEffect(() => {
		(async () => {
			const result = await Camera.requestCameraPermissionsAsync();
			setHasPermission(result && result?.status === "granted");
		})();
	}, []);

	// Conditions to prevent more than 1 camera component to run in the bg
	if (!hasPermission || !isFocused) {
		return <View />;
	}

	// Functions to toggle camera facing and flash status
	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

	const toggleFlashStatus = () => {
		setFlashStatus((current) => (current === "off" ? "on" : "off"));
	};

	// Function to take a picture and save it to the reducer store
	const takePicture = async () => {
		const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
		const formData = new FormData();
		const uri = photo?.uri;

		formData.append("url", {
			uri: uri,
			name: "photo.jpg",
			type: "image/jpeg",
		});

		// fetch(`${BACKEND_ADDRESS}/ocr`, {
		// 	method: "POST",
		// 	body: formData,
		// })
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		data.result && dispatch(addPhoto(data.url));
		// 	});
		try {
			const response = await fetch(`${BACKEND_ADDRESS}/ocr`, {
				method: "POST",
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data', 
				},
			});
			const data = await response.json();

			if (data.success) {
				Alert.alert("Extraction Success", "Text extracted! Please review and save.");
				setEditColisData({
					_id: data.colisId, 
					nom: data.extractedData.nom || '',
					prenom: data.extractedData.prenom || '',
					phone: data.extractedData.telephone || '', 
					trackingNumber: '', 
					transporteur: '', 
					poids: '', 
					date: data.extractedData.date ? new Date(data.extractedData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
				});
				setShowEditModal(true); // Open the modal
				// data.result && dispatch(addPhoto(data.url)); // <-- ORIGINAL LINE (can remove or adjust if not needed)
			} else {
				Alert.alert("Extraction Failed", data.message || "An unknown error occurred during text extraction.");
			}
		} catch (error) {
			console.error("Error during picture capture or backend fetch:", error);
			Alert.alert("Error", "Failed to process image. Please try again.");
		} finally {
			setIsLoading(false); //Always stop loading
		}
	};

	// MODAL INTERACTION FUNCTIONS
	const handleModalInputChange = (field, value) => {
		setEditColisData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const handleUpdateColis = async () => {
		if (!editColisData._id) {
			Alert.alert("Error", "No Colis ID found for update.");
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
					nom: editColisData.nom,
					prenom: editColisData.prenom,
					trackingNumber: editColisData.trackingNumber,
					transporteur: editColisData.transporteur,
					phone: editColisData.phone,
					poids: parseFloat(editColisData.poids) || undefined, 
					date: editColisData.date || undefined, // Format date for backend
				}),
			});
			const data = await response.json();

			if (data.success) {
				Alert.alert("Success", "Colis updated successfully!");
				setShowEditModal(false); 
			} else {
				Alert.alert("Update Failed", data.message || "Could not update colis.");
			}
		} catch (error) {
			console.error("Error updating colis:", error);
			Alert.alert("Error", "Failed to update colis. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setShowEditModal(false);
		setEditColisData({ _id: null, nom: '', prenom: '', trackingNumber: '', transporteur: '', phone: '', poids: '', date: '' });
	};

	return (
		<CameraView style={styles.camera} facing={facing} flash={flashStatus} ref={(ref) => (cameraRef.current = ref)}>
			{/* Top container with the setting buttons */}

			<SafeAreaView style={styles.settingContainer}>
				<TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
					<FontAwesome name="flash" size={25} color={flashStatus === "on" ? "#e8be4b" : "white"} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
					<FontAwesome name="rotate-right" size={25} color="white" />
				</TouchableOpacity>
			</SafeAreaView>

			{/* Bottom container with the snap button */}
			<View style={styles.snapContainer}>
				<TouchableOpacity style={styles.snapButton} onPress={takePicture}>
					<FontAwesome name="circle-thin" size={95} color="white" />
				</TouchableOpacity>
			</View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showEditModal}
                onRequestClose={handleCancelEdit}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <Text style={modalStyles.modalTitle}>Review & Edit Colis Data</Text>

                        <TextInput
                            style={modalStyles.input}
                            placeholder="Prénom"
                            placeholderTextColor="#888"
                            value={editColisData.prenom}
                            onChangeText={(text) => handleModalInputChange('prenom', text)}
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Nom"
                            placeholderTextColor="#888"
                            value={editColisData.nom}
                            onChangeText={(text) => handleModalInputChange('nom', text)}
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Numéro de Téléphone"
                            placeholderTextColor="#888"
                            keyboardType="phone-pad"
                            value={editColisData.phone}
                            onChangeText={(text) => handleModalInputChange('phone', text)}
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Numéro de Suivi"
                            placeholderTextColor="#888"
                            value={editColisData.trackingNumber}
                            onChangeText={(text) => handleModalInputChange('trackingNumber', text)}
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Transporteur"
                            placeholderTextColor="#888"
                            value={editColisData.transporteur}
                            onChangeText={(text) => handleModalInputChange('transporteur', text)}
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Poids (gr)" 
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={editColisData.poids ? String(editColisData.poids) : ''}
                            onChangeText={(text) => handleModalInputChange('poids', text)} // Changed to text first, convert to number on save
                        />
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            placeholderTextColor="#888"
                            value={editColisData.date} // Directly use the string value from state
                            onChangeText={(text) => handleModalInputChange('date', text)} // Update state with the new string
                        />
                        <View style={modalStyles.modalButtons}>
                            <TouchableOpacity style={modalStyles.buttonCancel} onPress={handleCancelEdit}>
                                <Text style={modalStyles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={modalStyles.buttonSave} onPress={handleUpdateColis} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text style={modalStyles.buttonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
		</CameraView>
	);
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
		justifyContent: "space-between",
	},
	settingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 20,
	},
	settingButton: {
		width: 40,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	snapContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	snapButton: {
		width: 100,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
const modalStyles = StyleSheet.create({ 
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    },
    modalContent: {
        width: '90%', 
        backgroundColor: 'white',
        borderRadius: 15, 
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 25, 
        color: '#333',
    },
    input: {
        width: '100%',
        paddingVertical: 12, 
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8, 
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    buttonSave: {
        backgroundColor: '#4CAF50', 
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#f44336', 
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
