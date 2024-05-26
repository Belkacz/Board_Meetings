import { Component } from '@angular/core';
import { dataMapService } from './services/dataService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Board-Meetings';

  constructor(private dataService: dataMapService){
    this.dataService.getMeetingsService();
  }
}
