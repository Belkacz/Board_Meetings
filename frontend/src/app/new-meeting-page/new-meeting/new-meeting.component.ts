import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { TimeType, FileType, urls } from '../../shared/enums';
import { Agenda, ExistedBoardMeetings } from '../../shared/interfaces';
import { FileDownloadService } from '../../services/file-download.service';
import { FormValidators } from 'src/app/shared/formValidators.directive';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from 'src/app/dialog-list/dialog-list.component';
import { DialogSelectComponent } from 'src/app/dialog-select/dialog-select.component';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/restService.service';
import { dataService } from 'src/app/services/dataService.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
})
export class NewMeetingComponent extends BaseFormComponent implements OnInit {
  @Input() editedMeeting: ExistedBoardMeetings | null;
  @Output() formEmiter = new EventEmitter<any>();
  @ViewChild('chooseFile') chooseFileInput!: ElementRef;
  @ViewChild('addDocument') addDocumentInput!: ElementRef;

  public FileType = FileType;

  private dateStart: Date;
  private dateEnd: Date;
  public TimeType = TimeType;

  public isHybridChecked!: boolean;
  public isAddressChecked!: boolean;
  public isOnlineChecked!: boolean;

  private pickedStartTimeString: string | null;
  private pickedEndTimeString: string | null;

  public defaultDate: Date | null;
  public defaultTimeStart: string | null;
  public defaultTimeEnd: string | null;

  public agendas: Agenda[];
  public agendasErrorMessage: string;
  private agendaSubscription: Subscription | undefined;
  private selectedDate = false;
  public noDatePicked = false;
  constructor(
    public fileDownloadService: FileDownloadService,
    public dialog: MatDialog,
    private restService: RestService,
    private dataService: dataService,
    protected override formBuilder: FormBuilder,
  ) {
    super(formBuilder);
    this.editedMeeting = null;
    this.dateStart = new Date();
    this.dateEnd = new Date();

    this.defaultDate = null;
    this.defaultTimeStart = null;
    this.defaultTimeEnd = null;

    this.agendas = [];
    this.agendasErrorMessage = ""

    this.createFormControls();
    this.pickedStartTimeString = null;
    this.pickedEndTimeString = null;
  }

  ngOnInit() {
    this.form.get('meetingAddress')?.disable();
    this.form.get('onlineAddress')?.disable();
    this.updateControlsWithEditMeeting();
    this.form.valueChanges.subscribe(() => {
      this.emitForm();
    });
  }

  ngOnChanges(editedMeeting: SimpleChanges) {
    this.updateControlsWithEditMeeting();
  }

  emitForm(): void {
    this.formEmiter.emit(this.form);
  }

  private updateControlsWithEditMeeting(): void {
    if (this.editedMeeting) {
      this.form.patchValue({
        selectedMeetingType: this.editedMeeting.meetingType || null,
        meetingName: this.editedMeeting.meetingName || null,
        dateStart: this.editedMeeting.dateStart || null,
        dateEnd: this.editedMeeting.dateEnd || null,
        meetingAddress: this.editedMeeting.meetingAddress || null,
        onlineAddress: this.editedMeeting.onlineAddress || null,
        attachedDocuments: this.editedMeeting.attachedDocuments || null,
      });
      this.selectedDate = true;
      this.defaultDate = this.editedMeeting.dateStart || null;
      if (this.editedMeeting.dateStart) {
        const date = new Date(this.editedMeeting.dateStart);
        const tempHours = date.getHours().toString();
        let tempMinutes = date.getMinutes().toString();
        if(tempMinutes.length === 1) {
          tempMinutes = "0"+tempMinutes;
        }
        this.pickedStartTimeString = `${tempHours}:${tempMinutes}`;
        this.defaultTimeStart = this.pickedStartTimeString
    }
      if (this.editedMeeting.dateEnd) {
        const date = new Date(this.editedMeeting.dateEnd);
        const tempHours = date.getHours().toString();
        let tempMinutes = date.getMinutes().toString();
        if(tempMinutes.length === 1) {
          tempMinutes = "0"+tempMinutes;
        }
        this.pickedEndTimeString = `${tempHours}:${tempMinutes}`;
        this.defaultTimeEnd = this.pickedEndTimeString
      }
    }
  }

  createFormControls(): void {
    this.form = this.formBuilder.group({
      selectedMeetingType: new FormControl([Validators.required]),
      meetingName: new FormControl(null, FormValidators.notEmpty()),
      dateStart: new FormControl(null, FormValidators.notEmpty()),
      dateEnd: new FormControl(null, FormValidators.notEmpty()),
      meetingAddress: new FormControl(),
      onlineAddress: new FormControl(),
      addedDocuments: new FormControl(null),
      hybridType: new FormControl(),
      agenda: new FormGroup({
        agendaName: new FormControl(),
        list: new FormControl()
      }),
      attachedDocuments: new FormControl()
    });
    this.formValidators();
  }

  private getAgendas(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETAGENDAS)
        .subscribe({
          next: (response: any) => {
            this.agendas = this.dataService.mapAgendas(response);
            resolve();
          },
          error: (error: any) => {
            console.error("Error:", error);
            this.agendasErrorMessage = "Server communication error";
            reject(error);
          }
        });
    });
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
            id: null,
            agendaName: result.value.agendaName,
            list: result.value.list
          }
        })
      }
    })
  }

  selectAgenda(): void {
    this.getAgendas().then(() => {
      const dialogRef = this.dialog.open(DialogSelectComponent, {
        data: this.agendas
      });
  
      dialogRef.afterClosed().subscribe(agenda => {
        if (agenda) {
          this.form.patchValue({
            agenda: {
              id: agenda.id,
              agendaName: agenda.name,
              list: agenda.list
            }
          });
        }
      });
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  public handleDateSelected(selectedDate: Date) {
    if (selectedDate !== null) {
      this.dateStart.setFullYear(selectedDate.getFullYear());
      this.dateStart.setMonth(selectedDate.getMonth());
      this.dateStart.setDate(selectedDate.getDate());
      this.dateEnd.setFullYear(selectedDate.getFullYear());
      this.dateEnd.setMonth(selectedDate.getMonth());
      this.dateEnd.setDate(selectedDate.getDate());
      this.selectedDate = true;
      this.noDatePicked = false;

      this.form.get('dateStart')?.setValue(this.dateStart);
      this.form.get('dateEnd')?.setValue(this.dateEnd);
      this.form.get('dateStart')?.markAsDirty();
      this.form.get('dateEnd')?.markAsDirty();
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
      this.form.get('dateStart')?.setValue(this.dateStart);

    }
    if (type === TimeType.End) {
      this.pickedEndTimeString = time;
      this.dateEnd.setHours(parseInt(hour, 10));
      this.dateEnd.setMinutes(parseInt(min, 10));
      this.form.get('dateEnd')?.setValue(this.dateEnd);
    }
    this.form.get('dateStart')?.markAsDirty();
    this.form.get('dateEnd')?.markAsDirty();

    this.confirmTheExistenceOfTime();
    this.form.updateValueAndValidity();
    this.checkDateExistence();
  }
  private checkDateExistence() {
    if ((this.form.get('dateStart')?.dirty || this.form.get('dateEnd')?.dirty) && !this.selectedDate) {
      this.noDatePicked = true;
    } else {
      this.noDatePicked = false;
    }
  }

  private confirmTheExistenceOfTime(): void {
    if (!this.pickedStartTimeString) {
      const currentErrors = this.form.get('dateStart')?.errors || {};
      currentErrors['noStartingTime'] = true;
      this.form.get('dateStart')?.setErrors(currentErrors);
    } else {
      const currentErrors = this.form.get('dateStart')?.errors;
      if (currentErrors && currentErrors['noStartingTime']) {
        delete currentErrors['noStartingTime'];
        this.form.get('dateStart')?.setErrors(Object.keys(currentErrors).length === 0 ? null : currentErrors);
      }
    }

    if (!this.pickedEndTimeString) {
      const currentErrors = this.form.get('dateEnd')?.errors || {};
      currentErrors['noEndTime'] = true;
      this.form.get('dateEnd')?.setErrors(currentErrors);
    } else {
      const currentErrors = this.form.get('dateEnd')?.errors;
      if (currentErrors && currentErrors['noEndTime']) {
        delete currentErrors['noEndTime'];
        this.form.get('dateEnd')?.setErrors(Object.keys(currentErrors).length === 0 ? null : currentErrors);
      }
    }
  }


  public clearInput() {
    this.form.get('meetingName')?.reset('');
  }

  toggleAddress() {
    this.form.get('meetingAddress')?.enable();
    this.form.get('onlineAddress')?.disable();
    this.isOnlineChecked = false;
    this.isHybridChecked = false;
    this.isAddressChecked = !this.isAddressChecked;
    if (this.isAddressChecked) {
      this.form.get('meetingAddress')?.enable();
    } else {
      this.form.get('meetingAddress')?.disable();
    }
  }

  toggleOnline() {
    this.form.get('meetingAddress')?.disable();
    this.isAddressChecked = false;
    this.isHybridChecked = false;
    this.isOnlineChecked = !this.isOnlineChecked;
    if (this.isOnlineChecked) {
      this.form.get('onlineAddress')?.enable();
    } else {
      this.form.get('onlineAddress')?.disable();
    }
  }

  toggleHybrid() {
    this.isHybridChecked = !this.isHybridChecked;
    if (this.isHybridChecked) {
      this.isAddressChecked = true;
      this.isOnlineChecked = true;
      this.form.get('meetingAddress')?.enable();
      this.form.get('onlineAddress')?.enable();
    } else {
      this.isAddressChecked = false;
      this.isOnlineChecked = false;
      this.form.get('meetingAddress')?.disable();
      this.form.get('onlineAddress')?.disable();
    }
    this.form.get('hybridType')?.setValue(this.isHybridChecked);
  }

  openFilePicker(inputElement: ElementRef): void {
    inputElement.nativeElement.click();
  }
  onFileSelected(event: Event, type: FileType): void {
    const target = event.target as HTMLInputElement;
    if (target?.files !== null) {
      const selectedFile = target.files[0];
      if (type === FileType.AddDocument) {
        const filesControl = this.form.get('addedDocuments')?.value
        const currentFiles = this.form.get('addedDocuments')?.value || [];
        this.form.get('addedDocuments')?.patchValue([...currentFiles, selectedFile]);
      }
    }
  }


  deleteDocs(docIndex: number): void {
    const currentFiles = this.form.get('addedDocuments')?.value || [];
    currentFiles.splice(docIndex, 1);
    this.form.get('addedDocuments')?.setValue(currentFiles);
  }

  deleteAttachedDocs(docIndex: number): void {
    const currentFiles = this.form.get('attachedDocuments')?.value || [];
    currentFiles.splice(docIndex, 1);
    this.form.controls['attachedDocuments'].setValue(currentFiles);
  }



  protected formValidators(): void {
    this.form.get('dateStart')?.setAsyncValidators([
      FormValidators.startBeforeEnd(this.dateStart, this.dateEnd, this.form.get('dateStart') as FormControl, this.form.get('dateEnd') as FormControl),
    ]);
    this.form.get('dateEnd')?.setAsyncValidators([
      FormValidators.startBeforeEnd(this.dateStart, this.dateEnd, this.form.get('dateStart') as FormControl, this.form.get('dateEnd') as FormControl)
    ]);
    this.form.get('dateStart')?.setValidators([
      Validators.required,
    ]);
    this.form.get('dateEnd')?.setValidators([
      Validators.required,
    ]);
    this.form.setValidators([
      FormValidators.locationValidator(this.isHybridChecked, this.isAddressChecked, this.isOnlineChecked),
    ]);
  }

  ngOnDestroy(): void {
    if (this.agendaSubscription) {
      this.agendaSubscription.unsubscribe();
    }
  }

}
