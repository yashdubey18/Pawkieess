import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import '../styles/Dashboard.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your AI Pet Assistant. Ask me anything about pet care, breeds, or health tips! 🐾' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const newMessages = [...messages, userMessage].map(msg => ({
                role: msg.role, 
                content: msg.content
            }));
            
            // Filter out the initial welcome message if we don't want to send it to AI
            // but for simplicity we'll just send everything
            const response = await api.post('/ai/ask', {
                messages: newMessages
            });
            const aiMessage = { role: 'assistant' as const, content: response.data.answer };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content">
            <header className="dashboard-header">
                <h1>AI Pet Assistant</h1>
                <p>Get instant answers to your pet care questions</p>
            </header>

            <div className="chat-container glass-card">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <div className="message-bubble">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message assistant">
                            <div className="message-bubble typing">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about dog breeds, diet, or training..."
                        disabled={loading}
                    />
                    <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
