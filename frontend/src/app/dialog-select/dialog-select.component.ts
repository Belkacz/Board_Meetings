import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Agenda } from '../shared/interfaces';


@Component({
  selector: 'app-dialog-select',
  templateUrl: './dialog-select.component.html',
  styleUrl: './dialog-select.component.css'
})
export class DialogSelectComponent {

  @Input() agendaList: Agenda[];
  public selectedAgenda: Agenda | null;
  public noAgendas = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Agenda[]) {
    this.selectedAgenda = null;
    this.agendaList = data;
    if (this.agendaList.length > 0) {
      this.noAgendas = false;
    }
  }
  panelOpenState = false;
}
