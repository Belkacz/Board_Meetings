import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.css']
})
export class DialogListComponent {
  @Input() title: string;
  @Input() list: string[];
  private localList: string[];

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogListComponent>) {
    this.title = 'title';
    this.list = [];
    this.localList = [];
    this.form = this.fb.group({
      agendaName: ['', Validators.required],
      newElement: ['']
    });
  }

  ngOnInit() {
    if (this.list.length > 0) {
      this.localList = this.list;
    }
  }

  saveDialog() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      this.dialogRef.close();
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  addElement() {
    const newElementValue = this.form.get('newElement')?.value;
    if (newElementValue && newElementValue.trim() !== '') {
      this.list.push(newElementValue.trim());
      this.form.get('newElement')?.setValue('');
    }
  }
}
