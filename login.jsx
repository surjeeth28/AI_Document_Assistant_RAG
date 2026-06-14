import { useState } from "react";
import { api } from "../api";
import "../styles/style.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async () => {
  if (!email || !password) {
    alert("Email and Password are required");
    return;
  }
  const data = await api.login(email, password);

  if (!data.access_token) {
    alert("Login failed");
    return;
  }

  localStorage.setItem("token", data.access_token);
  alert("Login success ✅");

  window.location.href = "/chat";
};

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Welcome Back</h2>

        <input
          className="input"
          placeholder="Enter Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Enter Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={login} >
          Login
        </button>

        <p className="text">
          Don't have an account?{" "}
          <span
            className="link"
            onClick={() => (window.location.href = "/")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;