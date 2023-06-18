import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** @title Datepicker with min & max validation */
@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  startTime: string;
  endTime: string;
  @Output() startDateSelected = new EventEmitter<Date>();
  @Output() endDateSelected = new EventEmitter<Date>();


  constructor() {
    this.currentDate = new Date();
    this.startDate = this.currentDate;
    this.endDate = new Date(this.currentDate.getHours() + 1);
    console.log(this.endDate)
    
    this.startTime = "12:30";
    this.endTime = "21:37";


  }
  setTimeToDate( newTime: string, date: Date): Date{
    const hour = newTime.split(':')[0]
    const min = newTime.split(':')[1]
    date.setHours(parseInt(hour, 10))
    date.setMinutes(parseInt(min, 10))
    return date;
  }

  startTimeChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const startTime = event.target.value;
      this.startTime = startTime;
      this.startDate = this.setTimeToDate(startTime, this.currentDate)

      this.startDateSelected.emit(this.startDate);
    }
  }

  endTimeChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const endTime = event.target.value;
      this.endTime = endTime;
      this.endDate = this.setTimeToDate(endTime, this.currentDate)
      this.endDateSelected.emit(this.currentDate);
    }
  }

  onDateChange(date: Date) {
    this.currentDate = date;
    this.startDate = date;
    this.endDate = date;
    this.startDate = this.setTimeToDate(this.startTime, this.currentDate)
    this.endDate = this.setTimeToDate(this.endTime, this.currentDate)
    this.startDateSelected.emit(this.startDate);
    this.endDateSelected.emit(this.endDate);
  }
}