import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import React, { useState, useEffect, useCallback } from "react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./Authentication/ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      if (Object.keys(selectedChat).length) {
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );

        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, user.token, toast]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    console.log("Selected Chat Changed: ", selectedChat); // Logging the change in selectedChat
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification, "-----------");

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Ensuring initial state values
  console.log("User: ", user); // Logging the user state
  console.log("Selected Chat: ", selectedChat); // Logging the selectedChat state
  console.log("Messages: ", messages); // Logging the messages state

  // if (!user || !Object.keys(selectedChat)?.length) {
  //   return (
  //     <Box
  //       display="flex"
  //       alignItems="center"
  //       justifyContent="center"
  //       height="100%"
  //     >
  //       <Text fontSize="3xl" pb={3} fontFamily="sans-serif">
  //         Click on a user to start chatting
  //       </Text>
  //     </Box>
  //   );
  // }

  if (!user || !selectedChat || !Object.keys(selectedChat).length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text fontSize="3xl" pb={3} fontFamily="sans-serif">
          Click on a user to start chatting
        </Text>
      </Box>
    );
  }

  const senderUser = getSenderFull(user, selectedChat.users) || {};

  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        width="100%"
        fontFamily="sans-serif"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat(null)}
        />
        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            {senderUser && <ProfileModal user={senderUser} />}
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
            />
          </>
        )}
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner
            size="xl"
            width={20}
            height={20}
            alignSelf="center"
            margin="auto"
          />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}
        <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
          {isTyping ? (
            <div>
              <Lottie
                options={defaultOptions}
                width={40}
                style={{ marginBottom: 15, marginLeft: 0 }}
              />
            </div>
          ) : (
            <></>
          )}

          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a Message..."
            onChange={typingHandler}
            value={newMessages}
          />
        </FormControl>
      </Box>
    </>
  );
};

export default SingleChat;
