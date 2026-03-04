import { Injectable, NotFoundException } from '@nestjs/common';
import { Priority, ProjectStatus, SubmittedStatus } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService) { }


  /* ---------- Helpers ---------- */
  private getMonthRange(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return { start, end };
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  /* ---------- Manager Dashboard ---------- */
  async getManagerDashboard(managerId: string) {
    const now = new Date();

    const currentMonth = this.getMonthRange(now);
    const previousMonth = this.getMonthRange(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );

    /* ================= Projects ================= */
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
        isDeleted: false,
      },
      include: {
        projectEmployees: {
          select: { employeeId: true },
        },
      },
    });

    /* ================= Unique Employee IDs ================= */
    const employeeIds = [
      ...new Set(
        projects.flatMap((p) => p.projectEmployees.map((pe) => pe.employeeId)),
      ),
    ];

    /* ================= Assigned Projects ================= */
    const totalAssigned = projects.length;

    const currentAssigned = await this.prisma.project.count({
      where: {
        managerId,
        isDeleted: false,
        createdAt: {
          gte: currentMonth.start,
          lte: currentMonth.end,
        },
      },
    });

    const previousAssigned = await this.prisma.project.count({
      where: {
        managerId,
        isDeleted: false,
        createdAt: {
          gte: previousMonth.start,
          lte: previousMonth.end,
        },
      },
    });

    /* ================= Submitted For Review ================= */
    const currentSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: { in: employeeIds },
        createdAt: {
          gte: currentMonth.start,
          lte: currentMonth.end,
        },
      },
    });

    const previousSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: { in: employeeIds },
        createdAt: {
          gte: previousMonth.start,
          lte: previousMonth.end,
        },
      },
    });

    /* ================= Returned For Edit ================= */
    const currentReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: { in: employeeIds },
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
        },
      },
    });

    const previousReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: { in: employeeIds },
          createdAt: {
            gte: previousMonth.start,
            lte: previousMonth.end,
          },
        },
      },
    });

    /* ================= Live Projects ================= */
    const currentLiveProjects = await this.prisma.project.count({
      where: {
        managerId,
        status: 'LIVE',
        isDeleted: false,
        createdAt: {
          gte: currentMonth.start,
          lte: currentMonth.end,
        },
      },
    });

    const previousLiveProjects = await this.prisma.project.count({
      where: {
        managerId,
        status: 'LIVE',
        isDeleted: false,
        createdAt: {
          gte: previousMonth.start,
          lte: previousMonth.end,
        },
      },
    });

    /* ================= Overdue Projects ================= */
    const overdueProjects = await this.prisma.project.count({
      where: {
        managerId,
        isDeleted: false,
        deadline: { lt: new Date() },
        status: 'OVERDUE',
      },
    });

    /* ================= Response ================= */
    return {
      totalAssignedProject: {
        count: totalAssigned,
        growth: this.calculateGrowth(currentAssigned, previousAssigned),
      },

      submittedForReview: {
        count: currentSubmissions,
        growth: this.calculateGrowth(currentSubmissions, previousSubmissions),
      },

      returnedForEdit: {
        count: currentReturns,
        growth: this.calculateGrowth(currentReturns, previousReturns),
      },

      liveProjects: {
        count: currentLiveProjects,
        growth: this.calculateGrowth(currentLiveProjects, previousLiveProjects),
      },

      overdueProjects: {
        count: overdueProjects,
      },
    };
  }

  async getLiveProjects(managerId: string) {
    return this.prisma.project.findMany({
      where: {
        managerId,
        status: 'LIVE',
      },
    });
  }

  async getOverdueProjects(managerId: string) {
    return this.prisma.project.findMany({
      where: {
        managerId,
        deadline: {
          lt: new Date(),
        },
        status: 'OVERDUE'
      },
    });
  }

  async getSubmissionReturns(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      select: {
        projectEmployees: {
          select: {
            employeeId: true,
          },
        },
      },
    });

    const employeeIds = projects.flatMap((p) =>
      p.projectEmployees.map((pe) => pe.employeeId),
    );

    return this.prisma.submissionReturn.findMany({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
      },
      include: {
        submitted: true,
      },
    });
  }

  async getManagerPerformance(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      include: {
        projectEmployees: true,
      },
    });

    const employeeIds = projects.flatMap((p) =>
      p.projectEmployees.map((pe) => pe.employeeId),
    );

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const currentMonthProjects = projects.filter(
      (p) => new Date(p.createdAt) >= currentMonthStart,
    ).length;

    const previousMonthProjects = projects.filter(
      (p) =>
        new Date(p.createdAt) >= previousMonthStart &&
        new Date(p.createdAt) < currentMonthStart,
    ).length;

    const currentMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: {
          in: employeeIds,
        },
        createdAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: {
          in: employeeIds,
        },
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const currentMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
        returnedAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
        returnedAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? '100%' : '0%';
      }
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    };

    return {
      projects: {
        currentMonth: currentMonthProjects,
        previousMonth: previousMonthProjects,
        percentageChange: calculatePercentageChange(
          currentMonthProjects,
          previousMonthProjects,
        ),
      },
      submissions: {
        currentMonth: currentMonthSubmissions,
        previousMonth: previousMonthSubmissions,
        percentageChange: calculatePercentageChange(
          currentMonthSubmissions,
          previousMonthSubmissions,
        ),
      },
      returns: {
        currentMonth: currentMonthReturns,
        previousMonth: previousMonthReturns,
        percentageChange: calculatePercentageChange(
          currentMonthReturns,
          previousMonthReturns,
        ),
      },
    };
  }
  private calculateOverdueDays(deadline: Date): number {
    const now = new Date();
    const diff =
      (now.getTime() - new Date(deadline).getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  }

  private getPriorityLabel(priority: string): string {
    if (priority === 'LOW') return 'Low';
    if (priority === 'MEDIUM') return 'Medium';
    if (priority === 'HIGH') return 'Critical';
    return 'Low';
  }

  async getTopOverdueProjects(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
        status: "OVERDUE"
      },
    });

    const formatted = projects.map((item) => {
      const overdueDays = this.calculateOverdueDays(item.deadline as any);

      return {
        id: item.id,
        name: item.name,
        status: item.status,
        overdueDays: overdueDays > 0 ? overdueDays : 0,
        priority: this.getPriorityLabel(item.priority),
        deadline: item.deadline,
      };
    });


    const overdueProjects = formatted
      .sort((a, b) => b.overdueDays - a.overdueDays);

    return {
      totalProjects: projects.length,
      overdueCount: overdueProjects.length,
      projects: overdueProjects,
    };
  }


  async getSubmissionStatus(managerId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const submissions = await this.prisma.submitted.findMany({
      where: {
        project: {
          managerId: managerId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: true,
      },
    });

    const total = submissions.length;

    let submitted = 0;
    let live = 0;
    let returned = 0;
    let overdue = 0;

    const now = new Date();

    submissions.forEach((item) => {
      const status = item.status.toUpperCase();

      if (status === 'APPROVED' || status === 'SUBMITTED') submitted++;
      if (status === 'PENDING') live++;
      if (status === 'REJECTED') returned++;

      if (new Date(item.project.deadline as any) < now && status !== 'APPROVED') {
        overdue++;
      }
    });

    return {
      total,
      counts: {
        submitted,
        live,
        returned,
        overdue,
      },
      percentages: {
        submitted: total ? Math.round((submitted / total) * 100) : 0,
        live: total ? Math.round((live / total) * 100) : 0,
        returned: total ? Math.round((returned / total) * 100) : 0,
        overdue: total ? Math.round((overdue / total) * 100) : 0,
      },
      month,
      year,
    };
  }

  async upcomingDeadlineProjects(managerId: string, days = 8) {
    const today = new Date();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
        status: 'LIVE',
        deadline: {
          gte: today,
          lte: new Date(today.getTime() + days * ONE_DAY),
        },
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        program: {
          select: {
            programName: true,
          },
        },
        projectEmployees: {
          select: {
            employee: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });

    const formatted = projects.map((project) => {
      const deadline = new Date(project.deadline as any);
      const diffMs = deadline.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / ONE_DAY);

      return {
        programName: project.program?.programName ?? 'No Program',
        projectId: project.id,
        projectName: project.name,
        deadline: project.deadline,
        daysLeft,
        employees: project.projectEmployees.map((pe) => ({
          id: pe.employee.id,
          name: pe.employee.user?.name ?? 'Unknown',
          profileImage: pe.employee.user?.profileImage ?? null,
        })),
      };
    });

    return {
      total: formatted.length,
      projects: formatted,
    };
  }
  async getProjectManagerDashboard(managerId: string) {
    /* ---------------- TOTAL PROJECTS ---------------- */
    const totalProjects = await this.prisma.project.count({
      where: { managerId },
    });

    /* ---------------- ASSIGNED STAFF ---------------- */
    const assignedStaff = await this.prisma.projectEmployee.findMany({
      where: {
        project: { managerId },
      },
      distinct: ['employeeId'],
      select: {
        employeeId: true,
      },
    });

    const assignedStaffCount = assignedStaff.length;

    /* ---------------- PROGRAM COMPLETION ---------------- */
    const programs = await this.prisma.program.findMany({
      where: {
        projects: {
          some: { managerId },
        },
      },
      include: {
        projects: {
          where: { managerId },
          select: { status: true },
        },
      },
    });

    const completedPrograms = programs.filter(
      (program) =>
        program.projects.length > 0 &&
        program.projects.every(
          (project) => project.status === ProjectStatus.COMPLETED,
        ),
    );

    const programCompletion =
      programs.length === 0
        ? 0
        : Math.round((completedPrograms.length / programs.length) * 100);

    /* ---------------- PENDING REVIEWS ---------------- */
    const pendingReviews = await this.prisma.review.count({
      where: {
        project: { managerId },
        status: 'PENDING',
      },
    });

    return {
      totalProjects,
      assignedStaff: assignedStaffCount,
      programCompletion,
      pendingReviews,
    };
  }

  async getProgramDashboard(
    managerId: string,
    priority?: Priority,
    search?: string,
  ) {
    /* ---------------- FETCH PROGRAM (NO PROJECT FILTER HERE) ---------------- */
    const program = await this.prisma.program.findFirst({
      where: {
        projects: {
          some: {
            managerId,
            isDeleted: false, // just to ensure program belongs to manager
          },
        },
      },
      include: {
        tags: true,
        projects: {
          where: {
            managerId,
            isDeleted: false,
            ...(priority && { priority }),
            ...(search && {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }),
          },
          include: {
            manager: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    profileImage: true,
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
                        name: true,
                        profileImage: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('No active program found for this manager');
    }

    /* ---------------- MANAGER INFO ---------------- */
    const managerUser =
      program.projects[0]?.manager?.user ??
      program.projects.find((p) => p.manager?.user)?.manager?.user ??
      null;

    /* ---------------- ALERT LOGIC ---------------- */
    const now = new Date();

    const overdueProjects = program.projects.filter(
      (project) =>
        new Date(project.deadline as any) < now &&
        project.status !== ProjectStatus.COMPLETED,
    );

    const alerts = overdueProjects.map((project) => ({
      type: 'CRITICAL',
      title: 'Project Overdue',
      subText: project.name,
      time: 'System Alert',
    }));

    /* ---------------- RESPONSE ---------------- */
    return {
      projects: program.projects.map((project) => ({
        id: project.id,
        name: project.name,
        priority: project.priority,
        deadline: project.deadline,
        progress: project.progress ?? 0,
        assignStuff: {
          avatars: project.projectEmployees.slice(0, 3).map((pe) => ({
            name: pe.employee.user?.name || '',
            image: pe.employee.user?.profileImage || null,
          })),
          extraCount: Math.max(0, project.projectEmployees.length - 3),
        },
        // latitude: project.latitude ,
        // logitude: project.longitude,
      })),

      sidebar: {
        programManager: managerUser
          ? {
            name: managerUser.name,
            email: managerUser.email,
            image: managerUser.profileImage,
          }
          : {
            name: 'No Manager Assigned',
            email: '',
            image: null,
          },

        duration: {
          start: program.datetime,
          end: program.deadline,
          daysRemaining: this.calculateDaysRemaining(program.deadline as string),
        },

        tags: program.tags.map((tag) => tag.name),

        alerts: {
          issueCount: alerts.length,
          list: alerts,
        },
      },
    };
  }

  /* ---------------- HELPER ---------------- */
  private calculateDaysRemaining(deadline: string): string {
    const end = new Date(deadline);
    const now = new Date();

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? `${diffDays} days` : 'Expired';
  }

  async getManagerSubmissions(
    managerId: string,
    status?: SubmittedStatus,
    fromDate?: string,
    toDate?: string,
  ) {
    return this.prisma.submitted.findMany({
      where: {
        project: {
          managerId: managerId,
        },
        ...(status && { status }),
        ...(fromDate || toDate
          ? {
            createdAt: {
              ...(fromDate && { gte: new Date(fromDate) }),
              ...(toDate && { lte: new Date(toDate) }),
            },
          }
          : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            description: true,
            joinedDate: true,
            skills: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                profileImage: true,
                role: true,
                userStatus: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async showSubmissionsData(
    managerId: string,
    status?: SubmittedStatus,
    fromDate?: string,
    toDate?: string,
  ) {
    const submissions = await this.prisma.submitted.findMany({
      where: {
        project: { managerId },
        ...(status && { status }),
        ...(fromDate || toDate
          ? {
            createdAt: {
              ...(fromDate && { gte: new Date(fromDate) }),
              ...(toDate && { lte: new Date(toDate) }),
            },
          }
          : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                profileImage: true,
                role: true,
                userStatus: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            startDate: true,
            // estimatedCompletedDate: true,
            projectCompleteDate: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((sub) => ({
      ...sub,
      employee: sub.employee
        ? sub.employee
        : {
          id: 'unknown',
          user: {
            id: 'unknown',
            name: 'Unknown Employee',
            email: null,
            phoneNumber: null,
            profileImage: null,
            role: null,
            userStatus: null,
          },
        },
    }));
  }

  async showSubmissionsOverview(managerId: string) {
    const managerProjects = await this.prisma.project.findMany({
      where: { managerId },
      select: { id: true },
    });
    const projectIds = managerProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      const defaultOverview = Object.values(SubmittedStatus).reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        {} as Record<string, number>,
      );
      return {
        submissions: defaultOverview,
        overdueWithSubmissions: 0,
        overduePercentage: 0,
        overdueProjects: [],
      };
    }

    const submissionsByStatus = await this.prisma.submitted.groupBy({
      by: ['status'],
      where: {
        projectId: { in: projectIds },
      },
      _count: { status: true },
    });

    const submissionOverview: Record<string, number> = Object.values(
      SubmittedStatus,
    ).reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    submissionsByStatus.forEach((item) => {
      const status = item.status as SubmittedStatus;
      submissionOverview[status] = item._count.status;
    });

    const overdueProjects = await this.prisma.project.findMany({
      where: {
        id: { in: projectIds },
        status: 'OVERDUE',
        submitted: { some: {} },
      },
      select: { id: true, name: true },
    });

    const overdueCount = overdueProjects.length;
    const totalProjects = projectIds.length;

    const projectoverdue =
      totalProjects > 0 ? (overdueCount / totalProjects) * 100 : 0;

    return {
      submissions: submissionOverview,
      projectoverdue,
    };
  }

  // async getSubmissionActivity(managerId: string) {
  //   const submissions = await this.prisma.submitted.findMany({
  //     include: {
  //       employee: {
  //         select: {
  //           id: true,
  //           user: {
  //             select: {
  //               id: true,
  //               name: true,
  //               profileImage: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const employeeMap = new Map<string, any>();

  //   submissions.forEach((sub) => {
  //     const empId = sub.employee?.id ?? 'unknown';

  //     if (!employeeMap.has(empId)) {
  //       const defaultStatusSummary = Object.values(SubmittedStatus).reduce(
  //         (acc, status) => ({ ...acc, [status]: 0 }),
  //         {} as Record<string, number>,
  //       );

  //       employeeMap.set(empId, {
  //         employee: {
  //           id: sub.employee?.id ?? empId,
  //           name: sub.employee?.user?.name ?? 'Unknown',
  //           profileImage: sub.employee?.user?.profileImage ?? 'default.png',
  //         },
  //         totalSubmissions: 0,
  //         statusSummary: defaultStatusSummary,
  //       });
  //     }

  //     const empData = employeeMap.get(empId);
  //     empData.totalSubmissions += 1;

  //     const status = sub.status as SubmittedStatus;
  //     empData.statusSummary[status] = (empData.statusSummary[status] ?? 0) + 1;
  //   });

  //   return Array.from(employeeMap.values());
  // }

  async getSubmissionActivity(managerId: string) {
    const submissions = await this.prisma.submitted.findMany({
      where: {
        project: {
          managerId: managerId,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        project: {
          select: {
            manager: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const employeeMap = new Map<string, any>();

    submissions.forEach((sub) => {
      const empId = sub.employee?.id ?? 'unknown';

      if (!employeeMap.has(empId)) {
        const defaultStatusSummary = Object.values(SubmittedStatus).reduce(
          (acc, status) => ({ ...acc, [status]: 0 }),
          {} as Record<string, number>,
        );

        employeeMap.set(empId, {
          employee: {
            id: sub.employee?.id ?? empId,
            name: sub.employee?.user?.name ?? 'Unknown',
            profileImage: sub.employee?.user?.profileImage ?? 'default.png',
          },
          totalSubmissions: 0,
          statusSummary: defaultStatusSummary,
        });
      }

      const empData = employeeMap.get(empId);
      empData.totalSubmissions += 1;

      const status = sub.status as SubmittedStatus;
      if (empData.statusSummary.hasOwnProperty(status)) {
        empData.statusSummary[status] += 1;
      }
    });

    return Array.from(employeeMap.values());
  }

  async deleteSubmissionForManager(submissionId: string, managerId: string) {
    const result = await this.prisma.submitted.deleteMany({
      where: {
        id: submissionId,
        project: {
          managerId: managerId,
        },
      },
    });

    if (result.count === 0) {
      throw new Error('Submission not found ');
    }

    return { message: 'Submission deleted successfully' };
  }

  async updateSubmissionStatus(
    submissionId: string,
    managerId: string,
    status: SubmittedStatus,
  ) {
    const result = await this.prisma.submitted.updateMany({
      where: {
        id: submissionId,
        project: { managerId: managerId },
      },
      data: { status },
    });

    if (result.count === 0) {
      throw new NotFoundException('Submission not found ');
    }

    const updatedSubmission = await this.prisma.submitted.findUnique({
      where: { id: submissionId },
      include: { project: true, employee: { include: { user: true } } },
    });

    return updatedSubmission;
  }
  async globalSearch(managerId: string, query: string) {
    if (!query.trim()) {
      return this.emptyResponse();
    }

    const [projects, programs, employees] = await Promise.all([
      /* ---------------- PROJECT SEARCH ---------------- */
      this.prisma.project.findMany({
        where: {
          managerId,
          isDeleted: false,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          priority: true,
          deadline: true,
          program: {
            select: {
              programName: true,
            },
          },
        },
      }),

      /* ---------------- PROGRAM SEARCH ---------------- */
      this.prisma.program.findMany({
        where: {
          projects: {
            some: {
              managerId,
              isDeleted: false,
            },
          },
          OR: [
            { programName: { contains: query, mode: 'insensitive' } },
            { programDescription: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          programName: true,
          priority: true,
          deadline: true,
        },
      }),

      /* ---------------- EMPLOYEE SEARCH ---------------- */
      this.prisma.projectEmployee.findMany({
        where: {
          project: {
            managerId,
            isDeleted: false,
          },
          employee: {
            user: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        },
        distinct: ['employeeId'],
        take: 5,
        select: {
          employee: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          programName: p.program.programName,
          priority: p.priority,
          deadline: p.deadline,
          type: 'PROJECT',
        })),

        programs: programs.map((p) => ({
          id: p.id,
          name: p.programName,
          priority: p.priority,
          deadline: p.deadline,
          type: 'PROGRAM',
        })),

        employees: employees
          .filter((e) => e.employee.user) // ensure user exists
          .map((e) => ({
            id: e.employee.id,
            name: e.employee.user!.name,
            email: e.employee.user!.email,
            image: e.employee.user!.profileImage,
            type: 'EMPLOYEE',
          })),
      },
    };
  }

  private emptyResponse() {
    return {
      success: true,
      data: {
        projects: [],
        programs: [],
        employees: [],
      },
    };
  }
}
