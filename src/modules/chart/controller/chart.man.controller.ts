import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
  Patch,
  Delete
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChartMainService } from '../service/chart.main.service';
import { ChartProgramBuilderService } from '../service/chart.programbuilder';
import { Roles } from 'src/common/jwt/roles.decorator';
import { CreateChartDto } from '../dto/create-chart.dto';
import { Role, ChartName } from 'generated/prisma';
import { UpdateMultipleChartsDto, UpdateSingleChartDto } from '../dto/update.data.dto';
import { CloneSingleChartDto } from '../dto/clone.dto';
import { ApplyTemplateDto } from '../dto/apply-template.dto';
import { CreateChartBuildDto } from '../dto/create-chart-build.dto';


@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard('jwt'))
export class ChartMainController {
  constructor(
    private readonly chartService: ChartMainService,
    private readonly chartProgramBuilderService: ChartProgramBuilderService
  ) { }

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a new chart' })
  async create(@Body() createChartDto: CreateChartDto) {
    const result = await this.chartService.createatfirstime(createChartDto);
    return {
      message: 'Chart created successfully',
      data: result,
    };
  }

  @Get('inactive') // Renamed for clarity: matches 'findAllInactive' logic
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Fetch all inactive charts' })
  async findAllInactive() {
    const result = await this.chartService.findAllInactive();
    return {
      message: 'All inactive charts fetched successfully',
      data: result,
    };
  }

  @Get('active') // Renamed for clarity: matches 'findAllActive' logic
  @ApiOperation({ summary: 'Fetch all active charts' })
  async findAllActive() {
    const result = await this.chartService.findAllActive();
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chart details by ID' })
  findOne(@Param('id') id: string) {
    return this.chartService.findOne(id);
  }

  @Get('specific-chart/:type/:id')
  @ApiOperation({ summary: 'Get specific chart details by type and ID' })
  getSpecificChart(@Param('id') id: string, @Param('type') type: ChartName) {
    return this.chartService.getSpecificChart(type, id);
  }

  @Get('findChildrenValue/:id')
  async samelevenode(@Param('id') id: string) {
    const result = await this.chartService.findsomelavelenode(id);
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }

  @Patch('updateChartValue/:id')
  async value(@Body() updateChartDto: UpdateSingleChartDto) {
    const result = await this.chartService.valuechageCalculations(updateChartDto.id, updateChartDto);
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }


  @Patch('bulk/value-change')
  async bulkValueChange(
    @Body() body: UpdateMultipleChartsDto,
  ) {
    return {
      success: true,
      message: 'Charts updated successfully',
      data: await this.chartService.bulkValueChangeCalculations(body),
    };
  }


  @Get('all-chart-history/:projectId')
  @Roles('CLIENT')
  async getchartHistoty(@Param('projectId') projectId: string) {
    const data = await this.chartService.showHistory(projectId)
    return data
  }


  @Post('store-template')
  @Roles('SUPERADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Store chart as a template' })
  async StoreTempleted(@Body() cloneChart: CloneSingleChartDto) {
    const result = await this.chartService.Storetempleted(cloneChart);
    return {
      message: 'Chart template stored successfully',
      data: result,
    };
  }

  @Post('apply-template')
  @Roles('SUPERADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Apply chart template to a project' })
  async applyTemplate(@Body() applyTemplateDto: ApplyTemplateDto) {
    const result = await this.chartService.applyTemplate(applyTemplateDto);
    return {
      message: 'Template applied successfully',
      data: result,
    };
  }

  @Post('create-chart-build')
  @Roles('SUPERADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create a chart build with value detect records' })
  async createChartBuild(@Body() dto: CreateChartBuildDto) {
    const result = await this.chartProgramBuilderService.create(dto);
    return {
      message: 'Chart build created successfully',
      data: result,
    };
  }

  @Get('program-builder/program/:programId')
  @ApiOperation({ summary: 'Get all program builder charts for a specific program' })
  async findByProgram(@Param('programId') programId: string) {
    const result = await this.chartProgramBuilderService.findAllByProgram(programId);
    return {
      message: 'Program builder charts fetched successfully',
      data: result,
    };
  }

  @Get('root/:projectId')
  async getRootCharts(
    @Param('projectId') projectId: string,
  ) {
    return {
      success: true,
      message: 'Root charts fetched successfully',
      data: await this.chartService.rootChart(projectId),
    };
  }


  @Get('onlylevechildren/:projectId')
  async getOnlyLevelChildren(@Param('projectId') projectId: string) {
    return {
      success: true,
      message: 'Only level children fetched successfully',
      data: await this.chartService.getOnlyLevelChildren(projectId),
    };
  }



  @Get('all-charts/:projectId')
  @ApiOperation({ summary: 'Get all charts by project ID' })
  async findAllByProject(@Param('projectId') projectId: string) {
    const result = await this.chartService.findAllByProject(projectId);
    return {
      message: 'All charts fetched successfully',
      data: result,
    };
  }


  @Delete('charttable/:id')
  async deleteChart(@Param('id') id: string) {
    return this.chartService.safeDeleteChart(id);
  }


}

