import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RentalService } from './rental.service';
import { CreateRentalDto, UpdateRentalDto, RentalQueryDto } from './rental.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('rentals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rentals')
export class RentalController {
  constructor(private rentalService: RentalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rental order' })
  @ApiResponse({ status: 201, description: 'Rental order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async create(@GetUser() user: User, @Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(user.id, createRentalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user rentals' })
  @ApiResponse({ status: 200, description: 'Rentals retrieved successfully' })
  async findAll(@GetUser() user: User, @Query() query: RentalQueryDto) {
    return this.rentalService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rental by ID' })
  @ApiResponse({ status: 200, description: 'Rental retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async findById(@GetUser() user: User, @Param('id') id: string) {
    return this.rentalService.findById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rental order' })
  @ApiResponse({ status: 200, description: 'Rental updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async update(
    @GetUser() user: User, 
    @Param('id') id: string, 
    @Body() updateRentalDto: UpdateRentalDto
  ) {
    return this.rentalService.update(id, user.id, updateRentalDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel rental order' })
  @ApiResponse({ status: 200, description: 'Rental cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async cancel(@GetUser() user: User, @Param('id') id: string) {
    return this.rentalService.cancel(id, user.id);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: 'Confirm rental order' })
  @ApiResponse({ status: 200, description: 'Rental confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async confirm(@GetUser() user: User, @Param('id') id: string) {
    return this.rentalService.confirm(id, user.id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete rental order' })
  @ApiResponse({ status: 200, description: 'Rental completed successfully' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  async complete(@GetUser() user: User, @Param('id') id: string) {
    return this.rentalService.complete(id, user.id);
  }
}
