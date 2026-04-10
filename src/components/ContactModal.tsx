import React from 'react';
import '../styles/ContactModal.css';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const contactInfo = {
        name: 'YASH DUBEY',
        phone: '8369176325',
        whatsapp: '9619639866',
        email: 'dyash1817@gmail.com'
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank');
    };

    const handleEmail = () => {
        window.location.href = `mailto:${contactInfo.email}`;
    };

    const handleCall = () => {
        window.location.href = `tel:${contactInfo.phone}`;
    };

    return (
        <div className="contact-modal-overlay" onClick={onClose}>
            <div className="contact-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Close modal">
                    ✕
                </button>

                <div className="contact-header">
                    <div className="contact-icon">📞</div>
                    <h2>Contact Information</h2>
                    <p>Get in touch with us</p>
                </div>

                <div className="contact-details">
                    <div className="contact-item">
                        <div className="contact-label">
                            <span className="icon">👤</span>
                            <span>Name</span>
                        </div>
                        <div className="contact-value">{contactInfo.name}</div>
                    </div>

                    <div className="contact-item clickable" onClick={handleCall}>
                        <div className="contact-label">
                            <span className="icon">📱</span>
                            <span>Phone</span>
                        </div>
                        <div className="contact-value">{contactInfo.phone}</div>
                    </div>

                    <div className="contact-item clickable" onClick={handleWhatsApp}>
                        <div className="contact-label">
                            <span className="icon">💬</span>
                            <span>WhatsApp</span>
                        </div>
                        <div className="contact-value">{contactInfo.whatsapp}</div>
                    </div>

                    <div className="contact-item clickable" onClick={handleEmail}>
                        <div className="contact-label">
                            <span className="icon">📧</span>
                            <span>Email</span>
                        </div>
                        <div className="contact-value">{contactInfo.email}</div>
                    </div>
                </div>

                <div className="contact-actions">
                    <button className="btn-primary" onClick={handleWhatsApp}>
                        Message on WhatsApp
                    </button>
                    <button className="btn-secondary" onClick={handleEmail}>
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
