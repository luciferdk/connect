//app/pages/HomePage/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../utils/axiosConfig';
import type { AxiosError } from 'axios';

export default function HomePage() {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [step, setStep] = useState<'mobile' | 'otp' | 'details'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [myOtp, setMyOtp] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // ⏲️  Timer efect for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isButtonDisabled && step === 'otp') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled, step]);

  // foramte the Time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
    return `${mm}:${ss}`;
  };

  const handleSendOtp = async () => {
    if (!mobile)
      return setMessage({
        type: 'error',
        text: 'Please enter your mobile number',
      });

    try {
      const takeMyOtp = await axiosInstance.post('/api/auth/authentication', {
        mobile,
      });

      setTimeout(() => {
        setMyOtp(
          `The developer is very poor and does not have Rs 5900 for "DLT registration".  Your OTP Is:  ${takeMyOtp.data.otp}`,
        );
      }, 5000);

      setStep('otp');
      setMessage({ type: 'success', text: 'OTP sent successfully!' });

      //Start 2-minute timer for  resend
      setTimeLeft(60);
      setIsButtonDisabled(true);
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

  const handleResendOtp = async () => {
    if (isButtonDisabled) return; //prevent Spam Clicks

    try {
      const takeOtp = await axiosInstance.post('/api/auth/authentication', {
        mobile,
      });
      setMyOtp(
        `The developer is very poor and does not have Rs 5900 for "DLT registration".  Your OTP Is:  ${takeOtp.data.otp}`,
      );
      setMessage({ type: 'success', text: 'OTP sent successfully!' });

      // Restart timer after resend
      setTimeLeft(60);
      setIsButtonDisabled(true);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send OTP',
      });
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
          {step === 'mobile'
            ? 'Login with Mobile'
            : step === 'otp'
              ? 'Enter OTP'
              : step === 'details'
                ? 'Complete Registration'
                : 'Welcome'}
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
              className="text-gray-600 border-b bg-transparent focus:outline-none focus:border-indigo-600 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSendOtp}
              className="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 transition active:text-red-200"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <h4 className="bg-red-400">{myOtp}</h4>
            <input
              type="text"
              pattern="\d{10}"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={!otp}
              className={`py-2 rounded-lg transition ${otp ? 'bg-indigo-500 hover:bg-red-200 text-white' : 'bg-gray-400 cursor-not-allowed text-white'}`}
            >
              Verify OTP
            </button>
            <button
              onClick={handleResendOtp}
              disabled={isButtonDisabled}
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              {isButtonDisabled
                ? `Re-Send in ${formatTime(timeLeft)}`
                : 'rensend OTP'}
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
