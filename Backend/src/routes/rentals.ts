import express from 'express';
import SupabaseService from '../services/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const supabase = SupabaseService.getClient();

// Create a new rental order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, startDate, endDate, quantity = 1, notes } = req.body;
    const userId = req.user?.id; // Assuming auth middleware sets req.user

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Product ID, start date, and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    if (start < new Date()) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check availability
    const { data: overlappingRentals, error: rentalError } = await supabase
      .from('rental_orders')
      .select('id')
      .eq('product_id', productId)
      .in('status', ['confirmed', 'active'])
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    if (rentalError) {
      return res.status(500).json({ error: 'Failed to check availability' });
    }

    const bookedQuantity = overlappingRentals?.length || 0;
    const availableQuantity = product.quantity_available - bookedQuantity;

    if (availableQuantity < quantity) {
      return res.status(400).json({ 
        error: `Only ${availableQuantity} units available for the selected period` 
      });
    }

    // Calculate total price
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = days * product.price_per_day * quantity;

    // Create rental order
    const { data: rentalOrder, error } = await supabase
      .from('rental_orders')
      .insert({
        user_id: userId,
        product_id: productId,
        start_date: startDate,
        end_date: endDate,
        quantity,
        unit_price: product.price_per_day,
        total_amount: totalAmount,
        status: 'pending',
        notes
      })
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create rental order' });
    }

    res.status(201).json({
      success: true,
      data: {
        id: rentalOrder.id,
        productId: rentalOrder.product_id,
        startDate: rentalOrder.start_date,
        endDate: rentalOrder.end_date,
        quantity: rentalOrder.quantity,
        totalAmount: rentalOrder.total_amount,
        status: rentalOrder.status,
        createdAt: rentalOrder.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's rental orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { status, page = 1, limit = 10 } = req.query;

    let query = supabase
      .from('rental_orders')
      .select(`
        *,
        products:product_id (
          name,
          image_url,
          category
        )
      `)
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum - 1;

    const { data: rentals, error, count } = await query
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch rentals' });
    }

    const transformedRentals = rentals?.map(rental => ({
      id: rental.id,
      productId: rental.product_id,
      productName: rental.products?.name,
      productImage: rental.products?.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop',
      startDate: rental.start_date,
      endDate: rental.end_date,
      quantity: rental.quantity,
      dailyRate: rental.unit_price,
      totalAmount: rental.total_amount,
      status: rental.status,
      notes: rental.notes,
      createdAt: rental.created_at
    })) || [];

    res.json({
      success: true,
      data: {
        rentals: transformedRentals,
        pagination: {
          total: count || 0,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil((count || 0) / limitNum)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rental by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: rental, error } = await supabase
      .from('rental_orders')
      .select(`
        *,
        products:product_id (
          name,
          image_url,
          category,
          description
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    const transformedRental = {
      id: rental.id,
      productId: rental.product_id,
      productName: rental.products?.name,
      productImage: rental.products?.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop',
      startDate: rental.start_date,
      endDate: rental.end_date,
      quantity: rental.quantity,
      dailyRate: rental.unit_price,
      totalAmount: rental.total_amount,
      status: rental.status,
      notes: rental.notes,
      createdAt: rental.created_at
    };

    res.json({
      success: true,
      data: transformedRental
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update rental order
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { startDate, endDate, quantity, notes, status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if rental exists and belongs to user
    const { data: existingRental, error: fetchError } = await supabase
      .from('rental_orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingRental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    if (existingRental.status === 'completed' || existingRental.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot update completed or cancelled rental' });
    }

    const updateData: any = {};

    if (startDate) updateData.start_date = startDate;
    if (endDate) updateData.end_date = endDate;
    if (quantity) updateData.quantity = quantity;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    // Recalculate total if dates or quantity changed
    if (startDate || endDate || quantity) {
      const start = new Date(startDate || existingRental.start_date);
      const end = new Date(endDate || existingRental.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const qty = quantity || existingRental.quantity;
      updateData.total_amount = days * existingRental.unit_price * qty;
    }

    const { data: updatedRental, error } = await supabase
      .from('rental_orders')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update rental' });
    }

    res.json({
      success: true,
      data: {
        id: updatedRental.id,
        startDate: updatedRental.start_date,
        endDate: updatedRental.end_date,
        quantity: updatedRental.quantity,
        totalAmount: updatedRental.total_amount,
        status: updatedRental.status,
        notes: updatedRental.notes
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel rental order
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: updatedRental, error } = await supabase
      .from('rental_orders')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error || !updatedRental) {
      return res.status(404).json({ error: 'Rental not found or cannot be cancelled' });
    }

    res.json({
      success: true,
      data: {
        id: updatedRental.id,
        status: updatedRental.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
