import { Component, Input } from '@angular/core';
import { MatGridListModule } from "@angular/material/grid-list";
import { DatePipe } from "@angular/common";
import { MarketData } from "../../models";

@Component({
  selector: 'app-market-price',
  standalone: true,
  imports: [
    MatGridListModule,
    DatePipe,
  ],
  templateUrl: './market-price.component.html',
  styleUrl: './market-price.component.scss'
})
export class MarketPriceComponent {

  @Input() marketData: MarketData | null = null;
  @Input() symbol: string = '';

}
