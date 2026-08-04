import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@/types';
import { parseApiError } from '@/utils/errors';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(formData);
            setAccessToken(res.data.access);
            navigate('/dashboard');
        } catch (err: unknown) {
            const { fieldErrors, generalError } = parseApiError(
                err,
                'Login gagal, silakan coba lagi nanti.'
            );
            if (fieldErrors) setFieldErrors(fieldErrors);
            if (generalError) setError(generalError);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Log In
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="my-4">
                        <label className="text-gray-600 block mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {fieldErrors.password1 && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account yet?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Register
                        </button>
                    </p>

                    <button
                        type="submit"
                        className="w-full px-4 py-2.5 text-white bg-black rounded-md hover:bg-gray-800 transition font-medium"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}
