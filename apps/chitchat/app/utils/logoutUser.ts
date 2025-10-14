
import axiosInstance from './axiosConfig';
import { useRouter } from 'next/navigation';


type AppRouterInstance = ReturnType<typeof useRouter>;


export async function logoutUser(router: AppRouterInstance) {
  try {
    // Call your API to degrade the token
    const response = await axiosInstance.post('/api/auth/degradeToken');
    console.log('Logout successful:', response.data);

    // Remove token from storage
    localStorage.removeItem('token');

    // Redirect to login page
    router.push('../pages/HomePage');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
