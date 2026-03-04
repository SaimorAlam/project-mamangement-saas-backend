import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  QueryActivityDto,
  ActivityResponseDto,
  CreateActivityDto,
} from '../dto';
import { CsvHelper } from '../utils/csv.helper';
import { ActivityQueryBuilder } from '../utils/query-builder.helper';
import { ActivityMapper } from '../utils/activity-mapper.helper';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';
// import { ActivityValidator } from '../utils/activity-validator.helper';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) { }


  async getActivities(query: QueryActivityDto): Promise<ActivityResponseDto> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = ActivityQueryBuilder.buildWhereClause(query);

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
          project: { select: { name: true } },
        },
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      data: activities.map(ActivityMapper.mapToDto),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getActivityById(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
        project: { select: { name: true } },
      },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return ActivityMapper.mapToDto(activity);
  }

  async getUserActivities(
    userId: string,
    query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    const { page = 1, limit = 20, includeIp = false } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...ActivityQueryBuilder.buildWhereClause(query, false),
      userId,
    };

    const [activities, total, user] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: { project: { select: { name: true } } },
      }),
      this.prisma.activity.count({ where }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, profileImage: true, role: true },
      }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      data: activities.map((a) =>
        ActivityMapper.mapUserActivityToDto(a, includeIp),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.profileImage || "",
          role: user.role,
        },
      },
    };
  }

  async exportActivities(query: QueryActivityDto) {
    const where = ActivityQueryBuilder.buildWhereClause(query);

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10000,
      include: {
        user: { select: { name: true } },
        project: { select: { name: true } },
      },
    });

    if (activities.length === 0) {
      throw new NotFoundException('No activities found to export');
    }

    if (activities.length >= 10000) {
      throw new BadRequestException(
        'Too many records to export. Please apply more specific filters.',
      );
    }

    return activities.map((activity) => ({
      timestamp: activity.timestamp.toISOString(),
      user: activity.user.name,
      description: activity.description,
      projectName: activity.project.name,
      ipAddress: activity.ipAddress || '',
    }));
  }

  async exportActivitiesAsCsv(query: QueryActivityDto): Promise<string> {
    const activities = await this.exportActivities(query);
    return CsvHelper.generateActivitiesCsv(activities);
  }



  private async validateUserAndProject(userId: string, projectId: string) {
    const [user, project] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  }

  async createActivityForEmployee(
    employeeId: string,
    data: CreateActivityDto,
    ipAddress: string,
  ) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: { userId: true },
    });

    if (!employee?.userId) {
      throw new UnauthorizedException('Employee not linked to a user');
    }

    const userId = employee.userId;


    await this.validateUserAndProject(userId, data.projectId);

    const activity = await this.prisma.activity.create({
      data: { ...data, userId, ipAddress },
    });

    const clients = await this.prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true },
    });

    if (clients.length === 0) {
      console.warn('No client users found to send activity notification.');
    } else {
      const receiverIds = clients.map((c) => c.id);

      // console.log('Sending ACTIVITY_CREATED notification to clients:', receiverIds);

      await this.notificationService.create(
        {
          receiverIds,
          context: `A new activity was created by employee ${employeeId}.`,
          type: NotificationType.ACTIVITY_CREATED,
          projectId: data.projectId,
        },
        userId,
      );
    }

    return {
      message: 'Activity created successfully',
      activity,
    };
  }


}
