import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state = {
    zoom: 1,
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
        start: 0,
        duration: 60,
        channel: 0,
        selected: false
      },
      {
        title: 'Timeline item #2',
        start: 300,
        duration: 60,
        channel: 1,
        selected: false
      }
    ]
  }

  itemMoved(state) {
    console.log("Item moved", state);
  }

  channelAdded(state) {
    console.log("Channel added", state);
  }

  itemAdded(state) {
    console.log("Item Added", state);
  }
}
