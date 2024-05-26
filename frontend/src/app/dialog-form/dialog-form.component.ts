import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent {
  @Output() formSubmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public title: string, @Inject(MAT_DIALOG_DATA) public fields: string[],
    private fb: FormBuilder) {
    this.form = new FormGroup({})
  }

  ngOnInit() {
    this.form = this.fb.group({});
    for (let field of this.fields) {
      this.form.addControl(field, new FormControl('', Validators.required));
    }
  }

}
