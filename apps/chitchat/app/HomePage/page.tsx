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
    className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #F5F7FA 0%, #1f2937 100%)',
    }}
  >
    {/* Decorative circles */}
    <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#1976D2' }}></div>
    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00C853' }}></div>
    
    <div className="bg-[#f0f8ff] shadow-2xl rounded-3xl w-full max-w-md p-10 border-2 relative z-10" style={{ borderColor: '#F5F7FA' }}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <div
          className="w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center shadow-xl "
         
        >
          <Image
            src="/logo.svg"
            alt="Connect company logo"
            height={95}
            width={95}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>
          {step === 'mobile'
            ? "Let's Connect"
            : step === 'otp'
              ? 'Verify OTP'
              : 'Complete Profile'}
        </h1>
        <p className="text-base font-medium" style={{ color: '#1f2937', opacity: 0.6 }}>
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
          className={`mb-6 p-4 rounded-xl text-sm font-semibold text-center shadow-sm ${
            message.type === 'success'
              ? 'border-2'
              : 'border-2'
          }`}
          style={{
            backgroundColor: message.type === 'success' ? '#F5F7FA' : '#fee',
            borderColor: message.type === 'success' ? '#00C853' : '#f44336',
            color: message.type === 'success' ? '#00C853' : '#f44336',
          }}
        >
          {message.text}
        </div>
      )}

      {step === 'mobile' && (
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border-2 bg-white focus:outline-none rounded-xl px-5 py-4 transition-all font-medium text-base shadow-sm"
              style={{ 
                borderColor: mobile ? '#1976D2' : '#F5F7FA',
                color: '#1f2937'
              }}
            />
          </div>
          <button
            onClick={handleSendOtp}
            className="w-full text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-base"
            style={{ backgroundColor: '#1976D2' }}
          >
            Send OTP
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="flex flex-col gap-6">
          {myOtp && (
            <div
              className="p-5 rounded-xl text-sm font-mono border-2 shadow-sm"
              style={{ 
                backgroundColor: '#F5F7FA', 
                borderColor: '#1976D2',
                color: '#1f2937'
              }}
            >
              {myOtp}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              Enter OTP
            </label>
            <input
              type="text"
              pattern="\d{10}"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-2 bg-white focus:outline-none rounded-xl px-5 py-4 transition-all text-center text-2xl tracking-widest font-bold shadow-sm"
              maxLength={6}
              style={{ 
                borderColor: otp ? '#1976D2' : '#F5F7FA',
                color: '#1f2937'
              }}
            />
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={!otp}
            className={`w-full py-4 rounded-xl font-bold transition-all transform shadow-lg text-base ${
              otp
                ? 'hover:scale-[1.02] active:scale-[0.98] text-white hover:shadow-xl'
                : 'cursor-not-allowed opacity-50 text-white'
            }`}
            style={{ backgroundColor: otp ? '#1976D2' : '#c2c0b6' }}
          >
            Verify OTP
          </button>
          <button
            onClick={handleResendOtp}
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-xl font-bold transition-all transform shadow-lg text-base ${
              !isButtonDisabled
                ? 'hover:scale-[1.02] active:scale-[0.98] text-white hover:shadow-xl'
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
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 bg-white focus:outline-none rounded-xl px-5 py-4 transition-all font-medium text-base shadow-sm"
              style={{ 
                borderColor: name ? '#1976D2' : '#F5F7FA',
                color: '#1f2937'
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              Bio (Optional)
            </label>
            <textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border-2 bg-white focus:outline-none rounded-xl px-5 py-4 transition-all resize-none font-medium shadow-sm"
              rows={3}
              style={{ 
                borderColor: bio ? '#1976D2' : '#F5F7FA',
                color: '#1f2937'
              }}
            />
          </div>
          <button
            onClick={handleRegister}
            className="w-full text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-base"
            style={{ backgroundColor: '#1976D2' }}
          >
            Register & Login
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs font-medium" style={{ color: '#1f2937', opacity: 0.6 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  </div>
);
  }
