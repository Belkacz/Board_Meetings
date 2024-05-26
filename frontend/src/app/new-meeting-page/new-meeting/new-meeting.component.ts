import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { TimeType, FileType, urls } from '../../shared/enums';
import { Agenda, AttachedDocument, DownloadFile, ExistedBoardMeetings } from '../../shared/interfaces';
import { FileDownloadService } from '../../services/file-download.service';
import { FormValidators } from 'src/app/shared/formValidators.directive';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from 'src/app/dialog-list/dialog-list.component';
import { DialogSelectComponent } from 'src/app/dialog-select/dialog-select.component';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/restService.service';
import { dataMapService } from 'src/app/services/dataService.service';

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

  public isHybridChecked!: boolean;
  public isAddressChecked!: boolean;
  public isOnlineChecked!: boolean;

  private pickedStartTimeString!: string | null;
  private pickedEndTimeString!: string | null;

  public defaultDate: Date | null;
  public defaultTimeStart: string | null;
  public defaultTimeEnd: string | null;

  public title: string;
  public agendas: Agenda[];
  public agendasErrorMessage : string;
  private agendaSubscription: Subscription | undefined;

  constructor(
    public fileDownloadService: FileDownloadService,
    public dialog: MatDialog,
    private restService: RestService,
    private dataMapService: dataMapService,
    private renderer: Renderer2
  ) {
    super();
    this.editedMeeting = null;
    this.dateStart = new Date();
    this.dateEnd = new Date();

    this.title = "Edit Meeting"

    this.defaultDate = null;
    this.defaultTimeStart = null;
    this.defaultTimeEnd = null;

    this.agendas = [];
    this.agendasErrorMessage = ""

    this.createFormControls();
  }

  ngOnInit() {
    if (this.editedMeeting) {
      this.title = `Editing meeting # ${this.editedMeeting.id}`;
      this.form.patchValue({
        selectedMeetingType: this.editedMeeting.meetingType || null,
        meetingName: this.editedMeeting.meetingName || null,
        dateStart: this.editedMeeting.dateStart || null,
        dateEnd: this.editedMeeting.dateEnd || null,
        meetingAddress: this.editedMeeting.meetingAddress || null,
        onlineAddress: this.editedMeeting.onlineAddress || null,
        attachedDocuments: this.editedMeeting.attachedDocuments || null,
      });
  
      this.defaultDate = this.editedMeeting.dateStart || null;
      if (this.editedMeeting.dateStart) {
        const tempHours = new Date(this.editedMeeting.dateStart).getHours().toString();
        const tempMinutes = new Date(this.editedMeeting.dateStart).getMinutes().toString();
        this.defaultTimeStart = `${tempHours}:${tempMinutes}`;
      }
      if (this.editedMeeting.dateEnd) {
        const tempHours = new Date(this.editedMeeting.dateEnd).getHours().toString();
        const tempMinutes = new Date(this.editedMeeting.dateEnd).getMinutes().toString();
        this.defaultTimeEnd = `${tempHours}:${tempMinutes}`;
      }
    }
    this.form.get('meetingAddress')?.disable();
    this.form.get('onlineAddress')?.disable();
    this.pickedStartTimeString = null;
    this.pickedEndTimeString = null;
  
    this.agendaSubscription = this.getAgendas();
  }

  createFormControls(): void {
    this.dateStartControl = new FormControl([Validators.required]);
    this.dateEndControl = new FormControl([Validators.required]);
    this.form = new FormGroup({
      selectedMeetingType: new FormControl([Validators.required]),
      meetingName: new FormControl(null, FormValidators.notEmpty()),
      dateStart: this.dateStartControl,
      dateEnd: this.dateEndControl,
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

  private getAgendas(): Subscription {
    const result = this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETAGENDAS)
      .subscribe({
        next: (response: any) => {
          this.agendas = this.dataMapService.mapAgendas(response);
        },
        error: (error: any) => {
          console.error("Error:", error);
          this.agendasErrorMessage = "Server communication error";
        }
      });
    return result;
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
    const dialogRef = this.dialog.open(DialogSelectComponent, {
      data: this.agendas
    })

    dialogRef.afterClosed().subscribe(agenda => {
      this.form.patchValue({
        agenda: {
          id: agenda.id,
          agendaName: agenda.name,
          list: agenda.list
        }
      });
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

  ngOnDestroy(): void {
    if (this.agendaSubscription) {
      this.agendaSubscription.unsubscribe();
    }
  }

}
