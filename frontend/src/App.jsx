import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import SignIn from './SignIn';
import CrudDashboard from './CrudDashboard';
import ProtectedRoute from './components/ProtectedRoute'
import MainContent from './components/MainContent';
import QuienesSomos from './components/QuienesSomos';
import Principios from './components/Principios';
import QueHacemos from './components/QueHacemos';
import Notas from './components/Notas';
import Contacto from './components/Contacto';
import Note from './components/Note';
import Audiovisual from './components/Audiovisual';
import Conversatorios from './components/Conversatorios';
import Formaciones from './components/Formaciones';
import Jornadas from './components/Jornadas';
import Actividades from './components/Actividades';
import Informes from './components/Informes';
import InformeShow from './components/InformeShow';
import AppTheme from '../shared-theme/AppTheme';
import { CssBaseline } from '@mui/material';
import Proyectos from './components/Proyectos';
import Lineas from './components/LineasTrabajo';

export default function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
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
          <Route path="/que-hacemos" element={
            <Layout>
              <QueHacemos />
            </Layout>
          } />
          <Route path="/lineas-trabajo" element={
            <Layout>
              <Lineas />
            </Layout>
          } />
          <Route path="/proyectos" element={
            <Layout>
              <Proyectos />
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
          <Route path="/informes" element={
            <Layout>
              <Informes />
            </Layout>
          } />
          <Route path="/informes/:id" element={
            <Layout>
              <InformeShow />
            </Layout>
          } />
          <Route path="/audiovisual" element={
            <Layout>
              <Audiovisual />
            </Layout>
          } />
          <Route path="/conversatorios" element={
            <Layout>
              <Conversatorios />
            </Layout>
          } />
          <Route path="/formaciones" element={
            <Layout>
              <Formaciones />
            </Layout>
          } />
          <Route path="/jornadas" element={
            <Layout>
              <Jornadas />
            </Layout>
          } />
          <Route path="/actividades/:id" element={
            <Layout>
              <Actividades />
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
    </AppTheme>
  );
}
