import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import '../styles/ReceptionistChat.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationState {
    flow?: string | null;
    bookingStep?: string;
    bookingData?: any;
}

// Floating pet emojis for the background
const FLOATING_PETS = ['🐕', '🐈', '🐾', '🦴', '🐶', '🐱', '🐰', '🐦', '🐾', '🐕‍🦺'];

const ReceptionistChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hello! 🐾 Welcome to the PAWKIESS reception desk!\n\nI'm your virtual receptionist. Here's how I can help:\n\n🗓️ **Book an Appointment** — Schedule pet care services\n📊 **Check My Bookings** — View your booking count & status\n🔍 **Find a Sitter** — Browse available pet sitters\n❓ **Ask Questions** — Learn about our services\n\nWhat would you like to do?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([
        'Book Appointment', 'My Bookings', 'Find a Sitter', 'Help'
    ]);
    const [conversationState, setConversationState] = useState<ConversationState>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const togglePanel = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setIsOpen(true);
        }
    };

    const formatMessage = (text: string) => {
        // Convert **bold** to <strong>
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setSuggestions([]);

        try {
            const response = await api.post('/receptionist/chat', {
                message: text,
                conversationState
            });

            const data = response.data;

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply
            };
            setMessages(prev => [...prev, assistantMessage]);

            if (data.conversationState !== undefined) {
                setConversationState(data.conversationState);
            }

            if (data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error: any) {
            console.error('Receptionist error:', error);
            let errorMsg = error.response?.data?.reply || 'Sorry, something went wrong. Please try again.';
            
            if (error.response?.status === 401) {
                errorMsg = "Your session has expired because the server reset. Please click 'Log Out' and register/sign in again to continue! 🐾";
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ ${errorMsg}`
            }]);
            setSuggestions(['Help', 'Book Appointment']);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`receptionist-fab ${isOpen ? 'open' : ''}`}
                onClick={togglePanel}
                aria-label="Open receptionist chat"
                id="receptionist-fab"
            >
                {isOpen ? '✕' : '🐾'}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className={`receptionist-panel ${isClosing ? 'closing' : ''}`} id="receptionist-panel">
                    {/* Header */}
                    <div className="receptionist-header">
                        <div className="receptionist-header-avatar">🐾</div>
                        <div className="receptionist-header-info">
                            <h4>Pawkiess Receptionist</h4>
                            <p><span className="online-dot"></span>Online — Ready to help!</p>
                        </div>
                    </div>

                    {/* Messages with floating pet background */}
                    <div className="receptionist-messages-wrapper">
                        {/* Floating Pet Emojis Background */}
                        <div className="pet-bg-container">
                            {FLOATING_PETS.map((pet, i) => (
                                <span key={i} className="floating-pet">{pet}</span>
                            ))}
                            {/* Paw trail at bottom */}
                            <div className="paw-trail">
                                <span>🐾</span>
                                <span>🐾</span>
                                <span>🐾</span>
                                <span>🐾</span>
                                <span>🐾</span>
                            </div>
                        </div>

                        {/* Actual Messages */}
                        <div className="receptionist-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`rcpt-msg ${msg.role}`}>
                                    <div className="rcpt-msg-bubble">
                                        {formatMessage(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="rcpt-msg assistant">
                                    <div className="rcpt-msg-bubble rcpt-typing">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick Action Chips */}
                    {suggestions.length > 0 && !loading && (
                        <div className="receptionist-suggestions">
                            {suggestions.map((sug, i) => (
                                <button
                                    key={i}
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(sug)}
                                >
                                    <span>{sug}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form className="receptionist-input-area" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading}
                            id="receptionist-input"
                        />
                        <button
                            type="submit"
                            className="receptionist-send-btn"
                            disabled={loading || !input.trim()}
                            id="receptionist-send-btn"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ReceptionistChat;
