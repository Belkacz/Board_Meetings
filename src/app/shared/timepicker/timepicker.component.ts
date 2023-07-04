import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent {
  selectedTime: string | null;
  @Output() timeSelected = new EventEmitter<string>();


  constructor() {
    this.selectedTime = "00:00"
  }


  timeChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const time = event.target.value;
      this.timeSelected.emit(time);
    }
  }
}