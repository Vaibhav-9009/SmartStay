import React, { useState } from "react";
import API from "../api/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      setError("");

      alert("Login successful");

    } catch (err) {

      console.error(err);

      setError("Invalid credentials");
    }
  };

  return (
    <div>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      {error && <p style={{color:"red"}}>{error}</p>}

    </div>
  );
}

export default Login;
