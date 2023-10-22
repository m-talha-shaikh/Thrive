import React from "react";

const Contact = ({ name, status, image, onClick }) => {
  return (
    <div className="contact" onClick={onClick}>
      <img src={image} alt="Contact" className="contact-image" />
      <div className="contact-info">
        <span className="contact-name">{name}</span>
        <span className="contact-status">{status}</span>
      </div>
    </div>
  );
};

export default Contact;
