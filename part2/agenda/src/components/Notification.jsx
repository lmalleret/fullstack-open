import "./Notification.style.css";

function Notification({ notification }) {
  return <h2 className={`${notification.type}`}>{notification.message}</h2>;
}

export default Notification;
