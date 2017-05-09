import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.css']
})
export class DurationInputComponent implements OnInit {
  hours = 0;
  minutes = 0;
  seconds = 1;
  hoursOutput = "00";
  minutesOutput = "00";
  secondsOutput = "01";
  focus = "second";
  focusedItem;
  timer;

  constructor() { }

  ngOnInit() {
  }

  increment() {
    console.log('increment called');
    this.focusedItem.focus();
    switch (this.focus) {
      case "hour":
        if (++this.hours > 24) {
          this.hours = 24;
        }
        break;
      case "minute":
        if (++this.minutes == 60) {
            this.minutes = 0;
            this.hours++;
        }
        break;
      case "second":
        if (++this.seconds == 60) {
          this.seconds = 0;
          this.minutes++;
        }
        break;
      default:
        break;
    }
    this.updateDisplay();
  }

  decrement() {
    switch (this.focus) {
      case "hour":
        if (--this.hours < 0) {
            this.hours = 0;
        }
        break;
      case "minute":
        if (this.minutes == 0 && this.hours == 0) break;
        if (--this.minutes == -1) {
            this.minutes = 59;
            this.hours--;
        }
        break;
      case "second":
        if (this.seconds == 0 && this.minutes == 0 && this.hours == 0) break;
        if (--this.seconds == -1) {
          this.seconds = 59;
          if (--this.minutes == -1) {
            this.minutes = 59;
            this.hours--;
          }
        }
        break;
      default:
        break;
    }
    this.updateDisplay();
  }

  updateDisplay() {
    this.secondsOutput = this.padLeft(this.seconds);
    this.minutesOutput = this.padLeft(this.minutes);
    this.hoursOutput = this.padLeft(this.hours);
  }

  setFocus(event, field) {
    this.focus = field;
    this.focusedItem = event.target;
  }

  mouseDownIncrement() {
    this.increment();
    this.timer = setInterval(() => this.increment(), 150);
  }

  mouseUpIncrement() {
    clearInterval(this.timer);
  }

  mouseDownDecrement() {
    this.decrement();
    this.timer = setInterval(() => this.decrement(), 150);
  }

  mouseUpDecrement() {
    clearInterval(this.timer);
  }

  padLeft(n){
  	n=n.toString();
      n= "00".substring(0,2-n.length)+""+n.toString() ;
      n=n.substring(n.length-2);
      return n;
  }


}
