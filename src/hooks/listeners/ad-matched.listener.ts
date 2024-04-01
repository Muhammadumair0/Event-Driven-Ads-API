import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User_Ad } from '../user_ad.model';
import { AdMatchedEvent } from '../events/ad-matched.event';

@Injectable()
export class AdMatchedListener {
  constructor(
    @InjectModel(User_Ad)
    private userAdModel: typeof User_Ad,
  ) {}

  @OnEvent('ad.matched')
  handleAdMatchedEvent(event: AdMatchedEvent) {
    this.userAdModel.upsert({
      ...event,
    });
  }
}
