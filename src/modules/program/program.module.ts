import { Module } from '@nestjs/common';
import { ProgramController } from './controller/program.controller';
import { ProgramService } from './service/program.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { ProgramProjectService } from './service/programproject.services';

@Module({
  imports: [PrismaModule],
  controllers: [ProgramController,TagController],
  providers: [ProgramService , ProgramProjectService ,TagService],
})
export class ProgramModule {}
