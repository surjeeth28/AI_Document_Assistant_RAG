import { useState } from "react";
import { api } from "../api";
import  "../styles/style.css"

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const signup = async () => {
  const data = await api.signup(email, password);

  if (data.detail) {
    alert(data.detail);
    if (data.detail === "User already exists") {
      window.location.href = "/login";
    }

    return;
  }

  alert("Signup success ✅");
  window.location.href = "/login";
};

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create Account</h2>

        <input
          className="input"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={signup}>
          Signup
        </button>
        
        <p className="text">
          If you have already signup?{" "}
          <span
            className="link"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;