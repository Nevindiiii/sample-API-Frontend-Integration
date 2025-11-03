import { useUserStore } from '../store/userStore';
import { Button } from './ui/button';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export default function NotificationDemo() {
  const { addUser, updateUser, deleteUser, users } = useUserStore();

  const handleAddUser = () => {
    const newUser = {
      name: `Test User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
      gender: 'Male',
      department: 'IT',
      phone: '+1234567890',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
    };
    addUser(newUser);
  };

  const handleUpdateUser = () => {
    if (users.length > 0) {
      const updatedUser = {
        ...users[0],
        name: `Updated ${users[0].name}`,
      };
      updateUser(0, updatedUser);
    }
  };

  const handleDeleteUser = () => {
    if (users.length > 0) {
      deleteUser(0);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Notification Demo</h3>
      <div className="flex space-x-3">
        <Button onClick={handleAddUser} size="sm" className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
        <Button 
          onClick={handleUpdateUser} 
          size="sm" 
          variant="outline"
          disabled={users.length === 0}
        >
          <Edit className="h-4 w-4 mr-2" />
          Update User
        </Button>
        <Button 
          onClick={handleDeleteUser} 
          size="sm" 
          variant="destructive"
          disabled={users.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-3">
        Total Users: {users.length}
      </p>
    </div>
  );
}