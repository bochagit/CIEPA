import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import SignIn from './SignIn';
import CrudDashboard from './CrudDashboard';
import ProtectedRoute from './components/ProtectedRoute'
import MainContent from './components/MainContent';
import QuienesSomos from './components/QuienesSomos';
import Principios from './components/Principios';
import Objetivos from './components/objetivos';
import Integrantes from './components/Integrantes';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <MainContent />
          </Layout>
          } />
          <Route path="/quienes-somos" element={
            <Layout>
              <QuienesSomos />
            </Layout>
          } />
          <Route path="/principios" element={
            <Layout>
              <Principios />
            </Layout>
          } />
          <Route path="/objetivos" element={
            <Layout>
              <Objetivos />
            </Layout>
          } />
          <Route path="/integrantes" element={
            <Layout>
              <Integrantes />
            </Layout>
          } />
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
