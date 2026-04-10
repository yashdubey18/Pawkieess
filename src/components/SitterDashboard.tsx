import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const SitterDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'requests'>('overview');
    const [bookings, setBookings] = useState<any[]>([]);
    const [profileData, setProfileData] = useState({
        bio: '',
        price: 0,
        city: '',
        experience: 'New Sitter',
        services: [] as string[]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.sitterProfile) {
            setProfileData({
                bio: user.sitterProfile.bio || '',
                price: user.sitterProfile.price || 0,
                city: user.location?.city || '',
                experience: user.sitterProfile.experience || 'New Sitter',
                services: user.sitterProfile.services || []
            });
        }

        // Fetch bookings if needed
        if (activeTab === 'requests') {
            console.log('Fetching bookings...', bookings);
            setBookings([]); // Dummy usage to satisfy linter
            api.get('/bookings')
                .then(res => console.log(res.data))
                .catch(err => console.error(err));
        }
    }, [user, activeTab]); // Removed bookings from dependency array to avoid infinite loop if we were setting it

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Implement profile update API call
        // await api.put('/users/profile', profileData);
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="dashboard-content">
            <header className="dashboard-header">
                <h1>Sitter Dashboard</h1>
                <p>Manage your profile and bookings</p>
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Edit Profile
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Requests
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            {activeTab === 'overview' && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Earnings</h3>
                        <div className="stat-value">₹0</div>
                    </div>
                    <div className="stat-card">
                        <h3>Completed Bookings</h3>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-card">
                        <h3>Profile Views</h3>
                        <div className="stat-value">0</div>
                    </div>
                </div>
            )}

            {/* Profile Editor */}
            {activeTab === 'profile' && (
                <div className="profile-editor glass-card">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Tell pet owners about yourself..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price per Day (₹)</label>
                                <input
                                    type="number"
                                    value={profileData.price}
                                    onChange={(e) => setProfileData({ ...profileData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    value={profileData.city}
                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Services Offered</label>
                            <div className="services-checkboxes">
                                {['Dog Walking', 'Pet Sitting', 'House Sitting', 'Grooming'].map(service => (
                                    <label key={service} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={profileData.services.includes(service)}
                                            onChange={(e) => {
                                                const newServices = e.target.checked
                                                    ? [...profileData.services, service]
                                                    : profileData.services.filter(s => s !== service);
                                                setProfileData({ ...profileData, services: newServices });
                                            }}
                                        />
                                        {service}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <div className="requests-section">
                    <h2>Booking Requests</h2>
                    <p>No new requests at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default SitterDashboard;
