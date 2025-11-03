// components/user/UserDataTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loading } from '@/components/ui/loading';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { User } from '@/store/userStore';
import { DataTablePagination } from '@/components/DataTablePagination';
import { UserViewDialog } from '@/components/user/UserViewDialog';

interface Props {
  table: TableType<User>;
  searchLoading: boolean;
  viewingUser?: User | null;
  viewDialogOpen?: boolean;
  setViewDialogOpen?: (open: boolean) => void;
}

export default function UserDataTable({ 
  table, 
  searchLoading, 
  viewingUser, 
  viewDialogOpen, 
  setViewDialogOpen 
}: Props) {
  return (
    <div className="relative mt-6 px-6">
      {searchLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Loading size="sm" />
            <span className="text-muted-foreground text-sm">Searching...</span>
          </div>
        </div>
      )}
      <div className="h-[calc(100vh-300px)] overflow-hidden overflow-y-auto rounded-md border">
        <Table className="relative">
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
      
      {viewingUser && viewDialogOpen && setViewDialogOpen && (
        <UserViewDialog 
          user={viewingUser} 
          open={viewDialogOpen} 
          onOpenChange={setViewDialogOpen} 
        />
      )}
    </div>
  );
}
