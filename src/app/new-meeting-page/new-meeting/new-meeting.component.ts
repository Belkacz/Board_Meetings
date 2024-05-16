import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { TimeType, FileType } from '../../shared/enums';
import { Agenda, DownloadFile, ExistedBoardMeetings } from '../../shared/interfaces';
import { FileDownloadService } from '../../services/file-download.service';
import { FormValidators } from 'src/app/shared/formValidators.directive';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from 'src/app/dialog-list/dialog-list.component';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
})
export class NewMeetingComponent extends BaseFormComponent implements OnInit {
  @Input() editedMeeting: ExistedBoardMeetings | null;
  @ViewChild('chooseFile') chooseFileInput!: ElementRef;
  @ViewChild('addDocument') addDocumentInput!: ElementRef;

  public FileType = FileType;

  private dateStart: Date;
  private dateEnd: Date;
  public TimeType = TimeType;
  public dateStartControl!: FormControl;
  public dateEndControl!: FormControl;
  public meetingAddress!: FormControl;
  public onlineAddress!: FormControl;
  private hybridType!: FormControl;
  public isHybridChecked!: boolean;
  public isAddressChecked!: boolean;
  public isOnlineChecked!: boolean;
  private addedDocumentControl!: FormControl;
  public addedDocumentFormArray!: FormArray;
  public pickedStartTimeString!: string | null;
  public pickedEndTimeString!: string | null;

  public defaultDate: Date | null;
  public defaultTimeStart: string | null;
  public defaultTimeEnd: string | null;

  public title: string;

  constructor(
    // private formBuilder: FormBuilder,
    private fileDownloadService: FileDownloadService,
    public dialog: MatDialog
  ) {
    super();
    this.editedMeeting = null;
    this.dateStart = new Date();
    this.dateEnd = new Date();

    this.title = "Create new meeting"

    this.defaultDate = null;
    this.defaultTimeStart = null;
    this.defaultTimeEnd = null;

    this.createFormControls();

  }

  ngOnInit() {
    this.meetingAddress.disable();
    this.onlineAddress.disable();
    this.pickedStartTimeString = null;
    this.pickedEndTimeString = null;

    if (this.editedMeeting) {
      this.title = `Editing meeting # ${this.editedMeeting.id}`
      if (this.editedMeeting) {
        Object.keys(this.editedMeeting).forEach(formControlName => {
          const editedMeetingField = this.editedMeeting?.[formControlName]
          if (editedMeetingField && editedMeetingField !== undefined) {
            this.form.get(formControlName)?.setValue(editedMeetingField);
          }
        });
      }
      if(this.editedMeeting.meetingType){
        this.form.patchValue({
          selectedMeetingType: this.editedMeeting.meetingType
        })
      }
      if(this.editedMeeting.meetingAddress){
        this.meetingAddress.setValue(this.editedMeeting.meetingAddress)
      }
      if (this.editedMeeting.dateStart) {
        this.defaultDate = this.editedMeeting.dateStart
      }
      if (this.editedMeeting.dateStart) {
        const tempHours = new Date(this.editedMeeting.dateStart).getHours().toString();
        const tempMinutes = new Date(this.editedMeeting.dateStart).getMinutes().toString();
        this.defaultTimeStart = `${tempHours}:${tempMinutes}`
      }
      if (this.editedMeeting.dateEnd) {
        const tempHours = new Date(this.editedMeeting.dateEnd).getHours().toString();
        const tempMinutes = new Date(this.editedMeeting.dateEnd).getMinutes().toString();
        this.defaultTimeEnd = `${tempHours}:${tempMinutes}`
      }
    }
  }

  createFormControls(): void {
    const selectedMeetingType = new FormControl('', [Validators.required]);
    const meetingName = !this.editedMeeting ? new FormControl('', FormValidators.notEmpty()) : new FormControl(this.editedMeeting.meetingName, FormValidators.notEmpty());
    this.dateStartControl = new FormControl('', [Validators.required]);
    this.dateEndControl = new FormControl('', [Validators.required]);
    this.meetingAddress = !this.editedMeeting ? new FormControl() : new FormControl(this.editedMeeting.meetingAddress);
    this.onlineAddress = !this.editedMeeting ? new FormControl() : new FormControl(this.editedMeeting.meetingAddress);
    this.hybridType = new FormControl();
    this.addedDocumentControl = new FormControl();
    this.addedDocumentFormArray = new FormArray<FormControl>([]);
    const agenda = new FormGroup({
      agendaName: new FormControl(),
      list: new FormControl()
    });

    this.form = new FormGroup({
      selectedMeetingType: selectedMeetingType,
      meetingName: meetingName,
      dateStart: this.dateStartControl,
      dateEnd: this.dateEndControl,
      meetingAddress: this.meetingAddress,
      onlineAddress: this.onlineAddress,
      addedDocuments: this.addedDocumentFormArray,
      hybridType: this.hybridType,
      agenda: agenda
    });
    this.formValidators();
  }

  public selectType(option: string) {
    this.form.patchValue({
      selectedMeetingType: option
    });
  }


  newAgenda(): void {
    const dialogRef = this.dialog.open(DialogListComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.form.patchValue({
          agenda: {
            agendaName: result.value.agendaName,
            list: result.value.list
          }
        })
      }
    })
  }

  public handleDateSelected(selectedDate: Date) {
    if (selectedDate !== null) {
      this.dateStart.setFullYear(selectedDate.getFullYear());
      this.dateStart.setMonth(selectedDate.getMonth());
      this.dateStart.setDate(selectedDate.getDate());
      this.dateEnd.setFullYear(selectedDate.getFullYear());
      this.dateEnd.setMonth(selectedDate.getMonth());
      this.dateEnd.setDate(selectedDate.getDate());

      this.dateStartControl.setValue(this.dateStart);
      this.dateEndControl.setValue(this.dateEnd);
      this.dateStartControl.markAsDirty();
      this.dateEndControl.markAsDirty();
      this.confirmTheExistenceOfTime();
    }
  }

  public handleTimeSelected(time: string, type: TimeType): void {
    const hour = time.split(':')[0];
    const min = time.split(':')[1];
    if (type === TimeType.Start) {
      this.pickedStartTimeString = time;
      this.dateStart.setHours(parseInt(hour, 10));
      this.dateStart.setMinutes(parseInt(min, 10));
      this.dateStartControl.setValue(this.dateStart);
    }
    if (type === TimeType.End) {
      this.pickedEndTimeString = time;
      this.dateEnd.setHours(parseInt(hour, 10));
      this.dateEnd.setMinutes(parseInt(min, 10));
      this.dateEndControl.setValue(this.dateEnd);
    }
    this.dateStartControl.markAsDirty();
    this.dateEndControl.markAsDirty();
    this.confirmTheExistenceOfTime();
    this.form.updateValueAndValidity();
  }

  private confirmTheExistenceOfTime(): void {
    if (!this.pickedStartTimeString) {
      const currentErrors = this.dateStartControl.errors || {};
      currentErrors['noStartingTime'] = true;
      this.dateStartControl.setErrors(currentErrors);
    } else {
      const currentErrors = this.dateStartControl.errors;
      if (currentErrors && currentErrors['noStartingTime']) {
        delete currentErrors['noStartingTime'];
        this.dateStartControl.setErrors(Object.keys(currentErrors).length === 0 ? null : currentErrors);
      }
    }

    if (!this.pickedEndTimeString) {
      const currentErrors = this.dateEndControl.errors || {};
      currentErrors['noEndTime'] = true;
      this.dateEndControl.setErrors(currentErrors);
    } else {
      const currentErrors = this.dateEndControl.errors;
      if (currentErrors && currentErrors['noEndTime']) {
        delete currentErrors['noEndTime'];
        this.dateEndControl.setErrors(Object.keys(currentErrors).length === 0 ? null : currentErrors);
      }
    }
  }

  public clearInput() {
    this.form.get('meetingName')?.reset('');
  }

  toggleAddress() {
    this.meetingAddress.enable();
    this.onlineAddress.disable();
    this.isOnlineChecked = false;
    this.isHybridChecked = false;
    this.isAddressChecked = !this.isAddressChecked;
    if (this.isAddressChecked === true) {
      this.meetingAddress.enable();
    } else {
      this.meetingAddress.disable();
    }
  }

  toggleOnline() {
    this.meetingAddress.disable();
    this.isAddressChecked = false;
    this.isHybridChecked = false;
    this.isOnlineChecked = !this.isOnlineChecked;
    if (this.isOnlineChecked === true) {
      this.onlineAddress.enable();
    } else {
      this.onlineAddress.disable();
    }
  }

  toggleHybrid() {
    this.isHybridChecked = !this.isHybridChecked;
    if (this.isHybridChecked) {
      this.isAddressChecked = true;
      this.isOnlineChecked = true;
      this.meetingAddress.enable();
      this.onlineAddress.enable();
    } else {
      this.isAddressChecked = false;
      this.isOnlineChecked = false;
      this.meetingAddress.disable();
      this.onlineAddress.disable();
    }

    this.hybridType.setValue(this.isHybridChecked);
  }

  openFilePicker(inputElement: ElementRef): void {
    inputElement.nativeElement.click();
  }

  onFileSelected(event: Event, type: FileType): void {
    const target = event.target as HTMLInputElement;
    if (target?.files !== null) {
      const selectedFile = target.files[0];
      if (type === FileType.ChooseFile) {
        // this.chosenFileControl.setValue(selectedFile);
      }
      if (type === FileType.AddDocument) {
        const addedDocumentControl = new FormControl(selectedFile);
        this.addedDocumentFormArray.push(addedDocumentControl);
      }
    }
  }

  downloadFile(doc: DownloadFile): void {
    this.fileDownloadService.downloadFile(doc);
  }

  deleteDocs(docIndex: number) {
    this.addedDocumentFormArray.removeAt(docIndex);
  }



  protected formValidators(): void {
    // this.form.get('meetingName')?.value.setValidators([
    //   Validators.required,
    //   FormValidators.notEmpty()
    // ]);
    this.dateStartControl.setAsyncValidators([
      FormValidators.startBeforeEnd(this.dateStart, this.dateEnd, this.dateStartControl, this.dateEndControl),
    ]);
    this.dateEndControl.setAsyncValidators([
      FormValidators.startBeforeEnd(this.dateStart, this.dateEnd, this.dateStartControl, this.dateEndControl)
    ]);
    this.dateStartControl.setValidators([
      Validators.required,
    ]);
    this.dateEndControl.setValidators([
      Validators.required,
    ]);
    this.form.setValidators([
      FormValidators.locationValidator(this.isHybridChecked, this.isAddressChecked, this.isOnlineChecked),
    ]);
  }

}
