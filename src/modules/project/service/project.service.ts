import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, ProjectStatus } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { buildProjectFilter } from '../utils/project-filter-builder';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { ReminderService } from 'src/modules/notification/service/reminder';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { UpdateProjectStatusDto } from '../dto/update-project-status.dto';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';
import { slugify } from 'src/modules/infrastructure/functions';
import { InfrastructureRepository } from 'src/modules/infrastructure/infrastructure.repository';
import { SchedulerService } from 'src/modules/notification/service/scheduler.service';
import { Gateway } from 'src/modules/notification/service/notification.getway';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly reminderService: ReminderService,
    private readonly notificationService: NotificationService,
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly schedulerService: SchedulerService,
    private readonly gateway: Gateway

  ) { }


  // async create(createProjectDto: CreateProjectDto) {
  //   const {
  //     chartList,
  //     employeeIds,
  //     managerId,
  //     programId,
  //     message,
  //     repeatEvery,
  //     repeatOnDays,
  //     repeatOnDates,
  //     remindBefore,
  //     isActive,
  //     viewerIds,
  //     name,
  //     ...projectData
  //   } = createProjectDto;

  //   // --- Pre-validation before transaction ---
  //   const [program] = await Promise.all([
  //     // this.prisma.manager.findUnique({
  //     //   where: { id: managerId },
  //     //   include: { user: true },
  //     // }),
  //     this.prisma.program.findUnique({ where: { id: programId } }),
  //   ]);

  //   // if (!manager) {
  //   //   throw new NotFoundException(`Manager with ID "${managerId}" not found`);
  //   // }

  //   if (!program) {
  //     throw new NotFoundException(`Program with ID "${programId}" not found`);
  //   }

  //   // if (employeeIds && employeeIds.length > 0) {
  //   //   const employees = await this.prisma.employee.findMany({
  //   //     where: { id: { in: employeeIds } },
  //   //     include: { user: true },
  //   //   });

  //   //   if (employees.length !== employeeIds.length) {
  //   //     throw new NotFoundException('One or more employees not found.');
  //   //   }
  //   // }

  //   // --- Main transaction ---
  //   const project = await this.prisma.$transaction(async (tx) => {
  //     // ============= SABBIR ================ //
  //     // brefore creating our post just check with slug
  //     if (!name) throw new BadRequestException('Project name is required');

  //     const slug = slugify(name);
  //     if (await this.infrastructureRepo.findByProjectSlug(slug)) {
  //       throw new ConflictException('Project slug already exists');
  //     }
  //     // ============== SABBIR =============== //
  //     // Create the new project
  //     const newProject = await tx.project.create({
  //       data: {
  //         ...projectData,
  //         name,
  //         // ============== SABBIR =============== //
  //         slug,
  //         computedProgress: createProjectDto.computedProgress ?? 0,
  //         progress: createProjectDto.progress ?? 0,
  //         metadata: {},
  //         // ============== SABBIR =============== //

  //         manager: managerId ? { connect: { id: managerId } } : undefined,
  //         program: { connect: { id: programId } },
  //         projectEmployees: {
  //           create: employeeIds?.map((employeeId) => ({
  //             employee: { connect: { id: employeeId } },
  //           })),
  //         },

  //         projectViewers: viewerIds?.length
  //           ? {
  //               create: viewerIds.map((viewerId) => ({
  //                 viewer: { connect: { id: viewerId } },
  //               })),
  //             }
  //           : undefined,
  //       },
  //       include: {
  //         manager: { include: { user: true } },
  //         program: true,
  //         projectEmployees: {
  //           include: { employee: { include: { user: true } } },
  //         },
  //         projectViewers: { include: { viewer: { include: { user: true } } } },
  //       },
  //     });

  //     //create sheets for the project based on chartList
  //     if (chartList && chartList.length > 0) {
  //       const existingSheets = await tx.sheet.findMany({
  //         where: {
  //           projectId: newProject.id,
  //           chartId: { in: chartList },
  //         },
  //         select: { chartId: true },
  //       });

  //       const existingChartIds = existingSheets.map((s) => s.chartId);

  //       const missingChartIds = chartList.filter(
  //         (chartId) => !existingChartIds.includes(chartId),
  //       );

  //       if (missingChartIds.length > 0) {
  //         await tx.sheet.createMany({
  //           data: missingChartIds.map((chartId) => ({
  //             name: 'My Sheet',
  //             chartId,
  //             projectId: newProject.id,
  //           })),
  //         });
  //       }
  //     }

  //     // Create reminder linked to the new project
  //     await this.reminderService.createReminderWithTx(tx, {
  //       message,
  //       repeatEvery,
  //       repeatOnDays,
  //       repeatOnDates,
  //       remindBefore,
  //       isActive,
  //       projectId: newProject.id,
  //     });

  //     return newProject;
  //   });

  //   try {
  //     if (!project.manager  || !project.manager.user) {
  //       throw new NotFoundException(
  //         'Manager or associated user not found for the project.',
  //       );
  //     }
  //     //send notification to manager and employees
  //     const receiverIds = [
  //       project.manager.user.id,
  //       ...(project.projectEmployees?.map((e) => {
  //         if (!e.employee || !e.employee.user) {
  //           throw new NotFoundException(
  //             'Employee or associated user not found for project employee record.',
  //           );
  //         }
  //         return e.employee.user.id;
  //       }) || []),
  //     ];

  //     const uniqueReceivers = [...new Set(receiverIds)];

  //     await this.notificationService.create(
  //       {
  //         receiverIds: uniqueReceivers,
  //         context: `A new project "${project.name}" has been created and assigned.`,
  //         type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
  //       },
  //       project.manager.user.id,
  //     );

  //     this.logger.log(
  //       `Notification sent for project "${project.name}" to manager and employees.`,
  //     );
  //   } catch (err) {
  //     this.logger.error(
  //       `Failed to send project creation notifications: ${err.message}`,
  //     );
  //   }

  //   return project;
  // }

  // async findAll(query: FindAllProjectsDto) {
  //   const where = { ...buildProjectFilter(query), isDeleted: false };

  //   const includeProgram = {
  //     program: {
  //       select: {
  //         programName: true,
  //       },
  //     },
  //   };

  //   const formatProjects = (projects: any[]) =>
  //     projects.map(({ program, ...rest }) => ({
  //       ...rest,
  //       programName: program?.programName ?? null,
  //     }));

  //   // No pagination
  //   if (query.limit !== 12) {
  //     const projects = await this.prisma.project.findMany({
  //       where,
  //       include: includeProgram,
  //     });

  //     const formatted = formatProjects(projects);

  //     return {
  //       data: formatted,
  //       total: formatted.length,
  //       page: 1,
  //       limit: formatted.length,
  //     };
  //   }

  //   // Pagination
  //   const { page = 1 } = query;
  //   const limit = 12;
  //   const skip = (page - 1) * limit;

  //   const [projects, total] = await this.prisma.$transaction([
  //     this.prisma.project.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       include: includeProgram,
  //     }),
  //     this.prisma.project.count({ where }),
  //   ]);

  //   return {
  //     data: formatProjects(projects),
  //     total,
  //     page,
  //     limit,
  //   };
  // }



  // async create(createProjectDto: CreateProjectDto) {
  //   const {
  //     employeeIds,
  //     viewerIds,
  //     managerId,
  //     programId,
  //     templateId,
  //     name,
  //     SelectDays,
  //     workingDay,
  //     selectDate,
  //     UploadData,
  //     dateDate,
  //     startDate,
  //     deadline,
  //     budget,
  //     currentRate,
  //     location,
  //     sortName,
  //     description,
  //     metadata,
  //     ...rest
  //   } = createProjectDto;

  //   // ---  Pre-validation ---
  //   if (!name) throw new BadRequestException('Project name is required');

  //   const slug = slugify(createProjectDto.name);

  //   const existingSlug = await this.infrastructureRepo.findByProjectSlug(slug);
  //   if (existingSlug) {
  //     throw new ConflictException(`Project name results in a duplicate slug: ${slug}`);
  //   }

  //   const program = await this.prisma.program.findUnique({ where: { id: programId } });
  //   if (!program) throw new NotFoundException(`Program with ID "${programId}" not found`);

  //   const project = await this.prisma.$transaction(async (tx) => {
  //     const newProject = await tx.project.create({
  //       data: {
  //         name,
  //         slug,
  //         description,
  //         sortName,
  //         location,
  //         budget,
  //         currentRate,
  //         metadata: metadata || {},
  //         computedProgress: createProjectDto.computedProgress ?? 0,
  //         progress: createProjectDto.progress ?? 0,

  //         // Handle Arrays []
  //         SelectDays: SelectDays || [],
  //         workingDay: workingDay || [],
  //         selectDate: selectDate || [],

  //         // Dates & Enums
  //         dateDate: dateDate || new Date(),
  //         startDate,
  //         deadline,
  //         UploadData,

  //         // Relations
  //         program: { connect: { id: programId } },
  //         manager: { connect: { id: managerId } },
  //         template: templateId ? { connect: { id: templateId } } : undefined,

  //         //Tables
  //         projectEmployees: employeeIds?.length
  //           ? { create: employeeIds.map(id => ({ employeeId: id })) }
  //           : undefined,
  //         projectViewers: viewerIds?.length
  //           ? { create: viewerIds.map(id => ({ viewerId: id })) }
  //           : undefined,
  //       },
  //       include: {
  //         manager: { include: { user: true } },
  //         program: true,
  //         projectEmployees: {
  //           include: { employee: { include: { user: true } } }
  //         },
  //       },
  //     });

  //     return newProject;
  //   });

  //   try {
  //     if (!project.manager || !project.manager.user) {
  //       throw new NotFoundException('Manager or associated user not found for the project.');
  //     }

  //     // Send notification to manager and employees
  //     const receiverIds = [
  //       project.manager.user.id,
  //       ...(project.projectEmployees?.map((e) => {
  //         if (!e.employee || !e.employee.user) {
  //           throw new NotFoundException(
  //             'Employee or associated user not found for project employee record.',
  //           );
  //         }
  //         return e.employee.user.id;
  //       }) || []),
  //     ];

  //     const uniqueReceivers = [...new Set(receiverIds)];

  //     await this.notificationService.create(
  //       {
  //         receiverIds: uniqueReceivers,
  //         context: `A new project ${project.name} has been created and assigned.`,
  //         type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
  //       },
  //       project.manager.user.id,
  //     );

  //     this.logger.log(
  //       `Notification sent for project ${project.name} to manager and employees.`,
  //     );
  //   } catch (err) {
  //     this.logger.error(
  //       `Failed to send project creation notifications: ${err.message}`,
  //     );
  //   }

  //   return project;
  // }




  async create(createProjectDto: CreateProjectDto) {
    const {
      employeeIds,
      viewerIds,
      managerId,
      programId,
      templateId,
      name,
      description,
      uploadCycle,
      message,
      repeatOnDays,
      repeatOnDates,
      remindBefore,
      SelectDays,
      workingDay,
      selectDate,
      UploadData,
      dateDate,
      startDate,
      deadline,
      budget,
      currentRate,
      location,
      sortName,
      metadata,
      status,

      ...rest
    } = createProjectDto;

    // --- 1. Pre-validation ---
    if (!name) throw new BadRequestException('Project name is required');

    const slug = slugify(name);
    const existingSlug = await this.infrastructureRepo.findByProjectSlug(slug);
    if (existingSlug) {
      throw new ConflictException(`Project name results in a duplicate slug: ${slug}`);
    }

    const program = await this.prisma.program.findUnique({ where: { id: programId } });
    if (!program) throw new NotFoundException(`Program with ID "${programId}" not found`);
    const project = await this.prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          slug,
          description,
          sortName,
          location,
          budget,
          currentRate,
          uploadCycle,
          metadata: metadata || {},
          computedProgress: createProjectDto.computedProgress ?? 0,
          progress: createProjectDto.progress ?? 0,

          SelectDays: SelectDays || [],
          workingDay: workingDay || [],
          selectDate: selectDate || [],

          dateDate: dateDate || new Date(),
          startDate,
          deadline,
          UploadData,
          status: status || 'PENDING',

          program: { connect: { id: programId } },
          manager: { connect: { id: managerId } },


          projectEmployees: employeeIds?.length
            ? { create: employeeIds.map(id => ({ employeeId: id })) }
            : undefined,
          projectViewers: viewerIds?.length
            ? { create: viewerIds.map(id => ({ viewerId: id })) }
            : undefined,
        },
        include: {
          manager: { include: { user: true } },
          program: true,
          projectEmployees: {
            include: { employee: { include: { user: true } } }
          },
        },
      });


      if (uploadCycle) {
        const firstTrigger = this.schedulerService.calculateNextTriggerAt(
          uploadCycle,
          new Date(),
          repeatOnDays,
          repeatOnDates,
          remindBefore
        );

        await tx.reminder.create({
          data: {
            message: message || `Reminder: Upload required for project ${name}`,
            repeatEvery: uploadCycle,
            nextTriggerAt: firstTrigger,
            repeatOnDays: repeatOnDays || [],
            repeatOnDates: repeatOnDates || [],
            remindBefore,
            projectId: newProject.id,
            isActive: true,
          },
        });

        this.logger.log(`Automatic reminder scheduled for project ${name} at ${firstTrigger}`);
      }

      return newProject;
    });

    this.sendCreationNotifications(project).catch(err =>
      this.logger.error(`Notification failed: ${err.message}`)
    );

    return project;
  }


  private async sendCreationNotifications(project: any) {
    const receiverIds = [
      project.manager?.user?.id,
      ...project.projectEmployees.map(e => e.employee?.user?.id)
    ].filter(Boolean);

    const uniqueReceivers = [...new Set(receiverIds)] as string[];
    const savedNotification = await this.notificationService.create({
      receiverIds: uniqueReceivers,
      context: `New project "${project.name}" assigned.`,
      type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
    }, project.manager.user.id);

    await this.gateway.sendToUsers(uniqueReceivers, 'notification_received', {
      id: savedNotification.id,
      message: `You have been assigned to project: ${project.name}`,
      metadata: { projectId: project.id },
      createdAt: new Date()
    });
  }

  private async sendProjectNotifications(project: any) {
    const managerUserId = project.manager?.user?.id;
    if (!managerUserId) return;

    const employeeUserIds = project.projectEmployees
      ?.map(pe => pe.employee?.user?.id)
      .filter(Boolean) || [];

    const uniqueReceivers = [...new Set([managerUserId, ...employeeUserIds])];

    await this.notificationService.create(
      {
        receiverIds: uniqueReceivers,
        context: `A new project "${project.name}" has been created and assigned.`,
        type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
      },
      managerUserId,
    );
  }

  async searchByName(query: SearchProjectByNameDto) {
    const { name, page = 1, limit = 10, employeeId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      name: {
        contains: name,
        mode: 'insensitive' as const,
      },
    };

    if (employeeId) {
      where.projectEmployees = {
        some: {
          employeeId: employeeId,
        },
      };
    }

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
    };
  }


  private readonly fullProjectInclude: Prisma.ProjectInclude = {
    program: true,
    manager: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            role: true,
            isOnline: true,
            lastActive: true,
          },
        },
      },
    },
    projectEmployees: {
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                role: true,
                isOnline: true,
                lastActive: true,
              },
            },
          },
        },
      },
    },

    projectViewers: {
      include: {
        viewer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                role: true,
                isOnline: true,
                lastActive: true,
              },
            },
          },
        },
      },
    },
    reminders: true,
    tasks: true,
    activities: true,
    rootCharts: true,
  };

  // async findAllFull(query: FindAllProjectsDto) {
  //   const where: Prisma.ProjectWhereInput = {
  //     ...buildProjectFilter(query),
  //     isDeleted: false,
  //   };

  //   const orderBy: Prisma.ProjectOrderByWithRelationInput = query.sortBy
  //     ? { [query.sortBy]: query.sortOrder ?? Prisma.SortOrder.desc }
  //     : { createdAt: Prisma.SortOrder.desc };

  //   const page = query.page ?? 1;
  //   const limit = query.limit ?? 12;
  //   const skip = (page - 1) * limit;

  //   const [projects, total] = await this.prisma.$transaction([
  //     this.prisma.project.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       include: this.fullProjectInclude,
  //       orderBy,
  //     }),
  //     this.prisma.project.count({ where }),
  //   ]);

  //   return {
  //     data: projects,
  //     total,
  //     page,
  //     limit,
  //   };
  // }

// project.service.ts

async findAllFull(query: FindAllProjectsDto, authUserId: string) {
  const where: Prisma.ProjectWhereInput = {
    ...buildProjectFilter(query),
    isDeleted: false,
    OR: [
      {
        manager: { userId: authUserId },
      },
      {
        projectEmployees: {
          some: {
            employee: { userId: authUserId },
          },
        },
      },
      {
        projectViewers: {
          some: {
            viewer: { userId: authUserId },
          },
        },
      },
    ],
  };

  const orderBy: Prisma.ProjectOrderByWithRelationInput = query.sortBy
    ? { [query.sortBy]: query.sortOrder ?? 'desc' }
    : { createdAt: 'desc' };

  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.max(query.limit ?? 12, 1);
  const skip = (page - 1) * limit;

  const [projects, total] = await this.prisma.$transaction([
    this.prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: this.fullProjectInclude, // Ensure this includes manager and employees
      orderBy,
    }),
    this.prisma.project.count({ where }),
  ]);

  return {
    data: projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}







  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: this.fullProjectInclude,

    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }


  //get sheet with project id
  async getSheets(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project)
      throw new NotFoundException(`Project with ID ${projectId}not found`);

    const sheets = await this.prisma.sheet.findMany({
      where: {
        projectId,
      },
    });

    return sheets;
  }

  // async updateProjectStatus(updateProjectStatusDto: UpdateProjectStatusDto) {
  //   const { projectId, status } = updateProjectStatusDto;

  //   const project = await this.prisma.project.findUnique({
  //     where: {
  //       id: projectId,
  //     },
  //     include: {
  //       manager: {
  //         include: {
  //           user: true,
  //         },
  //       },
  //       projectEmployees: {
  //         include: {
  //           employee: {
  //             include: {
  //               user: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!project) {
  //     throw new NotFoundException(`Project with ID "${projectId}" not found`);
  //   }

  //   const updatedProject = await this.prisma.project.update({
  //     where: { id: projectId },
  //     data: { status },
  //   });

  //   if (status === 'LIVE') {
  //     const managerUserId = project.manager?.user?.id;
  //     if (!managerUserId) {
  //       throw new NotFoundException('Manager or associated user not found');
  //     }

  //     const employeeUserIds = project.projectEmployees
  //       .map((e) => e.employee?.user?.id)
  //       .filter((id): id is string => !!id);

  //     const receiverIds = [...new Set([managerUserId, ...employeeUserIds])];

  //     await this.notificationService.create(
  //       {
  //         receiverIds,
  //         context: `Project ${project.name} is now LIVE.`,
  //         type: NotificationType.PROJECT_STATUS_UPDATE,
  //       },
  //       managerUserId,
  //     );
  //   }

  //   return updatedProject;
  // }

  async updateProjectStatus(updateProjectStatusDto: UpdateProjectStatusDto) {
    const { projectId, status } = updateProjectStatusDto;

    // Fetch project with manager & employees
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        manager: { include: { user: true } },
        projectEmployees: { include: { employee: { include: { user: true } } } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    const updateData: Partial<{
      status: ProjectStatus;
      projectCompleteDate: Date | null;
    }> = { status };

    //  If setting status LIVE, enforce startDate & deadline
    if (status === 'LIVE') {
      if (!project.startDate || !project.deadline) {
        throw new BadRequestException(
          `Cannot mark project as LIVE. Start date and deadline must be set.`
        );
      }

      // Send notifications to manager & employees
      const managerUserId = project.manager?.user?.id;
      if (!managerUserId) {
        throw new NotFoundException('Manager or associated user not found');
      }

      const employeeUserIds = project.projectEmployees
        .map((e) => e.employee?.user?.id)
        .filter((id): id is string => !!id);

      const receiverIds = [...new Set([managerUserId, ...employeeUserIds])];

      await this.notificationService.create(
        {
          receiverIds,
          context: `Project "${project.name}" is now LIVE.`,
          type: NotificationType.PROJECT_STATUS_UPDATE,
        },
        managerUserId,
      );
    }

    //  If setting status COMPLETED, auto set projectCompleteDate
    if (status === 'COMPLETED') {
      updateData.projectCompleteDate = new Date();
    }

    // Update project in DB
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return updatedProject;
  }


  // async updateProject(id: string, dto: UpdateProjectDto) {
  //   const project = await this.prisma.project.findUnique({
  //     where: { id },
  //     include: {
  //       manager: true,
  //     },
  //   });
  //   console.log('project: ', project);

  //   if (!project) {
  //     throw new NotFoundException(`Project with ID "${id}" not found`);
  //   }

  //   const removeIds = dto.removeEmployeeIds || [];
  //   const addIds = dto.addEmployeeIds || [];

  //   const updatedProject = await this.prisma.$transaction(async (prisma) => {
  //     // Remove non-relation fields
  //     const projectData: any = { ...dto };
  //     delete projectData.addEmployeeIds;
  //     delete projectData.removeEmployeeIds;

  //     //  Check if managerId exists
  //     if (dto.managerId) {
  //       const managerExists =
  //         (await this.prisma.manager.findUnique({
  //           where: { id: dto.managerId },
  //         })) ||
  //         (await this.prisma.user.findUnique({
  //           where: {
  //             id: dto.managerId,
  //           },
  //         }));

  //       console.log('managerExists: ', managerExists);

  //       if (!managerExists) {
  //         throw new NotFoundException(
  //           `Manager with ID "${dto.managerId}" does not exist`,
  //         );
  //       }
  //     }

  //     // Update project main fields
  //     const updated = await prisma.project.update({
  //       where: { id },
  //       data: projectData,
  //     });

  //     if (removeIds.length > 0) {
  //       await prisma.projectEmployee.deleteMany({
  //         where: {
  //           projectId: id,
  //           employeeId: { in: removeIds },
  //         },
  //       });
  //     }
  //     if (addIds.length > 0) {
  //       await prisma.projectEmployee.createMany({
  //         data: addIds.map((employeeId) => ({
  //           projectId: id,
  //           employeeId,
  //         })),
  //         skipDuplicates: true,
  //       });
  //     }

  //     return updated;
  //   });

  //   return updatedProject;
  // }


  // async updateProject(id: string, dto: UpdateProjectDto) {
  //   return await this.prisma.$transaction(async (prisma) => {

  //     const {workingDay , employeeIds, viewerIds, chartList, SelectDays, selectDate,   ...data  } = dto



  //     // 1️⃣ Check project exists
  //     const project = await prisma.project.findUnique({
  //       where: { id },
  //       include: { manager: true },
  //     });

  //     if (!project) {
  //       throw new NotFoundException(`Project with ID "${id}" not found`);
  //     }

  //     const removeIds = dto.removeEmployeeIds || [];
  //     const addIds = dto.addEmployeeIds || [];

  //     // 2️⃣ Prepare project update data
  //     const projectData: any = { ...dto };
  //     delete projectData.addEmployeeIds;
  //     delete projectData.removeEmployeeIds;

  //     // 3️⃣ Validate manager
  //     if (dto.managerId) {
  //       const managerExists =
  //         (await prisma.manager.findUnique({
  //           where: { id: dto.managerId },
  //         })) ||
  //         (await prisma.user.findUnique({
  //           where: { id: dto.managerId },
  //         }));

  //       if (!managerExists) {
  //         throw new NotFoundException(
  //           `Manager with ID "${dto.managerId}" does not exist`,
  //         );
  //       }
  //     }

  //     // 4️⃣ Validate employees BEFORE modifying relations
  //     if (addIds.length > 0) {
  //       const employees = await prisma.employee.findMany({
  //         where: { id: { in: addIds } },
  //         select: { id: true },
  //       });

  //       const existingIds = employees.map(e => e.id);
  //       const missingIds = addIds.filter(id => !existingIds.includes(id));

  //       if (missingIds.length > 0) {
  //         throw new BadRequestException(
  //           `Employees not found: ${missingIds.join(', ')}`
  //         );
  //       }
  //     }

  //     // 5️⃣ Update project main fields
  //     const updatedProject = await prisma.project.update({
  //       where: { id },
  //       data: projectData,
  //     });

  //     // 6️⃣ Remove employees
  //     if (removeIds.length > 0) {
  //       await prisma.projectEmployee.deleteMany({
  //         where: {
  //           projectId: id,
  //           employeeId: { in: removeIds },
  //         },
  //       });
  //     }

  //     // 7️⃣ Add employees (safe now)
  //     if (addIds.length > 0) {
  //       await prisma.projectEmployee.createMany({
  //         data: addIds.map(employeeId => ({
  //           projectId: id,
  //           employeeId,
  //         })),
  //         skipDuplicates: true,
  //       });
  //     }

  //     // 8️⃣ Return updated project with employees
  //     return prisma.project.findUnique({
  //       where: { id },
  //       include: {
  //         manager: true,
  //         projectEmployees: {
  //           include: {
  //             employee: true,
  //           },
  //         },
  //         projectViewers: {
  //           include: {
  //             viewer: true,
  //           },
  //         },
  //       },
  //     });

  //   });
  // }

  async updateProject(id: string, dto: UpdateProjectDto) {
    return await this.prisma.$transaction(async (prisma) => {

      const {
        workingDay,
        employeeIds,
        viewerIds,
        chartList,
        SelectDays,
        selectDate,
        ...data
      } = dto;



      const updateProject = await prisma.project.update({
        where: { id },
        data: {
          ...data,

          ...(workingDay && { workingDay }),
          ...(SelectDays && { SelectDays }),
          ...(chartList && { chartList }),
          ...(selectDate && { selectDate }),

         
          ...(employeeIds && {
            projectEmployees: {
              deleteMany: {},
              create: employeeIds.map(employeeId => ({
                employee: { connect: { id: employeeId } }
              })),
            },
          }),

         
          ...(viewerIds && {
            projectViewers: {
              deleteMany: {},
              create: viewerIds.map(viewerId => ({
                viewer: { connect: { id: viewerId } }
              })),
            },
          }),
        },
        include: {
          projectEmployees: true,
          projectViewers: true,
          manager: true,
          program: true,
        },
      });

      return updateProject;
    });
  }





  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        sheets: true,
        projectEmployees: true,
        tasks: true,
        activities: true,
      },
    });

    if (!project)
      throw new NotFoundException(`Project with ID "${id}" not found`);

    const sheetIds = project.sheets?.map((s: { id: string }) => s.id) || [];
    const employeeIds =
      project.projectEmployees?.map((e: { id: string }) => e.id) || [];
    const taskIds = project.tasks?.map((t: { id: string }) => t.id) || [];
    const activityIds =
      project.activities?.map((a: { id: string }) => a.id) || [];

    if (
      sheetIds.length ||
      employeeIds.length ||
      taskIds.length ||
      activityIds.length
    ) {
      const errors: string[] = [];
      if (sheetIds.length) errors.push(`sheets (${sheetIds.join(', ')})`);
      if (employeeIds.length)
        errors.push(`employees (${employeeIds.join(', ')})`);
      if (taskIds.length) errors.push(`tasks (${taskIds.join(', ')})`);
      if (activityIds.length)
        errors.push(`activities (${activityIds.join(', ')})`);

      throw new BadRequestException(
        `Cannot delete project. There are related: ${errors.join(', ')}.`,
      );
    }

    await this.prisma.project.delete({ where: { id } });

    return {
      message: `Project with ID "${id}" has been deleted successfully.`,
    };
  }
  async softDelete(projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        isDeleted: false,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
