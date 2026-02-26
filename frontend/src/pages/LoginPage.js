import { useState } from "react";

import useAuth from "../auth/useAuth";


export default function LoginPage() {

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  async function submit(e) {

    e.preventDefault();

    await login(email, password);

    window.location = "/dashboard";

  }



  return (

    <form onSubmit={submit}>

      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button>Login</button>

    </form>

  );

}