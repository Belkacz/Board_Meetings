import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { TimeType, FileType } from '../../shared/enums';
import { DownloadFile } from '../../shared/interfaces';
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
  @ViewChild('chooseFile') chooseFileInput!: ElementRef;
  @ViewChild('addDocument') addDocumentInput!: ElementRef;

  public FileType = FileType;

  public selectedMeetingType!: FormControl;
  public meetingName!: FormControl;
  private dateStart: Date;
  private dateEnd: Date;
  public TimeType = TimeType;
  public dateSelected!: FormControl;
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
  public showCreateAgenda: boolean;
  

  constructor(
    // private formBuilder: FormBuilder,
    private fileDownloadService: FileDownloadService,
    public dialog: MatDialog
  ) {
    super();
    this.dateStart = new Date();
    this.dateEnd = new Date();
    this.showCreateAgenda = false;
  }

  ngOnInit() {
    this.meetingAddress.setValue('online');
    this.meetingAddress.disable();
    this.onlineAddress.disable();
    this.pickedStartTimeString = null;
    this.pickedEndTimeString = null;

    this.createFormControls();
  }

  createFormControls(): void {
    this.selectedMeetingType = new FormControl('', [Validators.required]);
    this.meetingName = new FormControl();
    this.meetingAddress = new FormControl({ value: '', disabled: true });
    this.dateSelected = new FormControl();
    this.dateStartControl = new FormControl('', [Validators.required]);
    this.dateEndControl = new FormControl('', [Validators.required]);
    this.meetingAddress = new FormControl();
    this.onlineAddress = new FormControl();
    this.hybridType = new FormControl();
    this.addedDocumentControl = new FormControl();
    this.addedDocumentFormArray = new FormArray<FormControl>([]);
    this.form = new FormGroup({
      selectedMeetingType: this.selectedMeetingType,
      meetingName: this.meetingName,
      dateStart: this.dateStartControl,
      dateEnd: this.dateEndControl,
      meetingAddress: this.meetingAddress,
      onlineAddress: this.onlineAddress,
      addedDocuments: this.addedDocumentFormArray,
      hybridType: this.hybridType
    });
    this.formValidators();
  }

  public selectType(option: string) {
    this.form.patchValue({
      selectedMeetingType: option
    });
    console.log(this.form);
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
    this.meetingName.setValue('');
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
    if(this.isHybridChecked){
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

  newAgenda(): void {
    this.showCreateAgenda = !this.showCreateAgenda;
    const dialogRef = this.dialog.open(DialogListComponent)
    //const dialogRef = this.dialog.open(DialogFormComponent, { title: title })
    //dialogRef.componentInstance.title = title
    //dialogRef.componentInstance.fields = [title, 'priority', 'time']
    // fields.forEach(field => {
    //   dialogRef.componentInstance.fields = [field]
    // });
    // this.newTaskSub = dialogRef.componentInstance.formSubmit.subscribe((formValue: any) => {
    //   const lastTask = this.tasksList[this.tasksList.length - 1];
    //   let newTask: Task = { id: 0, name: formValue.name };
    //   if (lastTask != undefined) {
    //     newTask.id = lastTask.id + 1;
    //   } else {
    //     newTask.id = 1;
    //   }
    //   this.tasksList.push(newTask)
    //   // console.log(newTask.id)
    //   this.sendTasksList();
    // });
  }

  protected formValidators(): void {
    this.meetingName.setValidators([
      Validators.required,
      FormValidators.notEmpty()
    ]);
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
