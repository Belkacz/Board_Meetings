import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatIcon,
    MatInputModule
  ]
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
