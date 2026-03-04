import {
    Controller, Post, Get, Patch, Delete,
    Body, Param, Req, UseGuards, HttpStatus, HttpCode, 
    UseInterceptors, UploadedFiles, UnauthorizedException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

import { FSService } from '../service/FS.service';

import {
    CreateFeedbackDto, UpdateFeedbackDto,
    CreateSupportDto, UpdateSupportDto
} from '../dto/feedback.dto';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { multerOptions } from 'src/modules/utils/config/multer.config';


@UseGuards(JwtAuthGuard)
// @Roles('CLIENT') 
@Controller('support-feedback')
export class FSController {
    constructor(private readonly service: FSService) { }


    @Post('feedback')
    @UseInterceptors(FilesInterceptor('file', 5, multerOptions))
    @ApiConsumes('multipart/form-data')
    async createFeedback(@Req() req, @Body() dto: CreateFeedbackDto, @UploadedFiles() files: Express.Multer.File[]) {
        const clientId = req.user.clientId;
        if (!clientId) throw new UnauthorizedException('Client ID not found');

        if (files?.length) dto.file = files.map(f => f.path);
        const data = await this.service.createFeedback(clientId, dto);
        return { message: 'Feedback submitted successfully', data };
    }

    @Get('feedback')
    async getAllFeedbacks(@Req() req) {
        const clientId = req.user.clientId;
        const data = await this.service.getAllFeedbacks(clientId);
        return { message: 'Feedbacks retrieved successfully', data };
    }

    @Get('feedback/:id')
    async getFeedback(@Req() req, @Param('id') id: string) {
        const clientId = req.user.clientId;
        const data = await this.service.getFeedbackById(id, clientId);
        return { message: 'Feedback details retrieved', data };
    }


    @Patch('feedback/:id')
    @UseInterceptors(FilesInterceptor('file', 5, multerOptions))
    @ApiConsumes('multipart/form-data')
    async updateFeedback(@Req() req, @Param('id') id: string, @Body() dto: UpdateFeedbackDto, @UploadedFiles() files: Express.Multer.File[]) {
        const clientId = req.user.clientId;
        if (files?.length) dto.file = files.map(f => f.path);
        const data = await this.service.updateFeedback(id, clientId, dto);
        return { message: 'Feedback updated successfully', data };
    }


    @Delete('feedback/:id')
    @HttpCode(HttpStatus.OK)
    async deleteFeedback(@Req() req, @Param('id') id: string) {
        const clientId = req.user.clientId;
        await this.service.deleteFeedback(id, clientId);
        return { message: 'Feedback deleted successfully' };
    }


    // SUPPORT SECTION
    @Post('support')
    @UseInterceptors(FilesInterceptor('file', 5, multerOptions))
    @ApiConsumes('multipart/form-data')
    async createSupport(@Req() req, @Body() dto: CreateSupportDto, @UploadedFiles() files: Express.Multer.File[]) {
        const clientId = req.user.clientId;
        if (!clientId) throw new UnauthorizedException('Client ID not found');

        if (files?.length) dto.file = files.map(f => f.path);
        const data = await this.service.createSupport(clientId, dto);
        return { message: 'Support  created successfully', data };
    }

    @Get('support')
    async getAllSupport(@Req() req) {
        const clientId = req.user.clientId;
        const data = await this.service.getAllSupport(clientId);
        return { message: 'Support  retrieved successfully', data };
    }

    @Get('support/:id')
    async getSupport(@Req() req, @Param('id') id: string) {
        const clientId = req.user.clientId;
        const data = await this.service.getSupportById(id, clientId);
        return { message: 'Support  details retrieved', data };
    }

    @Patch('support/:id')
    @UseInterceptors(FilesInterceptor('file', 5, multerOptions))
    @ApiConsumes('multipart/form-data')
    async updateSupport(@Req() req, @Param('id') id: string, @Body() dto: UpdateSupportDto, @UploadedFiles() files: Express.Multer.File[]) {
        const clientId = req.user.clientId;
        if (files?.length) dto.file = files.map(f => f.path);
        const data = await this.service.updateSupport(id, clientId, dto);
        return { message: 'Support  updated successfully', data };
    }

    @Delete('support/:id')
    @HttpCode(HttpStatus.OK)
    async deleteSupport(@Req() req, @Param('id') id: string) {
        const clientId = req.user.clientId;
        await this.service.deleteSupport(id, clientId);
        return { message: 'Support  deleted successfully' };
    }
}