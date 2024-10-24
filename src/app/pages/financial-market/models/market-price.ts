export interface MarketPrice {
  instrumentId: string;
  last: Last;
  provider: string;
  type: 'l1-update';
}

interface Last {
  change: number;
  changePct: number;
  price: number;
  timestamp: string;
  volume: number;
}
