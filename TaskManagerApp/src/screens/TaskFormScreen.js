// Screen for creating a new task with checklist and reminder
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';

import { getTasks, saveTasks } from '../../utils/storage';
import { scheduleNotification } from '../../utils/notifications';

export default function TaskFormScreen() {
  // Main task fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Checklist state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');

  // Due date and reminder date
  const [dueDate, setDueDate] = useState(new Date());
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState(null);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const navigation = useNavigation();

  // Ensure the due date is initialised when the screen mounts
  useEffect(() => {
    setDueDate(new Date());
  }, []);

  // Add a subtask to the list
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask('');
  };

  // Toggle subtask completion
  const toggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  // Edit subtask title
  const updateSubtaskTitle = (id, text) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: text } : s))
    );
  };

  // Persist the new task and return to the list screen
  const saveTask = async () => {
    if (!title.trim()) {
      // Simple validation for mandatory fields
      alert('El título es obligatorio');
      return;
    }

    const existing = await getTasks();
    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      subtasks,
      dueDate: dueDate.toISOString(),
      reminderDateTime: reminderDateTime
        ? reminderDateTime.toISOString()
        : null,
      completed: false,
    };

    if (task.reminderDateTime) {
      // Schedule notification and store its identifier
      const notifId = await scheduleNotification(task);
      task.notificationId = notifId;
    }

    await saveTasks([...existing, task]);
    navigation.navigate('TaskListScreen');
  };

  // Render a single subtask row
  const renderSubtask = ({ item }) => (
    <View style={styles.subtaskItem}>
      <CheckBox value={item.completed} onValueChange={() => toggleSubtask(item.id)} />
      <TextInput
        style={styles.subtaskInput}
        value={item.title}
        onChangeText={(text) => updateSubtaskTitle(item.id, text)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Task title */}
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título de la tarea"
      />

      {/* Task description */}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        multiline
      />

      {/* Checklist */}
      <Text style={styles.label}>Subtareas</Text>
      <View style={styles.addSubtaskRow}>
        <TextInput
          style={[styles.input, styles.subtaskInput]}
          value={newSubtask}
          onChangeText={setNewSubtask}
          placeholder="Nueva subtarea"
        />
        <TouchableOpacity style={styles.addButton} onPress={addSubtask} accessibilityLabel="Add subtask">
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={subtasks} keyExtractor={(item) => item.id} renderItem={renderSubtask} />

      {/* Due date */}
      <Text style={styles.label}>Fecha límite</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDuePicker(true)}>
        <Text>{dueDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDuePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowDuePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}

      {/* Reminder date/time */}
      <Text style={styles.label}>Recordatorio</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowReminderPicker(true)}>
        <Text>
          {reminderDateTime
            ? reminderDateTime.toLocaleString()
            : 'Agregar recordatorio'}
        </Text>
      </TouchableOpacity>
      {showReminderPicker && (
        <DateTimePicker
          value={reminderDateTime || new Date()}
          mode="datetime"
          display="default"
          onChange={(_, date) => {
            setShowReminderPicker(false);
            if (date) setReminderDateTime(date);
          }}
        />
      )}

      {/* Save task button */}
      <Button title="Guardar tarea" onPress={saveTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 5,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  subtaskInput: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginTop: 5,
  },
});
