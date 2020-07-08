import React from "react";

const Notification = ({ type, message }) => {
  return <div className={type}>{message}</div>;
};

export default Notification;
