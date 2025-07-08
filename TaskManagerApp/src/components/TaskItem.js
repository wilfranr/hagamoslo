// Component that renders a single task item
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { theme, getNeumorphicStyle } from '../Theme';

// Renders a task using a soft neumorphic card design
export default function TaskItem({ task, onToggle }) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(task.id)}
      activeOpacity={0.7}
    >
      <View style={[getNeumorphicStyle(theme.colors.card), styles.item]}>
        {/* Checkbox to mark the task as complete */}
        <CheckBox
          value={task.completed}
          onValueChange={() => onToggle(task.id)}
          tintColors={{ true: theme.colors.accent, false: theme.colors.accent }}
        />

        {/* Task title */}
        <Text style={[styles.text, task.completed && styles.completed]}>{task.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Base container for the task row
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },

  // Title text style
  text: {
    flex: 1,
    marginLeft: 8,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
  },

  // Style applied when task is completed
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
});
