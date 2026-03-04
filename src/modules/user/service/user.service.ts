import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/modules/utils/services/cloudinary.service';
import { uploadImageAndDto } from '../dto/updatefile.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UploadApiResponse } from 'cloudinary';
import { buildDynamicPrismaFilter } from 'src/modules/utils/queryBuilder/prisma-filter-builder';
import { Role } from 'generated/prisma';
import { ConvertEmployeeToManagerDto } from '../dto/convert-employee-to-manager.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  paginate,
  PaginatedResult,
} from 'src/modules/utils/pagination/pagination.utils';
import { deleteProfileImage } from 'src/modules/utils/file.utils';
import { mapUserWithAssignedProjects } from '../dto/user.mapper';
import { ReplaceUserProjectDto } from '../dto/userUpdateAssignProject.Dto';
import { UpdateUserProjectsDto } from '../dto/updateuserproject.Dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    const results: UploadApiResponse[] = [];

    for (const file of files) {
      try {
        const res: UploadApiResponse = await this.cloudinary.uploadFile(file);
        results.push(res);
      } catch (error) {
        console.error(`Failed to upload image ${file.originalname}:`, error);
      }
    }

    return {
      message: 'Multiple images uploaded',
      files: results,
    };
  }

  async uploadSingleImage(file: Express.Multer.File) {
    try {
      const result = await this.cloudinary.uploadFile(file);
      return {
        message: 'Single image uploaded',
        file: result,
      };
    } catch (error) {
      console.error('Upload single image failed:', error);
      throw error;
    }
  }

  async findAll(
    query: { page: number; limit: number } = { page: 1, limit: 10 },
  ) {
    const users = await paginate<any>(
      this.prisma,
      'user',
      {
        where: {
          role: {
            in: ['MANAGER', 'EMPLOYEE', 'VIEWER'],
          },
        },
        include: {
          manager: {
            include: {
              projects: {
                select: { id: true, name: true },
              },
            },
          },
          employee: {
            include: {
              projectEmployees: {
                include: {
                  project: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
          viewer: {
            include: {
              projectViewers: {
                include: {
                  project: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
        },
      },
      {
        page: query.page,
        limit: query.limit,
      },
    );

    return users;
  }




  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const { password, ...result } = user;
    return result;
  }



  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }


    const { password, ...safeUser } = user;
    return safeUser;
  }




  async update(id: string, updateUserDto: UpdateUserDto) {

    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.profileImage && userExists.profileImage && updateUserDto.profileImage !== userExists.profileImage) {
      deleteProfileImage(userExists.profileImage);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });


    const { password, ...result } = user;
    return result;
  }


  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        manager: true,
        employee: true,
        viewer: true,
        supporter: true,
        superAdmin: true,
        client: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Delete role-specific records first
      if (user.manager) {
        await tx.manager.delete({ where: { id: user.manager.id } });
      }
      if (user.employee) {
        await tx.employee.delete({ where: { id: user.employee.id } });
      }
      if (user.viewer) {
        await tx.viewer.delete({ where: { id: user.viewer.id } });
      }
      if (user.supporter) {
        await tx.supporter.delete({ where: { id: user.supporter.id } });
      }
      if (user.superAdmin) {
        await tx.superAdmin.delete({ where: { id: user.superAdmin.id } });
      }
      if (user.client) {
        await tx.client.delete({ where: { id: user.client.id } });
      }

      // 2. Delete OTP verifications related to the user's email
      await tx.otpVerification.deleteMany({
        where: { email: user.email },
      });

      // 3. Delete files associated with the user
      await tx.file.deleteMany({
        where: { userId: id },
      });

      // 4. Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });


    const { password, ...result } = user;
    return result;
  }


  // async convertEmployeeToManager(employeeId: string, dto: ConvertEmployeeToManagerDto) {
  //   return this.prisma.$transaction(async (prisma) => {
  //     const user = await prisma.user.findUnique({
  //       where: { id: employeeId },
  //       include: { employee: true },
  //     });

  //     if (!user || !user.employee) {
  //       throw new BadRequestException(`User with ID "${employeeId}" is not a valid employee.`);
  //     }

  //     await prisma.employee.delete({ where: { userId: employeeId } });

  //     const manager = await prisma.manager.create({
  //       data: {
  //         userId: employeeId,
  //         description:dto.
  //         skills: dto.skills || [],
  //       },
  //     });

  //     const updatedUser = await prisma.user.update({
  //       where: { id: employeeId },
  //       data: { role: Role.MANAGER },
  //     });

  //     const { password, ...userWithoutPassword } = updatedUser;

  //     return {
  //       ...manager,
  //       user: userWithoutPassword,
  //     };
  //   });
  // }

  async findAllWithFilters(dto: Record<string, any>) {
    const where = buildDynamicPrismaFilter(dto);
    return this.prisma.user.findMany({ where });
  }




  async updateUser_assign_Project_and_update_user_status(dto: UpdateUserProjectsDto) {
    const { userId, removeProjectIds, addProjectIds, status } = dto;


    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: { include: { projectEmployees: true } },
        manager: { include: { projects: true } },
        viewer: { include: { projectViewers: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    let relationType: 'employee' | 'manager' | 'viewer' | null = null;
    let relationId: string | null = null;

    if (user.employee) {
      relationType = 'employee';
      relationId = user.employee.id;
    } else if (user.manager) {
      relationType = 'manager';
      relationId = user.manager.id;
    } else if (user.viewer) {
      relationType = 'viewer';
      relationId = user.viewer.id;
    } else {
      throw new BadRequestException('User has no role relation');
    }

    return this.prisma.$transaction(async (tx) => {

      if (removeProjectIds?.length) {
        if (relationType === 'employee') {
          await tx.projectEmployee.deleteMany({
            where: { employeeId: relationId!, projectId: { in: removeProjectIds } },
          });
        } else if (relationType === 'manager') {
          await tx.project.updateMany({
            where: { managerId: relationId!, id: { in: removeProjectIds } },
            data: { managerId: null as any },
          });
        } else if (relationType === 'viewer') {
          await tx.projectViewer.deleteMany({
            where: { viewerId: relationId!, projectId: { in: removeProjectIds } },
          });
        }
      }


      if (addProjectIds?.length) {
        if (relationType === 'employee') {
          await tx.projectEmployee.createMany({
            data: addProjectIds.map((projectId) => ({ employeeId: relationId!, projectId })),
            skipDuplicates: true,
          });
        } else if (relationType === 'manager') {
          await Promise.all(
            addProjectIds.map((projectId) =>
              tx.project.update({
                where: { id: projectId },
                data: { managerId: relationId! },
              }),
            ),
          );
        } else if (relationType === 'viewer') {
          await tx.projectViewer.createMany({
            data: addProjectIds.map((projectId) => ({ viewerId: relationId!, projectId })),
            skipDuplicates: true,
          });
        }
      }


      if (status) {
        await tx.user.update({
          where: { id: userId },
          data: { userStatus: status },
        });
      }


      return tx.user.findUnique({
        where: { id: userId },
        include: {
          employee: { include: { projectEmployees: { include: { project: true } } } },
          manager: { include: { projects: true } },
          viewer: { include: { projectViewers: { include: { project: true } } } },
        },
      });
    });
  }

  async removeBulk(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No user IDs provided for deletion');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Delete all role-specific records for these users
      await tx.manager.deleteMany({ where: { userId: { in: ids } } });
      await tx.employee.deleteMany({ where: { userId: { in: ids } } });
      await tx.viewer.deleteMany({ where: { userId: { in: ids } } });
      await tx.supporter.deleteMany({ where: { userId: { in: ids } } });
      await tx.superAdmin.deleteMany({ where: { userId: { in: ids } } });
      await tx.client.deleteMany({ where: { userId: { in: ids } } });

      // 2. Fetch user emails to delete linked OTP verifications
      const users = await tx.user.findMany({
        where: { id: { in: ids } },
        select: { email: true }
      });
      const emails = users.map(u => u.email);
      await tx.otpVerification.deleteMany({ where: { email: { in: emails } } });

      // 3. Delete files associated with these users
      await tx.file.deleteMany({
        where: { userId: { in: ids } },
      });

      // 4. Finally delete the users
      const deleted = await tx.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });


      return {
        message: 'Bulk deletion successful',
        deletedCount: deleted.count,
      };
    });
  }


}