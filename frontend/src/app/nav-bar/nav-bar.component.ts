import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @Input() title: string | null;
  @Input() editedMeetingId: number | null;
  @Input() formDisabled: boolean;
  @Input() meetingError: string | null;
  @Input() showSaveButton: boolean;
  @Output() saveAndPublish = new EventEmitter<boolean>();

  public tittle = "Edit Meeting №" + 0;
  public activeHamburger = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.title = null;
    this.editedMeetingId = null;
    this.formDisabled = true;
    this.meetingError = null;
    this.showSaveButton = false;
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.activeHamburger = true
      } else {
        this.activeHamburger = false;
      }
    })
  }

  emitPublish() {
    this.saveAndPublish.emit(true)
  }

}
