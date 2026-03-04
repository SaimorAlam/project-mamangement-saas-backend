import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  ValidateNested,
  IsOptional, // Add this
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger'; // Use the optional version

export class ShowWidgetDto {
  @ApiPropertyOptional({
    description: 'Name that will appear in the chart legend',
    example: 'Revenue 2024',
  })
  @IsOptional()
  @IsString()
  legendName?: string;

  @ApiPropertyOptional({
    description: 'Color of the dataset in hex format (with #)',
    example: '#3B82F6',
  })
  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateBarChartDto {
  @ApiPropertyOptional({
    description: 'Total number of datasets available',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  numberOfDataset?: number;

  @ApiPropertyOptional({
    description: 'Index of the first dataset to display (inclusive)',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  firstFieldDataset?: number;

  @ApiPropertyOptional({
    description: 'Index of the last dataset to display (inclusive)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  lastFieldDataset?: number;

  @ApiPropertyOptional({
    type: [ShowWidgetDto],
    description: 'List of datasets to show in the bar chart',
    minItems: 1,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ShowWidgetDto)
  widgets?: ShowWidgetDto[];


  @ApiPropertyOptional({
    description: 'if filter is used say that legent name ',
  })
  @IsOptional()
  @IsString()
  filter_By?: string;
}