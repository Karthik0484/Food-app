// lib/api.ts

// Interface definitions
export interface Restaurant {
  _id: string;
  name: string;
  imageUrl: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  address: string;
  description: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  restaurantId: string;
  available: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: {
    foodItemId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  createdAt: string;
}

// API urls
const BASE_URL = "/api";

// Mock data for development with Indian themed restaurants
export const mockRestaurants: Restaurant[] = [
  {
    _id: "1",
    name: "Maharaja Palace",
    imageUrl:
      "https://maharajarohtak.com/Resources/Img/3.jpg",
    cuisine: "North Indian",
    rating: 4.7,
    deliveryTime: "30-40 min",
    address: "123 MG Road, Bangalore, KA, India",
    description:
      "Experience royal flavors with authentic North Indian dishes including kebabs and curries."
  },
  {
    _id: "2",
    name: "Bombay Bites",
    imageUrl:
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=2074&auto=format&fit=crop",
    cuisine: "Mumbai Street Food",
    rating: 4.9,
    deliveryTime: "25-35 min",
    address: "456 Marine Drive, Mumbai, MH, India",
    description:
      "Delicious Mumbai street food with a modern twist on traditional snacks."
  },
  {
    _id: "3",
    name: "Curry Corner",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    cuisine: "South Indian",
    rating: 4.5,
    deliveryTime: "40-50 min",
    address: "789 Brigade Road, Bangalore, KA, India",
    description:
      "Aromatic South Indian delicacies featuring dosas, idlis, and flavorful sambar."
  },
  {
    _id: "4",
    name: "Tandoori Trails",
    imageUrl:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop",
    cuisine: "North Indian",
    rating: 4.8,
    deliveryTime: "35-45 min",
    address: "101 Connaught Place, New Delhi, DL, India",
    description:
      "Experience the best of tandoor-cooked dishes and rich curries in a vibrant setting."
  },
  {
    _id: "5",
    name: "Spice Symphony",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
    cuisine: "Indian Fusion",
    rating: 4.6,
    deliveryTime: "30-40 min",
    address: "202 Indiranagar, Bangalore, KA, India",
    description:
      "A blend of traditional Indian spices with innovative cooking techniques."
  },
  {
    _id: "6",
    name: "Dosa Delight",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2080&auto=format&fit=crop",
    cuisine: "South Indian",
    rating: 4.4,
    deliveryTime: "20-30 min",
    address: "303 T. Nagar, Chennai, TN, India",
    description:
      "Authentic dosas, idlis, and vadas served with a variety of chutneys."
  }
];

export const mockFoodItems: Record<string, FoodItem[]> = {
  "1": [
    {
      _id: "101",
      name: "Butter Chicken",
      price: 16.99,
      description: "Creamy tomato gravy with tender chicken pieces.",
      imageUrl:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2070&auto=format&fit=crop",
      category: "Main Course",
      restaurantId: "1",
      available: true
    },
    {
      _id: "102",
      name: "Paneer Tikka Masala",
      price: 18.99,
      description: "Grilled paneer in a spicy, creamy tomato sauce.",
      imageUrl:
        "https://spicecravings.com/wp-content/uploads/2020/08/Matar-Paneer-1.jpg",
      category: "Main Course",
      restaurantId: "1",
      available: true
    },
    {
      _id: "103",
      name: "Dal Makhani",
      price: 15.99,
      description: "Slow-cooked black lentils in a rich, buttery sauce.",
      imageUrl:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2062&auto=format&fit=crop",
      category: "Main Course",
      restaurantId: "1",
      available: true
    },
    {
      _id: "104",
      name: "Vegetable Biryani",
      price: 12.99,
      description: "Fragrant rice layered with mixed vegetables and spices.",
      imageUrl:
        "https://www.zeelskitchen.com/wp-content/uploads/2015/07/Vegtable_Biryani_14.jpg",
      category: "Rice Dish",
      restaurantId: "1",
      available: true
    }
  ],
  "2": [
    {
      _id: "201",
      name: "Vada Pav",
      price: 14.99,
      description:
        "Spicy potato fritter sandwiched between a bun, served with zesty chutney.",
      imageUrl:
        "https://images.unsplash.com/photo-1604908177524-1f5f0549afc0?q=80&w=2069&auto=format&fit=crop",
      category: "Street Food",
      restaurantId: "2",
      available: true
    },
    {
      _id: "202",
      name: "Pav Bhaji",
      price: 16.99,
      description:
        "Mixed vegetable curry served with buttered pav bread for a hearty snack.",
      imageUrl:
        "https://images.unsplash.com/photo-1604953048171-e751ef1f8dbf?q=80&w=2071&auto=format&fit=crop",
      category: "Street Food",
      restaurantId: "2",
      available: true
    },
    {
      _id: "203",
      name: "Jalebi",
      price: 8.99,
      description:
        "Sweet, spiral-shaped dessert soaked in saffron-infused syrup.",
      imageUrl:
        "https://images.unsplash.com/photo-1598515213690-600d66a5c06f?q=80&w=2070&auto=format&fit=crop",
      category: "Dessert",
      restaurantId: "2",
      available: true
    },
    {
      _id: "204",
      name: "Kachumber Salad",
      price: 10.99,
      description:
        "Fresh cucumber, tomato, and onion salad with a tangy lemon dressing.",
      imageUrl:
        "https://images.unsplash.com/photo-1601549646963-7ed02d8b29cf?q=80&w=2142&auto=format&fit=crop",
      category: "Salad",
      restaurantId: "2",
      available: true
    }
  ]
};

// API functions - we'll mock these for now
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: "user123",
        name: "John Doe",
        email: email,
        token: "mock-token-123456"
      });
    }, 800);
  });
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: "user123",
        name: name,
        email: email,
        token: "mock-token-123456"
      });
    }, 800);
  });
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRestaurants);
    }, 800);
  });
};

export const getRestaurantById = async (
  id: string
): Promise<Restaurant | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = mockRestaurants.find((r) => r._id === id);
      resolve(restaurant || null);
    }, 500);
  });
};

export const getFoodItemsByRestaurant = async (
  restaurantId: string
): Promise<FoodItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFoodItems[restaurantId] || []);
    }, 800);
  });
};

export const placeOrder = async (
  order: Omit<Order, "_id" | "createdAt" | "status">
): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...order,
        _id: "order" + Date.now(),
        createdAt: new Date().toISOString(),
        status: "pending"
      });
    }, 1000);
  });
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: "order123",
          userId: userId,
          restaurantId: "1",
          items: [
            {
              foodItemId: "101",
              quantity: 2,
              price: 16.99,
              name: "Butter Chicken"
            }
          ],
          totalAmount: 33.98,
          status: "delivered",
          deliveryAddress: "123 MG Road, Bangalore, KA, India",
          createdAt: new Date(Date.now() - 86400000).toISOString() // yesterday
        }
      ]);
    }, 800);
  });
};
