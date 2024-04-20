import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-list',
  templateUrl: './dialog-list.component.html',
  styleUrls: ['./dialog-list.component.css']
})

export class DialogListComponent {
  @Input() title: string;
  @Input() fields: string[];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogListComponent>) {
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
}

