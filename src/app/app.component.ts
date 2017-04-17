import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  resources = [
    {
      name: 'logo',
      type: 'png',
      time: '0',
      size: '110KB',
      src: 'assets/img/doc-13-128.png'
    },
    {
      name: 'samplesvg',
      type: 'svg',
      time: '0',
      size: '110KB',
      src: 'assets/img/svgexample.svg'
    }
  ];
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
        resource: "assets/img/doc-13-128.png",
        title: 'Logo_splash',
        start: 0,
        duration: 60,
        channel: 0,
        selected: false
      },
      {
        resource: "assets/img/doc-13-128.png",
        title: '350x350',
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
