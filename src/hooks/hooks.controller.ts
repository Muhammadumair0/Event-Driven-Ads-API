import { Body, Controller, Post, Query } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdMatchedEvent } from './events/ad-matched.event';
import { AdReadEvent } from './events/ad-read.event';

interface Event {
  id: string;
  payload: {
    adId: number;
    period?: number;
  };
}

@Controller('hooks')
export class HooksController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post()
  async notify(@Query('user') user: number, @Body() event: Event) {
    const ad = event.payload.adId;
    if (event.id === 'USER_MATCHES_AD') {
      const adMatchedEvent = new AdMatchedEvent(user, ad);
      this.eventEmitter.emit('ad.matched', adMatchedEvent);
    } else if (event.id === 'USER_READS_AD') {
      const { period } = event.payload;
      const adReadEvent = new AdReadEvent(user, ad, period);
      this.eventEmitter.emit('ad.read', adReadEvent);
    }
  }
}
