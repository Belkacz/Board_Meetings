import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent {
  @Input() title: string;
  @Input() fields: string[];
  @Output() formSubmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogFormComponent>) {
    //@Inject(MAT_DIALOG_DATA) public title: string
    this.title = 'title';
    this.fields = [];
    this.form = new FormGroup({})
  }

  ngOnInit() {
    this.form = this.fb.group({});
    for (let field of this.fields) {
      this.form.addControl(field, new FormControl('', Validators.required));
    }
  }

  SaveDialog() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      this.dialogRef.close()
      //this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
