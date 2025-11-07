import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';
import { useRouter } from 'next/navigation';

export default function DeleteUser() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  }>({ text: '', type: 'success' });
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    const API_ENDPOINT = '/api/delete/userdeleted';

    try {
      const deleteResponse = await axiosInstance.post(API_ENDPOINT);
      if (deleteResponse.status === 204) {
        setMessage({ text: 'User deleted Successfully', type: 'success' });
        setTimeout(() => router.push('/HomePage'), 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 503) {
          setMessage({ text: 'Deletion of user failed', type: 'error' });
        } else if (error.response.status === 500) {
          setMessage({ text: 'Internal server error', type: 'error' });
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={deleteUser}
        disabled={isDeleting}
        className={isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {isDeleting ? 'Deleting...' : 'Delete Your Account'}
      </button>

      {message.text && (
        <p
          className={`mt-4 text-center text-sm font-semibold transition-all ${message.type === 'success' ? 'text-green-600 animate-pulse' : 'text-red-600'}`}
        >
          {message.text}{' '}
        </p>
      )}
    </div>
  );
}
