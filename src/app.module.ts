import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './modules/utils/utils.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProgramModule } from './modules/program/program.module';
import { ProjectModule } from './modules/project/project.module';
import { SubmittedModule } from './modules/submitted/submitted.module';
import { ClientModule } from './modules/client/client.module';
import { ActivityModule } from './modules/activity/activity.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RedisModule } from './common/db/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ChartModule } from './modules/chart/chart.module';
import { SeedService } from './common/seed/seed.services';
import { EmployeeModule } from './modules/employee/employee.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { ManagerModule } from './modules/manager/manager.module';
import { FavoriteModule } from './modules/favouriteProject/favourite.module';
import { TemplateModule } from './modules/template/template.module';
import { FSModule } from './modules/feedbackAndSupport/FS.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const username = redisConfig.username;
        const password = redisConfig.password;

        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            ...(username &&
              password && {
                username,
                password,
                tls: {
                  rejectUnauthorized: false,
                },
              }),
          },
        };
      },
      inject: [ConfigService],
    }),

    BullModule.registerQueue({ name: 'notification' }),

    PrismaModule,
    UtilsModule,
    UserModule,
    AuthModule,
    ProgramModule,
    ProjectModule,
    SubmittedModule,
    ClientModule,
    EmployeeModule,
    ManagerModule,
    ActivityModule,
    NotificationModule,
    RedisModule,
    ChartModule,
    SheetModule,
    InfrastructureModule,
    FavoriteModule,
    TemplateModule,
    FSModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, SeedService],
})
export class AppModule {}
