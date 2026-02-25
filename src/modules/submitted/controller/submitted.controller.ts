import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SubmittedService } from '../service/submitted.service';
import { CreateSubmittedDto } from '../dto/create-submitted.dto';
import { UpdateSubmittedStatusDto } from '../dto/update-submitted-status.dto';
import { GetAllSubmissionsDto } from '../dto/get-all-submissions.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { Role } from 'generated/prisma';
import { ApiOperation } from '@nestjs/swagger';

@Controller('submitted')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmittedController {
  constructor(private readonly submittedService: SubmittedService) { }

  @Post()
  @Roles('EMPLOYEE')
  async create(
    @Body() createSubmittedDto: CreateSubmittedDto,
    @Req() req: RequestWithUser,
  ) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const submission = await this.submittedService.create(
      createSubmittedDto,
      employeeId,
    );
    return {
      message: 'Submission created successfully',
      submission,
    };
  }


  @Get('all')
  async findAll(
    @Query() query: GetAllSubmissionsDto,
    @Req() req: RequestWithUser
  ) {
    const authUserId = req.user.userId;
    const userRole = req.user.role;

    return this.submittedService.findAll(query, authUserId, userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single submission by ID' })
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId, role } = req.user;

    const data = await this.submittedService.findOne(id, userId, role);

    return {
      message: 'Submission retrieved successfully',
      data,
    };
  }


  @Patch(':id/status')
  @Roles(Role.MANAGER)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSubmittedStatusDto: UpdateSubmittedStatusDto,
    @Req() req: RequestWithUser
  ) {

    const mangerId = req.user.managerId;
    if (!mangerId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const updatedSubmission = await this.submittedService.updateStatus(
      id,
      updateSubmittedStatusDto,
      mangerId,
    );
    return {
      message: 'Submission status updated successfully',
      submission: updatedSubmission,
    };
  }

  @Delete(':id')
  @Roles('EMPLOYEE')
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    await this.submittedService.delete(id, employeeId);
    return { message: 'Submission deleted successfully' };
  }


@Get('returns/my-submissions')
@ApiOperation({ summary: 'Get my rejected submissions using employeeId' })
async getMyReturns(@Req() req: RequestWithUser) {
  const employeeId = req.user.employeeId; 
  
  console.log("Fetching for Employee ID:", employeeId);

  const data = await this.submittedService.getMyReturnedSubmissions(employeeId as string);

  return {
    success: true,
    message: 'Returned submissions retrieved successfully',
    data,
  };
}
}
