import React from "react";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home/:username" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
