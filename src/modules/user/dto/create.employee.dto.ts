import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'; // Use OmitType
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { UserHelperDto } from './user.dto';

export enum RestrictedRole {
  VIEWER = 'VIEWER',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

// We wrap UserHelperDto with OmitType to remove the 'password' field
export class CreateStaffEmployeeDto extends OmitType(UserHelperDto, ['password'] as const) {

  @ApiPropertyOptional({
    type: [String],
    example: ['Civil Eng', 'Architect'],
    description: 'List of skills the manager has',
  })
  @IsOptional()               
  @IsArray()                   
  @IsString({ each: true })     
  skills?: string[];

    @ApiPropertyOptional({
        example: 'Responsible for managing infrastructure projects',
        description: 'Program or role description',
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        example: '2025-10-11',
        description: 'The date the manager joined the company',
    })
    @IsDateString()
    joinedDate: string;

    @ApiPropertyOptional({
        type: [String],
        example: ['projectID_1', 'projectID_2'],
        description: 'List of assigned projects',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    projects?: string[];

    @ApiProperty({
        enum: RestrictedRole,
        example: RestrictedRole.EMPLOYEE,
        description: 'The role assigned to the user (Viewer, Employee, or Manager only)',
    })
    @IsEnum(RestrictedRole)
    role: RestrictedRole;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether to send a welcome email with login link',
    })
    @IsBoolean()
    @IsOptional()
    sendWelcomeEmail?: boolean;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether to notify the project manager about this new manager',
    })
    @IsBoolean()
    @IsOptional()
    notifyProjectManager?: boolean;
}