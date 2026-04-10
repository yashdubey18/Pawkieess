import React from 'react';
import '../styles/SitterProfile.css';

interface SitterProfileProps {
    sitter: any;
    onBack: () => void;
}

const SitterProfile: React.FC<SitterProfileProps> = ({ sitter, onBack }) => {
    return (
        <div className="sitter-profile-container">
            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
                ← Back to Search
            </button>

            {/* Profile Header */}
            <div className="profile-header glass-card">
                <div className="profile-header-content">
                    <div className="profile-avatar-large">
                        {sitter.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-header-info">
                        <h1>{sitter.name}</h1>
                        <div className="profile-meta">
                            <span className="location-tag">
                                📍 {sitter.location?.city}, {sitter.location?.state || 'Not specified'}
                            </span>
                            <span className="rating-display">
                                ⭐ {sitter.sitterProfile?.rating || 'New'}
                                {sitter.sitterProfile?.reviewsCount > 0 &&
                                    ` (${sitter.sitterProfile.reviewsCount} reviews)`
                                }
                            </span>
                            {sitter.sitterProfile?.isVerified && (
                                <span className="verified-badge">✓ Verified</span>
                            )}
                        </div>
                    </div>
                    <div className="profile-price-display">
                        <div className="price-amount">₹{sitter.sitterProfile?.price || 0}</div>
                        <div className="price-period">per day</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="profile-content-grid">
                {/* About Section */}
                <div className="profile-section glass-card">
                    <h2>About Me</h2>
                    <p className="bio-text">
                        {sitter.sitterProfile?.bio || 'No bio available yet.'}
                    </p>
                </div>

                {/* Experience Section */}
                <div className="profile-section glass-card">
                    <h2>Experience</h2>
                    <div className="experience-info">
                        <div className="experience-badge">
                            {sitter.sitterProfile?.experience || 'New Sitter'}
                        </div>
                        <p className="experience-description">
                            Passionate about pet care and dedicated to providing the best service for your furry friends!
                        </p>
                    </div>
                </div>

                {/* Services Section */}
                <div className="profile-section glass-card">
                    <h2>Services Offered</h2>
                    <div className="services-grid">
                        {sitter.sitterProfile?.services && sitter.sitterProfile.services.length > 0 ? (
                            sitter.sitterProfile.services.map((service: string, index: number) => (
                                <div key={index} className="service-card">
                                    <span className="service-icon">
                                        {service.includes('Walking') && '🚶'}
                                        {service.includes('Sitting') && '🏠'}
                                        {service.includes('Grooming') && '✂️'}
                                        {service.includes('Drop-in') && '👋'}
                                    </span>
                                    <span className="service-name">{service}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No services listed yet</p>
                        )}
                    </div>
                </div>

                {/* Location Details */}
                <div className="profile-section glass-card">
                    <h2>Location</h2>
                    <div className="location-details">
                        <div className="location-item">
                            <strong>City:</strong> {sitter.location?.city || 'Not specified'}
                        </div>
                        <div className="location-item">
                            <strong>State:</strong> {sitter.location?.state || 'Not specified'}
                        </div>
                        <div className="location-item">
                            <strong>ZIP:</strong> {sitter.location?.zipCode || 'Not specified'}
                        </div>
                        {sitter.location?.address && (
                            <div className="location-item">
                                <strong>Address:</strong> {sitter.location.address}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="profile-section glass-card">
                    <h2>Contact Information</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <span>{sitter.email || 'Not available'}</span>
                        </div>
                        {sitter.phone && (
                            <div className="contact-item">
                                <span className="contact-icon">📱</span>
                                <span>{sitter.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section (Placeholder) */}
                <div className="profile-section glass-card full-width">
                    <h2>Reviews</h2>
                    {sitter.sitterProfile?.reviewsCount > 0 ? (
                        <div className="reviews-list">
                            <p className="no-data">Reviews feature coming soon!</p>
                        </div>
                    ) : (
                        <p className="no-data">No reviews yet. Be the first to book and review!</p>
                    )}
                </div>
            </div>

            {/* Booking Section */}
            <div className="booking-section glass-card">
                <div className="booking-content">
                    <div className="booking-info">
                        <h3>Ready to book {sitter.name}?</h3>
                        <p>Start your booking and ensure your pet gets the best care!</p>
                    </div>
                    <button className="btn-primary booking-button">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SitterProfile;
