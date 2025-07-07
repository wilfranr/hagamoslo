import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskItem({ task, onToggle }) {
  return (
    <TouchableOpacity onPress={() => onToggle(task.id)}>
      <View style={styles.item}>
        <Text style={[styles.text, task.completed && styles.completed]}>{task.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
});
