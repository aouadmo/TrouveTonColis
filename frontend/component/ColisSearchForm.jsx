import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ColisSearchForm = ({ onSearch }) => {
  const [trackingNumber, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    
      const response = await fetch(`http://192.168.1.10:3000/colis/search/${trackingNumber}`); 
      const data = await response.json();

      if (data.found) {
        const { nom, prenom } = data.colis;
        setResult(`✅ Colis trouvé pour ${prenom} ${nom} !`);
      } else {
        setResult('❌ Aucun colis trouvé');
      }
    
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Numéro de suivi"
        value={trackingNumber}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
      </TouchableOpacity>
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    width: '80%',
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  result: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

export default ColisSearchForm;
