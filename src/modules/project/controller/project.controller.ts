import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
  Req,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProjectStatusDto } from '../dto/update-project-status.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { RequestWithUser } from 'src/types/RequestWithUser';

@Controller('project')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  //  Create a new project
  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    const newProject = await this.projectService.create(createProjectDto);
    return {
      message: 'Project created successfully',
      project: newProject,
    };
  }

  // Get all projects (with pagination/filter)
  // project.controller.ts

// project.controller.ts

// project.controller.ts

@Get('all')
@ApiOperation({ summary: 'Get all projects assigned to the user' })
@ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
async findAll(
  @Query() query: FindAllProjectsDto,
  @Req() req: RequestWithUser
) {
  const userId = req.user.userId;
  const userRole = req.user.role;

  const allProjects = await this.projectService.findAllFull(query, userId, userRole);
  
  return {
    message: 'Projects retrieved successfully',
    projects: allProjects,
  };
}
  // Search projects by name
  @Get('search')
  @ApiOperation({ summary: 'Search projects by name' })
  @ApiResponse({ status: 200, description: 'Projects found successfully' })
  async searchByName(@Query() query: SearchProjectByNameDto) {
    const results = await this.projectService.searchByName(query);
    return {
      message: 'Projects found successfully',
      projects: results,
    };
  }

  // Get a single project by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(id);
    return {
      message: 'Project retrieved successfully',
      project,
    };
  }

  // Get all sheets for which project this sheet exits
  @Get(':id/sheets')
  @ApiOperation({ summary: 'Get all sheets for a project by project ID' })
  @ApiResponse({ status: 200, description: 'Sheets retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getSheets(@Param('id') id: string) {
    const result = await this.projectService.getSheets(id);
    return {
      message: 'Sheets retrieved successfully',
      data: result,
    };
  }

  // Update project status by his won id
  @Patch('status')
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Update the status of a project' })
  @ApiResponse({
    status: 200,
    description: 'Project status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateStatus(@Body() updateProjectStatusDto: UpdateProjectStatusDto) {
    const updatedProject = await this.projectService.updateProjectStatus(
      updateProjectStatusDto,
    );
    return {
      message: `Project status updated to ${updatedProject.status} successfully`,
      project: updatedProject,
    };
  }

  @Patch(':id')
  @Roles(Role.CLIENT)
  async updateProject(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const clientId = req.user.clientId;
    if (!clientId)
      throw new UnauthorizedException('Client ID not found in token');

    const result = await this.projectService.updateProject(id, dto);

    return {
      message: 'Project updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @Roles(Role.CLIENT)
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  @Delete('manager-project-softdelete/:id')
  softDelete(@Param('id') id: string) {
    return this.projectService.softDelete(id);
  }
}
