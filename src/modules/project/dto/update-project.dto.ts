// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsOptional,
//   IsString,
//   IsEnum,
//   IsNumber,
//   IsDateString,
//   IsArray,
// } from 'class-validator';
// import { Priority } from 'generated/prisma';

// export class UpdateProjectDto {
//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @ApiPropertyOptional({ enum: Priority })
//   @IsOptional()
//   @IsEnum(Priority)
//   priority?: Priority;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   deadline?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   startDate?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   projectCompleteDate?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNumber()
//   progress?: number;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   currentRate?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   budget?: string;

//   @ApiPropertyOptional({ type: Number })
//   @IsOptional()
//   @IsNumber()
//   latitude?: number;

//   @ApiPropertyOptional({ type: Number })
//   @IsOptional()
//   @IsNumber()
//   longitude?: number;

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   chartList?: string[];

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   managerId?: string;

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   addEmployeeIds?: string[];

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   removeEmployeeIds?: string[];
// }




import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsUUID,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Days, Priority, ProjectStatus, Share, UploadCycle } from 'generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateReminderDto } from 'src/modules/notification/dto/create-reminder.dto';

export class UpdateProjectDto extends CreateReminderDto {
  @ApiPropertyOptional({
    description: 'The name of the project',
    example: 'Project Alpha',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'URL-friendly unique identifier' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Calculated progress of the project (0-100)',
    type: Number,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  computedProgress?: number;

  @ApiPropertyOptional({
    description: 'The ID of the program this project belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  programId?: string;


  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the template to apply (optional)'
  })
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Deep dive into infrastructure scaling',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The priority level',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;


  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Share,
    default: Share.Only_Me,
  })
  @IsEnum(Share)
  @IsOptional()
  shareWith?: Share;

  @ApiPropertyOptional({
    description: 'The deadline for completion',
    type: Date,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline?: Date;

  @ApiPropertyOptional({
    description: 'The deadline for completion',
    type: Date,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateDate?: Date;



  @ApiPropertyOptional({
    description: 'The ID of the project manager',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({
    description: 'List of viewer IDs to be linked via ProjectViewer',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  viewerIds?: string[];

  @ApiPropertyOptional({
    description: 'List of employee IDs to be linked via ProjectEmployee',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  employeeIds?: string[];

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Manual progress override', minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @ApiPropertyOptional({ type: [String], description: 'List of chart identifiers' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chartList?: string[];

  @ApiPropertyOptional({ description: 'Current billing/resource rate' })
  @IsString()
  @IsOptional()
  currentRate?: string;

  @ApiPropertyOptional({ description: 'Total allocated budget' })
  @IsString()
  @IsOptional()
  budget?: string;


  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: 'object',
    additionalProperties: true,
    example: { department: 'Engineering', billable: true },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;


  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Days,
    default: [Days.Sun]
  })
  @IsEnum(Days, { each: true })
  @IsOptional()
  SelectDays?: Days[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  UploadData?: string;


  @ApiPropertyOptional({
    description: 'A list of specific selected dates for the project',
    type: [Date],
    example: ['2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z'],
  })
  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  selectDate?: Date[];

  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Days,
    default: [Days.Sun]
  })
  @IsEnum(Days, { each: true })
  @IsOptional()
  workingDay?: Days[];


  @IsOptional()
  sortName?: string


  @IsOptional()
  location?: string

  @ApiPropertyOptional({
    description: 'The initial status of the project',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;


}
