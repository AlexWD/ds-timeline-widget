import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config = {
    channels: [
      {
        name: 'CH0',
        type: 'normal',
        color: '#0000FF'
      },
      {
        name: 'CH1',
        type: 'normal',
        color: '#0000FF'
      },
      {
        name: 'CH2',
        color: '#0000FF',
        type: 'common'
      },
    ],
    outputs: [
      {
        name: "Output",
        color: "#000"
      }
    ],
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
