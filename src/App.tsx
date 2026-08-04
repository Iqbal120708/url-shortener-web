import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import OTPPage from '@/pages/OTPPage';
import RegisterPage from '@/pages/RegisterPage';
import ShortUrlPage from '@/pages/ShortUrlPage';

import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="top-right" richColors />
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-otp" element={<OTPPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    // router setup
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<ShortUrlPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
