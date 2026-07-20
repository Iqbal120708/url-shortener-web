import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
//import OTPPage from '@/pages/OTPPage';
//import DashboardPage from '@/pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;