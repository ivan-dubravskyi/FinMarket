import { Component, OnDestroy, OnInit } from '@angular/core';
import {filter, map, Observable} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MarketDataService } from '../../core/services/market-data.service';
import { ApiService } from '../../core/services/api.service';
import { MatCard } from '@angular/material/card';
import { InstrumentSelectorComponent } from "./components/instrument-selector/instrument-selector.component";
import { MarketPriceComponent } from "./components/market-price/market-price.component";
import { HistoricalPriceComponent } from "./components/historical-price/historical-price.component";
import {Instrument, MarketData, MarketPrice, TimeFrame} from "./models";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-financial-market',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    InstrumentSelectorComponent,
    MarketPriceComponent,
    HistoricalPriceComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './financial-market.component.html',
  styleUrls: ['./financial-market.component.scss']
})

export class FinancialMarketComponent implements OnInit, OnDestroy {

  instruments: Instrument[] = [];
  marketData$!: Observable<MarketData>;
  selectedInstrument!: Instrument;
  chartData!: number[][];
  readonly timeFrames: TimeFrame[] = [
    {
      title: '1 Minute',
      interval: 1,
      periodicity: 'minute',
    },
    {
      title: '5 Minute',
      interval: 5,
      periodicity: 'minute',
    },
    {
      title: '15 Minute',
      interval: 15,
      periodicity: 'minute',
    },
    {
      title: '1 Hour',
      interval: 1,
      periodicity: 'hour',
    },
    {
      title: '4 Hour',
      interval: 4,
      periodicity: 'hour',
    },
    {
      title: '1 Day',
      interval: 1,
      periodicity: 'day',
    },
    {
      title: '1 Week',
      interval: 1,
      periodicity: 'week',
    },
  ];
  timeFrameControl = new FormControl<TimeFrame>({value: this.timeFrames[0], disabled: true});


  constructor(private marketDataService: MarketDataService,
              private apiService: ApiService)
  {}

  ngOnInit() {

    this.getInstruments();

    this.marketData$ = this.marketDataService.initWebSocket().pipe(
      filter((message): message is MarketPrice => message.type === 'l1-update'),
      map((marketData => {
        return {
          price: marketData.last?.price,
          time: marketData.last?.timestamp,
        }
      }))
    );
  }

  ngOnDestroy() {
    this.marketDataService.closeConnection();
  }

  get symbol() {
    return this.selectedInstrument?.symbol || '';
  }

  onInstrumentSubscribe(instrument: Instrument) {
    if (this.selectedInstrument) {
      this.marketDataService.unsubscribe(this.selectedInstrument.id);
    }
    this.selectedInstrument = instrument;
    this.timeFrameControl.enable();
    this.getChartData(instrument, this.timeFrameControl.value || this.timeFrames[0]);
    this.marketDataService.subscribeToRealTimeData(instrument.id);
  }

  onTimeFrameSelected(timeFrame: TimeFrame) {
    this.getChartData(this.selectedInstrument, timeFrame);
  }

  private getInstruments() {
    this.apiService.listInstruments().subscribe({
      next: instruments => this.instruments = instruments,
      error: (error) => console.log('Instruments Error', error),
    })
  }

  private getChartData(instrument: Instrument, timeFrame: TimeFrame) {
    this.apiService.countBack(instrument.id, 'oanda', timeFrame.interval, timeFrame.periodicity, 500)
      .subscribe({
        next: (historicalPrices) => {
          this.chartData = historicalPrices.map((bar) => [
            new Date(bar.t).getTime(),
            bar.o,
            bar.h,
            bar.l,
            bar.c
          ]);
        },
        error: (error) => {
          console.error('Instruments Error', error);
        },
      });
  }
}
