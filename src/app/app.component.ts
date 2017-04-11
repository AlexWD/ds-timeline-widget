import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config = {
    channelCount: 4,
    items: [
      {
        title: 'Timeline item #1',
        left: 0,
        width: 60,
        channel: 0,
        top: 0,
        draggable: undefined,
        $el: undefined,
        selected: false
      },
      {
        title: 'Timeline item #2',
        left: 300,
        width: 60,
        top: 50,
        channel: 1,
        draggable: undefined,
        $el: undefined,
        selected: false
      }
    ]
  }
}
