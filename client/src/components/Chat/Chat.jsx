import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.scss";
import Contact from "./Contact";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";


const Chat = () => {
  const [isCalling, setIsCalling] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [isMessagePaneOpen, setIsMessagePaneOpen] = useState(true);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversationExists, setConversationExists] = useState(true); // Track if conversation exists
  const { isLoading, error, data } = useQuery('getfriends', async () => {
    return await makeRequest.get(`/Connection/messagingfriends`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    })
      .then((res) => res.data);
  });
  const handleCall = () => {
    // Logic to initiate a call
    setIsCalling(true);
  };
  const queryClient = useQueryClient();

  useEffect(() => {

    const client = new W3CWebSocket('ws://192.168.100.6:3000/');


    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      handleMessage(dataFromServer);
    };

    // Store the client instance in a state variable
    setWebSocketClient(client);

    return () => {
      client.close();
    };
  }, []);

  const [webSocketClient, setWebSocketClient] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const handleMessage = (message) => {
    console.log("Received message:", message);

    // Update the messages state with the new message.
    setMessages((prevMessages) => ({
      ...prevMessages,
      [message.user]: [
        ...(prevMessages[message.user] || []),
        { user: message.user, text: message.msg },
      ],
    }));
  };

  const handleContactSelection = async (contact) => {
    setSelectedContact(contact);

    try {
      const response = await makeRequest.get("/Chat/messages", {
        params: {
          user_id_1: currentUser.data.user.user_id,
          user_id_2: contact // Use the contact parameter directly here
        }
      });
      
      // Assuming the response contains an array of messages
      const messagesData = response.data.messages;

      console.log(messagesData);

      // Map over messagesData to extract necessary information
      const formattedMessages = messagesData.map(message => ({
        user: (message.sender_id === currentUser.data.user.user_id) ? "me" : "other",
        text: message.message_content
      }));

      // Update the messages state with the formatted messages
      setMessages({ [contact]: formattedMessages });

      // Set conversationExists to true since messages are received
      setConversationExists(true);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setConversationExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to store the message
      await makeRequest.post("/Chat/messages", {
        sender_id: currentUser.data.user.user_id,
        receiver_id: selectedContact,
        message_content: newMessage
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    // Update the messages state with the new message.
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact]: [
        ...(prevMessages[selectedContact] || []),
        { user: "me", text: newMessage },
      ],
    }));

    // Send message using WebSocket
    if (webSocketClient) {
      webSocketClient.send(JSON.stringify({
        type: "message",
        msg: newMessage,
        user: currentUser.data.user.user_id, // Assuming user_id is unique
      }));
    }

    // Clear the message input
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="contacts-pane">

        {isLoading ? "Loading" : data.map((contact) => (
          <Contact
            name={contact.username}
            status="Online"
            image={"https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/" + contact.ProfilePic}
            onClick={() => handleContactSelection(contact.user_id)}
            key={contact.user_id}
          />
        ))}

      </div>
      {selectedContact && (
        <div className="message-pane">
          <div className="collapse-button" onClick={() => setIsMessagePaneOpen(!isMessagePaneOpen)}>
            {isMessagePaneOpen ? "Collapse" : "Expand"}
          </div>
           {isCalling && <CallComponent isCaller={true} />}
          {conversationExists ? (
            <div className="messages">
              {(messages[selectedContact] || []).map((message, index) => (
                <div
                  className={`message ${message.user === "me" ? "sent" : "received"}`}
                  key={index}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="no-messages">
              Say Hi to start a conversation
            </div>
          )}
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
      )}
    </div>
  );
};

export default Chat;



// import React, { useContext, useEffect, useState, useRef } from "react";
// import "./Chat.scss";
// import Contact from "./Contact";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { AuthContext } from "../../context/AuthContext";
// import { makeRequest } from "../../axios";
// import { w3cwebsocket as W3CWebSocket } from "websocket";

// const Chat = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [messages, setMessages] = useState({});
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [conversationExists, setConversationExists] = useState(true); // Track if conversation exists
//   const [showModal, setShowModal] = useState(false); // State variable for showing the modal
//   const { isLoading, error, data } = useQuery('getfriends', async () => {
//     return await makeRequest.get(`/Connection/messagingfriends`, {
//       params: {
//         userId: currentUser.data.user.user_id
//       }
//     })
//       .then((res) => res.data);
//   });

//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const client = new W3CWebSocket('ws://192.168.100.6:3000/');

//     client.onopen = () => {
//       console.log('WebSocket Client Connected');
//     };

//     client.onmessage = (message) => {
//       const dataFromServer = JSON.parse(message.data);
//       handleMessage(dataFromServer);

//       // Show the modal when a message is received
//       setShowModal(true);
//     };

//     // Store the client instance in a state variable
//     setWebSocketClient(client);

//     return () => {
//       client.close();
//     };
//   }, []);

//   const [webSocketClient, setWebSocketClient] = useState(null);

//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, selectedContact]);

//   const handleMessage = (message) => {
//     console.log("Received message:", message);

//     // Update the messages state with the new message.
//     setMessages((prevMessages) => ({
//       ...prevMessages,
//       [message.user]: [
//         ...(prevMessages[message.user] || []),
//         { user: message.user, text: message.msg },
//       ],
//     }));
//   };

//   const handleContactSelection = async (contact) => {
//     setSelectedContact(contact);

//     try {
//       const response = await makeRequest.get("/Chat/messages", {
//         params: {
//           user_id_1: currentUser.data.user.user_id,
//           user_id_2: contact // Use the contact parameter directly here
//         }
//       });
      
//       // Assuming the response contains an array of messages
//       const messagesData = response.data.messages;

//       console.log(messagesData);

//       // Map over messagesData to extract necessary information
//       const formattedMessages = messagesData.map(message => ({
//         user: (message.sender_id === currentUser.data.user.user_id) ? "me" : "other",
//         text: message.message_content
//       }));

//       // Update the messages state with the formatted messages
//       setMessages({ [contact]: formattedMessages });

//       // Set conversationExists to true since messages are received
//       setConversationExists(true);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//       setConversationExists(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Make a POST request to store the message
//       await makeRequest.post("/Chat/messages", {
//         sender_id: currentUser.data.user.user_id,
//         receiver_id: selectedContact,
//         message_content: newMessage
//       });
//       console.log("Message sent successfully");
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }

//     // Update the messages state with the new message.
//     setMessages((prevMessages) => ({
//       ...prevMessages,
//       [selectedContact]: [
//         ...(prevMessages[selectedContact] || []),
//         { user: "me", text: newMessage },
//       ],
//     }));

//     // Send message using WebSocket
//     if (webSocketClient) {
//       webSocketClient.send(JSON.stringify({
//         type: "message",
//         msg: newMessage,
//         user: currentUser.data.user.user_id, // Assuming user_id is unique
//       }));
//     }

//     // Clear the message input
//     setNewMessage("");
//   };

//   return (
//     <div className="chat-container">
//       <div className="contacts-pane">

//         {isLoading ? "Loading" : data.map((contact) => (
//           <Contact
//             name={contact.username}
//             status="Online"
//             image={"https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/" + contact.ProfilePic}
//             onClick={() => handleContactSelection(contact.user_id)}
//             key={contact.user_id}
//           />
//         ))}

//       </div>
//       {selectedContact && (
//         <div className="message-pane">
//           {conversationExists ? (
//             <div className="messages">
//               {(messages[selectedContact] || []).map((message, index) => (
//                 <div
//                   className={`message ${message.user === "me" ? "sent" : "received"}`}
//                   key={index}
//                 >
//                   {message.text}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           ) : (
//             <div className="no-messages">
//               Say Hi to start a conversation
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="message-form">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="message-input"
//             />
//             <button type="submit" className="send-button">
//               Send
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Modal for displaying incoming messages */}
//       {showModal && (
//         <div className="modal">
//           <p>You have a new message!</p>
//           <button onClick={() => setShowModal(false)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;

