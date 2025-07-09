// Component that renders a single task item
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme, getNeumorphicStyle } from '../Theme';
import { getTasks, saveTasks } from '../../utils/storage';

// Renders a task using a soft neumorphic card design
export default function TaskItem({ task, onToggle, onDelete }) {
  const scheme = useColorScheme();
  const backgroundColor = theme.colors.background[
    scheme === 'dark' ? 'dark' : 'light'
  ];

  // Store selected due date for this task
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null
  );

  // Determine if the task has passed its due date
  // Compare the due date timestamp with the current time from Date.now()
  // If the due date is before now, mark the task as expired
  const isExpired = dueDate ? dueDate.getTime() < Date.now() : false;
  const [showPicker, setShowPicker] = useState(false);

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

  // Persist a new due date to storage and update local state
  const saveDueDate = async (date) => {
    setDueDate(date);
    try {
      const tasks = await getTasks();
      const updated = tasks.map((t) =>
        t.id === task.id ? { ...t, dueDate: date.toISOString() } : t
      );
      await saveTasks(updated);
    } catch (e) {
      console.error('Failed to save due date', e);
    }
  };

  // Handle swipe open for both directions
  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setShowPicker(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (direction === 'right') {
      handleDelete();
    }
  };

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      {/* Trash icon shown while swiping */}
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.dueDateContainer}>
      {/* Calendar icon shown while swiping right */}
      <Ionicons name="calendar-outline" size={24} color="#fff" />
      <Text style={styles.dueDateText}>Set Due Date</Text>
    </View>
  );

  return (
    <>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={handleSwipe}
      >
        <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
          <Animated.View
            style={[
              getNeumorphicStyle(theme.colors.card),
              styles.item,
              isExpired && styles.expiredItem,
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

            {/* Container for task text and due date */}
            <View style={styles.textContainer}>
              <Text style={[styles.text, task.completed && styles.completed]}>
                {task.title}
              </Text>
              {dueDate && (
                <View style={styles.dueDateRow}>
                  <Text
                    style={[
                      styles.dueDate,
                      isExpired && styles.expiredDueDate,
                    ]}
                  >
                    {dueDate.toDateString()}
                  </Text>
                  {isExpired && (
                    <Text style={styles.expiredBadge}>Expired</Text>
                  )}
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Swipeable>
      {/* Date picker shown after swiping right */}
      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) saveDueDate(date);
          }}
        />
      )}
    </>
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

  // Reduced opacity when task is expired
  expiredItem: {
    opacity: 0.6,
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

  // Left swipe due date background
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
  },
  dueDateText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },

  // Wrapper for title and date
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },

  // Row to hold the due date and expired label
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Due date label below the title
  dueDate: {
    fontSize: theme.fonts.size.caption,
    color: theme.colors.textSecondary,
  },

  // Red color for overdue date
  expiredDueDate: {
    color: '#FF3B30',
  },

  // "Expired" badge shown when overdue
  expiredBadge: {
    marginLeft: 6,
    fontSize: theme.fonts.size.caption,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});
