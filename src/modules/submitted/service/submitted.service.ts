import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmittedDto } from '../dto/create-submitted.dto';
import { UpdateSubmittedStatusDto } from '../dto/update-submitted-status.dto';
import { GetAllSubmissionsDto } from '../dto/get-all-submissions.dto';
import {
  paginate,
  PaginatedResult,
} from '../../utils/pagination/pagination.utils';
import { Prisma, Submitted, SubmittedStatus } from '../../../../generated/prisma';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';
import { length } from 'class-validator';
import { ChartMainService } from 'src/modules/chart/service/chart.main.service';


@Injectable()
export class SubmittedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly ChartMainService: ChartMainService
  ) { }

  async create(createSubmittedDto: CreateSubmittedDto, employeeId: string) {
    const { projectId, information, submission, elements } = createSubmittedDto;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        manager: { select: { id: true } },
        projectEmployees: {
          where: { employeeId: employeeId }
        }
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.projectEmployees.length === 0) {
      throw new ForbiddenException(
        `Access Denied: You are not assigned to project "${project.name}"`
      );
    }

    const chartIds = elements.map(el => el.chartId);
    const validCharts = await this.prisma.chartTable.findMany({
      where: {
        id: { in: chartIds },
        projectId: projectId,
      },
      select: { id: true }
    });

    if (validCharts.length !== chartIds.length) {
      const foundIds = validCharts.map(c => c.id);
      const missingIds = chartIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Charts not found in this project: ${missingIds.join(', ')}`);
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        return await tx.submitted.create({
          data: {
            information,
            submission,
            projectId,
            employeeId,
            status: SubmittedStatus.PENDING,
            elements: {
              create: elements.map((el) => ({
                chartId: el.chartId,
                xAxis: JSON.parse(el.xAxis),
                yAxis: el.yAxis ? JSON.parse(el.yAxis) : Prisma.JsonNull,
                zAxis: el.zAxis ? JSON.parse(el.zAxis) : Prisma.JsonNull,

              })),
            },
          },
          include: { elements: true },
        });
      });

      this.handleNotifications(project, employeeId).catch(() => null);

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create submission');
    }
  }


  private async handleNotifications(project: any, senderId: string) {
    const managerUserId = project.manager?.user?.id || project.manager?.userId;

    if (!managerUserId) return;
    const permission = await this.prisma.notificationPermissionManager.findUnique({
      where: { userId: managerUserId },
    });
    if (permission?.submittedProject) {
      await this.notificationService.create(
        {
          receiverIds: [managerUserId],
          projectId: project.id,
          context: `New submission for project: ${project.name}. Approval required to update charts.`,
          type: NotificationType.SHEET_UPDATE_REQUEST,
        },
        senderId
      );
    }
  }

  // async findAll(
  //   query: GetAllSubmissionsDto,
  //   employeeId: string,
  // ): Promise<PaginatedResult<Submitted>> {
  //   const { page = 1, limit = 10, search, status, startDate, endDate } = query;

  //   const where: WhereClause = { employeeId };

  //   if (search) {
  //     where.project = {
  //       name: {
  //         contains: search,
  //         mode: 'insensitive',
  //       },
  //     };
  //   }

  //   if (status) {
  //     where.status = status;
  //   }

  //   if (startDate && endDate) {
  //     where.createdAt = {
  //       gte: new Date(startDate),
  //       lte: new Date(endDate),
  //     };
  //   }

  //   return paginate<Submitted>(
  //     this.prisma,
  //     'submitted',
  //     { where },
  //     { page, limit },
  //   );
  // }
  async findAll(
    query: GetAllSubmissionsDto,
    authUserId: string,
    userRole: string,
  ): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, status, startDate, endDate } = query;

    const where: any = {};

    if (userRole !== 'CLIENT') {
      where.project = {
        OR: [
          { manager: { userId: authUserId } },
          { projectEmployees: { some: { employee: { userId: authUserId } } } },
          { projectViewers: { some: { viewer: { userId: authUserId } } } },
        ],
      };
    }

    if (search) {
      where.project = { ...where.project, name: { contains: search, mode: 'insensitive' } };
    }
    if (status) where.status = status;
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }


    const selectClause = {
      id: true,
      information: true,
      submission: true,
      status: true,
      createdAt: true,
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        }
      },
      employee: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        }
      },
      elements: true
    };

    return paginate<any>(
      this.prisma,
      'submitted',
      {
        where,
        select: selectClause
      },
      { page, limit },
    );
  }
  // async findOne(id: string, employeeId: string) {
  //   const submitted = await this.prisma.submitted.findUnique({
  //     where: { id },
  //     include: {
  //       employee: true,
  //       project: true,
  //     },
  //   });
  //   if (!submitted) {
  //     throw new NotFoundException(`Submission with ID ${id} not found`);
  //   }
  //   if (submitted.employeeId !== employeeId) {
  //     throw new UnauthorizedException(
  //       'You are not authorized to view this submission',
  //     );
  //   }
  //   return submitted;
  // }
  async findOne(id: string, authUserId: string, userRole: string) {
    const submitted = await this.prisma.submitted.findFirst({
      where: {
        id,
        ...(userRole !== 'CLIENT' && {
          project: {
            OR: [
              { manager: { userId: authUserId } },
              { projectEmployees: { some: { employee: { userId: authUserId } } } },
              { projectViewers: { some: { viewer: { userId: authUserId } } } },
            ],
          },
        }),
      },
      select: {
        id: true,
        information: true,
        submission: true,
        status: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            user: {
              select: {
                name: true,
                profileImage: true,
              },
            },
          },
        },
        elements: true,
      },
    });

    if (!submitted) {
      throw new NotFoundException('Submission not found or access denied');
    }

    return submitted;
  }

  async updateStatus(
    id: string,
    updateSubmittedStatusDto: UpdateSubmittedStatusDto,
    authUserId: string,
  ) {
    const { status } = updateSubmittedStatusDto;

    const result = await this.prisma.$transaction(async (tx) => {
      const submitted = await tx.submitted.findFirst({
        where: {
          id,
          project: {
            OR: [
              { manager: { userId: authUserId } },
              { program: { managerId: authUserId } },
              { program: { manager: { userId: authUserId } } }
            ]
          },
        },
        include: {
          elements: true,
          employee: { select: { id: true, userId: true } },
          project: { select: { id: true, name: true } },
        },
      });

      if (!submitted) {
        throw new UnauthorizedException(`Access denied. You are not authorized.`);
      }

      if (!submitted.employee) {
        throw new BadRequestException('Submission has no employee assigned.');
      }

      const { project, employee, elements } = submitted;

      const updatedSubmission = await tx.submitted.update({
        where: { id },
        data: { status },
      });

      if (status === SubmittedStatus.APPROVED) {

        await this.ChartMainService.bulkValueChangeCalculations({
          charts: elements.map(el => ({
            id: el.chartId,
            xAxis: JSON.stringify(el.xAxis),
            yAxis: el.yAxis ? JSON.stringify(el.yAxis) : undefined,
            zAxis: el.zAxis ? JSON.stringify(el.zAxis) : undefined,
          }))
        });
        // for (const element of elements) {
        //   await tx.chartTable.update({
        //     where: { id: element.chartId },
        //     data: {
        //       xAxis: (element.xAxis as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        //       yAxis: (element.yAxis as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        //       zAxis: (element.zAxis as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        //     },
        //   });
        // }



      }

      if (status === SubmittedStatus.REJECTED) {
        await tx.submissionReturn.upsert({
          where: { submittedId: id },
          update: { returnedAt: new Date() },
          create: { submittedId: id },
        });
      }


      const permission = await tx.notificationPermissionEmployee.findUnique({
        where: { userId: employee.userId! },
        select: { returnProject: true },
      });
      return { updatedSubmission, employee, project, permission };
    });


    const { updatedSubmission, employee, project, permission } = result;

    if (permission?.returnProject) {
      const message = status === SubmittedStatus.APPROVED
        ? `Your submission for project ${project.name} has been APPROVED.`
        : `Your submission for project ${project.name} has been REJECTED.`;


      this.notificationService.create(
        {
          receiverIds: [employee.userId!],
          projectId: project.id,
          context: message,
          type: NotificationType.SUBMISSION_UPDATED_STATUS,
        },
        authUserId,
      ).catch(err => console.error('Real-time notification failed:', err));
    }

    return {
      success: true,
      message: `Submission ${status.toLowerCase()} successfully`,
      data: updatedSubmission,
    };
  }

  async delete(id: string, employeeId: string) {
    const submitted = await this.prisma.submitted.findUnique({ where: { id } });
    if (!submitted) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    if (submitted.employeeId !== employeeId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this submission',
      );
    }
    await this.prisma.submitted.delete({
      where: { id },
    });
    return { message: 'Submission deleted successfully' };
  }

  async getMyReturnedSubmissions(employeeId: string) {
    return await this.prisma.submitted.findMany({
      where: {
        employeeId: employeeId,
        status: 'REJECTED',
      },
      select: {
        id: true,
        information: true,
        submission: true,
        status: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true
          }
        },
        submissionReturn: {
          select: {
            id: true,
            returnedAt: true,
          }
        },
        elements: {
          select: {
            id: true,
            chartId: true,
            xAxis: true,
            yAxis: true,
            zAxis: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }
}
