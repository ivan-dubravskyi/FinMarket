import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

import { ApiService } from "./api.service";
import { L1Subscription, MarketPrice } from "../../pages/financial-market/models";

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  socket!: WebSocketSubject<MarketPrice | L1Subscription>;

  constructor(private apiService: ApiService) {}

  initWebSocket(): WebSocketSubject<MarketPrice | L1Subscription> {
    this.socket = this.apiService.realtimeMarketData() as WebSocketSubject<MarketPrice | L1Subscription>;
    return this.socket;
  }

  subscribeToRealTimeData(instrumentId: string) {
    const subscriptionMessage: L1Subscription = {
      type: 'l1-subscription',
      id: '1',
      instrumentId,
      provider: 'simulation',
      subscribe: true,
      kinds: [
        "last"
      ],
    };

    this.socket.next(subscriptionMessage);
  }

  unsubscribe(instrumentId: string) {
    const subscriptionMessage: L1Subscription = {
      type: 'l1-subscription',
      id: '1',
      instrumentId,
      provider: 'simulation',
      subscribe: false,
      kinds: [
        "last"
      ],
    };

    this.socket.next(subscriptionMessage);
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket.complete();
    }
  }

}

