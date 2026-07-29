import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage';
import OTPPage from '@/pages/OTPPage';
import LoginPage from '@/pages/LoginPage';
import ShortUrlPage from '@/pages/ShortUrlPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/short-url" element={<ShortUrlPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;