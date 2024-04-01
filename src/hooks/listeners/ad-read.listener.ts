import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User_Ad } from '../user_ad.model';
import { AdReadEvent } from '../events/ad-read.event';

@Injectable()
export class AdReadListener {
  constructor(
    @InjectModel(User_Ad)
    private userAdModel: typeof User_Ad,
  ) {}

  @OnEvent('ad.read')
  handleAdMatchedEvent(event: AdReadEvent) {
    this.userAdModel.update(
      {
        isRead: true,
        period: event.period,
      },
      {
        where: {
          user: event.user,
          ad: event.ad,
        },
      },
    );
  }
}
