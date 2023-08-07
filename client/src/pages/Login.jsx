import React, { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import { toast } from "react-toastify";

export default function Login() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { updateUserName } = useContext(userContext);

  useEffect(() => {
    const checkCookie = async () => {
      try {
        await axios.get("http://localhost:3000/login", {
          withCredentials: true,
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };
    checkCookie();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/login",
        {
          username: userNameRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );
      updateUserName(userNameRef.current.value);
      navigate("/");
      toast.success("Logged in!");
    } catch (error) {
      toast.error("Wrong credentials!");
    }
  }

  return (
    <div className="form-container">
      <div className="register-title">Login</div>
      <form onSubmit={handleSubmit}>
        <input
          ref={userNameRef}
          type="text"
          name="userName"
          placeholder="username"
          autoComplete="off"
        />
        <input
          ref={passwordRef}
          type="password"
          name="password"
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
