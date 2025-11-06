// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Cart } from '@/app/payments/columns';

// interface CartViewDialogProps {
//   cart: Cart | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function CartViewDialog({ cart, open, onOpenChange }: CartViewDialogProps) {
//   if (!cart) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader className="pb-4">
//           <DialogTitle className="text-xl font-semibold text-gray-800">Cart Item Details</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6">
//           <div className="flex justify-center bg-gray-50 rounded-lg p-4">
//             <img
//               src={cart.thumbnail}
//               alt={cart.title}
//               className="h-40 w-40 rounded-lg object-cover shadow-md"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-blue-600">Title</span>
//               <p className="text-gray-800 font-semibold">{cart.title}</p>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-green-600">Price</span>
//               <p className="text-gray-800 font-semibold">${cart.price}</p>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-purple-600">Quantity</span>
//               <p className="text-gray-800 font-semibold">{cart.quantity}</p>
//             </div>
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-orange-600">Total</span>
//               <p className="text-gray-800 font-semibold">${cart.total}</p>
//             </div>
//             <div className="bg-red-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-red-600">Discount</span>
//               <p className="text-gray-800 font-semibold">{cart.discountPercentage}%</p>
//             </div>
//             <div className="bg-indigo-50 p-3 rounded-lg">
//               <span className="text-sm font-medium text-indigo-600">Cart ID</span>
//               <p className="text-gray-800 font-semibold">{cart.cartId}</p>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <span className="text-sm font-medium text-gray-600">User ID</span>
//             <p className="text-gray-800 font-semibold">{cart.userId}</p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {  ShoppingBag } from 'lucide-react';

interface Cart {
  cartId: number;
  userId: number;
  thumbnail: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
}

interface CartViewDialogProps {
  cart: Cart | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartViewDialog({
  cart,
  open,
  onOpenChange,
}: CartViewDialogProps) {
  const [quantity] = useState(cart?.quantity || 1);
  const [isRemoving] = useState(false);

  if (!cart) return null;

  

  const calculatedTotal = (
    cart.price *
    quantity *
    (1 - cart.discountPercentage / 100)
  ).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-md border-0 bg-white p-0 shadow-2xl transition-all duration-300 ${isRemoving ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Item Details
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24  overflow-hidden rounded-lg bg-gray-100">
              <img
                src={cart.thumbnail}
                alt={cart.title}
                className="h-full w-full object-cover"
              />
              {cart.discountPercentage > 0 && (
                <div className="absolute -top-1 -right-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                  -{cart.discountPercentage}%
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="leading-snug font-semibold text-gray-900">
                {cart.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ${cart.price.toFixed(2)} each
              </p>
              <div className="mt-2 flex gap-2 text-xs text-gray-400">
                <span>Cart #{cart.cartId}</span>
                <span>•</span>
                <span>User #{cart.userId}</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center gap-3">
             
              <div className="flex h-9 w-16 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 font-semibold text-gray-900">
                {quantity}
              </div>
              
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                ${(cart.price * quantity).toFixed(2)}
              </span>
            </div>
            {cart.discountPercentage > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  Discount ({cart.discountPercentage}%)
                </span>
                <span className="text-green-600">
                  -$
                  {(
                    (cart.price * quantity * cart.discountPercentage) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ${calculatedTotal}
              </span>
            </div>
          </div>

          {/* Actions */}
        
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function Demo() {
  const [open, setOpen] = useState(true);

  const sampleCart: Cart = {
    cartId: 12345,
    userId: 789,
    thumbnail:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    title: 'Premium Wireless Mouse',
    price: 79.99,
    quantity: 2,
    total: 135.98,
    discountPercentage: 15,
  };

  return (
    <div className="flex min-h-screen items-center justify-center  from-blue-50 to-indigo-100 p-4">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-gray-800"
      >
        View Cart Item
      </button>
      <CartViewDialog cart={sampleCart} open={open} onOpenChange={setOpen} />
    </div>
  );
}
