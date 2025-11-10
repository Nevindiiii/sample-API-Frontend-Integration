import axios from 'axios';
import toast from 'react-hot-toast';
import { User } from '../store/userStore';
import { handleBackendToast } from '../utils/helpers';

const API_BASE = 'http://localhost:5000/api';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    handleBackendToast(response.data.toast);
    return response.data.users;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw new Error('Unable to fetch users');
  }
}

export async function addUser(user: User): Promise<User> {
  try {
    const response = await axios.post(`${API_BASE}/users`, user);
    handleBackendToast(response.data.toast);
    return response.data.user || response.data;
  } catch (error) {
    console.error('Add user error:', error);
    throw new Error('Unable to add user');
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const response = await axios.put(`${API_BASE}/users/${id}`, user);
    handleBackendToast(response.data.toast);
    return response.data.user || response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Unable to update user');
  }
}

export async function deleteUser(id: string, userName: string, onConfirm?: () => Promise<void>): Promise<void> {
  let countdown = 5;
  let confirmed = false;
  let interval: NodeJS.Timeout;
  
  const handleClick = async () => {
    if (!confirmed && onConfirm) {
      confirmed = true;
      clearInterval(interval);
      toast.dismiss(confirmToastId);
      await onConfirm();
    }
  };
  
  const confirmToastId = toast(
    `⚠️ Are you sure you want to Delete ? "${userName}"? |  OK (${countdown}s)`,
    {
      duration: 5000,
      style: {
        background: 'white',
        color: 'black',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: '1px solid black',
        padding: '16px',
      },
    }
  );

  // Add click listener
  const attachListener = () => {
    const toastElements = document.querySelectorAll('[role="status"]');
    toastElements.forEach((el) => {
      if (el.textContent?.includes(userName)) {
        el.addEventListener('click', handleClick, { once: true });
      }
    });
  };
  
  setTimeout(attachListener, 50);

  interval = setInterval(() => {
    countdown--;
    if (countdown > 0 && !confirmed) {
      toast(
        ` Delete "${userName}"? |  OK (${countdown}s)`,
        { 
          id: confirmToastId,
          duration: 5000,
          style: {
            background: 'white',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '1px solid black',
            padding: '16px',
          },
        }
      );
      setTimeout(attachListener, 50);
    } else {
      clearInterval(interval);
      if (!confirmed) {
        toast.dismiss(confirmToastId);
      }
    }
  }, 1000);
}
