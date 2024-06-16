import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @Input() name: string | null;
  @Input() meetingId: number | null;

  constructor() {
    this.name = null;
    this.meetingId = null;
  }

}
