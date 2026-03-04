import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InfrastructureNodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProjectById(projectId: string) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        nodes: true,
      },
    });
  }

  async findByProjectSlug(slug: string) {
    return this.prisma.project.findUnique({
      where: { slug },
    });
  }

  async findNodeById(nodeId: string) {
    return this.prisma.infrastructureNode.findUnique({
      where: { id: nodeId },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async findNodeBySlug(slug: string) {
    return this.prisma.infrastructureNode.findUnique({
      where: { slug },
    });
  }

  async findNodeWithChildren(nodeId: string) {
    return this.prisma.infrastructureNode.findUnique({
      where: { id: nodeId },
      include: {
        children: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async updateProjectProgress(projectId: string, computedProgress: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { computedProgress },
    });
  }

  async findAllNodesByProject(projectId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }
  findRootNodes(projectId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { projectId, parentId: null },
      orderBy: { createdAt: 'asc' },
    });
  }
  // updateNode(id: string, data: Prisma.InfrastructureNodeUpdateInput) {
  //   return this.prisma.infrastructureNode.update({
  //     where: { id },
  //     data,
  //   });
  // }
  // async createNode(data: Prisma.InfrastructureNodeCreateInput) {
  //   return await this.prisma.infrastructureNode.create({
  //     data,
  //   });
  // }




  async createNode(data: any) {
    return this.prisma.infrastructureNode.create({
      data: {
        ...data,
        progress: data.progress || [],
        computedProgress: data.computedProgress || [],
      },
    });
  }

  async updateNode(nodeId: string, data: any) {
    return this.prisma.infrastructureNode.update({
      where: { id: nodeId },
      data: {
        ...data,
        // Ensure progress fields are properly handled
        progress: data.progress !== undefined ? data.progress : undefined,
        computedProgress: data.computedProgress !== undefined ? data.computedProgress : undefined,
      },
    });
  }

  
  findChildren(parentId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
    });
  }
  deleteNode(id: string) {
    return this.prisma.infrastructureNode.delete({ where: { id } });
  }
  countChildren(parentId: string) {
    return this.prisma.infrastructureNode.count({ where: { parentId } });
  }
}
