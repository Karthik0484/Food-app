
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '@/lib/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export const RestaurantCard = ({ restaurant, index }: RestaurantCardProps) => {
  return (
    <motion.div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
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
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">{restaurant.name}</h3>
            <div className="flex items-center bg-secondary/50 px-2 py-1 rounded">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs font-medium">{restaurant.rating}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3">{restaurant.cuisine}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            
            <motion.div
              className="text-primary font-medium text-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              View Menu
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
