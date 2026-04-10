import { useState } from 'react'
import './App.css';
import HomePage from './components/HomePage';
import DashboardLayout from './components/DashboardLayout';
import OwnerDashboard from './components/OwnerDashboard';
import SitterDashboard from './components/SitterDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ChatInterface from './components/ChatInterface';
import AIChat from './components/AIChat';
import ReceptionistChat from './components/ReceptionistChat';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('overview');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Show admin login page
  if (showAdminLogin && !isAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated, show dashboard based on role
  if (isAuthenticated && user) {
    return (
      <>
        <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
          {activePage === 'overview' && (
            user.role === 'admin' ? <AdminDashboard /> :
              user.role === 'pet_sitter' ? <SitterDashboard /> : <OwnerDashboard />
          )}
          {activePage === 'search' && <OwnerDashboard />}
          {activePage === 'pets' && <OwnerDashboard />}
          {activePage === 'profile' && <SitterDashboard />}
          {activePage === 'ai-chat' && <AIChat />}
          {activePage === 'messages' && <ChatInterface />}

          {/* Admin Routes */}
          {activePage === 'users' && <AdminDashboard initialTab="users" />}

          {/* Default fallback */}
          {activePage === 'requests' && <SitterDashboard />}
          {activePage === 'bookings' && (
            user.role === 'admin' ? <AdminDashboard initialTab="bookings" /> :
              <div className="dashboard-content">
                <h1>Bookings Coming Soon</h1>
              </div>
          )}
        </DashboardLayout>
        <ReceptionistChat />
      </>
    );
  }

  // Otherwise show Landing Page
  return <HomePage onAdminLogin={() => setShowAdminLogin(true)} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
