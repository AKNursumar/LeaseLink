import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

// Product data that matches the Products page
const allProducts = [
  {
    id: 1,
    name: "Professional Camera Kit",
    price: 6500,
    category: "Photography",
    description: "Professional DSLR camera kit perfect for photography and videography projects. Includes camera body, multiple lenses, tripod, lighting equipment, and carrying case.",
    features: [
      "Full-frame DSLR camera body",
      "24-70mm f/2.8 lens",
      "85mm f/1.8 portrait lens",
      "Professional tripod",
      "LED lighting kit",
      "Memory cards and batteries",
      "Protective carrying case"
    ],
    specifications: {
      "Sensor": "Full-frame CMOS",
      "Resolution": "24.2 MP",
      "Video": "4K at 30fps",
      "Weight": "3.2 kg (complete kit)",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1627735000631-45b783e40e0a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.8,
    reviews: 24
  },
  {
    id: 2,
    name: "Power Drill Set",
    price: 1800,
    category: "Tools",
    description: "Professional power drill set with multiple bits and accessories. Perfect for construction, renovation, and DIY projects. Includes impact drill, bits, charger, and case.",
    features: [
      "18V Lithium-ion battery",
      "Variable speed trigger",
      "20+1 torque settings",
      "LED work light",
      "Quick-change chuck",
      "Multiple drill bits included",
      "Durable carrying case"
    ],
    specifications: {
      "Battery": "18V Lithium-ion",
      "Chuck Size": "13mm",
      "Torque": "65 Nm",
      "Weight": "1.8 kg",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516975941406-d74c1ce5df84?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.6,
    reviews: 18
  },
  {
    id: 3,
    name: "Gaming Laptop",
    price: 8500,
    category: "Electronics",
    description: "High-performance gaming laptop with latest graphics card and processor. Perfect for gaming, content creation, and professional work requiring high computing power.",
    features: [
      "Intel Core i7 processor",
      "RTX 4060 graphics card",
      "16GB DDR5 RAM",
      "1TB NVMe SSD",
      "15.6\" 144Hz display",
      "RGB backlit keyboard",
      "Advanced cooling system"
    ],
    specifications: {
      "Processor": "Intel Core i7-12700H",
      "Graphics": "RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Storage": "1TB NVMe SSD",
      "Display": "15.6\" 144Hz",
      "Weight": "2.3 kg",
      "Condition": "Like New"
    },
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop"
    ],
    available: false,
    rating: 4.9,
    reviews: 32
  },
  {
    id: 4,
    name: "DJ Mixer",
    price: 7200,
    category: "Audio",
    description: "Professional DJ mixer with multiple channels and effects. Perfect for parties, events, and professional DJ performances. Includes cables and instruction manual.",
    features: [
      "4-channel mixer",
      "Built-in effects",
      "Crossfader with curve control",
      "3-band EQ per channel",
      "Cue monitoring",
      "USB connectivity",
      "Professional grade faders"
    ],
    specifications: {
      "Channels": "4 channels",
      "Effects": "Built-in reverb, delay, filter",
      "Connectivity": "USB, XLR, RCA",
      "Power": "External adapter",
      "Weight": "3.5 kg",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.7,
    reviews: 21
  },
  {
    id: 5,
    name: "DSLR Camera",
    price: 4800,
    category: "Photography",
    description: "High-quality DSLR camera perfect for photography enthusiasts and professionals. Includes standard lens, battery, charger, and memory card.",
    features: [
      "24MP APS-C sensor",
      "18-55mm kit lens",
      "Full HD video recording",
      "Built-in flash",
      "Multiple shooting modes",
      "Image stabilization",
      "WiFi connectivity"
    ],
    specifications: {
      "Sensor": "24MP APS-C CMOS",
      "Lens": "18-55mm f/3.5-5.6",
      "Video": "1080p at 60fps",
      "Battery": "Li-ion rechargeable",
      "Weight": "1.2 kg",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.5,
    reviews: 16
  },
  {
    id: 6,
    name: "Circular Saw",
    price: 2500,
    category: "Tools",
    description: "Professional circular saw for wood cutting and construction work. Features adjustable cutting depth and bevel angles. Includes multiple blades and safety equipment.",
    features: [
      "7.25\" carbide blade",
      "Adjustable cutting depth",
      "Bevel capacity 0-45°",
      "Electric brake",
      "Dust blower",
      "LED cutting line guide",
      "Safety guard"
    ],
    specifications: {
      "Blade Size": "7.25 inches",
      "Motor": "15 Amp",
      "Cutting Depth": "2.5\" at 90°",
      "Bevel": "0-45°",
      "Weight": "4.2 kg",
      "Condition": "Good"
    },
    images: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.4,
    reviews: 12
  },
  {
    id: 7,
    name: "MacBook Pro",
    price: 12000,
    category: "Electronics",
    description: "Latest MacBook Pro with M2 chip, perfect for professional work, content creation, and development. Includes charger, documentation, and original packaging.",
    features: [
      "Apple M2 Pro chip",
      "16GB unified memory",
      "512GB SSD storage",
      "14-inch Liquid Retina XDR display",
      "1080p FaceTime HD camera",
      "Six-speaker sound system",
      "MagSafe 3 charging"
    ],
    specifications: {
      "Processor": "Apple M2 Pro",
      "Memory": "16GB unified memory",
      "Storage": "512GB SSD",
      "Display": "14-inch Liquid Retina XDR",
      "Battery": "Up to 18 hours",
      "Weight": "1.6 kg",
      "Condition": "Like New"
    },
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 8,
    name: "Studio Monitors",
    price: 3200,
    category: "Audio",
    description: "Professional studio monitor speakers for music production and audio editing. Delivers accurate sound reproduction with excellent clarity and detail.",
    features: [
      "5-inch woofer",
      "1-inch silk dome tweeter",
      "Bi-amplified design",
      "Multiple input options",
      "Room acoustic controls",
      "Magnetic shielding",
      "Professional stands included"
    ],
    specifications: {
      "Woofer": "5-inch polypropylene",
      "Tweeter": "1-inch silk dome",
      "Power": "50W total",
      "Frequency Response": "50Hz - 20kHz",
      "Inputs": "XLR, TRS, RCA",
      "Weight": "6.8 kg (pair)",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"
    ],
    available: false,
    rating: 4.6,
    reviews: 28
  },
  {
    id: 9,
    name: "Tennis Racket Set",
    price: 1200,
    category: "Sports",
    description: "Professional tennis racket set for players of all skill levels. Includes racket, strings, grip tape, and carrying case. Perfect for tournaments and practice.",
    features: [
      "Graphite composite frame",
      "100 sq inch head size",
      "Pre-strung racket",
      "Comfortable grip",
      "Lightweight design",
      "Vibration dampener",
      "Professional carrying case"
    ],
    specifications: {
      "Head Size": "100 sq inches",
      "Weight": "295g unstrung",
      "Balance": "320mm",
      "String Pattern": "16x19",
      "Grip Size": "4 1/4",
      "Condition": "Excellent"
    },
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.3,
    reviews: 14
  },
  {
    id: 10,
    name: "Pressure Washer",
    price: 2800,
    category: "Home",
    description: "High-pressure washer for cleaning driveways, patios, vehicles, and outdoor surfaces. Includes multiple nozzles and detergent tank for various cleaning tasks.",
    features: [
      "2000 PSI pressure",
      "Electric powered",
      "Multiple spray nozzles",
      "Detergent tank",
      "25ft high-pressure hose",
      "Wheeled design",
      "Auto shut-off"
    ],
    specifications: {
      "Pressure": "2000 PSI",
      "Flow Rate": "1.76 GPM",
      "Motor": "14.5 Amp electric",
      "Hose Length": "25 feet",
      "Tank Capacity": "0.9L",
      "Weight": "22 kg",
      "Condition": "Good"
    },
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"
    ],
    available: true,
    rating: 4.2,
    reviews: 19
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Find the product by ID
    const foundProduct = allProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Redirect to 404 or products page if product not found
      navigate('/products');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="neu-button px-6 py-3 text-foreground hover:text-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * product.price * quantity : 0;
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert("Please select rental dates");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      alert("End date must be after start date");
      return;
    }
    
    if (start < new Date()) {
      alert("Start date cannot be in the past");
      return;
    }

    console.log("Adding to cart:", {
      productId: id,
      productName: product.name,
      startDate,
      endDate,
      quantity,
      total: calculateTotal()
    });
    
    // Store in localStorage for now (in real app, use state management)
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const newItem = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      dailyRate: product.price,
      startDate,
      endDate,
      quantity,
      totalDays: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
      subtotal: calculateTotal()
    };
    
    cartItems.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    navigate("/cart");
  };

  const handleRentNow = () => {
    if (!startDate || !endDate) {
      alert("Please select rental dates");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      alert("End date must be after start date");
      return;
    }
    
    if (start < new Date()) {
      alert("Start date cannot be in the past");
      return;
    }

    console.log("Rent now:", {
      productId: id,
      productName: product.name,
      startDate,
      endDate,
      quantity,
      total: calculateTotal()
    });
    
    // Store rental details and go to checkout
    const rentalData = {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      dailyRate: product.price,
      startDate,
      endDate,
      quantity,
      totalDays: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
      subtotal: calculateTotal()
    };
    
    localStorage.setItem('currentRental', JSON.stringify(rentalData));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="neu-button px-4 py-2 mb-6 text-sm font-medium text-foreground"
            onClick={() => navigate(-1)}
          >
            ← Back to Products
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="neu-card p-4">
                <div className="aspect-square bg-muted rounded-xl overflow-hidden neu-inset">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'neu-inset' : 'neu-button'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="neu-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm neu-inset px-3 py-1 rounded-full text-muted-foreground">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-primary">₹{product.price}<span className="text-sm font-normal text-muted-foreground">/day</span></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-muted'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${product.available ? 'text-accent' : 'text-destructive'}`}>
                      <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-accent' : 'bg-destructive'}`} />
                      <span className="text-sm font-medium">
                        {product.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Rental Calculator */}
                <div className="neu-card p-6 mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Rental Calculator</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="neu-input w-full p-3 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="neu-input w-full p-3 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="neu-button w-10 h-10 flex items-center justify-center text-foreground"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg font-medium text-foreground px-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="neu-button w-10 h-10 flex items-center justify-center text-foreground"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {calculateTotal() > 0 && (
                    <div className="neu-inset p-4 rounded-xl mb-4">
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                        <span>Duration: {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                        <span>₹{product.price} × {quantity} × {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-primary">
                        <span>Total:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 neu-button px-6 py-3 text-foreground hover:text-primary-foreground hover:bg-primary font-medium"
                      onClick={handleAddToCart}
                      disabled={!product.available}
                    >
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 neu-button px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      onClick={handleRentNow}
                      disabled={!product.available}
                    >
                      Rent Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
          >
            {/* Features */}
            <div className="neu-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="neu-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    className="flex justify-between items-center py-2 border-b border-border"
                  >
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
