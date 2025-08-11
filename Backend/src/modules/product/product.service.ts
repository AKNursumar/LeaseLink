import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto = {}) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      available,
      page = 1,
      limit = 20
    } = query;

    const where: any = {};

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerDay = {};
      if (minPrice !== undefined) where.pricePerDay.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerDay.lte = maxPrice;
    }

    if (available !== undefined) {
      if (available) {
        where.quantityAvailable = { gt: 0 };
        where.status = 'active';
      } else {
        where.OR = [
          { quantityAvailable: { lte: 0 } },
          { status: { not: 'active' } }
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          facility: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      products: products.map(product => ({
        ...product,
        available: product.quantityAvailable > 0 && product.status === 'active',
        specifications: product.specifications ? JSON.parse(product.specifications) : null,
        features: product.features ? JSON.parse(product.features) : null
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true
          }
        },
        rentalLines: {
          include: {
            rentalOrder: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calculate availability based on current rentals
    const activeRentals = product.rentalLines.filter(line => 
      line.rentalOrder.status === 'active' || line.rentalOrder.status === 'confirmed'
    );
    
    const rentedQuantity = activeRentals.reduce((sum, line) => sum + line.quantity, 0);
    const availableQuantity = product.quantityAvailable - rentedQuantity;

    return {
      ...product,
      available: availableQuantity > 0 && product.status === 'active',
      availableQuantity,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      features: product.features ? JSON.parse(product.features) : null,
      activeRentals: activeRentals.length
    };
  }

  async create(dto: CreateProductDto) {
    const productData = {
      ...dto,
      specifications: dto.specifications ? JSON.stringify(dto.specifications) : null,
      features: dto.features ? JSON.stringify(dto.features) : null,
      quantityAvailable: dto.quantityAvailable || 1,
      status: 'active'
    };

    const product = await this.prisma.product.create({
      data: productData,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    return {
      ...product,
      available: product.quantityAvailable > 0 && product.status === 'active',
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      features: product.features ? JSON.parse(product.features) : null
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);
    
    const updateData = {
      ...dto,
      specifications: dto.specifications ? JSON.stringify(dto.specifications) : undefined,
      features: dto.features ? JSON.stringify(dto.features) : undefined
    };

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    return {
      ...updatedProduct,
      available: updatedProduct.quantityAvailable > 0 && updatedProduct.status === 'active',
      specifications: updatedProduct.specifications ? JSON.parse(updatedProduct.specifications) : null,
      features: updatedProduct.features ? JSON.parse(updatedProduct.features) : null
    };
  }

  async remove(id: string) {
    await this.findById(id); // Check if exists
    
    // Soft delete by updating status
    return this.update(id, { status: 'deleted' });
  }

  async getCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { status: 'active' }
    });

    return categories.map(item => item.category).filter(Boolean);
  }

  async checkAvailability(id: string, startDate: Date, endDate: Date, quantity: number = 1) {
    const product = await this.findById(id);
    
    // Get all confirmed/active rentals that overlap with the requested period
    const overlappingRentals = await this.prisma.rentalLine.findMany({
      where: {
        productId: id,
        rentalOrder: {
          status: { in: ['confirmed', 'active'] },
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } }
          ]
        }
      },
      include: {
        rentalOrder: {
          select: {
            startDate: true,
            endDate: true,
            status: true
          }
        }
      }
    });

    const bookedQuantity = overlappingRentals.reduce((sum, line) => sum + line.quantity, 0);
    const availableForPeriod = product.quantityAvailable - bookedQuantity;

    return {
      available: availableForPeriod >= quantity,
      availableQuantity: availableForPeriod,
      requestedQuantity: quantity,
      overlappingRentals: overlappingRentals.length
    };
  }
}
