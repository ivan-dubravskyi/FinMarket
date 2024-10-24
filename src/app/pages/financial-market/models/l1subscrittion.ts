export interface L1Subscription {
  type: 'l1-subscription';
  id: string;
  instrumentId: string;
  provider: 'simulation';
  subscribe: boolean;
  kinds: string[];
}
