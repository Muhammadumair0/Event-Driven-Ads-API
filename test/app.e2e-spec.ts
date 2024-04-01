import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from './../src/users/user.model';
import { Ad } from './../src/ads/ad.model';
import { User_Ad } from './../src/hooks/user_ad.model';

class Helpers {
  private app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  async notifyUserMatchedAd(user: User, ad: Ad) {
    await request(this.app.getHttpServer())
      .post(`/hooks?user=${user.id}`)
      .send({ id: 'USER_MATCHES_AD', payload: { adId: ad.id } })
      .expect(201);
  }

  async notifyUserReadAd(user: User, ad: Ad, period: number) {
    await request(this.app.getHttpServer())
      .post(`/hooks?user=${user.id}`)
      .send({ id: 'USER_READS_AD', payload: { period, adId: ad.id } })
      .expect(201);
  }

  async fetchReadAds(userId: number) {
    return request(this.app.getHttpServer())
      .get(`/ads/read?user=${userId}`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  async fetchMatchedAds(userId: number) {
    return request(this.app.getHttpServer())
      .get(`/ads/matched?user=${userId}`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let users: User[];
  let ads: Ad[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    helpers = new Helpers(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Mobile app can notify the API with webhooks and the system updates', async () => {
    // We're seeding the database on this test with a bunch of users, and ads.
    await request(app.getHttpServer()).post('/seed').send().expect(201);

    // We have at least four users on the DB, and two ads
    await request(app.getHttpServer())
      .get('/ads')
      .expect(200)
      .then((response) => {
        // 2 ads
        expect(response.body).toHaveLength(2);
        ads = response.body;
      });

    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then((response) => {
        // 4 users
        expect(response.body).toHaveLength(4);
        users = response.body;
      });

    // let's say Sarah and Simone match all ads
    // Umair matches the crypto ad and Hamid matches the fashion ad
    const umair = users.find((user) => user.firstName === 'Umair');
    const hamid = users.find((user) => user.firstName === 'Hamid');
    const simone = users.find((user) => user.firstName === 'Simone');
    const sarah = users.find((user) => user.firstName === 'Sarah');

    const cryptoAd = ads.find((ad) => ad.targetingCriteria === 'crypto');
    const fashionAd = ads.find((ad) => ad.targetingCriteria === 'fashion');

    // Oops notifying twice is Okay
    await helpers.notifyUserMatchedAd(simone, cryptoAd);
    await helpers.notifyUserMatchedAd(simone, cryptoAd);

    await helpers.notifyUserMatchedAd(simone, fashionAd);
    await helpers.notifyUserMatchedAd(sarah, cryptoAd);
    await helpers.notifyUserMatchedAd(sarah, fashionAd);
    await helpers.notifyUserMatchedAd(umair, cryptoAd);
    await helpers.notifyUserMatchedAd(hamid, fashionAd);

    // Mobile app can see that the system updates when requesting user data
    // for each user
    // Simone matches both ads
    await helpers.fetchMatchedAds(simone.id).then((ads) => {
      expect(ads).toHaveLength(2);
      expect(ads.map((ad: User_Ad) => ad.ad).sort()).toEqual(
        [fashionAd, cryptoAd].map((ad) => ad.id).sort(),
      );
    });

    // Sarah matches both ads
    await helpers.fetchMatchedAds(sarah.id).then((ads) => {
      expect(ads).toHaveLength(2);
      expect(ads.map((ad: User_Ad) => ad.ad).sort()).toEqual(
        [fashionAd, cryptoAd].map((ad) => ad.id).sort(),
      );
    });

    // Umair matches the crypto ad
    await helpers.fetchMatchedAds(umair.id).then((ads) => {
      expect(ads).toHaveLength(1);
      expect(ads[0].ad).toEqual(cryptoAd.id);
    });

    // Hamid matches the fashion ad
    await helpers.fetchMatchedAds(hamid.id).then((ads) => {
      expect(ads).toHaveLength(1);
      expect(ads[0].ad).toEqual(fashionAd.id);
    });

    // Notifying that both Simone and Sarah read the fashion ad
    // and Umair read the crypto ad
    await helpers.notifyUserReadAd(simone, fashionAd, 20);
    await helpers.notifyUserReadAd(sarah, fashionAd, 15);
    await helpers.notifyUserReadAd(umair, cryptoAd, 10);

    // Checking the system
    // System shows that simone has indeed read the fashion ad for 20 seconds
    await helpers.fetchReadAds(simone.id).then((ads) => {
      expect(ads).toHaveLength(1);
      expect(ads[0].ad).toEqual(fashionAd.id);
      expect(ads[0].period).toBe(20);
    });

    // System shows that sarah has read the fashion ad for 15 seconds
    await helpers.fetchReadAds(sarah.id).then((ads) => {
      expect(ads).toHaveLength(1);
      expect(ads[0].ad).toEqual(fashionAd.id);
      expect(ads[0].period).toBe(15);
    });

    // System shows that umair has read the crypto ad for 10 seconds
    await helpers.fetchReadAds(umair.id).then((ads) => {
      expect(ads).toHaveLength(1);
      expect(ads[0].ad).toEqual(cryptoAd.id);
      expect(ads[0].period).toBe(10);
    });

    // System shows that hamid has not read any ad
    await helpers.fetchReadAds(hamid.id).then((ads) => {
      expect(ads).toHaveLength(0);
    });

    // Checking the reports
    await request(app.getHttpServer())
      .get('/reports')
      .expect(200)
      .then((response) => {
        const { avg_read_rate } = response.body;
        expect(avg_read_rate).toBe(15);
      });

    await request(app.getHttpServer())
      .get(`/reports/ads/${fashionAd.id}`)
      .expect(200)
      .then((response) => {
        const { rate_of_users_matched } = response.body;
        expect(rate_of_users_matched).toBe(0.75);
        const { rate_of_users_read } = response.body;
        expect(rate_of_users_read).toBe(0.67);
      });
  });
});
