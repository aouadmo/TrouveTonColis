import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

export default function CameraScreen() {
  const [ocrResult, setOcrResult] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 

  async function testOCR() {
    setLoading(true); 
    setError(null); 
    try {
      const response = await fetch("http://192.168.209.102:3000/ocr", {
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

  return (
    <View style={styles.container}>
      <Button title="Run OCR" onPress={testOCR} disabled={loading} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {ocrResult && (
        <Text>OCR Result: {JSON.stringify(ocrResult)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
});