import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout';
import NewsList from './components/NewsList';
import NewsShow from './components/NewsShow';
import NewsCreate from './components/NewsCreate';
import NewsEdit from './components/NewsEdit';
import CategoryManager from './components/Categories'
import EventsList from './components/EventsList';
import EventShow from './components/EventShow';
import EventCreate from './components/EventCreate';
import EventEdit from './components/EventEdit';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:newsId" element={<NewsShow />} />
              <Route path="/news/new" element={<NewsCreate />} />
              <Route path="/news/:newsId/edit" element={<NewsEdit />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="/eventos" element={<EventsList />} />
              <Route path="/eventos/:eventId" element={<EventShow />} />
              <Route path="/eventos/new" element={<EventCreate />} />
              <Route path="/eventos/:eventId/edit" element={<EventEdit />} />
            </Routes>
          </DashboardLayout>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
