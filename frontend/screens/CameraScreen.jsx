import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Header from "../components/Header"; // ✅ Ajout du Header

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    fetch("https://onlinetools.ups.com/api/track/v1/details/1Z6068Y36822996054?locale=en_FR&returnSignature=false");
  };

  if (hasPermission === null) {
    return <Text>⏳ Demande de permission caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>🚫 Pas d'accès à la caméra</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={styles.container}>
  {/* Zone caméra */}
  <View style={styles.cameraWrapper}>
    <CameraView
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: [
          "qr",
          "pdf417",
          "code128",
          "code39",
          "ean13",
          "ean8",
          "upc_a",
          "upc_e",
        ],
      }}
      style={styles.cameraBox}
    />

    {/* Bouton par-dessus la caméra */}
    {scanned && (
      <View style={styles.buttonOverlay}>
        <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
      </View>
    )}
  </View>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      alignItems: "center",
      // justifyContent: "center", ❌ à retirer pour coller sous le Header
    },
    cameraWrapper: {
      width: 350,
      height: 350,
      overflow: "hidden",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#5E4AE3",
    },
    cameraBox: {
      width: "100%",
      height: "100%",
    },
    buttonOverlay: {
        position: 'absolute',
        bottom: 160,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 8,
        padding: 6,
      },
        });
  