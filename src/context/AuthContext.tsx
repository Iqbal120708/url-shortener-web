import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    setAccessTokenRef,
    setOnAuthExpired,
    setOnTokenRefreshed,
} from '../api/client';

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

export { AuthContext };
