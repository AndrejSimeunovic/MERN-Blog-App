import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import UserProvider from "./context/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Root() {
  return (
    <UserProvider>
      <Navbar />
      <div className="main-container">
        <div className="container">
          <ToastContainer autoClose={2000} />
          <Outlet />
        </div>
      </div>
    </UserProvider>
  );
}
