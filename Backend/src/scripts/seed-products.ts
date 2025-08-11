import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Professional Camera Kit",
    description: "Professional DSLR camera kit perfect for photography and videography projects. Includes camera body, multiple lenses, tripod, lighting equipment, and carrying case.",
    sku: "CAM001",
    pricePerDay: 6500,
    category: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
    quantityAvailable: 3,
    specifications: JSON.stringify({
      "Sensor": "Full-frame CMOS",
      "Resolution": "24.2 MP",
      "Video": "4K at 30fps",
      "Weight": "3.2 kg (complete kit)",
      "Condition": "Excellent"
    }),
    features: JSON.stringify([
      "Full-frame DSLR camera body",
      "24-70mm f/2.8 lens",
      "85mm f/1.8 portrait lens",
      "Professional tripod",
      "LED lighting kit",
      "Memory cards and batteries",
      "Protective carrying case"
    ]),
    status: "active"
  },
  {
    name: "Power Drill Set",
    description: "Professional power drill set with multiple bits and accessories. Perfect for construction, renovation, and DIY projects.",
    sku: "TOOL001",
    pricePerDay: 1800,
    category: "Tools",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
    quantityAvailable: 5,
    specifications: JSON.stringify({
      "Battery": "18V Lithium-ion",
      "Chuck Size": "13mm",
      "Torque": "65 Nm",
      "Weight": "1.8 kg",
      "Condition": "Excellent"
    }),
    features: JSON.stringify([
      "18V Lithium-ion battery",
      "Variable speed trigger",
      "20+1 torque settings",
      "LED work light",
      "Quick-change chuck",
      "Multiple drill bits included",
      "Durable carrying case"
    ]),
    status: "active"
  },
  {
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with latest graphics card and processor. Perfect for gaming, content creation, and professional work.",
    sku: "LAPTOP001",
    pricePerDay: 8500,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop",
    quantityAvailable: 2,
    specifications: JSON.stringify({
      "Processor": "Intel Core i7-12700H",
      "Graphics": "RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Storage": "1TB NVMe SSD",
      "Display": "15.6\" 144Hz",
      "Weight": "2.3 kg",
      "Condition": "Like New"
    }),
    features: JSON.stringify([
      "Intel Core i7 processor",
      "RTX 4060 graphics card",
      "16GB DDR5 RAM",
      "1TB NVMe SSD",
      "15.6\" 144Hz display",
      "RGB backlit keyboard",
      "Advanced cooling system"
    ]),
    status: "active"
  },
  {
    name: "DJ Mixer",
    description: "Professional DJ mixer with multiple channels and effects. Perfect for parties, events, and professional DJ performances.",
    sku: "AUDIO001",
    pricePerDay: 7200,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    quantityAvailable: 2,
    specifications: JSON.stringify({
      "Channels": "4 channels",
      "Effects": "Built-in reverb, delay, filter",
      "Connectivity": "USB, XLR, RCA",
      "Power": "External adapter",
      "Weight": "3.5 kg",
      "Condition": "Excellent"
    }),
    features: JSON.stringify([
      "4-channel mixer",
      "Built-in effects",
      "Crossfader with curve control",
      "3-band EQ per channel",
      "Cue monitoring",
      "USB connectivity",
      "Professional grade faders"
    ]),
    status: "active"
  },
  {
    name: "DSLR Camera",
    description: "High-quality DSLR camera perfect for photography enthusiasts and professionals. Includes standard lens, battery, charger, and memory card.",
    sku: "CAM002",
    pricePerDay: 4800,
    category: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop",
    quantityAvailable: 4,
    specifications: JSON.stringify({
      "Sensor": "24MP APS-C CMOS",
      "Lens": "18-55mm f/3.5-5.6",
      "Video": "1080p at 60fps",
      "Battery": "Li-ion rechargeable",
      "Weight": "1.2 kg",
      "Condition": "Excellent"
    }),
    features: JSON.stringify([
      "24MP APS-C sensor",
      "18-55mm kit lens",
      "Full HD video recording",
      "Built-in flash",
      "Multiple shooting modes",
      "Image stabilization",
      "WiFi connectivity"
    ]),
    status: "active"
  }
];

async function seedProducts() {
  try {
    // First, create a default facility if it doesn't exist
    let facility = await prisma.facility.findFirst();
    
    if (!facility) {
      facility = await prisma.facility.create({
        data: {
          name: "Main Rental Center",
          address: "123 Main Street, City, State 12345",
          phone: "+1-555-0123",
          email: "info@leaselink.com",
          operatingHours: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM"
        }
      });
      console.log(`Created facility: ${facility.name}`);
    }

    // Clear existing products
    await prisma.product.deleteMany();
    console.log('Cleared existing products');

    // Create sample products
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          facilityId: facility.id
        }
      });
      console.log(`Created product: ${product.name}`);
    }

    console.log('✅ Successfully seeded products!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedProducts();
