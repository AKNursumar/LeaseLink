import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  dailyRate: number;
  startDate: string;
  endDate: string;
  quantity: number;
  totalDays: number;
  subtotal: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    }
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, subtotal: item.totalDays * item.dailyRate * newQuantity }
        : item
    );
    updateCart(updatedItems);
  };

  const removeItem = (itemId: number) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    updateCart(updatedItems);
  };

  const updateDates = (itemId: number, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (totalDays > 0) {
      const updatedItems = cartItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              startDate,
              endDate,
              totalDays,
              subtotal: totalDays * item.dailyRate * item.quantity
            }
          : item
      );
      updateCart(updatedItems);
    }
  };

  const clearCart = () => {
    updateCart([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    // Store cart data for checkout
    localStorage.setItem('checkoutData', JSON.stringify({
      items: cartItems,
      subtotal,
      tax,
      total
    }));
    
    navigate("/checkout");
  };

  const continueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-card mb-6 p-6"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Shopping Cart 🛒
            </h1>
            <p className="text-muted-foreground">
              Review your selected items and proceed to checkout.
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neu-card p-12 text-center"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neu-button px-6 py-3 text-foreground hover:text-primary font-medium"
                onClick={continueShopping}
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Cart Items ({cartItems.length})
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-destructive hover:text-destructive/80"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </motion.button>
                </div>

                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="neu-card p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image & Info */}
                      <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 neu-inset rounded-xl overflow-hidden">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {item.productName}
                          </h3>
                          <p className="text-primary font-bold">₹{item.dailyRate}/day</p>
                        </div>
                      </div>

                      {/* Rental Dates */}
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                          <input
                            type="date"
                            value={item.startDate}
                            onChange={(e) => updateDates(item.id, e.target.value, item.endDate)}
                            min={new Date().toISOString().split('T')[0]}
                            className="neu-input w-full p-2 text-sm text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                          <input
                            type="date"
                            value={item.endDate}
                            onChange={(e) => updateDates(item.id, item.startDate, e.target.value)}
                            min={item.startDate}
                            className="neu-input w-full p-2 text-sm text-foreground"
                          />
                        </div>
                      </div>

                      {/* Quantity & Total */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="neu-button w-8 h-8 flex items-center justify-center text-foreground"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-foreground px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="neu-button w-8 h-8 flex items-center justify-center text-foreground"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{item.totalDays} days</p>
                          <p className="font-bold text-primary">₹{item.subtotal}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm text-destructive hover:text-destructive/80"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="neu-card p-6 sticky top-4"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax (8%):</span>
                      <span>₹{Math.round(tax)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>Total:</span>
                        <span>₹{Math.round(total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full neu-button px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full neu-button px-6 py-3 text-foreground hover:text-primary font-medium"
                      onClick={continueShopping}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>

                  {/* Cart Summary */}
                  <div className="mt-6 p-4 neu-inset rounded-xl">
                    <h4 className="font-medium text-foreground mb-2">Cart Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{cartItems.length} unique items</p>
                      <p>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} total quantity</p>
                      <p>{cartItems.reduce((sum, item) => sum + item.totalDays, 0)} total rental days</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
