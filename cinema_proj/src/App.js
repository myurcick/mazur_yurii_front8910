// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Booking from './pages/Booking';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Cinema React</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking/:id" element={<Booking />} />
          </Routes>
        </main>
        <footer>
          <p>© 2023 Cinema React. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;