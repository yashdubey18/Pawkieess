import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        role: 'pet_owner',
        phone: '',
        location: '',
        petName: '',
        petBreed: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                const registrationData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    phone: formData.phone,
                    location: formData.location,
                    ...(formData.role === 'pet_owner' && {
                        petName: formData.petName,
                        petBreed: formData.petBreed
                    })
                };

                console.log('Registering with data:', registrationData);
                await register(registrationData);
            } else {
                console.log('Logging in with email:', formData.email);
                await login({
                    email: formData.email,
                    password: formData.password
                });
            }

            // Close modal on success
            onClose();
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.response?.data?.message || err.message || 'Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            role: 'pet_owner',
            phone: '',
            location: '',
            petName: '',
            petBreed: ''
        });
        setError('');
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Close modal">
                    ✕
                </button>

                <div className="auth-header">
                    <h2>{mode === 'login' ? 'Welcome Back!' : 'Join PAWKIESS'}</h2>
                    <p>
                        {mode === 'login'
                            ? 'Sign in to access your pet care dashboard'
                            : 'Create an account to get started'}
                    </p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">I am a...</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role || 'pet_owner'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        backgroundColor: 'white'
                                    }}
                                    required
                                >
                                    <option value="pet_owner">🐕 Pet Owner</option>
                                    <option value="pet_sitter">👨‍⚕️ Pet Sitter</option>
                                </select>
                            </div>
                        </>
                    )}

                    {mode === 'signup' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit phone number"
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location (City, State)</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Mumbai, Maharashtra"
                                    required
                                />
                            </div>

                            {formData.role === 'pet_owner' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="petName">Pet Name</label>
                                        <input
                                            type="text"
                                            id="petName"
                                            name="petName"
                                            value={formData.petName}
                                            onChange={handleChange}
                                            placeholder="Enter your pet's name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="petBreed">Pet Breed</label>
                                        <input
                                            type="text"
                                            id="petBreed"
                                            name="petBreed"
                                            value={formData.petBreed}
                                            onChange={handleChange}
                                            placeholder="e.g., Golden Retriever, Persian Cat"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            minLength={6}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                minLength={6}
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button type="button" onClick={toggleMode} className="toggle-mode-btn">
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
