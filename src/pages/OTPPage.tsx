import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { otp, resend } from '@/api/auth';
import type { OTPFormState, OTPRequest } from '@/types';

export default function OTPPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState<OTPFormState>({
        otpCode: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const payload: OTPRequest = {
                otp_code: formData.otpCode,
                token: searchParams.get('token'),
            };
            await otp(payload);
            navigate('/login');
        } catch (err: unknown) {
            const data = err.response?.data;
            setError(
                data?.detail ?? 'Verifikasi gagal, silakan coba lagi nanti.'
            );
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resend({ token: searchParams.get('token') });
        } catch (err: unknown) {
            const data = err.response?.data;
            setError(
                data?.detail ?? 'Gagal mengirim ulang kode, silakan coba lagi.'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Verify your account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter the 6-digit code we sent to your email
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="otpCode"
                        value={formData.otpCode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className="w-full border border-gray-300 rounded-md px-3 py-3 text-center text-2xl tracking-[0.5em] font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                        placeholder="123456"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2.5 text-white bg-black rounded-md hover:bg-gray-800 transition font-medium"
                    >
                        Verify
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive the code?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
}
