import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg";
import './style.css'
import axios from "axios";
import { setAvatarRoute } from "../../utils/API";


export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [avatarUpdate, setAvatarUpdate] = useState(null);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };



  const handleAvatarFileChange = async (event) => {
    const user = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const formData = new FormData();
    formData.append("avatar", event.target.files[0]);
    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, formData
    );
    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(user)
      );
      setAvatarUpdate(event.target.files[0].name);
    }
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <div id='AllUsers'>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`http://localhost:5000/upload/${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              {console.log(currentUserImage)}
              <input type='file' name='avatar' onChange={(event) => handleAvatarFileChange(event)} />
              <img
                src={avatarUpdate !== null ? `http://localhost:5000/upload/${avatarUpdate}` : `http://localhost:5000/upload/${currentUserImage}`}
                // src={'http://localhost:5000/upload/data.png'}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

