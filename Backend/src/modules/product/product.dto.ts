import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  pricePerDay: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  facilityId: string;

  @ApiProperty()
  quantityAvailable?: number;

  @ApiProperty()
  specifications?: string; // JSON string

  @ApiProperty()
  features?: string; // JSON string
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  pricePerDay?: number;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  quantityAvailable?: number;

  @ApiProperty({ required: false })
  specifications?: string;

  @ApiProperty({ required: false })
  features?: string;

  @ApiProperty({ required: false })
  status?: string;
}

export class ProductQueryDto {
  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false })
  minPrice?: number;

  @ApiProperty({ required: false })
  maxPrice?: number;

  @ApiProperty({ required: false })
  available?: boolean;

  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  limit?: number;
}
