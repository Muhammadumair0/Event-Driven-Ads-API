import { InjectModel } from '@nestjs/sequelize';
import { Controller, Post } from '@nestjs/common';
import { User } from '../users/user.model';
import { Ad } from '../ads/ad.model';
import { User_Ad } from '../hooks/user_ad.model';

@Controller('seed')
export class SeederController {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Ad)
    private adModel: typeof Ad,
    @InjectModel(User_Ad)
    private userAdModel: typeof User_Ad,
  ) {}

  @Post()
  async seed() {
    await this.userModel.upsert({
      firstName: 'Hamid',
      lastName: 'Zahir',
      username: 'zahir',
    });
    await this.userModel.upsert({
      firstName: 'Umair',
      lastName: 'Khan',
      username: 'khan',
    });
    await this.userModel.upsert({
      firstName: 'Simone',
      lastName: 'Erl',
      username: 'erl',
    });
    await this.userModel.upsert({
      firstName: 'Sarah',
      lastName: 'Salim',
      username: 'salim',
    });

    await this.adModel.upsert({ targetingCriteria: 'fashion' });
    await this.adModel.upsert({ targetingCriteria: 'crypto' });

    await this.userAdModel.destroy({
      where: {},
    });
  }
}
