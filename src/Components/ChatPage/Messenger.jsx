import React, { useEffect, useState } from "react";
import axios from "axios";
import { SlArrowDown } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaRegCircle } from "react-icons/fa";
import ChatPage from "./ChatPage";
import userImage from "../../assets/user.png";
import Chatter from "./Chatter";

const Messenger = ({ socket }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showChatPage, setShowChatPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [chatters, setChatters] = useState([]);
  const [messages, setMessages] = useState({});
  const [username, setUsername] = useState(sessionStorage.getItem("username") || "");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (message) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.name]: [...(prevMessages[message.name] || []), message],
      }));
    });

    socket.on("messageHistory", (history) => {
      const groupedMessages = history.reduce((acc, message) => {
        if (!acc[message.name]) acc[message.name] = [];
        acc[message.name].push(message);
        return acc;
      }, {});
      setMessages(groupedMessages);
    });

    return () => {
      socket.off("messageResponse");
      socket.off("messageHistory");
    };
  }, [socket]);

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/messageSearch/${searchQuery}`);
      console.log(response.data);
      setSearchResults(response.data);
      setAccounts((prev) => [...prev, response.data]);
      handleSearch();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleMessageContainer = (recipient) => {
    if (!chatters.includes(recipient)) {
      setChatters([...chatters, recipient]);
    }
    setShowChatPage(!showChatPage);
  };

  return (
    <div className="min-h-screen w-[70vw] flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600 p-8 rounded-lg">
      <div className="flex w-full h-[95vh] max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/3 h-[100vh] bg-gray-100 p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold">
              {username}
              <SlArrowDown className="inline h-4 ml-2 cursor-pointer" />
            </span>
            {showSearch ? (
              <FaRegEdit className="text-2xl cursor-pointer" onClick={handleSearch} />
            ) : (
              <div className="absolute top-[15vh] left-[35px]">
                <input
                  type="text"
                  className="border-gray-800 rounded-lg mr-8 shadow-md"
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="border-none mt-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md rounded-tr-none rounded-br-none p-1 " onClick={performSearch}>
                  Search
                </button>
                <button className="border-none mt-2 bg-red-600 hover:bg-red-900 text-white p-1 w-8 rounded-md rounded-tl-none rounded-bl-none " onClick={handleSearch}>
                  X
                </button>
              </div>
            )}
          </div>
          <div className="overflow-y-auto h-[100vh]">
            {accounts.length > 0 ? (
              accounts.map((chatter, index) => (
                <Chatter
                  key={index}
                  id={index}
                  handleMessageContainer={handleMessageContainer}
                  searchResult={chatter}
                  userImage="/path/to/default/image.jpg"
                />
              ))
            ) : (
              <p className="relative top-[250px] text-center text-gray-400">No chatters found</p>
            )}
          </div>
        </div>
        <div className="w-2/3 flex flex-col items-center justify-center p-8 bg-gray-50">
          {chatters.map((chatter) => (
            <div key={chatter} className="w-full">
              {showChatPage ? (
                <>
                  <ChatPage socket={socket} recipient={chatter} messages={messages[chatter] || []} />
                 
                </>
              ) :  <div className="text-center">
                    <div className="relative mb-4">
                      <FaRegCircle
                        className="absolute text-gray-300"
                        style={{
                          fontSize: "75px",
                          top: "-60px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                      <FiSend
                        className="absolute text-gray-700"
                        style={{
                          fontSize: "32px",
                          top: "-35px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
                    <p>Send private photos and messages to a friend or group.</p>
                  </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
