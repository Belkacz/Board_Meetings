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
  public newElement: string;

  public submitDisable = true;

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogListComponent>) {
    this.title = 'title';
    this.list = [];
    this.localList = [];
    this.form = this.fb.group({
      agendaName: ['', Validators.required],
      list: [this.list, Validators.required],
    });
    this.newElement = '';
  }

  ngOnInit() {
    if (this.list.length > 0) {
      this.localList = this.list;
    }
  }

  saveDialog() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.formSubmit.emit(this.form.value);
      this.dialogRef.close();
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    console.log(this.form)
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  addElement(newElement: string) {
    console.log(this.form)
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
