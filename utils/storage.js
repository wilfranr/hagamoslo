import AsyncStorage from '@react-native-async-storage/async-storage';
import { cancelNotification } from './notifications';

const TASKS_KEY = 'TASKS';

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks', error);
  }
};

export const getTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching tasks', error);
    return [];
  }
};

export const deleteTask = async (id) => {
  try {
    const tasks = await getTasks();
    // Locate the task to be removed
    const task = tasks.find((t) => t.id === id);

    // Cancel any pending notification associated with this task
    if (task?.notificationId) {
      await cancelNotification(task.notificationId);
    }

    // Filter out the task from the list and persist the new array
    const filtered = tasks.filter((t) => t.id !== id);
    await saveTasks(filtered);
  } catch (error) {
    console.error('Error deleting task', error);
  }
};
