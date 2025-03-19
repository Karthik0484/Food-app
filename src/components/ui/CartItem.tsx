
import { CartItem as CartItemType } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export const CartItem = ({ item, index }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrease = () => {
    updateQuantity(item.item._id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.item._id, item.quantity - 1);
    } else {
      removeFromCart(item.item._id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.item._id);
  };
  
  const itemTotal = item.item.price * item.quantity;

  return (
    <motion.div 
      className="flex items-center gap-4 py-4 border-b border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.1,
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      exit={{ 
        opacity: 0, 
        x: -20,
        transition: { duration: 0.2 }
      }}
    >
      <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={item.item.imageUrl}
          alt={item.item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{item.item.name}</h3>
        <p className="text-muted-foreground text-sm">${item.item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-6 text-center">{item.quantity}</span>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-right min-w-[80px]">
        <p className="font-medium">${itemTotal.toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 px-2"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Remove</span>
        </Button>
      </div>
    </motion.div>
  );
};
