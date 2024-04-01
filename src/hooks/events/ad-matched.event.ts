export class AdMatchedEvent {
  ad: number;
  user: number;

  constructor(user: number, ad: number) {
    this.user = user;
    this.ad = ad;
  }
}
