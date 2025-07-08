import * as Notifications from 'expo-notifications';

// Configure notification handling to show alerts when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Schedule a local notification for the given task.
 * @param {Object} task - Task object with title, description and reminderDateTime.
 * @returns {Promise<string|null>} The scheduled notification identifier or null on failure.
 */
export const scheduleNotification = async (task) => {
  try {
    if (!task?.reminderDateTime) {
      return null;
    }
    // Request permissions if not already granted
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return null;
    }

    const trigger = new Date(task.reminderDateTime);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: task.description || '',
        data: { taskId: task.id },
      },
      trigger,
    });
    return id;
  } catch (error) {
    console.error('Failed to schedule notification', error);
    return null;
  }
};

/**
 * Cancel a previously scheduled notification.
 * @param {string} identifier - Notification identifier returned by scheduleNotification.
 */
export const cancelNotification = async (identifier) => {
  try {
    if (identifier) {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
  } catch (error) {
    console.error('Failed to cancel notification', error);
  }
};
