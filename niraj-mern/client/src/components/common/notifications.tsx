import { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNotificationContext } from '../../context/notification-provider';

const Notifications: FC = () => {
  const { notifications, showNotifications, updateNotifications } =
    useNotificationContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      updateNotifications(null);
    }, 3000);

    return () => clearTimeout(timer);
    // also add the dependency when something about the
    // notifications actually changes (it can showNotifications)
    // or 'notifications' itself, because this Notifications
    // component stays in the dom forever, either in the
    // form of notifications or 'null'
  }, [updateNotifications, showNotifications]);

  const JSX = showNotifications ? (
    <div className="fixed right-2 bottom-2">
      {notifications.map((notification, i) => {
        const colorClassName =
          notification.status === 'success' ? 'bg-green-500' : 'bg-red-500';

        return (
          <div
            key={i}
            className={`mb-2 shadow-md dark:shadow-gray-700 shadow-gray-400 ${colorClassName} rounded`}
          >
            <p className="text-white px-4 py-2 font-semibold">
              {notification.text}
            </p>
          </div>
        );
      })}
    </div>
  ) : null;

  return createPortal(
    JSX,
    document.getElementById('notifications') as HTMLElement
  );
};

export { Notifications };
