import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dialogFormData } from '../shared/interfaces';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent {
  @Output() formSubmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public title: string, @Inject(MAT_DIALOG_DATA) public data: dialogFormData[],
    private fb: FormBuilder) {
    this.form = new FormGroup({})
  }

  ngOnInit() {
    this.form = this.fb.group({});
    for (let data of this.data) {
      this.form.addControl(data.field, new FormControl(data.initData, Validators.required));
    }
  }

}
