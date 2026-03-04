import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';
import { CreateStaffEmployeeDto } from './create.employee.dto';

export class UpdateStaffEmployeeDto extends PartialType(CreateStaffEmployeeDto) {
  
  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'The active status of the user account',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    example: 'NewSecurePass123!',
    description: 'Manually reset the user password',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}