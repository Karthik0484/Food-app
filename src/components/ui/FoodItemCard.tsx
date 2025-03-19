
import { FoodItem } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodItemCardProps {
  item: FoodItem;
  index: number;
}

export const FoodItemCard = ({ item, index }: FoodItemCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(item, 1);
  };
  
  return (
    <motion.div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.1,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{item.name}</h3>
          <span className="font-medium text-primary">Rs.{item.price.toFixed()}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{item.description}</p>
        
        <Button 
          onClick={handleAddToCart} 
          className="mt-auto w-full flex items-center justify-center gap-2 group"
        >
          <span>Add to Cart</span>
          <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
        </Button>
      </div>
    </motion.div>
  );
};
