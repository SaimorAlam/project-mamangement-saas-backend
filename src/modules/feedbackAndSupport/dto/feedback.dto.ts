import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateFeedbackDto {
    @ApiProperty({ example: 'Great interface!' })
    @IsString()       
    @IsNotEmpty()     
    message: string;

    @ApiPropertyOptional({ 
        type: 'array', 
        items: { type: 'string', format: 'binary' }, 
        description: 'Upload up to 5 files' 
    })
    @IsOptional()     
    @IsArray()         
    file?: any[];
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}

export class CreateSupportDto extends CreateFeedbackDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()       
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()        
    @IsNotEmpty()
    phoneNumber: string;
}

export class UpdateSupportDto extends PartialType(CreateSupportDto) {}