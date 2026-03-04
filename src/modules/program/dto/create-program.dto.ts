import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Priority } from 'generated/prisma';


export class CreateProgramDto {
  @ApiProperty({ example: 'New Website Development' })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty({ example: '2025-10-12T05:19:26.155Z' })
  @IsISO8601()
  @IsNotEmpty()
  datetime: string;

  @ApiProperty({ example: 'Detailed description here...' })
  @IsString()
  @IsOptional()
  programDescription?: string;

  // @ApiProperty({ enum: Priority, example: Priority.MEDIUM })
  // @IsEnum(Priority)
  // @IsNotEmpty()
  // priority: Priority;

  @ApiPropertyOptional({ example: '2026-10-12T05:19:26.155Z' })
  @IsISO8601()
  @IsOptional()
  deadline?: string;
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the template to apply (optional)'
  })
  @IsUUID()
  @IsOptional() 
  templateId?: string; 

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  managerId: string;

  @ApiPropertyOptional({ example: 23.8103, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ example: 90.4125, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}