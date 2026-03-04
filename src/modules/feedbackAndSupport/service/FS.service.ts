import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, CreateSupportDto, UpdateSupportDto } from '../dto/feedback.dto';

@Injectable()
export class FSService {
  constructor(private readonly prisma: PrismaService) {}


  
  private async findOrThrow(model: 'feedback' | 'contactSupport', id: string, clientId: string) {
    const record = await (this.prisma[model] as any).findFirst({ where: { id, clientId } });
    if (!record) throw new NotFoundException(`${model} record not found`);
    return record;
  }



  async createFeedback(clientId: string, data: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data: { ...data, clientId } });
  }

  async getAllFeedbacks(clientId: string) {
    return this.prisma.feedback.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' } });
  }

  async getFeedbackById(id: string, clientId: string) {
    return this.findOrThrow('feedback', id, clientId);
  }

  async updateFeedback(id: string, clientId: string, data: UpdateFeedbackDto) {
    await this.findOrThrow('feedback', id, clientId);
    return this.prisma.feedback.update({ where: { id }, data });
  }

  async deleteFeedback(id: string, clientId: string) {
    await this.findOrThrow('feedback', id, clientId);
    return this.prisma.feedback.delete({ where: { id } });
  }


  async createSupport(clientId: string, data: CreateSupportDto) {
    return this.prisma.contactSupport.create({ data: { ...data, clientId } });
  }

  async getAllSupport(clientId: string) {
    return this.prisma.contactSupport.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' } });
  }

  async getSupportById(id: string, clientId: string) {
    return this.findOrThrow('contactSupport', id, clientId);
  }

  async updateSupport(id: string, clientId: string, data: UpdateSupportDto) {
    await this.findOrThrow('contactSupport', id, clientId);
    return this.prisma.contactSupport.update({ where: { id }, data });
  }

  async deleteSupport(id: string, clientId: string) {
    await this.findOrThrow('contactSupport', id, clientId);
    return this.prisma.contactSupport.delete({ where: { id } });
  }
}