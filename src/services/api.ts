import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('Network error - backend server may be down');
            error.message = 'Cannot connect to server. Please ensure the backend is running on port 5000.';
        } else if (error.response) {
            console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

// Auth API services
export const authService = {
    // Register user
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Login user
    login: async (userData: any) => {
        const response = await api.post('/auth/login', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
};

// Chat API services
export const chatService = {
    getUserChats: async () => {
        const response = await api.get('/chats');
        return response.data;
    },
    getChatMessages: async (chatId: string) => {
        const response = await api.get(`/chats/${chatId}/messages`);
        return response.data;
    },
    createChat: async (participantId: string) => {
        const response = await api.post('/chats', { participantId });
        return response.data;
    },
    sendMessage: async (chatId: string, content: string) => {
        const response = await api.post('/chats/message', { chatId, content });
        return response.data;
    }
};

export const aiService = {
    askAssistant: async (data: { prompt?: string, messages?: { role: string, content: string }[] }) => {
        const response = await api.post('/ai/ask', data);
        return response.data;
    }
};

export const receptionistService = {
    chat: async (message: string, conversationState: any = {}) => {
        const response = await api.post('/receptionist/chat', { message, conversationState });
        return response.data;
    }
};

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    }
};

export default api;
