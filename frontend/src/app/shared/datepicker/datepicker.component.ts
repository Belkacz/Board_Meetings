import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    }
  ]
})
export class DatepickerComponent implements OnInit {
  @Input() defaultDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  ngOnInit() {
    if (typeof this.defaultDate === 'string') {
      this.defaultDate = new Date(this.defaultDate);
    }
  }

  public onDateChange(date: Date) {
    this.dateSelected.emit(date);
  }
}
