import React, { useState, useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import LogoutButton from "../LogoutButton/LogoutButton";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import './style.css'
import { sendMessageRoute, recieveMessageRoute } from "../../utils/API";
import { appendFile } from "fs";
const fs = require("fs");

export default function ChatContainer({ currentChat, socket }) {
  const [t, setT] = useState(null);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    console.log("hgffgfhg")
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      type: "txt",
      byteFile: null,
      filename: null,
      extension: null,
    });
    await axios.post(sendMessageRoute, {
      to: currentChat._id,
      from: data._id,
      message: msg
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  const handleSendFile = async (e) => {
    const file = e.target.files[0];
    const filename = file.name;
    const extension = file.type;

    const byteFile = await getAsByteArray(file)
    let blob = new Blob([byteFile], { extension });// change resultByte to bytes
    const msg = <a href={window.URL.createObjectURL(blob)} download={filename}>{filename}</a>;
    setArrivalMessage({ fromSelf: true, message: msg });

    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg: null,
      type: "file",
      byteFile: byteFile,
      filename: filename,
      extension: extension,
    });

    // await axios.post(sendMessageRoute, {
    //   to: currentChat._id,
    //   from: data._id,
    //   msg: null,
    //   type: "file",
    //   bytefile: byteFile,
    //   filename: filename,
    //   extension: extension,
    // });

    // const msgs = [...messages];
    // msgs.push({ fromSelf: true, message: msg });
    // setMessages(msgs);
  };

  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()

      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)

      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg, filename, extension, byteFile) => {
        // console.log(type);
        if (filename === null)
          setArrivalMessage({ fromSelf: false, message: msg }); else {
          console.log(filename);
          let blob = new Blob([byteFile], {extension});// change resultByte to bytes
          const msg1 = <a href={window.URL.createObjectURL(blob)} download={filename}>{filename}</a>;
          setArrivalMessage({ fromSelf: false, message: msg1 });
        }
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div id='ChatScreen' >
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`http://localhost:5000/upload/${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <LogoutButton />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} handleSendFile={handleSendFile} socket={socket.current} />
    </div>
  );
}