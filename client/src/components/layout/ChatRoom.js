import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Spinner from "../layout/Spinner";
import { set } from "mongoose";
import { Link, useParams } from "react-router-dom";
import { getChatWithChatID } from "../../actions/chatRoom";

const ChatRoom = ({ auth, getChatWithChatID }) => {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatObj, setChatObj] = useState(null);

  useEffect(() => {
    const newSocket = io();

    setSocket(newSocket);

    return () => {
      // Clean up the socket event listeners
      if (newSocket) {
        newSocket.off("receiveMessage");
      }
    };
  }, []);

  //   useEffect(async () => {
  //     if (socket) {
  //       // Fetch the chat history
  //       socket.emit("fetchChatHistory", { user1, user2 });

  //       // Get chat from backend
  //       await getChatWithChatID(id).then((res) => {
  //         setChatObj(res.data);
  //       });

  //       setMessages(chatObj.messages);

  //       // Listen for incoming chat history
  //       //   socket.on("receiveChatHistory", (chatHistory) => {
  //       //     setMessages(chatHistory);
  //       //   });

  //       // Listen for incoming messages
  //       socket.on("receiveMessage", (message) => {
  //         setMessages((prevMessages) => [...prevMessages, message]);
  //       });
  //     }
  //   }, [socket, user1, user2]);

  useEffect(() => {
    if (socket) {
      // Get chat from backend
      getChatWithChatID(id)
        .then((res) => {
          setChatObj(res.data);
          setMessages(res.data.messages);
        })
        .catch((err) => {
          console.error(err);
        });

      // Listen for incoming messages
      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket, id]);

  const sendMessage = (content) => {
    const message = {
      chatId: id,
      sender: auth.user._id,
      content,
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", message);
  };

  if (!chatObj) {
    return <Spinner />;
  }

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

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  auth: state.auth,
});

export default connect(mapStateToProps, { getChatWithChatID })(ChatRoom);
