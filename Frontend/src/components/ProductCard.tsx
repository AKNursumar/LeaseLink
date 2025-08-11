import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  available: boolean;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onRent?: (productId: number) => void;
}

const ProductCard = ({ product, onRent }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleRentAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (product.available) {
      onRent?.(product.id);
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neu p-4 flex flex-col items-center cursor-pointer group"
      onClick={handleViewDetails}
    >
      <div className="w-full h-48 bg-muted rounded-xl mb-4 overflow-hidden neu-inset">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback for missing images
            e.currentTarget.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center`;
          }}
        />
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-1">{product.name}</h2>
      
      {product.category && (
        <span className="text-xs text-muted-foreground mb-2 px-2 py-1 neu-inset rounded-lg">
          {product.category}
        </span>
      )}
      
      <p className="text-primary font-bold mb-3">₹{product.price}/day</p>
      
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-accent' : 'bg-destructive'}`} />
        <span className={`text-sm ${product.available ? 'text-accent' : 'text-destructive'}`}>
          {product.available ? 'Available' : 'Rented'}
        </span>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`neu-button px-4 py-2 text-sm font-medium ${
          product.available 
            ? 'text-foreground hover:text-primary-foreground hover:bg-primary' 
            : 'text-muted-foreground cursor-not-allowed opacity-50'
        }`}
        onClick={handleRentAction}
        disabled={!product.available}
      >
        {product.available ? (isAuthenticated ? 'Rent Now' : 'Login to Rent') : 'Unavailable'}
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;