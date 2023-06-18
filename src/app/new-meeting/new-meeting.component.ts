import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../base-form/base-form.component';
import { TimeType } from '../shared/enums';


@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})
export class NewMeetingComponent extends BaseFormComponent {
  public selectedMeetingType!: FormControl;
  public mettingName!: FormControl;
  public dateStart: Date;
  public dateEnd: Date;
  public TimeType = TimeType;

  constructor() {
    super();
    this.dateStart = new Date();
    this.dateEnd = new Date();
  }

  createFormControls(): void {
    this.selectedMeetingType = new FormControl();
    this.mettingName = new FormControl();
    this.form = new FormGroup({
      selectedMeetingType: this.selectedMeetingType,
      mettingName: this.mettingName
    });
    console.log(this.form)
  }

  selectType(option: string) {
    if (this.form) {
      this.form.patchValue({
        selectedMeetingType: option
      });
    }
  }

  handleDateSelected(selectedDate: Date,) {
    if (selectedDate !== null) {
      console.log(selectedDate)
      console.log(selectedDate);
      this.dateStart.setFullYear(selectedDate.getFullYear());
      this.dateStart.setMonth(selectedDate.getMonth());
      this.dateStart.setDate(selectedDate.getDate());
      this.dateEnd.setFullYear(selectedDate.getFullYear());
      this.dateEnd.setMonth(selectedDate.getMonth());
      this.dateEnd.setDate(selectedDate.getDate());
      console.log('Wybrana data startowa:', this.dateStart);
      console.log('Wybrana data koncowa:', this.dateEnd);
    }
  }

  handleTimeSelected(time: string, type: TimeType): void {
    const hour = time.split(':')[0]
    const min = time.split(':')[1]
    if (type === TimeType.Start) {
      this.dateStart.setHours(parseInt(hour, 10))
      this.dateStart.setMinutes(parseInt(min, 10))
    }
    if (type === TimeType.End) {
      this.dateEnd.setHours(parseInt(hour, 10))
      this.dateEnd.setMinutes(parseInt(min, 10))
    }
  }

  clearInput() {
    this.mettingName.setValue('')
  }
}
