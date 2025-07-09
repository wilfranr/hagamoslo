import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import TaskInput from './src/components/TaskInput';
import TaskItem from './src/components/TaskItem';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title, completed: false },
    ]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Hide splash screen once everything is ready
  useEffect(() => {
    const hide = async () => {
      // Wait a short time to simulate asset loading
      await new Promise((res) => setTimeout(res, 300));
      await SplashScreen.hideAsync();
    };
    hide();
  }, []);

  return (
    <View style={styles.container}>
      <TaskInput onAdd={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} />
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
});
