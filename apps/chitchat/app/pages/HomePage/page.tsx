//app/pages/HomePage/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../utils/axiosConfig';
import type { AxiosError } from 'axios';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp' | 'details'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSendOtp = async () => {
    if (!mobile)
      return setMessage({
        type: 'error',
        text: 'Please enter your mobile number',
      });

    try {
      await axiosInstance.post('/api/auth/authentication', { mobile });
      setStep('otp');
      setMessage({ type: 'success', text: 'OTP sent successfully!' });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send OTP',
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage({ type: 'error', text: 'Please enter OTP' });

    try {
      const res = await axiosInstance.post('/api/auth/authentication', {
        mobile,
        otp,
      });
      if (res.status === 200) {
        setMessage({ type: 'success', text: 'Login successful!' });
        router.push('/');
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        setStep('details');
        setMessage({ type: 'error', text: 'User not found. Please register.' });
      } else if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Invalid or expired OTP' });
      } else {
        console.error(err);
        setMessage({ type: 'error', text: 'OTP verification failed' });
      }
    }
  };

  const handleRegister = async () => {
    if (!name)
      return setMessage({ type: 'error', text: 'Please enter your name' });

    try {
      const res = await axiosInstance.post('/api/auth/register', {
        mobile,
        name,
        bio,
      });
      if (res.status === 201) {
        setMessage({
          type: 'success',
          text: 'Registration successful! You are logged in.',
        });
        router.push('/');
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to register',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 'mobile' && 'Login with Mobile'}
          {step === 'otp' && 'Enter OTP'}
          {step === 'details' && 'Complete Registration'}
        </h1>

        {/* Message Display */}
        {message && (
          <div
            className={`text-center mb-4 font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 'mobile' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleSendOtp}
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleRegister}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
