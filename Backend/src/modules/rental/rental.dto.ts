import { ApiProperty } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  startDate: string; // ISO date string

  @ApiProperty()
  endDate: string; // ISO date string

  @ApiProperty({ default: 1 })
  quantity: number;

  @ApiProperty({ required: false })
  notes?: string;
}

export class UpdateRentalDto {
  @ApiProperty({ required: false })
  startDate?: string;

  @ApiProperty({ required: false })
  endDate?: string;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  status?: string;
}

export class RentalQueryDto {
  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  startDate?: string;

  @ApiProperty({ required: false })
  endDate?: string;

  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  limit?: number;
}
