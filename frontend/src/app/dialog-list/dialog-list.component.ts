import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.css']
})
export class DialogListComponent {
  public title: string;
  public list: string[];
  public newElement: string;

  public submitDisable = true;

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogListComponent>,
    @Inject(MAT_DIALOG_DATA) public form: FormGroup) {
    this.title = 'title';
    this.list = [];
    this.form = this.fb.group({
      agendaName: ['', Validators.required],
      list: [this.list, Validators.required],
    });
    this.newElement = '';
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  addElement(newElement: string) {
    if (newElement && newElement.trim() !== '') {
      this.list.push(newElement.trim());
      this.form.get('list')?.setValue(this.list);
    }
  }

  removeElement(index: number) {
    this.list.splice(index, 1);
    this.form.get('list')?.setValue(this.list);
    this.form.updateValueAndValidity();
  }
}
