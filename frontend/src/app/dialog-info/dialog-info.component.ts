import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExistedBoardMeetings } from '../shared/interfaces';
import { FileDownloadService } from '../services/file-download.service';

@Component({
  selector: 'app-dialog-info',
  standalone: true,
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule
  ]
})
export class DialogInfoComponent {
  meeting: ExistedBoardMeetings;
  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExistedBoardMeetings, public fileDownloadService: FileDownloadService,) {
    this.meeting = data;
    console.log(this.meeting)
  }
}
