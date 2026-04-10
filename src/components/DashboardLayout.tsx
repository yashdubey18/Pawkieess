import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePage, onNavigate }) => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    if (!user) return null;

    const isSitter = user.role === 'pet_sitter';
    const isAdmin = user.role === 'admin';

    return (
        <div className="dashboard-container">
            {/* Hamburger Menu Button */}
            <button
                className="hamburger-menu"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar glass-card ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="paw-icon">🐾</span>
                    <h3>PAWKIESS</h3>
                </div>

                <div className="user-profile-summary">
                    <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{user.name}</p>
                        <p className="user-role">
                            {isAdmin ? 'Administrator' : (isSitter ? 'Pet Sitter' : 'Pet Owner')}
                        </p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}
                        onClick={() => onNavigate('overview')}
                    >
                        <span>📊</span> Overview
                    </button>

                    {isSitter ? (
                        <>
                            <button
                                className={`nav-item ${activePage === 'requests' ? 'active' : ''}`}
                                onClick={() => onNavigate('requests')}
                            >
                                <span>📨</span> Requests
                            </button>
                            <button
                                className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
                                onClick={() => onNavigate('profile')}
                            >
                                <span>👤</span> My Profile
                            </button>
                        </>
                    ) : isAdmin ? (
                        <>
                            <button
                                className={`nav-item ${activePage === 'users' ? 'active' : ''}`}
                                onClick={() => onNavigate('users')}
                            >
                                <span>👥</span> Users
                            </button>
                            <button
                                className={`nav-item ${activePage === 'bookings' ? 'active' : ''}`}
                                onClick={() => onNavigate('bookings')}
                            >
                                <span>📅</span> All Bookings
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`nav-item ${activePage === 'search' ? 'active' : ''}`}
                                onClick={() => onNavigate('search')}
                            >
                                <span>🔍</span> Find Sitter
                            </button>
                            <button
                                className={`nav-item ${activePage === 'pets' ? 'active' : ''}`}
                                onClick={() => onNavigate('pets')}
                            >
                                <span>🐕</span> My Pets
                            </button>
                        </>
                    )}

                    {!isAdmin && (
                        <>
                            <button
                                className={`nav-item ${activePage === 'bookings' ? 'active' : ''}`}
                                onClick={() => onNavigate('bookings')}
                            >
                                <span>📅</span> Bookings
                            </button>

                            <button
                                className={`nav-item ${activePage === 'messages' ? 'active' : ''}`}
                                onClick={() => onNavigate('messages')}
                            >
                                <span>💬</span> Messages
                            </button>

                            <button
                                className={`nav-item ${activePage === 'ai-chat' ? 'active' : ''}`}
                                onClick={() => onNavigate('ai-chat')}
                            >
                                <span>🤖</span> AI Assistant
                            </button>
                        </>
                    )}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        className="nav-item"
                        onClick={logout}
                        style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 600,
                            border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}
                    >
                        <span>🏠</span> Home
                    </button>

                    <button className="logout-btn" onClick={logout}>
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
