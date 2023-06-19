import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../base-form/base-form.component';
import { TimeType } from '../shared/enums';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
})
export class NewMeetingComponent extends BaseFormComponent implements OnInit {
  @ViewChild('chosseFile') fileInput!: ElementRef;

  public selectedMeetingType!: FormControl;
  public mettingName!: FormControl;
  public dateStart: Date;
  public dateEnd: Date;
  public TimeType = TimeType;
  public dateSelected!: FormControl;
  public dateStartControl!: FormControl;
  public dateEndControl!: FormControl;
  public meetingAdrress!: FormControl;
  public onlineAddress!: FormControl;
  public isAddressChecked!: boolean
  public isOnlineChecked!: boolean
  private chossedFileControl!: FormControl;

  constructor() {
    super();
    this.dateStart = new Date();
    this.dateEnd = new Date(this.dateStart.getHours() + 1);
  }

  ngOnInit() {
    this.meetingAdrress.setValue('online');
    this.createFormControls();
    this.meetingAdrress.disable();
    this.onlineAddress.disable();
    // this.isAddressChecked = false
    // this.isOnlineChecked = false
  }

  print1() {
    console.log(this.form);
  }

  createFormControls(): void {
    this.selectedMeetingType = new FormControl();
    this.mettingName = new FormControl();
    this.meetingAdrress = new FormControl({value: '', disabled: true});
    this.dateSelected = new FormControl();
    this.dateStartControl = new FormControl();
    this.dateEndControl = new FormControl();
    this.meetingAdrress = new FormControl();
    this.onlineAddress = new FormControl();
    this.meetingAdrress = new FormControl();
    this.onlineAddress = new FormControl();
    this.chossedFileControl = new FormControl();
    this.form = new FormGroup({
      selectedMeetingType: this.selectedMeetingType,
      mettingName: this.mettingName,
      dateStart: this.dateStartControl,
      dateEnd: this.dateEndControl,
      meetingAdrress: this.meetingAdrress,
      onlineAddress: this.onlineAddress,
      chosseFile: this.chossedFileControl
    });
  }

  selectType(option: string) {
    if (this.form) {
      this.form.patchValue({
        selectedMeetingType: option
      });
    }
  }

  handleDateSelected(selectedDate: Date) {
    if (selectedDate !== null) {
      this.dateStart.setFullYear(selectedDate.getFullYear());
      this.dateStart.setMonth(selectedDate.getMonth());
      this.dateStart.setDate(selectedDate.getDate());
      this.dateEnd.setFullYear(selectedDate.getFullYear());
      this.dateEnd.setMonth(selectedDate.getMonth());
      this.dateEnd.setDate(selectedDate.getDate());

      this.dateStartControl.setValue(this.dateStart);
      this.dateEndControl.setValue(this.dateStart);
      // console.log('Wybrana data startowa:', this.dateStart);
      // console.log('Wybrana data koncowa:', this.dateEnd);
    }
  }

  handleTimeSelected(time: string, type: TimeType): void {
    const hour = time.split(':')[0];
    const min = time.split(':')[1];
    if (type === TimeType.Start) {
      this.dateStart.setHours(parseInt(hour, 10));
      this.dateStart.setMinutes(parseInt(min, 10));
      this.dateStartControl.setValue(this.dateStart);
    }
    if (type === TimeType.End) {
      this.dateEnd.setHours(parseInt(hour, 10));
      this.dateEnd.setMinutes(parseInt(min, 10));
      this.dateEndControl.setValue(this.dateEnd);
    }
  }

  clearInput() {
    this.mettingName.setValue('');
  }

  toggleAdress(){
    this.meetingAdrress.enable();
    this.onlineAddress.disable();
    this.isOnlineChecked = false;
    this.isAddressChecked = !this.isAddressChecked;
  }

  toggleOnline(){
    this.meetingAdrress.disable();
    this.onlineAddress.enable();
    this.isAddressChecked = false;
    this.isOnlineChecked = !this.isOnlineChecked;
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.chossedFileControl.setValue(file);
    console.log(file);
  }

}