import React, { useEffect, useState, useRef } from "react";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";

const ChatPage = ({ socket, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const lastMessageRef = useRef(null);

  socket.on("serverMessage", (message) => {
    console.log("Server: ", message);
  });

  const handleSendMessage = (messageData) => {
    socket.emit("message", messageData);
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (username) {
      socket.emit("userConnected", username);
    }

    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log("I received the message.");
    };

    const handleTyping = (data) => setTyping(data.typing);

    const handleMessageHistory = (data) => setMessages(data);

    socket.on("messageResponse", handleNewMessage);
    socket.on("typingResponse", handleTyping);
    socket.on("messageHistory", handleMessageHistory);

    return () => {
      socket.off("messageResponse", handleNewMessage);
      socket.off("typingResponse", handleTyping);
      socket.off("messageHistory", handleMessageHistory);
    };
  }, [socket]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="w-[600px] h-[95vh] rounded-tl-none rounded-bl-none max-w-4xl p-4 absolute top-8 rounded-lg bg-white shadow-lg">
        <ChatBody messages={messages} lastMessageRef={lastMessageRef} typing={typing} />
        <ChatFooter socket={socket} handleSendMessage={handleSendMessage} recipient={recipient} />
      </div>
    </div>
  );
};

export default ChatPage;
