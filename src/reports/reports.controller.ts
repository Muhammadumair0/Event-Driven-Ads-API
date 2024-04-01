import Sequelize from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Controller, Get, Param } from '@nestjs/common';
import { User } from '../users/user.model';
import { User_Ad } from '../hooks/user_ad.model';
import { Op } from 'sequelize';

@Controller('reports')
export class ReportsController {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(User_Ad)
    private userAdModel: typeof User_Ad,
  ) {}

  @Get()
  async reports() {
    const read = (
      await this.userAdModel.findAll({
        where: {
          isRead: true,
        },
        attributes: [
          [Sequelize.fn('avg', Sequelize.col('period')), 'read_rate'],
        ],
      })
    )[0].toJSON();
    return { avg_read_rate: Number(read.read_rate) };
  }

  @Get('ads/:id')
  async ad_reports(@Param('id') id: number) {
    const count = await this.userModel.count();
    const matched = await this.userAdModel.count({
      where: {
        ad: id,
      },
    });
    const read = await this.userAdModel.count({
      where: {
        ad: id,
        isRead: true,
      },
    });

    return {
      rate_of_users_matched: Math.round((matched * 100) / count) / 100,
      rate_of_users_read: Math.round((read * 100) / matched) / 100,
    };
  }
}
