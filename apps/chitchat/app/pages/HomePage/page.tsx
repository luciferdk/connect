'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../utils/userAuthStore';
import axiosInstance from '../../utils/axiosConfig';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp' | 'details'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const handleSendOtp = async () => {
    if (!mobile) return alert('Please enter your mobile number');

    try {
      await axiosInstance.post('/api/auth/authentication', { mobile });
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter OTP');

    try {
      const res = await axiosInstance.post('/api/auth/authentication', {
        mobile,
        otp,
      });
      if (res.status === 200) {
        alert('Login successful!');
        router.push('/');
      }
    } catch (err: any) {
      if (err.response?.status === 404) setStep('details');
      else if (err.response?.status === 401) alert('Invalid or expired OTP');
      else console.error(err);
    }
  };

  const handleRegister = async () => {
    if (!name) return alert('Please enter your name');

    try {
      const res = await axiosInstance.post('/api/auth/register', {
        mobile,
        name,
        bio,
      });
      if (res.status === 201) {
        alert('Registration successful! You are logged in.');
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to register');
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
