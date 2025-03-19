
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FoodItemCard } from '@/components/ui/FoodItemCard';
import { BlurImage } from '@/components/ui/BlurImage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Restaurant, FoodItem, getRestaurantById, getFoodItemsByRestaurant } from '@/lib/api';
import { motion } from 'framer-motion';

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const restaurantData = await getRestaurantById(id);
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          const foodData = await getFoodItemsByRestaurant(id);
          setFoodItems(foodData);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(foodData.map(item => item.category))
          );
          setCategories(['all', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const filteredItems = activeCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <PageContainer>
        <div className="pt-24 pb-12">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse mb-8" />
          <div className="h-8 bg-gray-100 rounded w-1/3 animate-pulse mb-4" />
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!restaurant) {
    return (
      <PageContainer>
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <BlurImage
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            containerClassName="absolute inset-0"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-3">
                {restaurant.cuisine}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{restaurant.rating} Rating</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="text-muted-foreground">{restaurant.description}</p>
        </motion.div>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid grid-flow-col justify-start gap-2 overflow-x-auto pb-1 mb-2">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <FoodItemCard 
                    key={item._id} 
                    item={item} 
                    index={index}
                  />
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No items in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default RestaurantDetailPage;
