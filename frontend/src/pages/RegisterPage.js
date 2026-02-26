import { useState } from "react";

import useAuth from "../auth/useAuth";


export default function RegisterPage() {

  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function submit(e) {

    e.preventDefault();

    await register(email, password);

    window.location = "/dashboard";

  }


  return (

    <form onSubmit={submit}>

      <h1>Register</h1>

      <input onChange={e => setEmail(e.target.value)} />

      <input
        type="password"
        onChange={e => setPassword(e.target.value)}
      />

      <button>Create Account</button>

    </form>

  );

}