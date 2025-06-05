import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Button, SafeAreaView } from "react-native";
import { CameraView, CameraType, FlashMode, Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

const BACKEND_ADDRESS = "http://192.168.209.102:3000/colis";

export default function CameraScreen() {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();

	// Reference to the camera
	const cameraRef = useRef<CameraView | null>(null);

	// Permission hooks
	const [hasPermission, setHasPermission] = useState(false);
	const [facing, setFacing] = useState("back");
	const [flashStatus, setFlashStatus] = useState("off");

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

		fetch(`${BACKEND_ADDRESS}/ocr`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				data.result && dispatch(addPhoto(data.url));
			});
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

