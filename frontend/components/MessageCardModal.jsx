import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

export default function MessageCard({
  title,
  message,
  setMessage,
  messageType,
  icon,
  description,
  editing,
  toggleEditing,
  resetMessage,
}) {
  return (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <View style={styles.titleContainer}>
          <FontAwesome5 name={icon} size={18} color="#4F378A" />
          <Text style={styles.messageTitle}>{title}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetMessage(messageType)}
          >
            <FontAwesome5 name="undo" size={14} color="#D0BCFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editToggleButton}
            onPress={() => toggleEditing(messageType)}
          >
            <FontAwesome5 
              name={editing ? "check" : "edit"} 
              size={14} 
              color="#4F378A" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.messageDescription}>{description}</Text>
      
      <TextInput
        style={[
          styles.messageInput,
          editing && styles.messageInputEditing
        ]}
        value={message}
        onChangeText={setMessage}
        multiline
        editable={editing}
        placeholder={`Votre message ${title.toLowerCase()}`}
        placeholderTextColor="#D0BCFF"
        textAlignVertical="top"
      />
      
      <View style={styles.characterCount}>
        <Text style={styles.characterCountText}>
          {message.length} caractères
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D0BCFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F378A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFAF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0BCFF',
  },
  editToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D0BCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageDescription: {
    fontSize: 14,
    color: '#D0BCFF',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  messageInput: {
    backgroundColor: '#FFFAF5',
    borderWidth: 1,
    borderColor: '#D0BCFF',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
    color: '#4F378A',
    textAlignVertical: 'top',
  },
  messageInputEditing: {
    borderColor: '#4F378A',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    color: '#D0BCFF',
  },
});