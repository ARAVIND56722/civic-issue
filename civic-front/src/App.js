// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WelcomePage from "./pages/WelcomePage";
import Signup from "./pages/Signup";
import LoginChoice from "./pages/LoginChoice";
import CitizenLogin from "./pages/CitizenLogin";
import AdminLogin from "./pages/AdminLogin";
import IssueForm from "./components/IssueForm";

import AdminDashboard from "./components/AdminDashboard";
import IssueList from "./components/IssueList";   // 👈 add this
import IssueDetail from "./components/IssueDetail"; // 👈 add this
import MyIssues from "./pages/MyIssues";

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome / Landing page */}
        <Route path="/" element={<WelcomePage />} />
        
        <Route path="/signup" element={<Signup />} />

        {/* Login choice screen */}
        <Route path="/login" element={<LoginChoice />} />

        {/* Specific login pages */}
        <Route path="/login/citizen" element={<CitizenLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Dashboards */}
        <Route path="/report" element={<IssueForm />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Issues */}
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/issues" element={<IssueList />} />       {/* List all issues */}
        <Route path="/issues/:id" element={<IssueDetail />} /> {/* Show issue detail */}
      </Routes>
    </Router>
  );
}

export default App;
