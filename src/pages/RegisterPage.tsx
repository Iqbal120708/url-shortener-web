import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/api/auth';
import type { RegisterRequest } from '@/types';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              password1: formData.password,
              password2: formData.confirmPassword,
            };
            await register(payload);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err: any) {
            const data = err.response?.data;
            if (data && typeof data === 'object' && !data.detail) {
                const flat: Record<string, string> = {};
                Object.entries(data).forEach(([key, msgs]) => {
                    flat[key] = Array.isArray(msgs) ? msgs[0] : String(msgs);
                });
                setFieldErrors(flat);
            } else {
              setError(data?.detail ?? 'Registrasi gagal, silakan coba lagi nanti.');
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-3xl font-bold m-4">Register</h1>
            <form onSubmit={handleSubmit} className="p-4">
                <div>
                    <h2 className="text-white font-bold text-xl bg-black px-4 py-2 mb-4 rounded">Your Name</h2>
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">First Name</label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.first_name && <p className="text-red-500 text-sm mt-1">{fieldErrors.first_name}</p>}
                    </div>
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">Last Name</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.last_name && <p className="text-red-500 text-sm mt-1">{fieldErrors.last_name}</p>}    
                    </div>
                </div>

                <div className="my-12">
                    <h2 className="text-white font-bold text-xl bg-black px-4 py-2 mb-4 rounded">Your Email</h2>
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-white font-bold text-xl bg-black px-4 py-2 mb-4 rounded">Your Password</h2>
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.password1 && <p className="text-red-500 text-sm mt-1">{fieldErrors.password1}</p>}
                    </div>
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.password2 && <p className="text-red-500 text-sm mt-1">{fieldErrors.password2}</p>}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm my-3">{error}</p>}

                <button type="submit" className="px-4 py-2 text-white bg-black rounded-md w-full hover:bg-gray-800 transition">
                    Register
                </button>
            </form>
        </div>
    );
}