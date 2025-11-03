import { apiClient } from './axiosConfig';

export const fetchCarts = async () => {
  const response = await apiClient.get('/carts?limit=0');
  const carts = response.data.carts;
  
  // Flatten products from all carts
  const products = carts.flatMap((cart: any) => 
    cart.products.map((product: any) => ({
      ...product,
      cartId: cart.id,
      userId: cart.userId
    }))
  );
  
  return products;
};