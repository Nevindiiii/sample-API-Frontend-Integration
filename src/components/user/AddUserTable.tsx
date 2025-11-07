import { useRef } from 'react';
import { useUserTable } from '@/components/ui/customize-ui/useUserTable';
import UserDialogs from '@/components/ui/customize-ui/UserDialogs';
import { useTableState } from '@/components/ui/customize-ui/useTableState';
import { useUserActions } from './hooks/useUserActions';
import { useNotifications } from './hooks/useNotifications';
import { UserTableContent } from './UserTableContent';

export default function AddUserTable() {
  const state = useTableState();
  const { showMessage } = useNotifications();

  // Create a ref to store handlers
  const handlersRef = useRef<any>(null);

  // Create userTable with handlers
  const userTable = useUserTable(
    state.searchTerm,
    handlersRef.current?.handleEdit,
    handlersRef.current?.handleDelete,
    handlersRef.current?.handleView
  );

  // Create handlers and store in ref
  const handlers = useUserActions(userTable, state, showMessage);
  handlersRef.current = handlers;

  const {
    handleSubmit,
    handleConfirmDelete,
    handleDialogClose,
    handleViewDialogClose,
  } = handlers;

  console.log('AddUserTable editingIndex:', userTable.editingIndex);
  console.log(
    'AddUserTable editingUser:',
    userTable.editingIndex !== null
      ? userTable.users[userTable.editingIndex]
      : undefined
  );

  const handleUndo = () => {
    if (state.deletedUser) {
      userTable.addUser(state.deletedUser);
      state.setDeletedUser(null);
      state.setShowUndoNotification(false);
    }
  };

  const handleBulkDelete = () => {
    const selectedIndices = Object.keys(userTable.rowSelection).map(Number);
    if (selectedIndices.length > 0) {
      selectedIndices
        .sort((a, b) => b - a)
        .forEach((index) => {
          const user = userTable.users[index];
          if (user?._id) userTable.deleteUser(user._id);
        });
      userTable.setRowSelection({});
      showMessage(
        'success',
        `${selectedIndices.length} users deleted successfully`
      );
    }
  };

  const handleCopyEmails = () => {
    const selectedIndices = Object.keys(userTable.rowSelection).map(Number);
    const emails = selectedIndices
      .map((index) => userTable.users[index]?.email)
      .filter(Boolean);
    if (emails.length > 0) {
      navigator.clipboard.writeText(emails.join(', '));
      showMessage('success', `${emails.length} emails copied to clipboard`);
    }
  };

  return (
    <div className="relative min-h-screen">
      <UserTableContent
        userTable={userTable}
        state={state}
        onBulkDelete={handleBulkDelete}
        onCopyEmails={handleCopyEmails}
      />
      <UserDialogs
        dialogStates={{
          dialogOpen: state.dialogOpen,
          setDialogOpen: handleDialogClose,
          deleteDialogOpen: state.deleteDialogOpen,
          setDeleteDialogOpen: state.setDeleteDialogOpen,
          viewDialogOpen: state.viewDialogOpen,
          setViewDialogOpen: handleViewDialogClose,
          showUndoNotification: state.showUndoNotification,
          undoCountdown: state.undoCountdown,
          deletedUser: state.deletedUser,
          onUndo: handleUndo,
          onDismiss: () => state.setShowUndoNotification(false),
        }}
        editingUser={
          userTable.editingIndex !== null
            ? userTable.users[userTable.editingIndex]
            : undefined
        }
        viewingUser={userTable.viewingUser}
        onSubmit={handleSubmit}
        onSuccess={(msg) => showMessage('success', msg)}
        onError={(msg) => showMessage('error', msg)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
