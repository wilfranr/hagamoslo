// Reusable component representing a single checklist item
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, getNeumorphicStyle } from '../Theme';

export default function ChecklistItem({ item, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);

  const scheme = useColorScheme();
  const backgroundColor = theme.colors.background[
    scheme === 'dark' ? 'dark' : 'light'
  ];

  // Animated values for mount and toggle effects
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Toggle completed state
  const handleToggle = () => {
    if (onToggle) {
      onToggle(item.id);
    }
    const completed = !item.completed;
    scale.value = withTiming(completed ? 0.9 : 1, { duration: 150 }, () => {
      scale.value = withTiming(1, { duration: 150 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Save edited title and exit edit mode
  const saveEdit = () => {
    setEditing(false);
    if (text.trim() !== item.title) {
      onEdit(item.id, text.trim());
    }
  };

  return (
    <Animated.View
      style={[
        getNeumorphicStyle(theme.colors.card),
        styles.container,
        { backgroundColor },
        animatedStyle,
      ]}
    >
      {/* Checkmark icon toggles completion */}
      <TouchableOpacity onPress={handleToggle} accessibilityLabel="Toggle subtask">
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={theme.colors.accent}
        />
      </TouchableOpacity>

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
      <TouchableOpacity
        onPress={() => (editing ? saveEdit() : setEditing(true))}
        accessibilityLabel={editing ? 'Save subtask' : 'Edit subtask'}
      >
        <Ionicons
          name={editing ? 'checkmark' : 'pencil'}
          size={20}
          color={theme.colors.accent}
        />
      </TouchableOpacity>

      {/* Optional delete button */}
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          accessibilityLabel="Delete subtask"
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
  },
  text: {
    flex: 1,
    marginLeft: 8,
    color: theme.colors.textSecondary,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 4,
    padding: 4,
  },
});
