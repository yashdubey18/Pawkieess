import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/api';
import '../styles/Dashboard.css'; // Reusing dashboard styles for now

interface Message {
    _id: string;
    sender: { _id: string; name: string } | string;
    content: string;
    timestamp: string;
}

interface Chat {
    _id: string;
    participants: { _id: string; name: string }[];
    lastMessage: string;
    updatedAt: string;
}

const ChatInterface: React.FC = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io('http://localhost:5000'); // Adjust URL if needed
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Fetch Chats
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await chatService.getUserChats();
                setChats(data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        fetchChats();
    }, []);

    // Join Chat Room & Fetch Messages
    useEffect(() => {
        if (!selectedChat || !socket) return;

        socket.emit('join_chat', selectedChat._id);

        const fetchMessages = async () => {
            try {
                const data = await chatService.getChatMessages(selectedChat._id);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();

        // Listen for incoming messages
        socket.on('receive_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [selectedChat, socket]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || !socket || !user) return;

        const messageData = {
            chatId: selectedChat._id,
            senderId: user._id,
            content: newMessage
        };

        // Emit to socket
        socket.emit('send_message', messageData);

        // Optimistically update UI (optional, but good for UX)
        // setMessages((prev) => [...prev, { ...messageData, timestamp: new Date().toISOString(), sender: user, _id: 'temp' }]);

        setNewMessage('');
    };

    const getOtherParticipant = (chat: Chat) => {
        return chat.participants.find(p => p._id !== user?._id) || { name: 'Unknown User' };
    };

    return (
        <div className="chat-interface-container" style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '1rem' }}>
            {/* Sidebar List */}
            <div className="chat-sidebar glass-card" style={{ width: '300px', padding: '1rem', overflowY: 'auto' }}>
                <h3>Messages</h3>
                <div className="chat-list">
                    {chats.map(chat => (
                        <div
                            key={chat._id}
                            className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat)}
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                background: selectedChat?._id === chat._id ? 'rgba(255, 107, 107, 0.1)' : 'transparent'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{getOtherParticipant(chat).name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {chat.lastMessage || 'Start a conversation'}
                            </div>
                        </div>
                    ))}
                    {chats.length === 0 && <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>No conversations yet.</p>}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {selectedChat ? (
                    <>
                        <div className="chat-header" style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <h3>{getOtherParticipant(selectedChat).name}</h3>
                        </div>

                        <div className="messages-list" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {messages.map((msg, index) => {
                                const isMe = (typeof msg.sender === 'string' ? msg.sender : msg.sender._id) === user?._id;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '12px',
                                            background: isMe ? 'var(--primary-gradient)' : '#f0f2f5',
                                            color: isMe ? 'white' : 'var(--text-primary)',
                                            borderBottomRightRadius: isMe ? '2px' : '12px',
                                            borderBottomLeftRadius: isMe ? '12px' : '2px'
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
