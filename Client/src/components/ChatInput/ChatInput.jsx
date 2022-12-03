import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import './style.css'
import Picker from "emoji-picker-react";
import { BsFillArrowUpCircleFill } from "react-icons/bs";


export default function ChatInput({ handleSendMsg, handleSendFile, socket }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    // console.log(emojiObject.emoji)
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const sendFile = (e) => {
    handleSendFile(e);
  }

  // function upload(files) {
  //   socket.emit("upload", files[0], (status) => {
  //     console.log(status);
  //   });
  // }


  return (
    <div id='ChatInput'>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill className="bsEmoji" onClick={handleEmojiPickerhideShow}/>
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
        </div>
        <div className="upload">
          <input type="file" onChange={(e) => sendFile(e)} />
          <BsFillArrowUpCircleFill className="upload-icon"></BsFillArrowUpCircleFill>
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}

