const Notification = ({ message, isError }) => {
  console.log(message, isError);
  if (message === null) {
    return null;
  } else if (isError === true) {
    return <div className="error">{message}</div>;
  }

  return <div className="message">{message}</div>;
};

export default Notification;
