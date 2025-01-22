import { Component } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  public isAboutVisible = false;

  public handleAboutVisibility(){
    this.isAboutVisible = !this.isAboutVisible;
  }

}
