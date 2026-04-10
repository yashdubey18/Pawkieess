import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'pet_owner' | 'pet_sitter' | 'admin';
    location?: {
        city: string;
        address: string;
    };
    sitterProfile?: {
        bio: string;
        price: number;
        experience: string;
        services: string[];
        rating: number;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (userData: any) => {
        const data = await authService.login(userData);
        setUser(data);
    };

    const register = async (userData: any) => {
        const data = await authService.register(userData);
        setUser(data);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
