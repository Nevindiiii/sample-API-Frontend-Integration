import { Button } from '@/components/ui/button';
import { Cart } from '@/app/payments/columns';
import { Trash2, Copy, ShoppingCart } from 'lucide-react';

interface Props {
  selectedCarts: Set<number>;
  carts: Cart[];
  onBulkDelete: () => void;
  onCopyCartIds: () => void;
}

export function CartBulkActions({ selectedCarts, onBulkDelete, onCopyCartIds }: Props) {
  if (selectedCarts.size === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedCarts.size} selected
      </span>
      <Button variant="outline" size="sm" onClick={onBulkDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Remove Selected
      </Button>
      <Button variant="outline" size="sm" onClick={onCopyCartIds}>
        <Copy className="mr-2 h-4 w-4" />
        Copy Cart IDs
      </Button>
    </div>
  );
}