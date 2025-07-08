// Reusable component representing a single checklist item
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function ChecklistItem({ item, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);

  // Toggle completed state
  const handleToggle = () => {
    if (onToggle) {
      onToggle(item.id);
    }
  };

  // Save edited title and exit edit mode
  const saveEdit = () => {
    setEditing(false);
    if (text.trim() !== item.title) {
      onEdit(item.id, text.trim());
    }
  };

  return (
    <View style={styles.container}>
      {/* Checkbox to mark the subtask as done */}
      <CheckBox
        value={item.completed}
        onValueChange={handleToggle}
        accessibilityLabel="checkbox"
      />

      {/* Title or text input depending on edit mode */}
      {editing ? (
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={saveEdit}
          onBlur={saveEdit}
          autoFocus
        />
      ) : (
        <Text style={[styles.text, item.completed && styles.completed]}>{item.title}</Text>
      )}

      {/* Button to edit/save title */}
      <TouchableOpacity onPress={() => (editing ? saveEdit() : setEditing(true))} accessibilityLabel="Edit subtask">
        <Text style={styles.action}>{editing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>

      {/* Optional delete button */}
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(item.id)} accessibilityLabel="Delete subtask">
          <Text style={styles.action}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    flex: 1,
    marginLeft: 8,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
  },
  action: {
    marginLeft: 10,
    color: '#6200ee',
  },
});
