import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../base-form/base-form.component';

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

  handleDateSelected(selectedDate: Date, type: number) {
    if (selectedDate !== null) {
      if (type === 0) {
        console.log('Wybrana data startowa:', selectedDate);
      }
      if (type === 1) {
        console.log('Wybrana data koncowa:', selectedDate);
      }
    }
  }

  clearInput() {
    this.mettingName.setValue('')
  }
}
