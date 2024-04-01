import { InjectModel } from '@nestjs/sequelize';
import { Controller, Get, Query } from '@nestjs/common';
import { User_Ad } from '../hooks/user_ad.model';
import { Ad } from './ad.model';

@Controller('ads')
export class AdsController {
  constructor(
    @InjectModel(User_Ad)
    private userAdModel: typeof User_Ad,
    @InjectModel(Ad)
    private adModel: typeof Ad,
  ) {}

  @Get()
  async all() {
    return this.adModel.findAll();
  }

  @Get('matched')
  async matched(@Query('user') userId: number) {
    return this.userAdModel.findAll({
      where: { user: userId },
    });
  }

  @Get('read')
  async read(@Query('user') userId: number) {
    return this.userAdModel.findAll({
      where: { user: userId, isRead: true },
    });
  }
}
