import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const navigate = useNavigate();

 const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });

    // Save JWT token
    localStorage.setItem("token", res.data.token);

    // Save logged-in citizen's ID
    localStorage.setItem("citizenId", res.data.user._id);

    navigate("/");
  } catch (err) {
    alert(err?.response?.data?.error || "Login failed");
  }
};


  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
