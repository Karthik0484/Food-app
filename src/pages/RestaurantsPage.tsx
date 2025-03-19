
import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RestaurantCard } from '@/components/ui/RestaurantCard';
import { Restaurant, getRestaurants } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = restaurants.filter(
      restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query)
    );
    
    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants]);

  return (
    <PageContainer>
      <div className="pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Restaurants
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover and order from the best restaurants in your area
          </motion.p>
        </div>

        {/* Search and filters */}
        <motion.div 
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by restaurant or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div 
          className="flex items-center justify-center mb-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <MapPin className="h-4 w-4 mr-1" />
          <span>Delivering to: Banglore, Electronic City 10001</span>
        </motion.div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={restaurant._id} 
                restaurant={restaurant}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RestaurantsPage;
