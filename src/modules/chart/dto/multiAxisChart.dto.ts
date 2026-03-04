import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,

    ValidateNested,
    IsOptional,
    IsInt,
} from 'class-validator';
import { WidgetDto } from './widgets.dto';



export class MultiAxis_ChartDto {

    @IsOptional()
    @IsInt()
    numberOfDataset?: number;

   
    @IsOptional()
    @IsInt()
    firstFiledDataset?: number;

    @IsOptional()
    @IsInt()
    lastFiledDAtaset?: number;
    
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WidgetDto)
    widgets?: WidgetDto[];
}