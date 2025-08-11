import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRentalDto, UpdateRentalDto, RentalQueryDto } from './rental.dto';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRentalDto) {
    const { productId, startDate, endDate, quantity, notes } = dto;
    
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('End date must be after start date');
    }

    if (start < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Check availability
    const overlappingRentals = await this.prisma.rentalLine.findMany({
      where: {
        productId,
        rentalOrder: {
          status: { in: ['confirmed', 'active'] },
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: start } }
          ]
        }
      }
    });

    const bookedQuantity = overlappingRentals.reduce((sum, line) => sum + line.quantity, 0);
    const availableQuantity = product.quantityAvailable - bookedQuantity;

    if (availableQuantity < quantity) {
      throw new BadRequestException(`Only ${availableQuantity} units available for the selected period`);
    }

    // Calculate total price
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = days * product.pricePerDay * quantity;

    // Create rental order
    const rentalOrder = await this.prisma.rentalOrder.create({
      data: {
        userId,
        startDate: start,
        endDate: end,
        totalAmount,
        status: 'pending',
        notes,
        rentalLines: {
          create: {
            productId,
            quantity,
            unitPrice: product.pricePerDay,
            totalPrice: totalAmount
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        rentalLines: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true
              }
            }
          }
        }
      }
    });

    return rentalOrder;
  }

  async findAll(userId: string, query: RentalQueryDto = {}) {
    const { status, startDate, endDate, page = 1, limit = 10 } = query;
    
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({ startDate: { gte: new Date(startDate) } });
      }
      if (endDate) {
        where.AND.push({ endDate: { lte: new Date(endDate) } });
      }
    }

    const skip = (page - 1) * limit;

    const [rentals, total] = await Promise.all([
      this.prisma.rentalOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          rentalLines: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  category: true,
                  pricePerDay: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.rentalOrder.count({ where })
    ]);

    return {
      rentals,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string, userId: string) {
    const rental = await this.prisma.rentalOrder.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true
          }
        },
        rentalLines: {
          include: {
            product: {
              include: {
                facility: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    return rental;
  }

  async update(id: string, userId: string, dto: UpdateRentalDto) {
    const rental = await this.findById(id, userId);

    if (rental.status === 'completed' || rental.status === 'cancelled') {
      throw new BadRequestException('Cannot update completed or cancelled rental');
    }

    const updateData: any = {};

    if (dto.startDate) {
      const startDate = new Date(dto.startDate);
      if (startDate < new Date()) {
        throw new BadRequestException('Start date cannot be in the past');
      }
      updateData.startDate = startDate;
    }

    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    // Recalculate total if dates changed
    if (updateData.startDate || updateData.endDate) {
      const start = updateData.startDate || rental.startDate;
      const end = updateData.endDate || rental.endDate;
      
      if (start >= end) {
        throw new BadRequestException('End date must be after start date');
      }

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const unitPrice = rental.rentalLines[0]?.unitPrice || 0;
      const quantity = rental.rentalLines[0]?.quantity || 1;
      updateData.totalAmount = days * unitPrice * quantity;

      // Update rental line total as well
      if (rental.rentalLines[0]) {
        await this.prisma.rentalLine.update({
          where: { id: rental.rentalLines[0].id },
          data: { totalPrice: updateData.totalAmount }
        });
      }
    }

    const updatedRental = await this.prisma.rentalOrder.update({
      where: { id },
      data: updateData,
      include: {
        rentalLines: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true
              }
            }
          }
        }
      }
    });

    return updatedRental;
  }

  async cancel(id: string, userId: string) {
    return this.update(id, userId, { status: 'cancelled' });
  }

  async confirm(id: string, userId: string) {
    return this.update(id, userId, { status: 'confirmed' });
  }

  async complete(id: string, userId: string) {
    return this.update(id, userId, { status: 'completed' });
  }
}
