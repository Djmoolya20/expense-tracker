import { useState } from "react";
import API from "../services/api";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setToken(token);

      alert("Login successful");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2 className="title">🔐 Login</h2>

        <input
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;