import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../base-form/base-form.component';
import { TimeType, FileType } from '../shared/enums';
import { DownloadFile } from '../shared/interfaces';
import { FileDownloadService } from '../services/file-download.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
})
export class NewMeetingComponent extends BaseFormComponent implements OnInit {
  @ViewChild('chooseFile ') chooseFileInput !: ElementRef;
  @ViewChild('addDocument  ') addDocumentInput !: ElementRef;

  FileType = FileType;

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
  private choosedFileControl!: FormControl;
  private addedDocumentControl!: FormControl
  public addedDocumentFormArray!: FormArray;

  constructor(private fileDownloadService: FileDownloadService) {
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
    //console.log(this.form);
    console.log(this.addedDocumentFormArray.value[0].name)
  }

  print2(elem: any) {
    console.log(elem)
  }

  createFormControls(): void {
    this.selectedMeetingType = new FormControl();
    this.mettingName = new FormControl();
    this.meetingAdrress = new FormControl({ value: '', disabled: true });
    this.dateSelected = new FormControl();
    this.dateStartControl = new FormControl();
    this.dateEndControl = new FormControl();
    this.meetingAdrress = new FormControl();
    this.onlineAddress = new FormControl();
    this.meetingAdrress = new FormControl();
    this.onlineAddress = new FormControl();
    this.choosedFileControl = new FormControl();
    this.addedDocumentControl = new FormControl();
    this.addedDocumentFormArray = new FormArray<FormControl>([]);
    this.form = new FormGroup({
      selectedMeetingType: this.selectedMeetingType,
      mettingName: this.mettingName,
      dateStart: this.dateStartControl,
      dateEnd: this.dateEndControl,
      meetingAdrress: this.meetingAdrress,
      onlineAddress: this.onlineAddress,
      chooseFile: this.choosedFileControl,
      addedDocuments: this.addedDocumentFormArray
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

  toggleAdress() {
    this.meetingAdrress.enable();
    this.onlineAddress.disable();
    this.isOnlineChecked = false;
    this.isAddressChecked = !this.isAddressChecked;
  }

  toggleOnline() {
    this.meetingAdrress.disable();
    this.onlineAddress.enable();
    this.isAddressChecked = false;
    this.isOnlineChecked = !this.isOnlineChecked;
  }

  openFilePicker(inputElement: ElementRef): void {
    inputElement.nativeElement.click();
  }

  onFileSelected(event: Event, type: FileType): void {
    const target = event.target as HTMLInputElement;
    if (target?.files !== null) {
      const selectedFile = target.files[0];
      if (type === FileType.ChooseFile) {
        this.choosedFileControl.setValue(selectedFile);
      }
      if (type === FileType.AddDocument) {
        const addedDocumentControl = new FormControl(selectedFile);
        this.addedDocumentFormArray.push(addedDocumentControl);
      }
    }
  }
  // downloadDoc(indexDox: number): void {
  //   const fileDocument = this.addedDocumentFormArray.value[indexDox];
  //   if (fileDocument) {
  //     const downloadLink = document.createElement('a');
  //     //downloadLink.href = fileDocument.fileUrl;
  //     downloadLink.download = fileDocument.name;
  //     downloadLink.click();
  //   }
  // }

  downloadFile(doc: DownloadFile): void {
    this.fileDownloadService.downloadFile(doc);
  }

  deleteDocs(docIndex: number) {
    this.addedDocumentFormArray.value.splice(docIndex, 1);
  }
}
