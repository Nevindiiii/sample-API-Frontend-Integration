import { Edit, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/store/userStore';

interface UserTableProps {
  users: User[];
  selectedUsers: Set<number>;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onView: (index: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectUser: (index: number, checked: boolean) => void;
  onSort: (key: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchLoading?: boolean;
}

export function UserTable({
  users,
  selectedUsers,
  sortConfig,
  onEdit,
  onDelete,
  onView,
  onSelectAll,
  onSelectUser,
  onSort,
}: UserTableProps) {
  // Calculate row height (adjust these values based on your actual row heights)
  const rowHeight = 50; // approximate height of each row in pixels
  const headerHeight = 56; // approximate height of the header
  const tableHeight = rowHeight * 6 + headerHeight; 
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key as keyof typeof a];
    const bValue = b[key as keyof typeof b];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <>
      <Table maxHeight={`${tableHeight}px`}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedUsers.size === users.length && users.length > 0
                }
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('name')}
                className="h-8 p-0 font-medium"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('email')}
                className="h-8 p-0 font-medium"
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('gender')}
                className="h-8 p-0 font-medium"
              >
                Gender
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('department')}
                className="h-8 p-0 font-medium"
              >
                Department
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.has(index)}
                  onCheckedChange={(checked) =>
                    onSelectUser(index, checked as boolean)
                  }
                  aria-label="Select row"
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>{user.startDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(index)}
                    className="h-8 px-2"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(index)}
                    className="h-8 px-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(index)}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-muted-foreground mt-4 text-sm">
        {selectedUsers.size} of {users.length} users selected
      </div>
    </>
  );
}
