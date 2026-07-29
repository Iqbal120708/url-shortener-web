import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setAccessTokenRef, setOnTokenRefreshed } from '../api/client';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        setAccessTokenRef(accessToken);
    }, [accessToken]);

    useEffect(() => {
        setOnTokenRefreshed(setAccessToken);
    }, []);
    
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