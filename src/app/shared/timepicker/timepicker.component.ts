import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent {
  // selectedTime: string | undefined
  @Input() selectedTime: string | null = null;
  @Output() timeSelected = new EventEmitter<string>();

  public timeChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const time = event.target.value;
      console.log(time)
      console.log(typeof(time))
      this.timeSelected.emit(time);
    }
  }
}
