import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem, CartItem } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addToCart: (item: FoodItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('foodApp_cart');
    const storedRestaurantId = localStorage.getItem('foodApp_cartRestaurant');
    
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart data from localStorage', error);
        localStorage.removeItem('foodApp_cart');
      }
    }
    
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodApp_cart', JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem('foodApp_cartRestaurant', restaurantId);
    }
  }, [items, restaurantId]);

  const addToCart = (item: FoodItem, quantity: number = 1) => {
    // If adding from a different restaurant, ask to clear cart first
    if (restaurantId && restaurantId !== item.restaurantId && items.length > 0) {
      toast({
        title: "Different restaurant",
        description: "Your cart contains items from another restaurant. Would you like to clear your cart?",
        variant: "destructive",
        action: (
          <button 
            onClick={() => {
              clearCart();
              _addToCart(item, quantity);
            }}
            className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium"
          >
            Clear cart
          </button>
        ),
      });
      return;
    }
    
    _addToCart(item, quantity);
  };

  const _addToCart = (item: FoodItem, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.item._id === item._id);
      
      // If item already exists, update quantity
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      
      // Otherwise add new item
      return [...prevItems, { item, quantity }];
    });
    
    // Set restaurant ID if not yet set
    if (!restaurantId) {
      setRestaurantId(item.restaurantId);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${item.name} added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.item._id !== itemId));
    
    // If cart is empty, reset restaurantId
    if (items.length === 1) {
      setRestaurantId(null);
      localStorage.removeItem('foodApp_cartRestaurant');
    }
    
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(i => 
        i.item._id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem('foodApp_cart');
    localStorage.removeItem('foodApp_cartRestaurant');
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      restaurantId,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
