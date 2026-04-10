import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SitterProfile from './SitterProfile';
import '../styles/Dashboard.css';

const OwnerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pets' | 'search'>('search');
    const [pets, setPets] = useState<any[]>([]);
    const [sitters, setSitters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSitter, setSelectedSitter] = useState<any>(null);

    useEffect(() => {
        fetchPets();
        fetchSitters();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await api.get('/pets');
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    const fetchSitters = async () => {
        try {
            const response = await api.get('/sitters');
            setSitters(response.data);
        } catch (error) {
            console.error('Error fetching sitters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get(`/sitters?city=${searchTerm}`);
            setSitters(response.data);
        } catch (error) {
            console.error('Error searching sitters:', error);
        } finally {
            setLoading(false);
        }
    };

    // If a sitter is selected, show their profile
    if (selectedSitter) {
        return (
            <SitterProfile
                sitter={selectedSitter}
                onBack={() => setSelectedSitter(null)}
            />
        );
    }

    return (
        <div className="dashboard-content">
            <header className="dashboard-header">
                <h1>Pet Owner Dashboard</h1>
                <p>Manage your pets and find the perfect sitter</p>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>My Pets</h3>
                    <div className="stat-value">{pets.length}</div>
                </div>
                <div className="stat-card">
                    <h3>Active Bookings</h3>
                    <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                    <h3>Total Spent</h3>
                    <div className="stat-value">₹0</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                >
                    Find a Sitter
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pets')}
                >
                    My Pets
                </button>
            </div>

            {/* Search Content */}
            {activeTab === 'search' && (
                <div className="search-section fade-in">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by city (e.g., New York)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">Search</button>
                    </form>

                    <div className="sitters-grid">
                        {loading ? (
                            <p>Loading sitters...</p>
                        ) : sitters.length === 0 ? (
                            <p>No sitters found in this area.</p>
                        ) : (
                            sitters.map((sitter) => (
                                <div
                                    key={sitter._id}
                                    className="sitter-card glass-card"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelectedSitter(sitter)}
                                >
                                    <div className="sitter-header">
                                        <div className="sitter-avatar">
                                            {sitter.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3>{sitter.name}</h3>
                                            <p className="sitter-location">📍 {sitter.location?.city || 'Location not set'}</p>
                                        </div>
                                    </div>
                                    <div className="sitter-body">
                                        <p className="sitter-bio">{sitter.sitterProfile?.bio || 'No bio available'}</p>
                                        <div className="sitter-details">
                                            <span className="price-tag">₹{sitter.sitterProfile?.price || 0}/day</span>
                                            <span className="rating-tag">⭐ {sitter.sitterProfile?.rating || 'New'}</span>
                                        </div>
                                        <div className="sitter-services">
                                            {sitter.sitterProfile?.services?.map((service: string, index: number) => (
                                                <span key={index} className="service-badge">{service}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="btn-secondary full-width"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSitter(sitter);
                                        }}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Pets Content */}
            {activeTab === 'pets' && (
                <div className="pets-section fade-in">
                    <div className="pets-grid">
                        {pets.map((pet) => (
                            <div key={pet._id} className="pet-card glass-card">
                                <div className="pet-image-placeholder">
                                    {pet.species === 'Dog' ? '🐕' : '🐈'}
                                </div>
                                <h3>{pet.name}</h3>
                                <p>{pet.breed} • {pet.age} years old</p>
                                <button className="btn-secondary small">Edit Profile</button>
                            </div>
                        ))}

                        <div className="add-pet-card glass-card dashed">
                            <span className="plus-icon">+</span>
                            <h3>Add New Pet</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
