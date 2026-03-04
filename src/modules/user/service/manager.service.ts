import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Manager, Role } from 'generated/prisma';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { EmailService } from '../../utils/services/emailService';
import { welcomeEmailTemplate } from '../../utils/template/welcometempleted';
import { NotificationService } from '../../notification/service/notification.service';
import {
  paginate,
  PaginatedResult,
} from 'src/modules/utils/pagination/pagination.utils';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  // async create(createManagerDto: CreateManagerDto) {
  //   const {
  //     sendWelcomeEmail,
  //     notifyProjectManager,
  //     projects,
  //     email,
  //     password,
  //     skills,
  //     phoneNumber,
  //     name,
  //     joinedDate,
  //     description,
  //   } = createManagerDto;

  //   const existingUser = await this.prisma.user.findFirst({
  //     where: { OR: [{ email }, { phoneNumber }] },
  //   });

  //   if (existingUser) {
  //     throw new ConflictException(
  //       'User with this email or phone number already exists',
  //     );
  //   }

  //   if (projects && projects.length > 0) {
  //     const projectCount = await this.prisma.project.count({
  //       where: {
  //         id: { in: projects },
  //       },
  //     });

  //     if (projectCount !== projects.length) {
  //       throw new NotFoundException('One or more projects not found.');
  //     }
  //   }

  //   const saltRounds = Number(
  //     this.configService.get<string | number>('bcrypt_salt_rounds') ?? 10,
  //   );
  //   const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   return this.prisma.$transaction(async (prisma) => {
  //     const user = await prisma.user.create({
  //       data: {
  //         name,
  //         email,
  //         phoneNumber,
  //         password: hashedPassword,
  //         role: Role.MANAGER,
  //       },
  //     });

  //     await prisma.manager.create({
  //       data: {
  //         userId: user.id,
  //         description,
  //         joinedDate,
  //         projects: projects
  //           ? { connect: projects.map((id) => ({ id })) }
  //           : undefined,
  //         skills: skills || [],
  //       },
  //     });

  //     if (sendWelcomeEmail) {
  //       await this.emailService.sendMail(
  //         user.email,
  //         'Welcome to the Team!',
  //         welcomeEmailTemplate(user.name, user.email, joinedDate, password),
  //       );
  //     }

  //     if (notifyProjectManager && projects && projects.length > 0) {
  //       const projectManagers = await this.prisma.project.findMany({
  //         where: {
  //           id: { in: projects },
  //         },
  //         select: {
  //           managerId: true,
  //         },
  //       });
  //       await this.notificationService.create(
  //         {
  //           receiverIds: [...new Set(projectManagers.map((p) => p.managerId))],
  //           context: `A new manager ${name} has been assigned to a project you are managing.`,
  //           type: 'NEW_MANAGER_ASSIGNED',
  //         },
  //         user.id,
  //       );
  //     }

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: _password, ...userWithoutPassword } = user;
  //     return userWithoutPassword;
  //   });
  // }

  // async create(createManagerDto: CreateManagerDto) {
  //   const {
  //     sendWelcomeEmail,
  //     notifyProjectManager,
  //     projects,
  //     email,
  //     password,
  //     skills,
  //     phoneNumber,
  //     name,
  //     joinedDate,
  //     description,
  //   } = createManagerDto;

  //   // Check existing user
  //   const existingUser = await this.prisma.user.findFirst({
  //     where: { OR: [{ email }, { phoneNumber }] },
  //   });

  //   if (existingUser) {
  //     throw new ConflictException(
  //       'User with this email or phone number already exists',
  //     );
  //   }

  //   // Validate project IDs
  //   if (projects?.length) {
  //     const projectCount = await this.prisma.project.count({
  //       where: { id: { in: projects } },
  //     });

  //     if (projectCount !== projects.length) {
  //       throw new NotFoundException('One or more projects not found.');
  //     }
  //   }

  //   const saltRounds = Number(
  //     this.configService.get<string | number>('bcrypt_salt_rounds') ?? 10,
  //   );

  //   const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   const result = await this.prisma.$transaction(async (prisma) => {
  //     const user = await prisma.user.create({
  //       data: {
  //         name,
  //         email,
  //         phoneNumber,
  //         password: hashedPassword,
  //         role: Role.MANAGER,
  //       },
  //     });

  //     await prisma.notificationPermissionManager.create({
  //       data: { userId: user.id },
  //     });

  //     await prisma.manager.create({
  //       data: {
  //         userId: user.id,
  //         description,
  //         joinedDate,
  //         skills: skills || [],
  //         projects: projects
  //           ? {
  //               connect: projects.map((projectId) => ({ id: projectId })),
  //             }
  //           : undefined,
  //       },
  //     });

  //     return user;
  //   });

  //   if (sendWelcomeEmail) {
  //     await this.emailService.sendMail(
  //       result.email,
  //       'Welcome to the Team!',
  //       welcomeEmailTemplate(name, email, joinedDate, password),
  //     );
  //   }

  //   if (notifyProjectManager && projects?.length) {
  //     const projectManagers = await this.prisma.project.findMany({
  //       where: { id: { in: projects } },
  //       select: {
  //         manager: {
  //           select: { userId: true },
  //         },
  //       },
  //     });

  //     const receiverIds = [
  //       ...new Set(
  //         projectManagers
  //           .map((p) => p.manager?.userId)
  //           .filter((id) => id !== null && id !== undefined),
  //       ),
  //     ];

  //     if (receiverIds.length) {
  //       await this.notificationService.create(
  //         {
  //           receiverIds,
  //           context: `A new manager ${name} has been assigned to a project you are managing.`,
  //           type: NotificationType.NEW_MANAGER_ASSIGNED,
  //         },
  //         result.id,
  //       );
  //     }
  //   }

  //   const { password: _password, ...userWithoutPassword } = result;
  //   return userWithoutPassword;
  // }

  async findOne(id: string) {
    if (!id) throw new NotFoundException('Manager id is required!');

    let manager: any;
    console.log('before find: ', manager);
    manager = await this.prisma.manager.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID "${id}" not found`);
    }

    const { user } = manager;

    if (!user) {
      throw new NotFoundException(
        `User associated with manager ID "${id}" not found`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      ...manager,
      user: userWithoutPassword,
    };
  }

  async findAll(
    query: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<any>> {
    const paginatedManagers = await paginate(
      this.prisma,
      'manager',
      {
        include: { user: true },
      },
      { page: query.page, limit: query.limit },
    );

    paginatedManagers.data = paginatedManagers.data.map((manager: any) => {
      const { user } = manager;
      if (!user) {
        throw new NotFoundException(
          `User not found for manager with id ${manager.id}`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return {
        ...manager,
        user: userWithoutPassword,
      };
    });

    return paginatedManagers;
  }
}
