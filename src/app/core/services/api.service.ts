import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HistoricalPrice, Instrument } from "../../pages/financial-market/models";
import { webSocket } from "rxjs/webSocket";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.API_URL;

  constructor(private http: HttpClient,
              private tokenService: TokenService) {}

  getToken(): Observable<string> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', environment.API_USERNAME);
    body.set('password', environment.API_PASSWORD);

    return this.http.post(
      `${environment.API_URL}/identity/realms/fintatech/protocol/openid-connect/token`,
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
    )
      .pipe(map((response: any) => response.access_token));
  }

  listInstruments(
    provider: string = 'oanda',
    kind: string = 'forex'
  ): Observable<Instrument[]> {
    const params = new HttpParams()
      .set('provider', provider)
      .set('kind', kind);

    return this.http.get<{data: Instrument[]}>(
      `${this.baseUrl}/api/instruments/v1/instruments`,
      { params }
    )
      .pipe(
        map((response) => response.data)
      );
  }

  countBack(
    instrumentId: string,
    provider: string,
    interval: number,
    periodicity: string,
    barsCount: number
  ): Observable<HistoricalPrice[]> {

    const params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval)
      .set('periodicity', periodicity)
      .set('barsCount', barsCount.toString());


    return this.http.get<{data: HistoricalPrice[]}>(
      `${this.baseUrl}/api/bars/v1/bars/count-back`,
      { params }
    )
      .pipe(
        map((response) => response.data)
      );
  }

  realtimeMarketData() {
    return webSocket(
      `${environment.API_WSS}/api/streaming/ws/v1/realtime?token=${this.tokenService.getToken()}`
    );
  }





  listProviders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/instruments/v1/providers`);
  }

  listExchanges(provider?: string): Observable<any> {
    let params = new HttpParams();
    if (provider) {
      params = params.set('provider', provider);
    }

    return this.http.get(`${this.baseUrl}/api/instruments/v1/exchanges`, { params });
  }

  dateRange(instrumentId: string, provider: string, interval: string, periodicity: string, startDate: string, endDate?: string): Observable<any> {
    let params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval)
      .set('periodicity', periodicity)
      .set('startDate', startDate);

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get(`${this.baseUrl}/api/bars/v1/bars/date-range`, { params });
  }

  timeBack(instrumentId: string, provider: string, interval: string, periodicity: string, timeBack: string): Observable<any> {
    const params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval)
      .set('periodicity', periodicity)
      .set('timeBack', timeBack);

    return this.http.get(`${this.baseUrl}/api/data-consolidators/bars/v1/bars/time-back`, { params });
  }
}
