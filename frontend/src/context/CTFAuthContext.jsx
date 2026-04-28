import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CTFAuthContext = createContext(null);

export function CTFAuthProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [ctfToken, setCTFToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ctf_token");
    const savedPlayer = localStorage.getItem("ctf_player");
    if (savedToken && savedPlayer) {
      setCTFToken(savedToken);
      setPlayer(JSON.parse(savedPlayer));
    }
    setLoading(false);
  }, []);

  const loginCTF = (token, playerData) => {
    localStorage.setItem("ctf_token", token);
    localStorage.setItem("ctf_player", JSON.stringify(playerData));
    setCTFToken(token);
    setPlayer(playerData);
  };

  const logoutCTF = () => {
    localStorage.removeItem("ctf_token");
    localStorage.removeItem("ctf_player");
    setCTFToken(null);
    setPlayer(null);
  };

  return (
    <CTFAuthContext.Provider value={{ player, ctfToken, loginCTF, logoutCTF, loading }}>
      {children}
    </CTFAuthContext.Provider>
  );
}

CTFAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCTFAuth() {
  const ctx = useContext(CTFAuthContext);
  if (!ctx) throw new Error("useCTFAuth must be used within CTFAuthProvider");
  return ctx;
}
