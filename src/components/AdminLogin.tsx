import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate admin credentials
        if (email !== 'dyash1817@gmail.com' || password !== 'hello@123') {
            setError('Invalid admin credentials');
            return;
        }

        setLoading(true);
        try {
            await login({ email, password });
            // User will be redirected by App.tsx based on role
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" style={{ position: 'fixed', inset: 0 }}>
            <div className="auth-modal">
                <div className="auth-modal-header">
                    <h2>Admin Login</h2>
                    <p>Access the administrative panel</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: '0.8rem',
                            background: 'rgba(255, 107, 107, 0.1)',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                            borderRadius: '8px',
                            color: 'var(--primary-color)',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="dyash1817@gmail.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary full-width"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <a
                            href="/"
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            ← Back to Home
                        </a>
                    </div>
                </form>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(255, 107, 107, 0.05)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong>Admin Access Only</strong><br />
                    This page is restricted to authorized administrators.
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
