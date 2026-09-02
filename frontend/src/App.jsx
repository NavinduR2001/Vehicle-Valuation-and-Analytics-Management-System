import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard';
import Valuations from './Pages/Manager/valuations';



function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/valuations" element={<Valuations />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

