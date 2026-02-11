import { useState } from "react";
import API from "../api/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

   const handleLogin = async () => {
  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    onLogin();

  } catch (error){
    console.log(error);
    setError("Invalid credentials");
  }
};

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Login</h3>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
