import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import SignIn from './SignIn';
import CrudDashboard from './CrudDashboard';
import ProtectedRoute from './components/ProtectedRoute'
import MainContent from './components/MainContent';
import QuienesSomos from './components/QuienesSomos';
import Principios from './components/Principios';
import Objetivos from './components/Objetivos';
import Integrantes from './components/Integrantes';
import QueHacemos from './components/QueHacemos';
import EjesTrabajo from './components/EjesTrabajo';
import Asesoramiento from './components/Asesoramiento';
import Notas from './components/Notas';
import Contacto from './components/Contacto';
import Note from './components/Note';

export default function App() {
  return (
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
        <Route path="/que-hacemos" element={
          <Layout>
            <QueHacemos />
          </Layout>
        } />
        <Route path="/ejes" element={
          <Layout>
            <EjesTrabajo />
          </Layout>
        } />
        <Route path="/asesoramiento" element={
          <Layout>
            <Asesoramiento />
          </Layout>
        } />
        <Route path="/notas" element={
          <Layout>
            <Notas />
          </Layout>
        } />
        <Route path="/notas/:id" element={
          <Layout>
            <Note />
          </Layout>
        } />
        <Route path="/contacto" element={
          <Layout>
            <Contacto />
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
  );
}
