import { useState, useEffect } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { User } from '@/store/userStore';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: User;
  onSubmit: (userData: User) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function UserForm({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  onSuccess,
}: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log('UserForm editingUser:', editingUser);
    if (editingUser) {
      setName(editingUser.name || '');
      setEmail(editingUser.email || '');
      setGender(editingUser.gender || 'Male');
      setDepartment(editingUser.department || '');
      setPhone(editingUser.phone || '');
      setIsActive(editingUser.isActive ?? true);
      setBirthday(editingUser.startDate ? new Date(editingUser.startDate) : undefined);
    } else {
      setName('');
      setEmail('');
      setGender('Male');
      setDepartment('');
      setPhone('');
      setIsActive(true);
      setBirthday(undefined);
    }
    setFieldErrors({});
  }, [editingUser, open]);

  const validateField = (field: string, value: string | Date) => {
    const schemas = {
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      gender: z.string().min(1, 'Gender is required'),
      department: z.string().min(1, 'Department is required'),
      phone: z.string().min(10, 'Phone must be at least 10 characters'),
      birthday: z.date(),
    };

    try {
      schemas[field as keyof typeof schemas].parse(value);
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error.issues[0].message,
        }));
      }
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!name) {
      newErrors.name = 'Name is required';
    } else {
      try {
        z.string().min(2, 'Name must be at least 2 characters').parse(name);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.name = error.issues[0].message;
        }
      }
    }

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
    } else {
      try {
        z.string().email('Please enter a valid email').parse(email);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.email = error.issues[0].message;
        }
      }
    }

    // Validate gender
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }

    // Validate department
    if (!department) {
      newErrors.department = 'Department is required';
    }

    // Validate phone
    if (!phone) {
      newErrors.phone = 'Phone is required';
    } else {
      try {
        z.string().min(10, 'Phone must be at least 10 characters').parse(phone);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.phone = error.issues[0].message;
        }
      }
    }

    // Validate birthday
    if (!birthday) {
      newErrors.birthday = 'Birthday is required';
    }

    setFieldErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const userData = {
      name,
      email,
      gender,
      department,
      phone,
      isActive,
      startDate: format(birthday!, 'yyyy-MM-dd'),
    };

    onSubmit(userData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? 'Update the user details'
              : 'Enter the details of the new user'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Enter full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField('name', e.target.value);
                }}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                placeholder="user@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField('email', e.target.value);
                }}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => {
                  setGender(value);
                  validateField('gender', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.gender && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.gender}
                </p>
              )}
            </div>
            <div>
              <Label>Department</Label>
              <Select
                value={department}
                onValueChange={(value) => {
                  setDepartment(value);
                  validateField('department', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.department && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.department}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  validateField('phone', e.target.value);
                }}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>
              )}
            </div>
            <div>
              <Label>Birthday</Label>
              <Input
                type="date"
                value={birthday ? format(birthday, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setBirthday(date);
                  if (date) validateField('birthday', date);
                }}
              />
              {fieldErrors.birthday && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.birthday}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="active">Active User</Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>
            {editingUser ? 'Update' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
