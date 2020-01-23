/**
 * Detect on load notification. Can only show a single success
 * or failure message
 * @param {object} query On load query strings
 * @returns {object} Notification initialization object
 */
export function getLoadNotification(query) {
  const notificationsObj = {};

  if (query.e || query.s) {
    const notif = {
      level: query.e ? "error" : "success"
    };

    switch (query.e || query.s) {
      case 'reset':
        notif.text = query.e
          ? "We could not reset your password with that link, please try again."
          : "Password successfully reset, please log in."
        break;

      default:
        break;
    }

    if (notif.text) {
      notificationsObj.onLoadNotification = notif;
    }
  }

  return notificationsObj
}

/**
 * Show notification on page load
 * @param {object} notification Notification context
 * @param {object} onLoadNotification Notification data
 */
export function showLoadNotification(notification, onLoadNotification) {
  if (onLoadNotification) {
    notification.createNotification(
      onLoadNotification.text,
      onLoadNotification.level
    );
  }
}