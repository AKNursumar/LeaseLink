import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { productAPI } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  pricePerDay: number;
  imageUrl: string;
  isAvailable: boolean;
  category: string;
  description?: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories
        const categoriesResponse = await productAPI.getCategories();
        if (categoriesResponse.success) {
          setCategories(["All", ...categoriesResponse.data]);
        }

        // Load products
        const params: any = {};
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        
        const productsResponse = await productAPI.getProducts(params);
        if (productsResponse.success) {
          setProducts(productsResponse.data.products || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load products. Please try again.');
        // Fallback to local data if API fails
        setProducts([]);
        setCategories(["All", "Photography", "Tools", "Electronics", "Audio", "Sports", "Home"]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchTerm]);

  const handleRentProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-card mb-6 p-6"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Browse Products 📦
            </h1>
            <p className="text-muted-foreground">
              Discover and rent from our extensive collection of tools, electronics, and equipment.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="neu-card p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neu-input w-full p-3 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'neu-inset text-primary'
                        : 'neu-button text-foreground hover:text-primary'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredProducts.length} products</span>
              <span>{filteredProducts.filter(p => p.isAvailable).length} available</span>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.pricePerDay}
                  image={product.imageUrl}
                  available={product.isAvailable}
                  onRent={() => handleRentProduct(product.id)}
                  onView={() => handleViewProduct(product.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or selected category.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neu-button px-6 py-3 text-foreground hover:text-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
