import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { ProgramService } from '../service/program.service';
import { CreateProgramDto } from '../dto/create-program.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { GetAllProgramsDto } from '../dto/get-all-programs.dto';
import { FindAllProjectsInProgramDto } from '../dto/find-all-projects-in-program.dto';
import { UpdateProgramNameDto } from '../dto/update-program.dto';
import { Request } from 'express';
import { SyncTagsDto } from '../dto/tag-program.dto';
import { ProgramProjectService } from '../service/programproject.services';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService,
              private readonly programProjectService: ProgramProjectService
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
    @Req() req: RequestWithUser,
  ) {
    const userid = req.user.clientId;

    return this.programService.create(createProgramDto, userid!);
  }


  @Get('all')
  async findAll(@Query() query: GetAllProgramsDto) {
    try {
      const data = await this.programService.findAll(query);
      return {
        message: 'Programs fetched successfully',
        data,
      };
    } catch (error) {
      console.error('Error in findAll controller:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('program-filter-by-user')
  async getMyPrograms(@Req() req: RequestWithUser) {
    return this.programService.getProgramsByLoggedInUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.programService.findOne(id);
    return {
      message: 'Program fetched successfully',
      data,
    };
  }

  @Get(':id/projects')
  async findAllProjectsByProgram(
    @Param('id') id: string,
    @Query() query: FindAllProjectsInProgramDto,
  ) {
    const data = await this.programProjectService.findAllProjectsByProgram(id, query);
    return {
      message: 'Projects fetched successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Patch(':id/name')
  async updateName(
    @Param('id') id: string,
    @Body() body: UpdateProgramNameDto,
    @Req() req: RequestWithUser,
  ) {
    const data = await this.programService.updateProgramName(
      id,
      body.programName,
    );
    return {
      message: 'Program name updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Put(':id/tags')
  async syncTags(
    @Param('id') id: string,
    @Body() body: SyncTagsDto,
  ) {
    const data = await this.programService.syncTags(id, body.tags);
    return {
      message: 'Tags synchronized successfully',
      data,
    };
  }
}
