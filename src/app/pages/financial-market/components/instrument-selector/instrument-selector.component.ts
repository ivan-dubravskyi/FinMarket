import {Component, EventEmitter, Input, Output, OnChanges} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Instrument } from "../../models";

@Component({
  selector: 'app-instrument-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './instrument-selector.component.html',
  styleUrl: './instrument-selector.component.scss'
})

export class InstrumentSelectorComponent implements OnChanges {

  @Input() instruments: Instrument[] = [];
  @Output() instrumentSelected = new EventEmitter<Instrument>();

  instrumentControl: FormControl<Instrument | null> = new FormControl(null, Validators.required);
  filteredInstruments!: Observable<Instrument[]>;

  ngOnChanges(): void {
    this.filteredInstruments = this.instrumentControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string'
        ? this._filter(value, this.instruments)
        : this.instruments
      )
    );
  }

  displayInstrument(instrument: Instrument): string {
    return instrument ? instrument?.symbol : '';
  }

  onSubscribe() {
    const selectedInstrument: Instrument = this.instrumentControl.value as Instrument;
    if (selectedInstrument && selectedInstrument.symbol) {
      this.instrumentSelected.emit(selectedInstrument);
    }
  }

  private _filter(term: string, instruments: Instrument[]): Instrument[] {
    const filterValue = term.toLowerCase();
    return instruments.filter(instrument =>
      instrument.symbol.toLowerCase().includes(filterValue)
    );
  }
}
