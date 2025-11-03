import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { useUserStore, User } from '@/store/userStore';
import { getColumns } from '@/components/user/columns';

export function useUserTable(searchTerm: string, handleEdit?: (index: number) => void, handleDelete?: (index: number) => void, handleView?: (index: number) => void) {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const defaultHandleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const defaultHandleDelete = (index: number) => {
    setUserToDelete(index);
  };

  const defaultHandleView = (index: number) => {
    console.log('View clicked for user:', users[index]);
    setViewingUser(users[index]);
    setViewDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(
      handleEdit || defaultHandleEdit, 
      handleDelete || defaultHandleDelete, 
      handleView || defaultHandleView
    ),
    [users, handleEdit, handleDelete, handleView]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  useEffect(() => {
    table.setGlobalFilter(searchTerm);
  }, [searchTerm, table]);

  return {
    table,
    users,
    addUser,
    updateUser,
    deleteUser,
    editingIndex,
    setEditingIndex,
    viewingUser,
    setViewingUser,
    userToDelete,
    setUserToDelete,
    rowSelection,
    setRowSelection,
    handleEdit: defaultHandleEdit, 
    handleDelete: defaultHandleDelete, 
    handleView: defaultHandleView,
    viewDialogOpen,
    setViewDialogOpen,
  };
}
