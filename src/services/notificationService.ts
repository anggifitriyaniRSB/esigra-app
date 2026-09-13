import { LocalStorageRepository } from './repository';
import type { AppNotification, NotificationType } from '../types/notification';
import { mockNotifications } from '../data/mockNotifications';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';

const repo = new LocalStorageRepository<AppNotification>('notifications');
repo.seedIfEmpty(mockNotifications);

export const notificationService = {
  listForUser(userId: string): AppNotification[] {
    return repo
      .getAll()
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  unreadCount(userId: string): number {
    return this.listForUser(userId).filter((n) => !n.read).length;
  },

  markRead(id: string): void {
    repo.update(id, { read: true });
  },

  create(params: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    linkTo?: string;
  }): AppNotification {
    return repo.create({
      id: generateId('notif'),
      read: false,
      createdAt: nowIso(),
      ...params,
    });
  },
};
