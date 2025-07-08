// Screen that displays the list of tasks
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

import TaskItem from '../components/TaskItem';
import { getTasks } from '../../utils/storage';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const fabScale = useSharedValue(1);
  const fabAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));
  const navigation = useNavigation();

  // Load tasks from storage when the screen mounts
  useEffect(() => {
    const load = async () => {
      const stored = await getTasks();
      setTasks(stored);
    };
    load();
  }, []);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, undefined, () => {
      fabScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TaskFormScreen');
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
          <Text style={styles.fabText}>+</Text>
        </Animated.View>
      </TouchableOpacity>
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
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 34,
  },
});
