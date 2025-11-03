import { Users } from 'lucide-react';
import UserDataTable from '@/components/ui/customize-ui/UserDataTable';
import {
  TableContainer,
  TableHeader,
  TableActions,
} from '@/components/ui/customize-ui';

interface UserTableContentProps {
  userTable: any;
  state: any;
  onBulkDelete: () => void;
  onCopyEmails: () => void;
}

export function UserTableContent({ userTable, state, onBulkDelete, onCopyEmails }: UserTableContentProps) {
  return (
    <TableContainer>
      <TableHeader
        title="Manually Added User Directory"
        icon={<Users className="h-6 w-6 text-black" />}
      />
      <TableActions
        onAddUser={() => state.setDialogOpen(true)}
        searchTerm={state.searchTerm}
        onSearchChange={state.handleSearchChange}
        searchLoading={state.searchLoading}
        users={userTable.users}
        selectedUsers={new Set(Object.keys(userTable.rowSelection).map(Number))}
        onBulkDelete={onBulkDelete}
        onCopyEmails={onCopyEmails}
        table={userTable.table}
      />
      <UserDataTable 
        table={userTable.table} 
        searchLoading={state.searchLoading}
        viewingUser={userTable.viewingUser}
        viewDialogOpen={userTable.viewDialogOpen}
        setViewDialogOpen={userTable.setViewDialogOpen}
      />
    </TableContainer>
  );
}