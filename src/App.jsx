import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminPanel from "./components/AdminPanel";
import NGODashboard from "./components/NGODashboard";
import VerifierDashboard from "./components/VerifierDashboard";
import { ToastContainer } from 'react-toastify';
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer/>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/verifier" element={<VerifierDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
