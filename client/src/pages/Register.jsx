import React, { useRef, useEffect } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const userName = useRef();
  const password = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const checkCookie = async () => {
      try {
        await axios.get("https://mern-blog-app-delta.vercel.app/register", {
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
      const response = await axios.post("https://mern-blog-app-delta.vercel.app/register", {
        username: userName.current.value,
        password: password.current.value,
      });
      toast.success("Registration successfull!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="form-container">
      <div className="register-title">Register</div>
      <form onSubmit={handleSubmit}>
        <input
          ref={userName}
          type="text"
          name="userName"
          placeholder="username"
          autoComplete="off"
        />
        <input
          ref={password}
          type="password"
          name="password"
          placeholder="password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
