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
import ReportCreate from './components/ReportCreate';
import ReportsList from './components/ReportsList';
import ReportShow from './components/ReportShow';
import ReportEdit from './components/ReportEdit';
import ContactsList from './components/ContactsList';
import { ContactsProvider } from './context/ContactsContext';

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
          <ContactsProvider>
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
              <Route path="/informes" element={<ReportsList />} />
              <Route path="/informes/new" element={<ReportCreate />} />
              <Route path="/informes/:reportId" element={<ReportShow />} />
              <Route path="/informes/edit/:reportId" element={<ReportEdit />} />
              <Route path="/contacts" element={<ContactsList />} />
            </Routes>
          </DashboardLayout>
          </ContactsProvider>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
