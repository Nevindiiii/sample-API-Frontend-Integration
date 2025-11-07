import axios from 'axios';
import { User } from '../store/userStore';

const API_BASE = 'http://localhost:5000/api';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    return response.data.users;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw new Error('Unable to fetch users');
  }
}

export async function addUser(user: User): Promise<User> {
  try {
    const response = await axios.post(`${API_BASE}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Add user error:', error);
    throw new Error('Unable to add user');
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const response = await axios.put(`${API_BASE}/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Unable to update user');
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const response = await axios.delete(`${API_BASE}/users/${id}`);
    console.log('Delete response:', response.data);
  } catch (error: any) {
    console.error('Delete user error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Unable to delete user');
  }
}
