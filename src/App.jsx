import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Businesses from './pages/Businesses';
import BusinessDetails from './pages/BusinessDetails';
import Staff from './pages/Staff';

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/business/:ownerId/:bizId" element={<BusinessDetails />} />
            <Route path="/staff" element={<Staff />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
