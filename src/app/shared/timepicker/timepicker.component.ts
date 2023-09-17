import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent {
  selectedTime: string | undefined;
  @Output() timeSelected = new EventEmitter<string>();


  public timeChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const time = event.target.value;
      this.timeSelected.emit(time);
    }
  }
}
