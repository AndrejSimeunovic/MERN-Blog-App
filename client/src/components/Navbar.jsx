import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { userContext } from "../context/userContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { updateUserLogOut, updateUserName, userName } =
    useContext(userContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const response = await axios.get("https://mern-blog-app-delta.vercel.app/profile", {
          withCredentials: true,
        });
        const user = response.data.user;
        updateUserName(user.username);
      } catch (error) {
        updateUserName(null);
      }
    };
    checkCookie();
  }, []);

  async function logOut() {
    toggleMenu();
    await axios.get("https://mern-blog-app-delta.vercel.app/logout", {
      withCredentials: true,
    });
    toast.success("Logged out!");
    updateUserLogOut();
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <nav>
        <div className="header">
          <Link to="/">MyBlog</Link>
        </div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          &#9776;
        </div>
        {userName ? (
          <>
            <ul className={isMenuOpen ? "active" : ""}>
              <li>
                <Link onClick={toggleMenu} to="/create-post">
                  Create new post
                </Link>
              </li>
              <li>
                <Link onClick={logOut} to="/">
                  Logout ({userName})
                </Link>
              </li>
            </ul>{" "}
          </>
        ) : (
          <>
            <ul className={isMenuOpen ? "active" : ""}>
              <li>
                <Link onClick={toggleMenu} to="/register">
                  Register
                </Link>
              </li>
              <li>
                <Link onClick={toggleMenu} to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>
    </>
  );
}
