

export function useUserActions(userTable: any, state: any, showMessage: any) {
  const handleEdit = (index: number) => {
    userTable.setEditingIndex(index);
    state.setDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    userTable.setUserToDelete(index);
    state.setDeleteDialogOpen(true);
  };

  const handleView = (index: number) => {
    console.log('handleView called with index:', index);
    console.log('User at index:', userTable.users[index]);
    userTable.setViewingUser(userTable.users[index]);
    state.setViewDialogOpen(true);
  };

  const handleSubmit = async (user: any) => {
    try {
      if (userTable.editingIndex !== null) {
        const existingUser = userTable.users[userTable.editingIndex];
        await userTable.updateUser(existingUser._id, user);
      } else {
        await userTable.addUser(user);
      }
      state.setDialogOpen(false);
      userTable.setEditingIndex(null);
    } catch {
      showMessage('error', 'Failed to save user');
    }
  };

  const handleDialogClose = (open: boolean) => {
    state.setDialogOpen(open);
    if (!open) {
      userTable.setEditingIndex(null);
    }
  };

  const handleViewDialogClose = (open: boolean) => {
    state.setViewDialogOpen(open);
    if (!open) {
      userTable.setViewingUser(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (userTable.userToDelete !== null) {
      const user = userTable.users[userTable.userToDelete];
      try {
        await userTable.deleteUser(user._id);
        state.setDeleteDialogOpen(false);
      } catch {
        showMessage('error', 'Failed to delete user');
        state.setDeleteDialogOpen(false);
      }
    }
  };

  return { handleEdit, handleDelete, handleView, handleSubmit, handleConfirmDelete, handleDialogClose, handleViewDialogClose };
}