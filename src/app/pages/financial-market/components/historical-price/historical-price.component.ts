import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import * as Highcharts from 'highcharts';
import StockModule from 'highcharts/modules/stock';
import  {MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {TimeFrame} from "../../models";

StockModule(Highcharts);

@Component({
  selector: 'app-historical-price',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './historical-price.component.html',
  styleUrl: './historical-price.component.scss'
})

export class HistoricalPriceComponent implements OnChanges {
  @Input() chartData: number[][] = [];

  chartOptions: Highcharts.Options = {
    title: { text: '' },
    rangeSelector: {
      enabled: true,
      selected: 1
    },
    scrollbar: {
      enabled: true
    },
    navigator: {
      enabled: true
    },
    series: [{
      showInLegend: false,
      name: '',
      data: this.chartData,
      type: 'candlestick',
    }],
    xAxis: { type: 'datetime' },
    plotOptions: {
      candlestick: {
        color: 'rgb(236 90 88)',
        upColor: 'rgb(38 166 154)',
      },
    },
  };

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions.series = [{
      showInLegend: false,
      name: '',
      data: this.chartData,
      type: 'candlestick',
    }];
    Highcharts.chart('candlestick', this.chartOptions);
  }
}
