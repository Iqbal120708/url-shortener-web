import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setAccessTokenRef, setOnTokenRefreshed, setOnAuthExpired } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        setAccessTokenRef(accessToken);
    }, [accessToken]);

    useEffect(() => {
        setOnTokenRefreshed(setAccessToken);
    }, []);
    
    useEffect(() => {
        setOnAuthExpired(() => navigate('/login'));
    }, [navigate]);
    
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}