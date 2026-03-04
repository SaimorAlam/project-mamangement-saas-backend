import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Priority } from '../contants';

// export class InfrastructureNodeDto {
//   @ApiProperty({
//     description: 'ProgramId this just remember of our program',
//     example: '0699c9bd-dc72-437e-b4cd-f40844ef5579',
//   })
//   @IsUUID()
//   programId: string;

//   @ApiProperty({
//     description: 'Project ID this node belongs to',
//     example: '0699c9bd-dc72-437e-b4cd-f40844ef5579',
//   })
//   @IsUUID()
//   projectId: string;

//   @ApiPropertyOptional({
//     description: 'Parent node ID (null for top-level nodes)',
//     example: 'c1d2e3f4-a5b6-7890-abcd-112233445566',
//   })
//   @IsOptional()
//   @IsUUID()
//   parentId?: string | null;

//   @ApiProperty({
//     description: 'Task name of the node',
//     example: 'Foundation Work',
//   })
//   @IsString()
//   taskName: string;

//   @IsString()
//   @IsOptional()
//   slug: string;

//   @ApiProperty({
//     description: 'Task duration (days)',
//     example: 10,
//     default: 0,
//   })
//   @IsInt()
//   @Min(0)
//   @IsOptional()
//   duration: number;

//   @ApiProperty({
//     description: 'Start date of the task',
//     example: '2025-01-01T00:00:00.000Z',
//   })
//   @IsDateString()
//   @IsOptional()
//   startDate: Date;

//   @ApiProperty({
//     description: 'Finish date of the task',
//     example: '2025-01-10T00:00:00.000Z',
//   })
//   @IsDateString()
//   @IsOptional()
//   finishDate: Date;

//   @ApiProperty({
//     description: 'Priority of the task',
//     example: 'NONE',
//   })
//   @IsString()
//   @IsOptional()
//   priority: Priority;

//   @ApiProperty({
//     description: 'Actual hours spent',
//     example: 12.5,
//     default: 0,
//   })
//   @IsNumber()
//   @IsOptional()
//   actualHour: number;

//   @ApiProperty({
//     description: 'Planned hours',
//     example: 15,
//     default: 0,
//   })
//   @IsNumber()
//   @IsOptional()
//   plannedHour: number;

//   @ApiProperty({
//     description: 'Planned cost',
//     example: 25000,
//     default: 0,
//   })
//   @IsNumber()
//   @IsOptional()
//   plannedCost: number;

//   @ApiProperty({
//     description: 'Planned resource cost',
//     example: 12000,
//     default: 0,
//   })
//   @IsNumber()
//   @IsOptional()
//   plannedResourceCost: number;

//   @ApiPropertyOptional({
//     description: 'Progress value (only for leaf nodes)',
//     example: 0.6,
//   })
//   @IsOptional()
//   @IsNumber()
//   progress?: number | null;

//   @ApiProperty({
//     description: 'Computed progress (auto-calculated)',
//     example: 0.45,
//     default: 0,
//   })
//   @IsNumber()
//   @IsOptional()
//   computedProgress: number;

//   @ApiProperty({
//     description: 'Weight of the node in progress calculation',
//     example: 1,
//     default: 1,
//   })
//   @IsNumber()
//   @IsOptional()
//   weight: number;

//   @ApiProperty({
//     description: 'Indicates whether the node is a leaf',
//     example: true,
//     default: true,
//   })
//   @IsBoolean()
//   @IsOptional()
//   isLeaf: boolean;
// }

// export class UpdateInfrastructureNodeDto extends PartialType(
//   InfrastructureNodeDto,
// ) {}


// infrastructure.node.dto.ts
export class InfrastructureNodeDto {
  @ApiProperty({
    description: 'Project ID this node belongs to',
    example: '0699c9bd-dc72-437e-b4cd-f40844ef5579',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Program ID this node belongs to',
    example: '0699c9bd-dc72-437e-b4cd-f40844ef5579',
  })
  @IsString()
  @IsNotEmpty()
  programId: string;

  @ApiProperty({
    description: 'Task name of the node',
    example: 'Foundation Work',
  })
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @ApiPropertyOptional({
    description: 'Type of node (optional)',
    example: 'milestone',
  })
  @IsOptional()
  @IsString()
  nodeType?: string;

  @ApiPropertyOptional({
    description: 'Parent node ID (null for top-level nodes)',
    example: 'c1d2e3f4-a5b6-7890-abcd-112233445566',
  })
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Progress value (can be array or JSON string)',
    example: '[0.2, 0.5, 0.3]',
  })
  @IsOptional()
  progress?: any[] | string;

  @ApiPropertyOptional({
    description: 'Weight of the node in progress calculation',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Task duration in days',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Start date of the task',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Finish date of the task',
    example: '2025-01-10T00:00:00.000Z',
  })
  @IsOptional()
  finishDate?: Date;

  @ApiPropertyOptional({
    description: 'Priority of the task',
    example: 'HIGH',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Actual hours spent on task',
    example: 12.5,
  })
  @IsOptional()
  @IsNumber()
  actualHour?: number;

  @ApiPropertyOptional({
    description: 'Planned hours for the task',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  plannedHour?: number;

  @ApiPropertyOptional({
    description: 'Planned cost for the task',
    example: 25000,
  })
  @IsOptional()
  @IsNumber()
  plannedCost?: number;

  @ApiPropertyOptional({
    description: 'Planned resource cost for the task',
    example: 12000,
  })
  @IsOptional()
  @IsNumber()
  plannedResourceCost?: number;
}

export class UpdateInfrastructureNodeDto {
  @ApiPropertyOptional({
    description: 'Task name of the node',
    example: 'Foundation Work',
  })
  @IsOptional()
  @IsString()
  taskName?: string;

  @ApiPropertyOptional({
    description: 'Type of node (optional)',
    example: 'milestone',
  })
  @IsOptional()
  @IsString()
  nodeType?: string;

  @ApiPropertyOptional({
    description: 'Parent node ID (null for top-level nodes)',
    example: 'c1d2e3f4-a5b6-7890-abcd-112233445566',
  })
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Progress value (can be array or JSON string)',
    example: '[0.2, 0.5, 0.3]',
  })
  @IsOptional()
  progress?: any[] | string;

  @ApiPropertyOptional({
    description: 'Weight of the node in progress calculation',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Task duration in days',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Start date of the task',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Finish date of the task',
    example: '2025-01-10T00:00:00.000Z',
  })
  @IsOptional()
  finishDate?: Date;

  @ApiPropertyOptional({
    description: 'Priority of the task',
    example: 'HIGH',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Actual hours spent on task',
    example: 12.5,
  })
  @IsOptional()
  @IsNumber()
  actualHour?: number;

  @ApiPropertyOptional({
    description: 'Planned hours for the task',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  plannedHour?: number;

  @ApiPropertyOptional({
    description: 'Planned cost for the task',
    example: 25000,
  })
  @IsOptional()
  @IsNumber()
  plannedCost?: number;

  @ApiPropertyOptional({
    description: 'Planned resource cost for the task',
    example: 12000,
  })
  @IsOptional()
  @IsNumber()
  plannedResourceCost?: number;
}