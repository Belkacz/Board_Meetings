import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

    @Output() visibilityOutput = new EventEmitter<boolean>();

    public changeVisibility(){
      this.visibilityOutput.emit(true);
    }
}
