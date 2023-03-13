import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Notifications } from '../components/common/notifications';

type NotificationValues = { text: string; status: 'success' | 'error' };
type NotificationContextType = {
  showNotifications: boolean;
  notifications: NotificationValues[];
  updateNotifications: (values: NotificationValues | null) => void;
  clearPreviousNotifications: () => void;
};

const DEFAULT_NOTIFICATIONS: NotificationValues[] = [];
const NotificationContext = createContext<NotificationContextType>({
  // these are all default values, they will not be used, just for 'types' purposes
  showNotifications: false,
  notifications: DEFAULT_NOTIFICATIONS,
  updateNotifications: () => {},
  clearPreviousNotifications: () => {},
});

function useNotificationContext() {
  return useContext(NotificationContext);
}

function NotificationProvider({ children }: PropsWithChildren) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    NotificationContextType['notifications']
  >(DEFAULT_NOTIFICATIONS);

  const clearPreviousNotifications = useCallback(() => {
    setNotifications(DEFAULT_NOTIFICATIONS);
    setShowNotifications(false);
  }, []);

  const updateNotifications: NotificationContextType['updateNotifications'] =
    useCallback(
      values => {
        if (!values) {
          // values is null, hide the notification
          return clearPreviousNotifications();
        }

        // new notification should come first
        setNotifications(prev => [values, ...prev]);
        setShowNotifications(true);
      },
      [clearPreviousNotifications]
    );

  const value = {
    showNotifications,
    notifications,
    updateNotifications,
    clearPreviousNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notifications />
    </NotificationContext.Provider>
  );
}

export { NotificationProvider, useNotificationContext };
