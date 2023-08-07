import { createContext, useState } from "react";

export const userContext = createContext({});

export default function UserProvider({ children }) {
  const [userName, setUsername] = useState(null);

  function updateUserLogOut() {
    setUsername(null);
  }
  function updateUserName(user) {
    setUsername(user);
  }

  return (
    <userContext.Provider
      value={{
        updateUserLogOut,
        updateUserName,
        userName,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
