import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importuj CommonModule

/** @title Datepicker with min & max validation */
@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./datepicker.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    }
  ],
})
export class DatepickerComponent {
  @Input() defaultDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  public onDateChange(date: Date) {
    this.dateSelected.emit(date);
  }
}
