import { IsString, IsEnum, IsOptional, IsJSON, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ChartName, ChartStatus } from 'generated/prisma';
import { CreateBarChartDto } from './barchartDto';
import { Create_Hr_BarChartDto } from './hr_bar_chartDto';
import { Create_Pi_ChartDto } from './pi_ChartDto';
import { HeatMap_ChartDto } from './heatMap_chartDto';
import { Area_ChartDto } from './areaChart.dto';
import { MultiAxis_ChartDto } from './multiAxisChart.dto';
import { Column_ChartDto } from './columnChart.dto';
import { Stacker_Bar_ChartDto } from './stackerbarchart.dto';
import { Pareto_ChartDto } from './peretoChart.dto';
import { Histogram_ChartDto } from './histrogram.dto';
import { SolidGauge_ChartDto } from './solideGauge.dto';
import { Funnel_ChartDto } from './funelChart.dto';
import { WaterFall_ChartDto } from './waterfall.dto';
import { Radar_ChartDto } from './radarChart.dto';
import { DOUGHNUT_ChartDto } from './dougnnut.dto';
import { CandleStick_ChartDto } from './candelsick.dto';
import { Scatter_ChartDto } from './scatter.dto';

export class CreateChartDto extends IntersectionType(
  CreateBarChartDto,
  Create_Hr_BarChartDto,
  Create_Pi_ChartDto,
  HeatMap_ChartDto,
  Area_ChartDto,
  MultiAxis_ChartDto,
  Column_ChartDto,
  Stacker_Bar_ChartDto,
  Pareto_ChartDto,
  Histogram_ChartDto,
  SolidGauge_ChartDto,
  Funnel_ChartDto,
  WaterFall_ChartDto,
  Radar_ChartDto,
  DOUGHNUT_ChartDto,
  CandleStick_ChartDto,
  Scatter_ChartDto


) {
  @ApiProperty({
    example: 'Weekly Sleep Pattern',
    description: 'Title of the chart.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: ChartStatus.INACTIVE,
    enum: ChartStatus,
  })
  @IsEnum(ChartStatus)
  status: ChartStatus;

  @ApiProperty({
    example: ChartName.BAR,
    enum: ChartName,
  })
  @IsEnum(ChartName)
  category: ChartName;

  @ApiProperty({
    example: "[[\"Day\",\"absent\",\"late\",\"present\"],[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]",
  })
  @IsJSON()
  xAxis: string;

  @ApiProperty({
    example: "[[\"Day\",\"absent\",\"late\",\"present\"],[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]",
  })
  @IsOptional()
  @IsJSON()
  yAxis?: string;

  @ApiProperty({
    example: "[[\"Day\",\"absent\",\"late\",\"present\"],[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]",
    required: false,
  })
  @IsOptional()
  @IsJSON()
  zAxis?: string;

  @ApiProperty({
    example: 'project uuid',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    example: 'parentId uuid',
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  rootchart?: boolean;

  @ApiProperty({
    example: 'parentId uuid',
  })
  @IsOptional()
  roottitle?: string

  @ApiProperty({
    example: 'group title',
  })
  @IsString()
  grouptitle: string
}




