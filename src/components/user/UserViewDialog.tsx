import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User } from '@/store/userStore';
import { User as UserIcon, Mail, Phone, Building, Users } from 'lucide-react';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
}: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <DialogHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 shadow-sm dark:bg-green-900/30">
            <UserIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="left-100 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4" />
            {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Department */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <Building className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Department
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.department}
              </p>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Gender
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.gender}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Phone
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.phone}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Status
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                user.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-300'
              }`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
