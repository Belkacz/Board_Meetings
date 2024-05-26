import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

/** @title Datepicker with min & max validation */
@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent {

  @Input() defaultDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  public onDateChange(date: Date) {
    this.dateSelected.emit(date);
  }
}