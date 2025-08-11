import express from 'express';
import SupabaseService from '../services/supabase';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();
const supabase = SupabaseService.getClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      available = true,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = supabase
      .from('products')
      .select('*');

    // Apply filters
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (minPrice) {
      query = query.gte('price_per_day', Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price_per_day', Number(maxPrice));
    }

    if (available === 'true') {
      query = query.gt('quantity_available', 0).eq('status', 'active');
    }

    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum - 1;

    query = query.range(start, end);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Transform data to match frontend expectations
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price_per_day,
      category: product.category,
      description: product.description,
      image: product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      available: product.quantity_available > 0 && product.status === 'active',
      features: product.features ? JSON.parse(product.features) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      rating: product.rating || 4.5,
      reviews: product.review_count || 0
    })) || [];

    res.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          total: count || 0,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil((count || 0) / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Products route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform data to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price_per_day,
      category: product.category,
      description: product.description,
      images: product.image_url ? [
        product.image_url,
        product.image_url,
        product.image_url,
        product.image_url
      ] : [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
      ],
      available: product.quantity_available > 0 && product.status === 'active',
      features: product.features ? JSON.parse(product.features) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      rating: product.rating || 4.5,
      reviews: product.review_count || 0,
      quantityAvailable: product.quantity_available
    };

    res.json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Product detail route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null);

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    const uniqueCategories = [...new Set(categories?.map(item => item.category))].filter(Boolean);

    res.json({
      success: true,
      data: uniqueCategories
    });
  } catch (error) {
    console.error('Categories route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check product availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, quantity = 1 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('quantity_available, status')
      .eq('id', id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check for overlapping rentals
    const { data: overlappingRentals, error: rentalError } = await supabase
      .from('rental_orders')
      .select('id')
      .eq('product_id', id)
      .in('status', ['confirmed', 'active'])
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    if (rentalError) {
      console.error('Error checking rentals:', rentalError);
      return res.status(500).json({ error: 'Failed to check availability' });
    }

    const bookedQuantity = overlappingRentals?.length || 0;
    const availableQuantity = product.quantity_available - bookedQuantity;
    const requestedQuantity = Number(quantity);

    res.json({
      success: true,
      data: {
        available: availableQuantity >= requestedQuantity && product.status === 'active',
        availableQuantity,
        requestedQuantity,
        overlappingRentals: bookedQuantity
      }
    });
  } catch (error) {
    console.error('Availability check route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
