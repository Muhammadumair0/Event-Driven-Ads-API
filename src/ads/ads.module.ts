import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User_Ad } from '../hooks/user_ad.model';
import { Ad } from './ad.model';
import { AdsController } from './ads.controller';

@Module({
  controllers: [AdsController],
  imports: [SequelizeModule.forFeature([Ad, User_Ad])],
})
export class AdsModule {}
