import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Blog from './Blog'
import SignIn from './SignIn';
import CrudDashboard from './CrudDashboard';
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <CrudDashboard />
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}
