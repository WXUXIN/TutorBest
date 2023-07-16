import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

const ChatRoom = ({ user1, user2 }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io();

    setSocket(newSocket);

    return () => {
      // Clean up the socket event listeners
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.emit("fetchChatHistory", { user1, user2 });
    }
  }, [socket, user1, user2]);

  const sendMessage = (content) => {
    const message = {
      chatId: "<CHAT_ID>",
      sender: "<SENDER_USER_ID>",
      content,
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", message);
  };

  return (
    <section className="bright-overlay-bg">
      <div className="container">
        <div className="box-container">
          <h1
            className="form-font-gold normal-text"
            style={{ textAlign: "center" }}
          >
            Chat Room
          </h1>
          {/* Render the chat messages */}
          {messages.map((message, index) => (
            <p key={index}>{message.content}</p>
          ))}

          {/* Chat input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const content = e.target.elements.content.value;
              sendMessage(content);
              e.target.elements.content.value = "";
            }}
          >
            <input type="text" name="content" />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(ChatRoom);
