import { useState } from "react";
import API from "../api/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // save token
      localStorage.setItem("token", res.data.token);

      // clear error
      setError("");

      alert("Login successful");

      // optional redirect
      window.location.reload();

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);

      setError(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      {error && <p style={{color:"red"}}>{error}</p>}

    </form>
  );
}
