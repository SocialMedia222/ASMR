import React, { useEffect, useState, useMemo } from "react";
import Header from "./Header";
import PostPage from "./PostPage/PostPage";
import SearchPage from "./SearchPage/SearchPage";
import CreatePost from "./CreatePost/CreatePost";
import socketIO from "socket.io-client";
import Messenger from "./ChatPage/Messenger";
import UserProfile from "./UserProfile/UserProfile";
import Explore from "./Explore/Explore";

function Home() {
  const [currentPage, setCurrentPage] = useState("PostPage");
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [userList, setUserList] = useState({});
  
  const username = useMemo(() => sessionStorage.getItem('username'), []);
  const socket = useMemo(() => socketIO.connect("http://localhost:3000"), []);

  useEffect(() => {
    console.log("Setting up Messenger component...");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      // Emit userConnected event with the username
      if (username) {
        console.log(`Emitting userConnected for ${username}`);
        socket.emit('userConnected', username);
      }
    });

    socket.on("userList", (users) => {
      setUserList(Object.fromEntries(users));
      console.log("Connected users:", Object.fromEntries(users));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      console.log("Cleaning up Messenger component...");
      socket.disconnect();
    };
  }, [socket, username]);

  return (
    <div className="flex items-center body-image">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowSearchSidebar={setShowSearchSidebar}
        showSearchSidebar={showSearchSidebar}
      />
      <SearchPage showSearchSidebar={showSearchSidebar} />


      {currentPage === "PostPage" ? (
        <PostPage socket={socket} />
      ) : currentPage === "SearchPage" ? (
        <SearchPage />
      ) : currentPage === "CreatePost" ? (
        <CreatePost />
      ) : currentPage === "ChatPage" ? (
        <Messenger socket={socket} />
      ) : currentPage === "UserProfile" ? (
        <UserProfile />
      ) : currentPage === "Explore" ? (
        <Explore />
      ) : null}
    </div>
  );
}

export default Home;
