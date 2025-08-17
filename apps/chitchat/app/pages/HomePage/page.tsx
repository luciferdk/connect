'use client';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function HomePage() {
const router = useRouter();
  const [step, setStep] = useState(1); // 1: phone input, 2: OTP input
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Send phone number to backend
      const { data } = await axios.post('http://localhost:8080/api/auth/authentication',{ mobile });
      setMessage('OTP sent successfully!');
      setStep(2);
    } catch (error: any) {
      setMessage('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (otp.length === 0) {
      setMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Send phone number and OTP to backend
      const {data} = await axios.post('http://localhost:8080/api/auth/authentication', {mobile, otp });
      
setMessage('OTP Verified Successfully!');
// You can redirect or update UI state here
 router.push('pages/ChatPage');

    } catch (error:any) {
    console.error(error,'otp varification issue');
      setMessage('Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setMobile('');
    setOtp('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Phone Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1
              ? 'Enter your phone number'
              : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {step === 1 ? (
            // Step 1: Phone Number Input
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\\D/g, ''); // Only digits
                    if (value.length <= 10) {
                      setMobile(value);
                    }
                  }}
                  placeholder="Enter 10-digit phone number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading || mobile.length !== 10}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            // Step 2: OTP Input
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Sent to: +91{mobile}
                </p>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleSubmitOtp}
                  disabled={loading || otp.length === 0}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Submit'}
                </button>
                <button
                  onClick={resetForm}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes('successfully')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
