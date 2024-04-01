export class AdReadEvent {
  user: number;
  ad: number;
  period: number;

  constructor(user: number, ad: number, period: number) {
    this.user = user;
    this.ad = ad;
    this.period = period;
  }
}
