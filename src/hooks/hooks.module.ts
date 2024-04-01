import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HooksController } from './hooks.controller';
import { AdMatchedListener } from './listeners/ad-matched.listener';
import { AdReadListener } from './listeners/ad-read.listener';
import { User_Ad } from './user_ad.model';

@Module({
  imports: [SequelizeModule.forFeature([User_Ad])],
  controllers: [HooksController],
  providers: [AdMatchedListener, AdReadListener],
})
export class HooksModule {}
