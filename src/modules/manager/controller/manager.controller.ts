import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { ChartService } from '../../chart/service/chart.service';
import { ManagerService } from '../service/manager.service';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SubmittedStatus } from 'generated/prisma';
import { GetSubmissionStatusQueryDto } from 'src/modules/employee/dto/get-submission-status.dto';
import { UpdateSubmissionStatusDto } from '../dto/UpdateSubmissionStatusDto';
import { ProgramDashboardQueryDto } from '../dto/Manager-program-dashboardDto';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagerController {
  constructor(
    private readonly chartService: ChartService,
    private readonly managerService: ManagerService,
  ) { }

  @Get('dashboard')
  @Roles('MANAGER')
  async getManagerDashboard(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getManagerDashboard(managerId);
  }

  @Get('projects/live')
  @Roles('MANAGER')
  async getLiveProjects(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getLiveProjects(managerId);
  }

  @Get('projects/overdue')
  @Roles('MANAGER')
  async getOverdueProjects(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getOverdueProjects(managerId);
  }

  @Get('submissions/returns')
  @Roles('MANAGER')
  async getSubmissionReturns(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getSubmissionReturns(managerId);
  }

  @Get('performance')
  @Roles('MANAGER')
  async getManagerPerformance(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getManagerPerformance(managerId);
  }

  @Get('charts/submission-status')
  @Roles('MANAGER')
  async getSubmissionStatusChartData(
    @Req() req: RequestWithUser,
    @Query('period') period: string,
  ) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return await this.chartService.getManagerSubmissionStatusChartData(
      managerId,
      period,
    );
  }

  // @Get('charts/top-overdue-projects')
  // @Roles('MANAGER')
  // async getTopOverdueProjectsChartData(@Req() req: RequestWithUser) {
  //   const managerId = req.user.managerId;
  //   if (!managerId) {
  //     throw new UnauthorizedException('Manager ID not found in token');
  //   }
  //   return await this.chartService.getManagerTopOverdueProjectsChartData(
  //     managerId,
  //   );
  // }
  @Get('projects/top-overdue')
  @Roles('MANAGER')
  async getTopOverdue(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }

    const result = await this.managerService.getTopOverdueProjects(managerId);

    return {
      statusCode: 200,
      success: true,
      message: 'Top overdue projects fetched successfully',
      data: result,
    };
  }

  // @Get('submission-status')
  // @Roles('MANAGER')
  // async getSubmissionStatus(@Req() req: RequestWithUser) {
  //   const managerId = req.user.managerId;

  //   if (!managerId) {
  //     throw new UnauthorizedException('Employee ID not found in token');
  //   }

  //   const result = await this.managerService.getSubmissionStatus(managerId);

  //   return {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Submission status fetched successfully',
  //     data: result,
  //   };
  // }

  @Get('submission-status')
  @Roles('MANAGER')
  async getSubmissionStatus(
    @Req() req: RequestWithUser,
    @Query() query: GetSubmissionStatusQueryDto,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const now = new Date();

    const selectedMonth = query.month
      ? Number(query.month)
      : now.getMonth() + 1;
    const selectedYear = query.year ? Number(query.year) : now.getFullYear();

    const result = await this.managerService.getSubmissionStatus(
      managerId,
      selectedMonth,
      selectedYear,
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Submission status fetched successfully',
      data: result,
    };
  }
  @Get('projects/upcoming-deadlines')
  @Roles('MANAGER')
  async getUpcomingDeadlineProjects(
    @Req() req: RequestWithUser,
    @Query('days') days?: string,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const limitDays = days ? Number(days) : 8;

    return this.managerService.upcomingDeadlineProjects(managerId, limitDays);
  }
  @Get('project-dashboard')
  async getProjectManagerDashboard(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    return this.managerService.getProjectManagerDashboard(managerId);
  }

  // @Get('program-dashboard')
  // @Roles('MANAGER')
  // async getProgramDashboard(@Req() req: RequestWithUser) {
  //   const managerId = req.user.managerId;

  //   if (!managerId) {
  //     throw new UnauthorizedException('Manager ID not found in token');
  //   }

  //   // This service call returns the combined data for the UI image provided
  //   return this.managerService.getProgramDashboard(managerId);
  // }

  @Get('program-dashboard')
  @Roles('MANAGER')
  async getProgramDashboard(
    @Req() req: RequestWithUser,
    @Query() query: ProgramDashboardQueryDto,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    return this.managerService.getProgramDashboard(
      managerId,
      query.priority,
      query.search,
    );
  }

  @Get('all-manager-submission')
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Get all submissions for manager projects' })
  @ApiQuery({ name: 'status', required: false, enum: SubmittedStatus })
  @ApiQuery({ name: 'fromDate', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'toDate', required: false, example: '2025-01-31' })
  async managerSubmissions(
    @Req() req: RequestWithUser,
    @Query('status') status?: SubmittedStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const result = await this.managerService.getManagerSubmissions(
      managerId,
      status,
      fromDate,
      toDate,
    );

    return {
      statusCode: 200,
      success: true,
      message: 'All submissions fetched successfully',
      data: result,
    };
  }

  @Get('submissions')
  @Roles('MANAGER')
  @ApiQuery({ name: 'status', required: false, enum: SubmittedStatus })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async getSubmissions(
    @Req() req: RequestWithUser,
    @Query('status') status?: SubmittedStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const userId = req.user.managerId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    const submissions = await this.managerService.showSubmissionsData(
      userId,
      status,
      fromDate,
      toDate,
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Submissions fetched successfully',
      data: submissions,
    };
  }

  @Get('overview')
  @Roles('MANAGER')
  async getOverview(@Req() req: RequestWithUser) {
    const userId = req.user.managerId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    const overview = await this.managerService.showSubmissionsOverview(userId);
    return {
      message: 'overview successfully for submit status and overdue project',
      data: overview,
    };
  }

  // @Get('activity')
  // async getSubmissionActivity(@Req() req: RequestWithUser) {
  //   const userId = req.user.managerId;
  //   if (!userId) {
  //     throw new UnauthorizedException('User ID not found in token');
  //   }
  //   const data = await this.managerService.getSubmissionActivity(userId);
  //   return {
  //     message: 'activity fetch  successfully',
  //     data,
  //   };
  // }

  @Get('activity')
  async getSubmissionActivity(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const data = await this.managerService.getSubmissionActivity(managerId);

    return {
      message: 'Activity fetched successfully',
      data,
    };
  }

  @Delete(':id/delete-submission')
  async deleteSubmission(
    @Param('id') submissionId: string,
    @Req() req: RequestWithUser,
  ) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const result = await this.managerService.deleteSubmissionForManager(
      submissionId,
      managerId,
    );

    return {
      message: 'Submission deleted successfully',
      data: result,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of a submission by manager' })
  @ApiBody({ type: UpdateSubmissionStatusDto })
  async updateStatus(
    @Param('id') submissionId: string,
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateSubmissionStatusDto,
  ) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const result = await this.managerService.updateSubmissionStatus(
      submissionId,
      managerId,
      updateDto.status,
    );

    return {
      message: 'Submission status changed successfully',
      data: result,
    };
  }

  @Get('global-search')
  @Roles('MANAGER')
  async globalSearch(
    @Req() req: RequestWithUser,
    @Query('query') query?: string,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const result = await this.managerService.globalSearch(
      managerId,
      query ?? '',
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Global search result fetched successfully',
      data: result.data,
    };
  }
}
