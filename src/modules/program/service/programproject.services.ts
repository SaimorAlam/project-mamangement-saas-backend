import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllProjectsInProgramDto } from '../dto/find-all-projects-in-program.dto';
import { paginate, PaginatedResult } from 'src/modules/utils/pagination/pagination.utils';

@Injectable()
export class ProgramProjectService {
  constructor(private readonly prisma: PrismaService) {}



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
   
  };



  private async findProgramOrThrow(programId: string) {
    const program = await this.prisma.program.findFirst({
      where: {
        id: programId,
      },
    });

    if (!program) {
      throw new NotFoundException(
        `Program with ID "${programId}" not found`,
      );
    }

    return program;
  }


  async findAllProjectsByProgram(
    programId: string,
    query: FindAllProjectsInProgramDto,
  ): Promise<PaginatedResult<Project>> {
    

    await this.findProgramOrThrow(programId);

    const {
      page = 1,
      limit = 10,
      search,
      priority,
      startDate,
      deadline,
    } = query;

    const where: Prisma.ProjectWhereInput = {
      programId,
      isDeleted: false,
    };



    // Search
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Priority
    if (priority) {
      where.priority = priority;
    }

    // Start Date
    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    // Deadline
    if (deadline) {
      where.deadline = {
        lte: new Date(deadline),
      };
    }



    return paginate(
      this.prisma,
      'project',
      {
        where,
        include: this.fullProjectInclude,
        orderBy: { createdAt: 'desc' },
      },
      {
        page,
        limit,
      },
    );
  }
}
