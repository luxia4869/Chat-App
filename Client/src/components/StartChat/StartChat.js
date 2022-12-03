import React, { useState, useEffect } from "react";
import './style.css'
import GIFT from "../../assets/giphy.gif";
import LogoutButton from "../LogoutButton/LogoutButton";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <div id='StartChat'>
      <div className="logout">
        <LogoutButton />
      </div>
      <div className="content">
        <img src={GIFT} alt="" />
        <h1>
          Welcome, <span>{userName}!</span>
        </h1>
        <h3>Please select a chat to Start messaging.</h3>
      </div>
    </div>
  );
}
