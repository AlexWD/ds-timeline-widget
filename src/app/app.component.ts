import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';
const { Map } = require('immutable');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  resources = {
    items: [
      {
        id: 1,
        name: 'logo',
        type: 'png',
        time: '0',
        size: '110KB',
        src: 'assets/img/doc-13-128.png'
      },
      {
        id: 2,
        name: 'samplesvg',
        type: 'svg',
        time: '0',
        size: '110KB',
        src: 'assets/img/svgexample.svg'
      }
    ],
    outputs: [
      {
        id: 1,
        name: 'logo',
        type: 'png',
        time: '0',
        size: '110KB',
        src: 'assets/img/doc-13-128.png'
      },
      {
        id: 2,
        name: 'samplesvg',
        type: 'svg',
        time: '0',
        size: '110KB',
        src: 'assets/img/svgexample.svg'
      }
    ]
  };
  state = Map({
    duration: 3600,
    zoom: 1,
    channels: [
      {
        id: 5,
        name: 'CH0',
        type: 'normal',
        color: '#0000FF',
        selected: false,
      },
      {
        id: 7,
        name: 'CH1',
        type: 'normal',
        color: '#0000FF',
        selected: false
      },
      {
        id: 8,
        name: 'CH2',
        color: '#0000FF',
        type: 'common',
        selected: false
      },
    ],
    outputs: [
      // {
      //   id: 1,
      //   name: "Output",
      //   color: "#000",
      //   selected: false
      // }
    ],
    items: [
      {
        id: 1,
        type: 'channel',
        resource: "assets/img/doc-13-128.png",
        title: 'Logo_splash',
        start: 0,
        duration: 10,
        channel: 5,
        selected: false
      },
      {
        id: 2,
        type: 'channel',
        resource: "assets/img/doc-13-128.png",
        title: '350x350',
        start: 0,
        duration: 10,
        channel: 7,
        selected: false
      }
    ]
  });

  constructor() {
    // for (let i = 0; i < 15; ++i) {
    //   this.state.channels.push({
    //     id: 4 + i,
    //     name: 'CH2',
    //     color: '#0000FF',
    //     type: 'normal',
    //     selected: false
    //   });
    // }
    // for (let i = 0; i < 100; ++i) {
    //   this.state.items.push({
    //     id: 2,
    //     type: 'channel',
    //     resource: "assets/img/doc-13-128.png",
    //     title: '350x350',
    //     start: Math.floor(Math.random() * 20000),
    //     duration: Math.floor(Math.random() * 500),
    //     channel: 1 + Math.floor(Math.random() * 18),
    //     selected: false
    //   });
    // }
    //
    // setTimeout(() => {
    //   console.log("Adding new channel");
    //   this.state.channels.push({
    //     id: 4,
    //       name: 'CH3',
    //       color: '#0000FF',
    //       type: 'normal',
    //       selected: false
    //     });
    // }, 15 * 1000);

  }

  itemMoved(item) {
    console.log("Item moved", item);
  }

  itemAdded(item) {
    console.log("Item Added", item);
  }

  itemClicked(item) {
    console.log('Item clicked', item);
  }

  channelAdded(channel) {
    console.log("Channel added", channel);
  }

  channelClicked(channel) {
    console.log("Channel clicked", channel);
  }

  outputAdded(output) {
    console.log("Channel added", output);
  }

  outputClicked(output) {
    console.log("Channel clicked", output);
  }


}
