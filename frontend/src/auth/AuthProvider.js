import React, { createContext, useState, useEffect } from "react";

import {

 initTokens,
 saveTokens,
 clearTokens

} from "../api/client";


export const AuthContext = createContext();


export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);


  useEffect(() => {

    initTokens();

  }, []);



  async function login(email, password) {

    const res = await fetch("/api/auth-login", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        email,
        password

      })

    });

    const tokens = await res.json();

    saveTokens(tokens);

    setUser({ email });

  }



  async function register(email, password) {

    const res = await fetch("/api/auth-register", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        email,
        password

      })

    });

    const tokens = await res.json();

    saveTokens(tokens);

    setUser({ email });

  }



  async function logout() {

    const tokens = JSON.parse(localStorage.getItem("tokens"));

    await fetch("/api/auth-logout", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        refreshToken: tokens.refreshToken

      })

    });

    clearTokens();

    setUser(null);

    window.location = "/login";

  }



  return (

    <AuthContext.Provider value={{

      user,
      login,
      register,
      logout

    }}>

      {children}

    </AuthContext.Provider>

  );

}