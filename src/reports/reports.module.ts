import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { User_Ad } from '../hooks/user_ad.model';

@Module({
  imports: [SequelizeModule.forFeature([User, User_Ad])],
  controllers: [ReportsController],
})
export class ReportsModule {}
