// Screen that displays the list of tasks
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

import TaskItem from '../components/TaskItem';
import {
  getTasks,
  saveTasks,
  deleteTask as removeTask,
} from '../../utils/storage';
import { scheduleNotification } from '../../utils/notifications';
import { theme } from '../Theme';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const scheme = useColorScheme();
  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);
  // Animated style for the floating action button
  const fabAnimated = useAnimatedStyle(() => ({
    transform: [
      { scale: fabScale.value },
      { rotate: `${fabRotation.value}deg` },
    ],
  }));
  const navigation = useNavigation();

  // Helper to load tasks from storage
  const loadTasks = async () => {
    try {
      const stored = await getTasks();
      setTasks(stored);
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
  };

  // Load tasks when the screen mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Toggle task completion and persist the change
  const toggleTask = async (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    try {
      await saveTasks(updated);
    } catch (e) {
      console.error('Failed to update task', e);
    }
  };

  // Delete a task, store it for undo and show snackbar
  const deleteTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setLastDeletedTask(task);
    try {
      await removeTask(id);
      setSnackbarVisible(true);
    } catch (e) {
      console.error('Failed to delete task', e);
    }
  };

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, undefined, () => {
      fabScale.value = withSpring(1);
    });
    fabRotation.value = withSequence(
      withTiming(45, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TaskFormScreen');
  };

  // Restore a previously deleted task
  const undoDelete = async () => {
    if (!lastDeletedTask) return;
    try {
      const current = await getTasks();
      const taskToRestore = { ...lastDeletedTask };
      if (taskToRestore.reminderDateTime) {
        const id = await scheduleNotification(taskToRestore);
        taskToRestore.notificationId = id;
      }
      await saveTasks([...current, taskToRestore]);
      setSnackbarVisible(false);
      setLastDeletedTask(null);
      await loadTasks();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      console.error('Failed to restore task', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the list of tasks */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
      />

      {/* Floating action button to create a new task */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        accessibilityLabel="Add task"
      >
        <Animated.View style={fabAnimated}>
          {/* Plus icon from Ionicons */}
          <Ionicons name="add" size={32} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      {/* Snackbar to undo deletions */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{ label: 'Undo', onPress: undoDelete }}
        style={{
          backgroundColor: theme.colors.background[
            scheme === 'dark' ? 'dark' : 'light'
          ],
        }}
        theme={{ colors: { onSurface: theme.colors.textPrimary } }}
      >
        Task deleted. Undo?
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
