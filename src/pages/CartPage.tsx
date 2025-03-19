
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { CartItem } from '@/components/ui/CartItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { placeOrder } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const { items, removeFromCart, clearCart, getCartTotal, restaurantId } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitOrder = async () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address.",
        variant: "destructive",
      });
      return;
    }

    if (!restaurantId) {
      toast({
        title: "Error",
        description: "Could not identify the restaurant for this order.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const orderData = {
        userId: user!._id,
        restaurantId: restaurantId,
        items: items.map(item => ({
          foodItemId: item.item._id,
          quantity: item.quantity,
          price: item.item.price,
          name: item.item.name
        })),
        totalAmount: getCartTotal(),
        deliveryAddress: address
      };
      
      const order = await placeOrder(orderData);
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order._id} has been confirmed.`,
      });
      
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        title: "Failed to place order",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = getCartTotal();
  const deliveryFee = 2.99;
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = cartTotal + deliveryFee + tax;

  return (
    <PageContainer>
      <div className="pt-24 pb-12">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Cart
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Review your items and complete your order
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link to="/restaurants" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to get started</p>
            <Link to="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-4">Order Items</h2>
                <AnimatePresence>
                  {items.map((item, index) => (
                    <CartItem 
                      key={item.item._id} 
                      item={item} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CartPage;
