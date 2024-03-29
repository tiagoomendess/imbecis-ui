import type { Notification, NotificationType } from '../types';
import { notifications } from '../stores/notificationStore';

let nextId = 0;

export function showNotification(message: string, type: NotificationType = 'info') {
    const notification: Notification = { id: nextId++, message, type };
    notifications.update(n => [...n, notification]);

    // Optional: auto-dismiss functionality can be added here
}
