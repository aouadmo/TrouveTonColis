import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Header from "../components/Header"; // ✅ Ajout du Header

export default function CameraScreen() {
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  async function testOCR() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://192.168.1.10:3006/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl:
            "https://help.oxatis.com/servlet/rtaImage?eid=ka05p000000MyYn&feoid=00N0N00000HIW66&refid=0EM0N000001jy74" /* or base64 string */,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOcrResult(data);
      console.log("OCR Result:", data);
    } catch (error) {
      console.error("Error testing OCR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
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
      <Button title="Run OCR" onPress={testOCR} disabled={loading} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {ocrResult && (
        <Text>OCR Result: {JSON.stringify(ocrResult)}</Text>
        )}
    </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
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
