//app/pages/HomePage/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <div
      className="h-screen-dvh flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #F5F7FA 0%, #c2c0b6 100%)',
      }}
    >
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1976D2' }}
          >
            <Image
              src="/logo.svg"
              alt="Connect company logo"
              height={65}
              width={65}
              className="rounded-full "
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 'mobile'
              ? 'Welcome Back'
              : step === 'otp'
                ? 'Verify OTP'
                : 'Complete Profile'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'mobile'
              ? 'Enter your mobile number to continue'
              : step === 'otp'
                ? 'Enter the OTP sent to your mobile'
                : 'Just a few more details'}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium text-center ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
            style={{
              color: message.type === 'success' ? '#00C853' : '#f44336',
            }}
          >
            {message.text}
          </div>
        )}

        {step === 'mobile' && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full text-gray-800 border-2 border-gray-200 focus:border-blue-500 bg-white focus:outline-none rounded-lg px-4 py-3 transition-all"
                style={{ borderColor: mobile ? '#1976D2' : undefined }}
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#1976D2' }}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-5">
            {myOtp && (
              <div
                className="p-4 rounded-lg text-sm font-mono text-gray-700 border-2"
                style={{ backgroundColor: '#F5F7FA', borderColor: '#c2c0b6' }}
              >
                {myOtp}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                pattern="\d{10}"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-gray-800 border-2 border-gray-200 focus:border-blue-500 bg-white focus:outline-none rounded-lg px-4 py-3 transition-all text-center text-xl tracking-widest font-semibold"
                maxLength={6}
                style={{ borderColor: otp ? '#1976D2' : undefined }}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={!otp}
              className={`w-full py-3 rounded-lg font-semibold transition-all transform shadow-md ${
                otp
                  ? 'hover:scale-[1.02] active:scale-[0.98] text-white hover:shadow-lg'
                  : 'cursor-not-allowed opacity-50 text-white'
              }`}
              style={{ backgroundColor: otp ? '#1976D2' : '#c2c0b6' }}
            >
              Verify OTP
            </button>
            <button
              onClick={handleResendOtp}
              disabled={isButtonDisabled}
              className={`w-full py-3 rounded-lg font-semibold transition-all transform shadow-md ${
                !isButtonDisabled
                  ? 'hover:scale-[1.02] active:scale-[0.98] text-white hover:shadow-lg'
                  : 'cursor-not-allowed opacity-70 text-white'
              }`}
              style={{ backgroundColor: '#00C853' }}
            >
              {isButtonDisabled
                ? `Resend in ${formatTime(timeLeft)}`
                : 'Resend OTP'}
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-gray-800 border-2 border-gray-200 focus:border-blue-500 bg-white focus:outline-none rounded-lg px-4 py-3 transition-all"
                style={{ borderColor: name ? '#1976D2' : undefined }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-gray-800 border-2 border-gray-200 focus:border-blue-500 bg-white focus:outline-none rounded-lg px-4 py-3 transition-all resize-none"
                rows={3}
                style={{ borderColor: bio ? '#1976D2' : undefined }}
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#1976D2' }}
            >
              Register & Login
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-800">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
