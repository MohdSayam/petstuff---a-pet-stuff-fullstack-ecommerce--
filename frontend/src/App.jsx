import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/*for user layout*/}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          {/*for admin layout*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
