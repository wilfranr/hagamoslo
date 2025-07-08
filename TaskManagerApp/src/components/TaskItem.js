// Component that renders a single task item
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { theme, getNeumorphicStyle } from '../Theme';

// Renders a task using a soft neumorphic card design
export default function TaskItem({ task, onToggle, onDelete }) {
  // Shared animated values for simple microinteractions
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Animated styles driven by the shared values
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  // Triggered when the user taps the task to toggle completion
  const handleToggle = () => {
    onToggle?.(task.id);
    // Animate subtle feedback
    opacity.value = withTiming(task.completed ? 1 : 0.5, { duration: 200 });
    scale.value = withTiming(task.completed ? 1 : 0.95, { duration: 200 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Called after swipe gesture completes
  const handleDelete = () => {
    const screenWidth = Dimensions.get('window').width;
    opacity.value = withTiming(0, { duration: 200 });
    translateX.value = withTiming(-screenWidth, { duration: 200 }, () => {
      runOnJS(onDelete)?.(task.id);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteText}>Eliminar</Text>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={handleDelete}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
        <Animated.View style={[getNeumorphicStyle(theme.colors.card), styles.item, animatedStyle]}>
          {/* Checkbox to mark the task as complete */}
          <CheckBox
            value={task.completed}
            onValueChange={handleToggle}
            tintColors={{ true: theme.colors.accent, false: theme.colors.accent }}
          />

          {/* Task title */}
          <Text style={[styles.text, task.completed && styles.completed]}>{task.title}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Swipeable>
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

  // Right swipe delete background
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#ff5252',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
