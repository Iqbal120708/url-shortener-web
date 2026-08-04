import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout'
import RegisterPage from '@/pages/RegisterPage';
import OTPPage from '@/pages/OTPPage';
import LoginPage from '@/pages/LoginPage';
import ShortUrlPage from '@/pages/ShortUrlPage';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="/login" element={<LoginPage />} />// router setup
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<ShortUrlPage />} />
            </Route>
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;