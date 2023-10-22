import React, { useEffect, useState } from "react";
import "./Chat.scss";



const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws,setws]= useState(null);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    setws(socket);
    socket.addEventListener('message',handleMessage)    
   }
, []);
   const handleMessage = (e)=>
   {
      console.log("new message",e);
   }
   const handleSubmit = ()=>
   {

   }
  return (
    <div className="chat-container">
      <div className="contacts-pane">
        <div className="contact">
          <img
            src="https://via.placeholder.com/40"
            alt="Contact"
            className="contact-image"
          />
          <div className="contact-info">
            <span className="contact-name">John Doe</span>
            <span className="contact-status">Online</span>
          </div>
        </div>
        {/* Add more contacts */}
      </div>
      <div className="message-pane">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`message ${message.user === "me" ? "sent" : "received"}`}
              key={index}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
