import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation 
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SiteProvider } from './context/SiteContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CoachDashboard } from './pages/CoachDashboard';
import { ScoutDashboard } from './pages/ScoutDashboard';
import { AthletePage } from './pages/AthletePage';
import { EventPage } from './pages/EventPage';

function AppContent() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/scout" element={<ScoutDashboard />} />
        <Route path="/athlete/:id" element={<AthletePage />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <SiteProvider>
      {/* Added the future flags here to silence the warnings */}
      <Router 
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <AppContent />
      </Router>
    </SiteProvider>
  );
}