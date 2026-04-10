import React, { useState } from 'react';
import FeatureCard from './FeatureCard';
import AuthModal from './AuthModal';
import ContactModal from './ContactModal';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

interface HomePageProps {
    onAdminLogin?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAdminLogin }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const openAuthModal = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const features = [
        {
            icon: '🐾',
            title: 'Smart Matching',
            description: 'AI-powered algorithm matches your pet with the perfect sitter based on needs, preferences, and location.'
        },
        {
            icon: '📱',
            title: 'Real-Time Updates',
            description: 'Get live updates, photos, and videos of your pet while you\'re away. Stay connected 24/7.'
        },
        {
            icon: '⭐',
            title: 'Verified Sitters',
            description: 'All pet sitters are thoroughly vetted, verified, and reviewed by our community.'
        },
        {
            icon: '💬',
            title: 'Instant Chat',
            description: 'Communicate directly with sitters through our secure, in-app messaging system.'
        },
        {
            icon: '🔒',
            title: 'Secure Payments',
            description: 'Safe and encrypted payment processing with booking protection and refund policies.'
        },
        {
            icon: '📊',
            title: 'Pet Profiles',
            description: 'Create detailed profiles for your pets with medical records, preferences, and special needs.'
        }
    ];

    return (
        <div className="home-page">
            {/* Animated Background */}
            <div className="animated-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    {isAuthenticated && (
                        <div className="user-welcome fade-in">
                            <span className="welcome-badge">👋 Welcome back, {user?.name}!</span>
                        </div>
                    )}

                    <div className="hero-layout">
                        {/* Pet Images - Left Side */}
                        <div className="hero-pets-left">
                            <img
                                src="/happy_puppy.png"
                                alt="Happy puppy"
                                className="pet-image pet-image-1 fade-in"
                            />
                            <img
                                src="/elegant_cat.png"
                                alt="Elegant cat"
                                className="pet-image pet-image-2 fade-in"
                            />
                        </div>

                        {/* Main Content - Center */}
                        <div className="hero-content">
                            <div className="hero-brand-logo fade-in">
                                <span className="paw-icon">🐾</span>
                                <span className="brand-name">PAWKIESS</span>
                            </div>
                            <div className="hero-badge fade-in">
                                <span>Smart Pet Care Platform</span>
                            </div>
                            <h1 className="hero-title fade-in-up">
                                Your Pet Deserves the Best Care
                            </h1>
                            <p className="hero-subtitle fade-in-up">
                                Connect with trusted, verified pet sitters in your area.
                                Give your furry friends the love and care they deserve while you're away.
                            </p>
                            <div className="hero-buttons fade-in-up">
                                {!isAuthenticated ? (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                            width: '100%',
                                            maxWidth: '400px'
                                        }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    setAuthMode('signup');
                                                    setIsAuthModalOpen(true);
                                                }}
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span>🐕</span> Pet Owner Login
                                            </button>

                                            <button
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setAuthMode('signup');
                                                    setIsAuthModalOpen(true);
                                                }}
                                                style={{
                                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span>👨‍⚕️</span> Pet Sitter Login
                                            </button>

                                            <button
                                                className="btn-contact"
                                                onClick={() => setIsContactModalOpen(true)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    border: '2px solid rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                <span className="contact-icon">📞</span>
                                                <span className="contact-text">Contact Us</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-primary">
                                            Go to Dashboard
                                        </button>
                                        <button
                                            className="btn-secondary"
                                            onClick={logout}
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Pet Images - Right Side */}
                        <div className="hero-pets-right">
                            <img
                                src="/playful_puppy.png"
                                alt="Playful puppy"
                                className="pet-image pet-image-3 fade-in"
                            />
                            <img
                                src="/cute_kitten.png"
                                alt="Cute kitten"
                                className="pet-image pet-image-4 fade-in"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose PAWKIESS?</h2>
                        <p className="section-subtitle">
                            Everything you need to ensure your pet receives exceptional care
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Getting started is easy. Follow these simple steps
                        </p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card glass-card">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Create Your Profile</h3>
                            <p className="step-description">
                                Sign up and add your pet's details, preferences, and any special care requirements.
                            </p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card glass-card">
                            <div className="step-number">2</div>
                            <h3 className="step-title">Find Perfect Match</h3>
                            <p className="step-description">
                                Browse verified sitters near you or let our AI find the perfect match for your pet.
                            </p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card glass-card">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Book & Relax</h3>
                            <p className="step-description">
                                Secure your booking, make payment, and enjoy peace of mind with real-time updates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content glass-card">
                        <h2 className="cta-title">Ready to Get Started?</h2>
                        <p className="cta-subtitle">
                            Join thousands of pet owners who trust PAWKIESS for their pet care needs
                        </p>
                        {!isAuthenticated && (
                            <button
                                className="btn-primary cta-button"
                                onClick={() => openAuthModal('signup')}
                            >
                                Create Free Account
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>🐾 PAWKIESS</h3>
                            <p>Smart Pet Care Platform</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Platform</h4>
                                <a href="#">For Pet Owners</a>
                                <a href="#">For Pet Sitters</a>
                                <a href="#">How It Works</a>
                                <a href="#">Pricing</a>
                            </div>

                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Careers</a>
                                <a href="#">Blog</a>
                                <a href="#">Press</a>
                            </div>

                            <div className="footer-column">
                                <h4>Support</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Safety</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Privacy Policy</a>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p>&copy; 2025 PAWKIESS. All rights reserved.</p>
                            <div className="social-links">
                                <a href="#" aria-label="Facebook">📘</a>
                                <a href="#" aria-label="Twitter">🐦</a>
                                <a href="#" aria-label="Instagram">📷</a>
                                <a href="#" aria-label="LinkedIn">💼</a>
                            </div>
                            {!isAuthenticated && onAdminLogin && (
                                <button
                                    onClick={onAdminLogin}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        border: '1px solid rgba(102, 126, 234, 0.3)',
                                        borderRadius: '8px',
                                        color: '#667eea',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                    }}
                                >
                                    🔐 Admin Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            {/* Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
};

export default HomePage;
