// import { createContext, useContext, useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [user, setUser] = useState();
//   const [selectedChat, setSelectedChat] = useState([]);
//   const [chats, setChats] = useState();

//   const navigator = useHistory();
//   navigator?.push("/chats");

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     setUser(userInfo);

//     if (!userInfo) {
//       navigator?.push("/");
//     }
//   }, []);

//   return (
//     <ChatContext.Provider
//       value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;

import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigator = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (userInfo) {
      navigator?.push("/chats");
    } else {
      navigator?.push("/");
    }
  }, [navigator]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
