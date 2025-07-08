// Component that renders a single task item
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { theme, getNeumorphicStyle } from '../Theme';

// Renders a task using a soft neumorphic card design
export default function TaskItem({ task, onToggle, onDelete }) {
  const scheme = useColorScheme();
  const backgroundColor = theme.colors.background[
    scheme === 'dark' ? 'dark' : 'light'
  ];

  // Shared animated values for microinteractions and mount animation
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(10);

  // Fade in and slide up when mounted
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
  }, []);

  // Animated styles driven by the shared values
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Triggered when the user taps the task to toggle completion
  const handleToggle = () => {
    onToggle?.(task.id);
    // Animate subtle feedback using the new completed state
    const completed = !task.completed;
    opacity.value = withTiming(completed ? 0.5 : 1, { duration: 200 });
    scale.value = withTiming(completed ? 0.95 : 1, { duration: 200 });
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
      {/* Trash icon shown while swiping */}
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={handleDelete}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
        <Animated.View
          style={[
            getNeumorphicStyle(theme.colors.card),
            styles.item,
            { backgroundColor },
            animatedStyle,
          ]}
        >
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
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
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
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
  },
});
