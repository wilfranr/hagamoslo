import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const filtered = tasks.filter((task) => task.id !== id);
    await saveTasks(filtered);
  } catch (error) {
    console.error('Error deleting task', error);
  }
};
