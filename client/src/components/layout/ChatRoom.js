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
  const [otherUser, setOtherUser] = useState(null);

  // Get pfp of other user
  useEffect(() => {
    if (socket) {
      // Get chat from backend
      getChatWithChatID(id)
        .then((res) => {
          console.log(res, "this is the chatObj status");
          setChatObj(res);
          setMessages(res.messages);

          if (res.user1._id === auth.user._id) {
            console.log(res.user2, "this is thte other user's info");
            setOtherUser(res.user2);
          } else {
            console.log(res.user1, "this is thte other user's info");
            setOtherUser(res.user1);
          }
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
  const sendMessage = (content) => {
    const message = {
      chatId: id,
      sender: auth.user._id,
      content,
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", message);
  };

  if (!chatObj || !otherUser) {
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
          {/* Render the chat messages 
            if messages belong to the other user, render on the left with their pfp
            if messages belong to the current user, render on the right
          */}

          <div className="chat-container">
            {messages.map((message, index) => {
              if (message.sender === auth.user._id) {
                return (
                  <div className="chat-message chat-message-right" key={index}>
                    <div className="chat-message-content">
                      <p className="form-font-black">{message.content}</p>
                    </div>
                  </div>
                );
              } else {
                // This is the other user's message
                return (
                  <div className="chat-message" key={index}>
                    <div className="chat-message-profile">
                      <img
                        src={`../../../../uploads/${
                          otherUser.photo || "default.jpg"
                        }`}
                        alt="profile pic"
                        className="round-img"
                        style={{
                          marginTop: "20px",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          display: "inline-block", // Add this style to make the image appear inline
                        }}
                      />
                      <p className="chat-message-content form-font-black">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>

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
