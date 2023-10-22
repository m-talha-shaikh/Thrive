import React, { useContext, useEffect, useState } from "react";
import "./Chat.scss";
import Contact from "./Contact";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";

const Chat = () => {
  const {currentUser}=useContext(AuthContext) ;
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const { isLoading, error, data } = useQuery('getfriends', async () => { 
    return  await makeRequest.get( `/Connection/messagingfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    })
      .then((res) => res.data);
  });
  
  const handleMessage = (e) => {
    console.log("new message", e);
    // Handle incoming messages and update the messages state
  };

  const handleContactSelection = (contact) => {
    setSelectedContact(contact);
    // Load chat history or messages for the selected contact here, if applicable.

    // For example, update the messages state with the conversation for the selected contact.
    // This is a placeholder and should be replaced with actual message data.
    setMessages({
      [contact]: [
        { user: "contact", text: "Hello, how can I help you?" },
        { user: "me", text: "Hi, I have a question." },
        // Add more messages for the conversation
      ],
    });
  };
  const mutation = useMutation(
    async (newPost) => {
      try {
        const response = await makeRequest.post("/",newPost);
        return response.data; // Assuming your response contains the new post data
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission
    // Update the messages state with the new message.
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact]: [
        ...(prevMessages[selectedContact] || []),
        { user: "me", text: newMessage },
      ],
    }));

    // Clear the message input
    setNewMessage("");
  };
  
  return (
    <div className="chat-container">
      <div className="contacts-pane">

        {isLoading?"Loading":data.map((contact) => (
             <Contact
             name={contact.username}
             status="Online"
             image={"../../../public/uploads/"+contact.ProfilePic}
             onClick={() => handleContactSelection(contact.user_id)}
             key={contact.user_id}
           />
          ))}
       
        
      </div>
      {selectedContact && (
        <div className="message-pane">
          <div className="messages">
            {(messages[selectedContact] || []).map((message, index) => (
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
            <button type="submit" className="send-button" onClick={handleSubmit}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
