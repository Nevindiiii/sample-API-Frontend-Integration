'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table-column-header';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
};

export type Cart = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
  cartId: number;
  userId: number;
};

export const getColumns = (onViewDetails: (cart: Cart) => void): ColumnDef<Cart>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const cart = row.original;

      return (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails(cart)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product ID" />
    ),
  },
  {
    accessorKey: 'thumbnail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <img 
        src={row.getValue('thumbnail')} 
        alt={row.getValue('title')} 
        className="h-12 w-12 rounded object-cover" 
      />
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => `$${row.getValue('price')}`,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => `$${row.getValue('total')}`,
  },
  {
    accessorKey: 'discountPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount %" />
    ),
    cell: ({ row }) => `${row.getValue('discountPercentage')}%`,
  },
];

export const columns: ColumnDef<Cart>[] = getColumns(() => {});
