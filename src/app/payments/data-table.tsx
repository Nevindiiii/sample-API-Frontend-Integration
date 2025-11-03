'use client';

import * as React from 'react';
import { useState } from 'react';

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/ui/customize-ui/search-box';
import { Loading } from '@/components/ui/loading';
import { DataTablePagination } from '@/components/DataTablePagination';

import { DataTableViewOptions } from '@/components/DataTableViewOptions';
import { CartBulkActions } from '@/components/CartBulkActions';
import { Cart } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCarts = new Set(selectedRows.map(row => row.index));

  const handleBulkDelete = () => {
    console.log('Bulk delete cart items:', selectedRows.map(row => row.original));
    setRowSelection({});
  };

  const handleCopyCartIds = () => {
    const cartIds = selectedRows.map(row => (row.original as Cart).cartId).join(', ');
    navigator.clipboard.writeText(cartIds);
    console.log('Copied cart IDs:', cartIds);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <SearchBox
            placeholder="Search by product title..."
            value={
              (table.getColumn('title')?.getFilterValue() as string) ?? ''
            }
            onChange={(value) => {
              setSearchLoading(true);
              setTimeout(() => {
                table.getColumn('title')?.setFilterValue(value);
                setSearchLoading(false);
              }, 300);
            }}
            loading={searchLoading}
            className="max-w-sm"
          />
          <CartBulkActions
            selectedCarts={selectedCarts}
            carts={data as Cart[]}
            onBulkDelete={handleBulkDelete}
            onCopyCartIds={handleCopyCartIds}
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="relative h-[calc(100vh-280px)] overflow-hidden overflow-y-auto rounded-md border">
        {searchLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Loading size="sm" />
              <span className="text-muted-foreground text-sm">
                Searching...
              </span>
            </div>
          </div>
        )}
        <Table className="relative">
          <TableHeader className="sticky top-0 z-20 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*pagination */}
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
