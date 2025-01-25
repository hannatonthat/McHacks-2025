import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Admin from './Pages/Admin';
import Donor from './Pages/Donor';
import Hospital from './Pages/Hospital';
import MakeDonation from './Pages/MakeDonation';
import Inventory from './Pages/Inventory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/makedonation" element={<MakeDonation />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
