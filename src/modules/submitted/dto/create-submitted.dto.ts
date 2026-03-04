// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator';

// export class CreateSubmittedDto {
//   @ApiProperty({
//     example: 'This is the information',
//     description: 'The information about the submission',
//   })
//   @IsString()
//   @IsNotEmpty()
//   information: string;

//   @ApiProperty({
//     example: 'This is the submission',
//     description: 'The submission content',
//   })
//   @IsString()
//   @IsNotEmpty()
//   submission: string;

//   @ApiProperty({
//     example: 'project-id',
//     description: 'The ID of the project',
//   })
//   @IsString()
//   @IsNotEmpty()
//   projectId: string;

//   @ApiProperty({
//     example: 'sheet-id',
//     description: 'The ID of the sheet',
//   })
//   @IsString()
//   @IsNotEmpty()
//   sheetId: string;

//   @ApiProperty({
//     example: ['cell-id-1', 'cell-id-2'],
//     description: 'An array of submitted cell IDs',
//   })
//   @IsArray()
//   @IsUUID('4', { each: true })
//   submiteCells: string[];
// }


import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsUUID, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class SubmittedElementDto {
  @ApiProperty({
    description: 'The ID of the target chart to be updated',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  chartId: string;
  @ApiPropertyOptional({
    description: 'Updated X-Axis data in Stringified JSON Matrix format',
    example: "[[\"Program A\",\"Station 1\",\"Station 2\",\"Station 3\"],[\"Project A\",0,0,0],[\"Project B\",0,0,0]]"
  })
  @IsString()
  xAxis: string;

  @ApiPropertyOptional({
    description: 'Updated Y-Axis data in Stringified JSON Matrix format',
    example: "[[\"Program A\",\"Station 1\",\"Station 2\",\"Station 3\"],[\"Project A\",0,0,0],[\"Project B\",0,0,0]]"
  })
  @IsOptional()
  @IsString()
  yAxis?: string;

  @ApiPropertyOptional({
    description: 'Updated Z-Axis data in Stringified JSON Matrix format',
    example: "[[\"Program A\",\"Station 1\",\"Station 2\",\"Station 3\"],[\"Project A\",0,0,0],[\"Project B\",0,0,0]]"
  })
  @IsOptional()
  @IsString()
  zAxis?: string;

}
export class CreateSubmittedDto {
  @ApiProperty({
    description: 'General information about the submission',
    example: 'Monthly performance report for Q1'
  })
  @IsString()
  @IsNotEmpty()
  information: string;

  @ApiProperty({
    description: 'Detailed submission notes or content',
    example: 'Draft submission for manager review'
  })
  @IsString()
  @IsNotEmpty()
  submission: string;

  @ApiProperty({
    description: 'ID of the project this submission belongs to',
    example: '7a2d8b1c-3e4f-5g6h-7i8j-9k0l1m2n3o4p'
  })
  @IsUUID()
  projectId: string;


  @ApiProperty({
    description: 'IP Address',
    example: '::1'
  })
  @IsString()
  ipAddress: string;

  @ApiProperty({
    type: [SubmittedElementDto],
    description: 'Array of chart data elements to be submitted for approval'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmittedElementDto)
  elements: SubmittedElementDto[];
}
