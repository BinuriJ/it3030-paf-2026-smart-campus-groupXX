import NotificationItem from "./NotificationItem";

export default function NotificationPanel() {
  const notifications = [
    { id: 1, title: "Booking Approved", message: "Room A1 approved", unread: true },
    { id: 2, title: "New Comment", message: "Technician replied", unread: false },
  ];

  return (
    <div className="panel">
      <h3>Notifications</h3>

      {notifications.map((n) => (
        <NotificationItem key={n.id} data={n} />
      ))}
    </div>
  );
}