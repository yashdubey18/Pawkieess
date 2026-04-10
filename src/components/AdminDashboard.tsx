import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import '../styles/Dashboard.css';

interface AdminDashboardProps {
    initialTab?: 'overview' | 'users' | 'bookings';
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'overview' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings'>(initialTab);
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
            setStats({
                totalUsers: data.length,
                activeUsers: data.filter((u: UserData) => u.role !== 'admin').length,
                totalBookings: 0 // Will be updated when bookings endpoint is ready
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin': return 'role-badge admin';
            case 'pet_owner': return 'role-badge owner';
            case 'pet_sitter': return 'role-badge sitter';
            default: return 'role-badge';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-content">
            <header className="dashboard-header">
                <h1>Admin Panel</h1>
                <p>Welcome back, {user?.name}</p>
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        All Bookings
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            {activeTab === 'overview' && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Active Regular Users</h3>
                        <div className="stat-value">{stats.activeUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Bookings</h3>
                        <div className="stat-value">{stats.totalBookings}</div>
                    </div>
                </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Logged In Users</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            Loading users...
                        </p>
                    ) : users.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No users found.
                        </p>
                    ) : (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>User ID</th>
                                    <th>Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((userData) => (
                                    <tr key={userData._id}>
                                        <td style={{ fontWeight: 600 }}>{userData.name}</td>
                                        <td>{userData.email}</td>
                                        <td>
                                            <span className={getRoleBadgeClass(userData.role)}>
                                                {userData.role === 'pet_owner' ? 'Pet Owner' :
                                                    userData.role === 'pet_sitter' ? 'Pet Sitter' : 'Admin'}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {userData._id.substring(0, 8)}...
                                        </td>
                                        <td>{formatDate(userData.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* All Bookings */}
            {activeTab === 'bookings' && (
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>System Bookings</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Global booking history and status.</p>
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        Booking Table Component Coming Soon
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
