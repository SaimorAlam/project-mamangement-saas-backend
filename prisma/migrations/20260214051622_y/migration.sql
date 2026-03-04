-- CreateEnum
CREATE TYPE "public"."Share" AS ENUM ('Only_Me', 'Invite_Staff');

-- CreateEnum
CREATE TYPE "public"."UploadCycle" AS ENUM ('Daily', 'Weekly', 'By_Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "public"."Days" AS ENUM ('Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat');

-- CreateEnum
CREATE TYPE "public"."ChartName" AS ENUM ('BAR', 'LINE', 'PIE', 'DOUGHNUT', 'RADAR', 'POLAR_AREA', 'BUBBLE', 'SCATTER', 'AREA', 'MIXED', 'GAUGE', 'FUNNEL', 'TREEMAP', 'SUNBURST', 'SANKEY', 'TABLE', 'HEATMAP', 'HORIZONTAL_BAR', 'STACK_BAR_HORIZONTAL', 'COLUMN', 'PARETO', 'HISTOGRAM', 'WATERFALL', 'CANDLESTICK', 'GEOGRAPHY_GRAPH', 'SPLINE');

-- CreateEnum
CREATE TYPE "public"."ChartStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEPRECATED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('VIEWER', 'EMPLOYEE', 'SUPPORTER', 'MANAGER', 'ADMIN', 'CLIENT', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('ENGLISH');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'HALFYEARLY', 'YEARLY', 'TWOYEARLY', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."IndustryCategory" AS ENUM ('REALESTATE', 'FINANCE', 'RENEWABLE_ENERGY', 'TRAVEL_AGENCY', 'BEAUTY_AND_WELLNESS');

-- CreateEnum
CREATE TYPE "public"."SupporterRole" AS ENUM ('CALLATTENDANCE', 'SUPPORTMANAGER', 'SALESOFFICER', 'SYSTEMENGINEER');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'NORMAL');

-- CreateEnum
CREATE TYPE "public"."ProjectCycle" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('PENDING', 'LIVE', 'DRAFT', 'OVERDUE', 'PROBLEM', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('INPROGRESS', 'COMPLETED', 'OVERDUE', 'NOSTART');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('OPEN', 'UNASSIGNED', 'IN_PROGRESS', 'SOLVED');

-- CreateEnum
CREATE TYPE "public"."IssueType" AS ENUM ('LOGINFAILED', 'SYSTEMERROR', 'OTHERPROBLEM');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'DELETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."ActivityActionType" AS ENUM ('ASSIGNEE_ADDED', 'ASSIGNEE_REMOVED', 'FILE_ADDED', 'FILE_REMOVED', 'LINK_ADDED', 'LINK_REMOVED', 'DUE_DATE_CHANGED', 'PROGRESS_CHANGED', 'SUBTASK_ADDED', 'SUBTASK_REMOVED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'TASK_CREATED', 'TASK_COMPLETED', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."SubmittedStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_EMPLOYEE_ASSIGNED', 'NEW_MANAGER_ASSIGNED', 'SUBMISSION_UPDATED_STATUS', 'PROJECT_SUBMITTED', 'PROJECT_STATUS_UPDATE', 'PROJECT_CREATED', 'REMINDER', 'SHEET_UPDATE_REQUEST', 'FILE_CREATED', 'ACTIVITY_CREATED');

-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "actionType" "public"."ActivityActionType" NOT NULL DEFAULT 'GENERAL',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "contactPersonName" TEXT,
    "clientLogo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "footerText" TEXT,
    "supportMail" TEXT,
    "subdomain" TEXT,
    "serverLocation" TEXT,
    "category" "public"."IndustryCategory" NOT NULL DEFAULT 'REALESTATE',
    "onboarding" BOOLEAN NOT NULL DEFAULT false,
    "welcomeDashboard" BOOLEAN NOT NULL DEFAULT false,
    "chartList" TEXT[],
    "storage" TEXT,
    "threshold" INTEGER,
    "archiveAfter" INTEGER,
    "userWarning" BOOLEAN NOT NULL DEFAULT false,
    "adminNote" TEXT,
    "trialPeriod" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "skills" TEXT[],
    "description" TEXT,
    "joinedDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."managers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "skills" TEXT[],
    "description" TEXT,
    "joinedDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverIds" TEXT[],
    "projectId" TEXT,
    "context" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_provisions" (
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "notification_provisions_pkey" PRIMARY KEY ("userId","notificationId")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "returnProject" BOOLEAN NOT NULL DEFAULT true,
    "assignNewProject" BOOLEAN NOT NULL DEFAULT true,
    "projectPublish" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_manager" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileImportByEmployees" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "createNewProject" BOOLEAN NOT NULL DEFAULT true,
    "submittedProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onProjectApproval" BOOLEAN NOT NULL DEFAULT true,
    "onProjectRejection" BOOLEAN NOT NULL DEFAULT true,
    "fileImportByEmployees" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "billPayment" BOOLEAN NOT NULL DEFAULT true,
    "overdueProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_supporter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignNewProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_supporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "receivedPayment" BOOLEAN NOT NULL DEFAULT true,
    "createClient" BOOLEAN NOT NULL DEFAULT true,
    "createTicket" BOOLEAN NOT NULL DEFAULT true,
    "paymentCycleChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_permissions_super_admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "receivedPayment" BOOLEAN NOT NULL DEFAULT true,
    "createClient" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_super_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."programs" (
    "id" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "datetime" TEXT NOT NULL,
    "programDescription" TEXT NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "deadline" TEXT,
    "progress" INTEGER,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "managerId" TEXT,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shareWith" "public"."Share" NOT NULL DEFAULT 'Only_Me',
    "dateDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "programId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "progress" INTEGER,
    "uploadCycle" "public"."UploadCycle",
    "slug" TEXT,
    "computedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "metadata" JSONB DEFAULT '{}',
    "nodeType" TEXT,
    "projectCompleteDate" TIMESTAMP(3),
    "description" TEXT,
    "sortName" TEXT,
    "currentRate" TEXT,
    "startDate" TIMESTAMP(3),
    "SelectDays" "public"."Days"[],
    "UploadData" TEXT,
    "selectDate" TIMESTAMP(3)[],
    "location" TEXT,
    "deadline" TIMESTAMP(3),
    "budget" TEXT,
    "workingDay" "public"."Days"[],
    "chartList" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_employees" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_viewers" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_viewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskAssignId" TEXT,
    "status" "public"."ProjectStatus" NOT NULL,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submission_returns" (
    "id" TEXT NOT NULL,
    "submittedId" TEXT NOT NULL,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submitted" (
    "id" TEXT NOT NULL,
    "information" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "status" "public"."SubmittedStatus" NOT NULL DEFAULT 'PENDING',
    "employeeId" TEXT,
    "projectId" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "submiteCells" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submitted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."super_admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "clientLogo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supporters" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "supporterRole" "public"."SupporterRole" NOT NULL,
    "skills" TEXT[],
    "workload" INTEGER,
    "workItems" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supporters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "status" "public"."TaskStatus",
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "progress" INTEGER,
    "dueDate" TEXT,
    "assignedTo" TEXT NOT NULL,
    "assigneeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerid" TEXT NOT NULL,
    "chartList" TEXT[],

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."programmbuildertemplates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerid" TEXT NOT NULL,
    "charid" TEXT NOT NULL,

    CONSTRAINT "programmbuildertemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "supporterIds" TEXT[],
    "adminIds" TEXT[],
    "companyName" TEXT,
    "subject" TEXT NOT NULL,
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "public"."Priority" NOT NULL,
    "issue" TEXT NOT NULL,
    "adminNote" TEXT,
    "attachFile" TEXT,
    "issueType" "public"."IssueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'VIEWER',
    "profileImage" TEXT,
    "language" "public"."Language" NOT NULL DEFAULT 'ENGLISH',
    "timezone" TIMESTAMP(3),
    "verification2FA" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userStatus" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."referred_persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" INTEGER,
    "aboutThere" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referred_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request_to_add_project_members" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "projectId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_to_add_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."viewers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "skills" TEXT[],
    "description" TEXT,
    "joinedDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "filter_By" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "barChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HorizontalBarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HorizontalBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pi" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER,
    "lastFieldDataset" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "Pi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HeatMapChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HeatMapChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AreaChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "AreaChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MultiAxisChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "MultiAxisChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ColumnChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ColumnChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackedBarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "StackedBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoughnutChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "DoughnutChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParetoChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "Left_firstFieldDataset" INTEGER NOT NULL,
    "Left_lastFieldDataset" INTEGER NOT NULL,
    "Right_firstFieldDataset" INTEGER NOT NULL,
    "Right_lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ParetoChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistogramChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HistogramChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScatterChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ScatterChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolidGaugeChart" (
    "id" TEXT NOT NULL,
    "startingRange" INTEGER NOT NULL,
    "endRange" INTEGER NOT NULL,
    "gaugeValue" INTEGER NOT NULL,
    "chartHight" INTEGER NOT NULL,
    "startAngle" INTEGER NOT NULL,
    "endAngle" INTEGER NOT NULL,
    "trackColor" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "valueFontSize" INTEGER NOT NULL,
    "shadeIntensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "SolidGaugeChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunnelChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "FunnelChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaterFallChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "WaterFallChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandlestickChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "CandlestickChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RadarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "RadarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "filter_By" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "barChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HorizontalBarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HorizontalBarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Piprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER,
    "lastFieldDataset" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "Piprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HeatMapChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HeatMapChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AreaChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "AreaChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MultiAxisChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "MultiAxisChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ColumnChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ColumnChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackedBarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "StackedBarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoughnutChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "DoughnutChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParetoChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "Left_firstFieldDataset" INTEGER NOT NULL,
    "Left_lastFieldDataset" INTEGER NOT NULL,
    "Right_firstFieldDataset" INTEGER NOT NULL,
    "Right_lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ParetoChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistogramChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HistogramChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScatterChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ScatterChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolidGaugeChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "startingRange" INTEGER NOT NULL,
    "endRange" INTEGER NOT NULL,
    "gaugeValue" INTEGER NOT NULL,
    "chartHight" INTEGER NOT NULL,
    "startAngle" INTEGER NOT NULL,
    "endAngle" INTEGER NOT NULL,
    "trackColor" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "valueFontSize" INTEGER NOT NULL,
    "shadeIntensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "SolidGaugeChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunnelChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "FunnelChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaterFallChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "WaterFallChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandlestickChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "CandlestickChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RadarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "RadarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChartTable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grouptitle" TEXT NOT NULL,
    "parentId" TEXT,
    "status" "public"."ChartStatus" NOT NULL DEFAULT 'INACTIVE',
    "category" "public"."ChartName" NOT NULL,
    "xAxis" JSONB NOT NULL,
    "yAxis" JSONB,
    "zAxis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sheetId" TEXT,
    "projectId" TEXT
);

-- CreateTable
CREATE TABLE "public"."ChartHistory" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT,

    CONSTRAINT "ChartHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chartnumber" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Chartnumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChartTableProgramBuilder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectnumber" INTEGER NOT NULL,
    "status" "public"."ChartStatus" NOT NULL DEFAULT 'INACTIVE',
    "category" "public"."ChartName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "programid" TEXT,

    CONSTRAINT "ChartTableProgramBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChartHistoryprogrambuilder" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT,

    CONSTRAINT "ChartHistoryprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Valuediteact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "charttableId" TEXT NOT NULL,
    "rowname" TEXT NOT NULL,

    CONSTRAINT "Valuediteact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favourite_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favourite_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheetId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InfrastructureNode" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nodeType" TEXT,
    "programId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL DEFAULT 'NONE',
    "actualHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plannedHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plannedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plannedResourceCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress" DOUBLE PRECISION,
    "computedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "InfrastructureNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reminder" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "nextTriggerAt" TIMESTAMP(3),
    "repeatEvery" "public"."UploadCycle",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "repeatOnDays" "public"."DayOfWeek"[],
    "repeatOnDates" INTEGER[],
    "remindBefore" INTEGER,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RootChart" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "RootChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SheetSnapshot" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SheetSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submiteCell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submiteCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Widget" (
    "id" TEXT NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barChartId" TEXT,
    "horizontalBarChartId" TEXT,
    "piChartId" TEXT,
    "heatMapChartId" TEXT,
    "areaChartId" TEXT,
    "multiAxisChartId" TEXT,
    "columnChartId" TEXT,
    "stackedBarChartId" TEXT,
    "doughnutChartId" TEXT,
    "paretoChartId" TEXT,
    "histogramChartId" TEXT,
    "scatterChartId" TEXT,
    "solidGaugeChartId" TEXT,
    "funnelChartId" TEXT,
    "waterFallChartId" TEXT,
    "candlestickChartId" TEXT,
    "radarChartId" TEXT,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WidgetProgramBuilder" (
    "id" TEXT NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barChartId" TEXT,
    "horizontalBarChartId" TEXT,
    "pieChartId" TEXT,
    "heatmapChartId" TEXT,
    "areaChartId" TEXT,
    "multiAxisChartId" TEXT,
    "columnChartId" TEXT,
    "stackedBarChartId" TEXT,
    "doughnutChartId" TEXT,
    "paretoChartId" TEXT,
    "histogramChartId" TEXT,
    "scatterChartId" TEXT,
    "solidGaugeChartId" TEXT,
    "funnelChartId" TEXT,
    "waterFallChartId" TEXT,
    "candlestickChartId" TEXT,
    "radarChartId" TEXT,

    CONSTRAINT "WidgetProgramBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "public"."clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "public"."clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "public"."employees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "otp_verifications_email_key" ON "public"."otp_verifications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "public"."payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "managers_userId_key" ON "public"."managers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_employee_userId_key" ON "public"."notification_permissions_employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_manager_userId_key" ON "public"."notification_permissions_manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_client_userId_key" ON "public"."notification_permissions_client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_supporter_userId_key" ON "public"."notification_permissions_supporter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_admin_userId_key" ON "public"."notification_permissions_admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_super_admin_userId_key" ON "public"."notification_permissions_super_admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "projects_programId_idx" ON "public"."projects"("programId");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "projects_managerId_idx" ON "public"."projects"("managerId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "public"."projects"("status");

-- CreateIndex
CREATE INDEX "projects_priority_idx" ON "public"."projects"("priority");

-- CreateIndex
CREATE INDEX "projects_deadline_idx" ON "public"."projects"("deadline");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "public"."projects"("createdAt");

-- CreateIndex
CREATE INDEX "projects_updatedAt_idx" ON "public"."projects"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_employees_projectId_employeeId_key" ON "public"."project_employees"("projectId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "project_viewers_projectId_viewerId_key" ON "public"."project_viewers"("projectId", "viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "submission_returns_submittedId_key" ON "public"."submission_returns"("submittedId");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_userId_key" ON "public"."super_admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supporters_userId_key" ON "public"."supporters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "public"."users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "viewers_userId_key" ON "public"."viewers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "barChart_ChartTableId_key" ON "public"."barChart"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HorizontalBarChart_chartTableId_key" ON "public"."HorizontalBarChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "Pi_chartTableId_key" ON "public"."Pi"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapChart_chartTableId_key" ON "public"."HeatMapChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaChart_chartTableId_key" ON "public"."AreaChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiAxisChart_chartTableId_key" ON "public"."MultiAxisChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnChart_chartTableId_key" ON "public"."ColumnChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "StackedBarChart_ChartTableId_key" ON "public"."StackedBarChart"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "DoughnutChart_chartTableId_key" ON "public"."DoughnutChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ParetoChart_chartTableId_key" ON "public"."ParetoChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HistogramChart_chartTableId_key" ON "public"."HistogramChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ScatterChart_chartTableId_key" ON "public"."ScatterChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "SolidGaugeChart_chartTableId_key" ON "public"."SolidGaugeChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "FunnelChart_chartTableId_key" ON "public"."FunnelChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterFallChart_chartTableId_key" ON "public"."WaterFallChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "CandlestickChart_chartTableId_key" ON "public"."CandlestickChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "RadarChart_chartTableId_key" ON "public"."RadarChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "barChartprogrambuilder_ChartTableId_key" ON "public"."barChartprogrambuilder"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HorizontalBarChartprogrambuilder_chartTableId_key" ON "public"."HorizontalBarChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "Piprogrambuilder_chartTableId_key" ON "public"."Piprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapChartprogrambuilder_chartTableId_key" ON "public"."HeatMapChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaChartprogrambuilder_chartTableId_key" ON "public"."AreaChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiAxisChartprogrambuilder_chartTableId_key" ON "public"."MultiAxisChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnChartprogrambuilder_chartTableId_key" ON "public"."ColumnChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "StackedBarChartprogrambuilder_ChartTableId_key" ON "public"."StackedBarChartprogrambuilder"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "DoughnutChartprogrambuilder_chartTableId_key" ON "public"."DoughnutChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ParetoChartprogrambuilder_chartTableId_key" ON "public"."ParetoChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HistogramChartprogrambuilder_chartTableId_key" ON "public"."HistogramChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ScatterChartprogrambuilder_chartTableId_key" ON "public"."ScatterChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "SolidGaugeChartprogrambuilder_chartTableId_key" ON "public"."SolidGaugeChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "FunnelChartprogrambuilder_chartTableId_key" ON "public"."FunnelChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterFallChartprogrambuilder_chartTableId_key" ON "public"."WaterFallChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "CandlestickChartprogrambuilder_chartTableId_key" ON "public"."CandlestickChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "RadarChartprogrambuilder_chartTableId_key" ON "public"."RadarChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_id_key" ON "public"."ChartTable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_grouptitle_key" ON "public"."ChartTable"("grouptitle");

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_sheetId_key" ON "public"."ChartTable"("sheetId");

-- CreateIndex
CREATE INDEX "favourite_projects_userId_idx" ON "public"."favourite_projects"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favourite_projects_userId_projectId_key" ON "public"."favourite_projects"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureNode_slug_key" ON "public"."InfrastructureNode"("slug");

-- CreateIndex
CREATE INDEX "InfrastructureNode_projectId_idx" ON "public"."InfrastructureNode"("projectId");

-- CreateIndex
CREATE INDEX "InfrastructureNode_parentId_idx" ON "public"."InfrastructureNode"("parentId");

-- CreateIndex
CREATE INDEX "InfrastructureNode_isLeaf_idx" ON "public"."InfrastructureNode"("isLeaf");

-- CreateIndex
CREATE INDEX "InfrastructureNode_slug_id_idx" ON "public"."InfrastructureNode"("slug", "id");

-- CreateIndex
CREATE INDEX "Reminder_projectId_idx" ON "public"."Reminder"("projectId");

-- CreateIndex
CREATE INDEX "Reminder_nextTriggerAt_idx" ON "public"."Reminder"("nextTriggerAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_chartId_key" ON "public"."Sheet"("projectId", "chartId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheetId_row_col_key" ON "public"."Cell"("sheetId", "row", "col");

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otp_verifications" ADD CONSTRAINT "otp_verifications_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."managers" ADD CONSTRAINT "managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_provisions" ADD CONSTRAINT "notification_provisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_provisions" ADD CONSTRAINT "notification_provisions_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "public"."notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_employee" ADD CONSTRAINT "notification_permissions_employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_manager" ADD CONSTRAINT "notification_permissions_manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_client" ADD CONSTRAINT "notification_permissions_client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_supporter" ADD CONSTRAINT "notification_permissions_supporter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_admin" ADD CONSTRAINT "notification_permissions_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_permissions_super_admin" ADD CONSTRAINT "notification_permissions_super_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."super_admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programs" ADD CONSTRAINT "programs_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programs" ADD CONSTRAINT "programs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_employees" ADD CONSTRAINT "project_employees_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_employees" ADD CONSTRAINT "project_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_viewers" ADD CONSTRAINT "project_viewers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_viewers" ADD CONSTRAINT "project_viewers_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "public"."viewers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission_returns" ADD CONSTRAINT "submission_returns_submittedId_fkey" FOREIGN KEY ("submittedId") REFERENCES "public"."Submitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submitted" ADD CONSTRAINT "Submitted_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submitted" ADD CONSTRAINT "Submitted_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supporters" ADD CONSTRAINT "supporters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."referred_persons" ADD CONSTRAINT "referred_persons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_to_add_project_members" ADD CONSTRAINT "request_to_add_project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_to_add_project_members" ADD CONSTRAINT "request_to_add_project_members_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."viewers" ADD CONSTRAINT "viewers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barChart" ADD CONSTRAINT "barChart_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HorizontalBarChart" ADD CONSTRAINT "HorizontalBarChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pi" ADD CONSTRAINT "Pi_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HeatMapChart" ADD CONSTRAINT "HeatMapChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AreaChart" ADD CONSTRAINT "AreaChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiAxisChart" ADD CONSTRAINT "MultiAxisChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ColumnChart" ADD CONSTRAINT "ColumnChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackedBarChart" ADD CONSTRAINT "StackedBarChart_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoughnutChart" ADD CONSTRAINT "DoughnutChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParetoChart" ADD CONSTRAINT "ParetoChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistogramChart" ADD CONSTRAINT "HistogramChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScatterChart" ADD CONSTRAINT "ScatterChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolidGaugeChart" ADD CONSTRAINT "SolidGaugeChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunnelChart" ADD CONSTRAINT "FunnelChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaterFallChart" ADD CONSTRAINT "WaterFallChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandlestickChart" ADD CONSTRAINT "CandlestickChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadarChart" ADD CONSTRAINT "RadarChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barChartprogrambuilder" ADD CONSTRAINT "barChartprogrambuilder_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HorizontalBarChartprogrambuilder" ADD CONSTRAINT "HorizontalBarChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Piprogrambuilder" ADD CONSTRAINT "Piprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HeatMapChartprogrambuilder" ADD CONSTRAINT "HeatMapChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AreaChartprogrambuilder" ADD CONSTRAINT "AreaChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiAxisChartprogrambuilder" ADD CONSTRAINT "MultiAxisChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ColumnChartprogrambuilder" ADD CONSTRAINT "ColumnChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackedBarChartprogrambuilder" ADD CONSTRAINT "StackedBarChartprogrambuilder_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoughnutChartprogrambuilder" ADD CONSTRAINT "DoughnutChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParetoChartprogrambuilder" ADD CONSTRAINT "ParetoChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistogramChartprogrambuilder" ADD CONSTRAINT "HistogramChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScatterChartprogrambuilder" ADD CONSTRAINT "ScatterChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolidGaugeChartprogrambuilder" ADD CONSTRAINT "SolidGaugeChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunnelChartprogrambuilder" ADD CONSTRAINT "FunnelChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaterFallChartprogrambuilder" ADD CONSTRAINT "WaterFallChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandlestickChartprogrambuilder" ADD CONSTRAINT "CandlestickChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadarChartprogrambuilder" ADD CONSTRAINT "RadarChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ChartTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartHistory" ADD CONSTRAINT "ChartHistory_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartTableProgramBuilder" ADD CONSTRAINT "ChartTableProgramBuilder_programid_fkey" FOREIGN KEY ("programid") REFERENCES "public"."programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartHistoryprogrambuilder" ADD CONSTRAINT "ChartHistoryprogrambuilder_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valuediteact" ADD CONSTRAINT "Valuediteact_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favourite_projects" ADD CONSTRAINT "favourite_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."InfrastructureNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RootChart" ADD CONSTRAINT "RootChart_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sheet" ADD CONSTRAINT "Sheet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SheetSnapshot" ADD CONSTRAINT "SheetSnapshot_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_horizontalBarChartId_fkey" FOREIGN KEY ("horizontalBarChartId") REFERENCES "public"."HorizontalBarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_piChartId_fkey" FOREIGN KEY ("piChartId") REFERENCES "public"."Pi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_heatMapChartId_fkey" FOREIGN KEY ("heatMapChartId") REFERENCES "public"."HeatMapChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_areaChartId_fkey" FOREIGN KEY ("areaChartId") REFERENCES "public"."AreaChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_multiAxisChartId_fkey" FOREIGN KEY ("multiAxisChartId") REFERENCES "public"."MultiAxisChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_columnChartId_fkey" FOREIGN KEY ("columnChartId") REFERENCES "public"."ColumnChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_stackedBarChartId_fkey" FOREIGN KEY ("stackedBarChartId") REFERENCES "public"."StackedBarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_doughnutChartId_fkey" FOREIGN KEY ("doughnutChartId") REFERENCES "public"."DoughnutChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_paretoChartId_fkey" FOREIGN KEY ("paretoChartId") REFERENCES "public"."ParetoChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_histogramChartId_fkey" FOREIGN KEY ("histogramChartId") REFERENCES "public"."HistogramChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_scatterChartId_fkey" FOREIGN KEY ("scatterChartId") REFERENCES "public"."ScatterChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_solidGaugeChartId_fkey" FOREIGN KEY ("solidGaugeChartId") REFERENCES "public"."SolidGaugeChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_funnelChartId_fkey" FOREIGN KEY ("funnelChartId") REFERENCES "public"."FunnelChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_waterFallChartId_fkey" FOREIGN KEY ("waterFallChartId") REFERENCES "public"."WaterFallChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_candlestickChartId_fkey" FOREIGN KEY ("candlestickChartId") REFERENCES "public"."CandlestickChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_radarChartId_fkey" FOREIGN KEY ("radarChartId") REFERENCES "public"."RadarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_horizontalBarChartId_fkey" FOREIGN KEY ("horizontalBarChartId") REFERENCES "public"."HorizontalBarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_pieChartId_fkey" FOREIGN KEY ("pieChartId") REFERENCES "public"."Piprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_heatmapChartId_fkey" FOREIGN KEY ("heatmapChartId") REFERENCES "public"."HeatMapChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_areaChartId_fkey" FOREIGN KEY ("areaChartId") REFERENCES "public"."AreaChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_multiAxisChartId_fkey" FOREIGN KEY ("multiAxisChartId") REFERENCES "public"."MultiAxisChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_columnChartId_fkey" FOREIGN KEY ("columnChartId") REFERENCES "public"."ColumnChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_stackedBarChartId_fkey" FOREIGN KEY ("stackedBarChartId") REFERENCES "public"."StackedBarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_doughnutChartId_fkey" FOREIGN KEY ("doughnutChartId") REFERENCES "public"."DoughnutChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_paretoChartId_fkey" FOREIGN KEY ("paretoChartId") REFERENCES "public"."ParetoChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_histogramChartId_fkey" FOREIGN KEY ("histogramChartId") REFERENCES "public"."HistogramChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_scatterChartId_fkey" FOREIGN KEY ("scatterChartId") REFERENCES "public"."ScatterChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_solidGaugeChartId_fkey" FOREIGN KEY ("solidGaugeChartId") REFERENCES "public"."SolidGaugeChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_funnelChartId_fkey" FOREIGN KEY ("funnelChartId") REFERENCES "public"."FunnelChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_waterFallChartId_fkey" FOREIGN KEY ("waterFallChartId") REFERENCES "public"."WaterFallChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_candlestickChartId_fkey" FOREIGN KEY ("candlestickChartId") REFERENCES "public"."CandlestickChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_radarChartId_fkey" FOREIGN KEY ("radarChartId") REFERENCES "public"."RadarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
