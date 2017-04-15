import { Component, OnInit, Input, AfterViewChecked, EventEmitter, Output } from '@angular/core';

declare let $: any;
declare let Draggable: any;
declare let TweenLite: any;
declare let ruler: any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, AfterViewChecked {
  standardGridWidth = 196 * 4;
  gridWidth = 196 * 4;
  gridHeight = 50;
  $container;

  items = [];
  channels = [];
  outputs = [{
    name: "Output",
    color: "#000"
  }];
  ruler = undefined;
  selectedChannel = undefined;
  selectedItem = undefined;
  selectedOutput = undefined;
  frozen = false;
  zoom = 1;

  @Input() config;

  @Output() onVoted = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.$container = $('#container');

    // add channels
    this.config.channels.map((channel) => {
      this.addChannel(channel);
    });

    // add timeline items
    this.config.items.map((item) => {
      this.addItem(item);
    });

    // reset item selection when the container is clicked
    this.$container.click((e) => {
      if (!$(e.target).hasClass('box') && !$(e.target).hasClass('box-image')) {
        this.resetSelection();
      }
    });

    this.ruler = new ruler({
      container: document.querySelector('.ruler'),// reference to DOM element to apply rulers on
      rulerHeight: 50, // thickness of ruler
      fontFamily: 'arial',// font for points
      fontSize: '10px',
      cornerSides: [],
      strokeStyle: 'black',
      lineWidth: 1,
      enableMouseTracking: false,
      enableToolTip: false,
      sides: ['top']
    });

    this.ruler.api.setScale(1);
  }

  ngAfterViewChecked() {
    this.items.map((item, i) => {
      if (item.$el === undefined) {
        var self = this;

        var startX, startY;
        var companions;

        item.$el = $("li[data-bid='" + i + "']");

        item.draggable = Draggable.create(item.$el, {
          bounds: $('#container'),
          edgeResistance: 1.0,
          type: "x,y",
          throwProps: false,
          lockAxis: false,
          x: 0,
          y: 0,
          liveSnap: {
            y: function(endValue) { return Math.round(endValue / self.gridHeight) * self.gridHeight; },
            x: function(endValue) { return endValue; }
          },
          onPress: function(e) {
            // select item
            //self.selectedItem = item;

            // mutli-select functionality
            if (!e.ctrlKey && $(".box.ui-selected").length == 1) {
              self.resetSelection();
            }
            $(this.target).addClass('ui-selected');
            e.stopPropagation();

            //when the user presses, we'll create an array ("companions") and populate it with all the OTHER elements that have the ".ui-selected" class applied (excluding the one that's being dragged). We also record their x and y position so that we can apply the delta to it in the onDrag.
            var boxes = $(".box.ui-selected"),
              i = boxes.length;

            companions = [];
            startX = this.x;
            startY = this.y;

            while (--i > -1) {
              var boxId = $(boxes[i]).data('bid');
              if (boxes[i] !== this.target) {
                companions.push({
                  e: e,
                  selfId: self.items.indexOf(item),
                  item: self.items[boxId],
                  itemId: boxId,
                  element: boxes[i],
                  x: boxes[i]._gsTransform.x,
                  y: boxes[i]._gsTransform.y,
                  lastX: boxes[i]._gsTransform.x,
                  lastY: boxes[i]._gsTransform.y
                });
              } else {
                self.items[boxId].selected = true;
              }
            }
            TweenLite.killTweensOf(".box");
          },
          onDrag: function() {
            var i = companions.length,
              deltaX = this.x - startX,
              deltaY = this.y - startY,
              companion;

            while (--i > -1) {
              companion = companions[i];


              self.moveItem(companion.item, companion.x + deltaX, companion.y + deltaY);

              if (!companion.item.draggable.hitTest('#container', "100%")) { // if the item is moved outside of the bounds, move it back
                console.log('undo movement');
                self.moveItem(companion.item, companion.lastX, companion.lastY);
              } else {
                companion.lastX = companion.x + deltaX;
                companion.lastY = companion.y + deltaY;
              }

              // start the companion dragging with the original event
              self.items[companion.selfId].draggable.startDrag(companion.e);
            }
          }
        })[0];

        //connect object to drag event listener to update position
        item.draggable.addEventListener("drag", function() {
          item.left = this._gsTransform.x;
          item.baseLeft = this._gsTransform.x;
          item.top = this._gsTransform.y;
        });

        // set item initial position
        this.moveItem(item, item.left, item.top);

        var startWidth;

        // the ui-resizable-handles are added here
        $('.resizable').resizable({
          handles: 'e, w',
          start: function (event, ui) {
            var id = ui.originalElement.data('bid');
            var resizingItem = self.items[id];

            startWidth = resizingItem.width;
            console.log("startWidth: " + startWidth);
          },
          create: function(event, ui) { console.log(event); },
          resize: function(event, ui) {
            var id = ui.originalElement.data('bid');
            var resizingItem = self.items[id];
            resizingItem.width = ui.size.width;
            resizingItem.duration = ui.size.width * self.zoom;

            var widthDelta = resizingItem.width - startWidth;

            // move any companions
            self.items.filter((item) => item.selected).map((selectedItem) => {
              if (selectedItem != resizingItem) {
                //selectedItem.
                selectedItem.width += widthDelta;
                selectedItem.duration = selectedItem.width * self.zoom;
              }
            });

            startWidth = resizingItem.width;
          },
          stop: function(event, ui) {
            // resizable modifies the left which messes with things, so we undo it and calculate the offsets
            var left = parseInt($(this).css('left'));
            var id = ui.originalElement.data('bid');

            $(this).css({left: 0});

            self.moveItem(self.items[id], self.items[id].left + left, self.items[id].top);
          }
        });

        // makes GSAP Draggable avoid clicks on the resize handles
        $('.ui-resizable-handle').attr('data-clickable', true);
      }


    });
  }

  addItem(item) {
    var newItem = Object.assign(
      {},
      item,
      {
        duration: item.width,
        baseLeft: item.left
      }
    );
    this.items.push(newItem);
  }

  resetSelection() {
    $('.resizable').removeClass('ui-selected');
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].selected = false;
    }
  }

  drag(e, l) {
    e.dataTransfer.setData("text", l);
  }

  drawChannels() {
    this.$container.find(".timeline-row").remove();

    this.channels.map((channel, i) => {
      // create element for channel and append it to the container
      channel.$el = $("<div/>").css({
        width: this.gridWidth - 1,
        height: this.gridHeight - 1,
        top: i * this.gridHeight,
        left: 0
      }).addClass('timeline-row').appendTo(this.$container);

      // add ondrop event listener for accepting item drops
      channel.$el[0].ondrop = (e) => {
        e.preventDefault();

        var data = e.dataTransfer.getData("text");
        var offset = this.$container.offset();
        var left = e.x - offset.left;
        var top = Math.floor((e.y - offset.top) / this.gridHeight) * this.gridHeight;

        this.addItem({
          title: data,
          left: left,
          width: 60 * (1 / this.zoom),
          channel: Math.floor(top / this.gridHeight),
          top: top,
          draggable: undefined,
          $el: undefined,
          selected: false
        });
      };

      channel.$el[0].ondragover = function(e) {
        e.preventDefault();
      };
    });

    //set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
    this.updateContainerSize();

    // update bounds for all draggable items
    for (var i = 0; i < this.items.length; ++i) {
      if (this.items[i].draggable !== undefined) {
        this.items[i].draggable.applyBounds();
      }
    }
  }

  resizeToLargest() {
    var largest = this.items.reduce((accum, item) => {
      return Math.max(accum, item.width);
    }, 0);

    this.items.filter(item => item.selected)
      .map((item) => {
        item.width = largest;
        item.duration = largest * this.zoom;
        item.$el.css({ width: largest });
      });
  }

  closeGaps() {
    var channel;
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].channel = Math.floor((this.items[i].top) / this.gridHeight);
      if (this.items[i].selected) {
        channel = this.items[i].channel;
      }
    }
    if (channel !== undefined) {
      // get the items in this channel and sort them left to right
      var groupedItems = this.items.filter((item) => {
        return item.channel == channel;
      }).sort((a, b) => {
        return a.left - b.left;
      });

      // place the channels
      var nextStartPos = 0;
      groupedItems.map((item, i) => {
        this.moveItem(item, nextStartPos, item.top);
        nextStartPos += item.width;
      });
    }
  }

  alignLeft() {
    var leftAlign = this.items.filter((item) => item.selected)
      .reduce((accum, item) => Math.min(accum, item.left), Infinity);

    this.items.filter(item => item.selected)
      .map((item, i) => {
        this.moveItem(item, leftAlign, item.top)
      });
  }

  alignRight() {
    var rightAlign = this.items.filter((item) => item.selected)
      .reduce((accum, item) => Math.max(accum, item.left + item.width), 0);

    this.items.filter(item => item.selected)
      .map((item, i) => {
        this.moveItem(item, rightAlign - item.width, item.top)
      });
  }

  moveItem(item, x, y) {
    if (item) {
      x = (x === undefined) ? item.left : x;
      y = (y === undefined) ? item.top : y;

      TweenLite.set(item.$el[0], { x: x, y: y });
      item.draggable.update(); // update the draggable position
      item.left = x;
      item.baseLeft = item.left * this.zoom;
      item.top = y;
    }
  }

  changeZoom(e) {
    var zoomFactor = 1 / this.zoom;

    this.items.map((item) => {
      item.width = item.duration * zoomFactor;
      this.moveItem(item, item.baseLeft * zoomFactor, item.top);
    });

    this.ruler.api.setScale(this.zoom);
  }

  addChannel(channel) {
    var newChannel = Object.assign(
        {},
        channel,
        {
          $el: undefined,
          name: "CH" + this.channels.length,
          color: '#0000FF'
        }
    );
    this.channels.push(newChannel);
    this.drawChannels();
  }

  addOutput() {
    var newOutput = Object.assign(
      {},
      {
        name: "Output",
        color: "#000"
      }
    );

    this.outputs.push(newOutput);
  }

  updateContainerSize() {
    TweenLite.set(
      this.$container, {
        height: this.channels.length * this.gridHeight + 1,
        width: this.gridWidth + 1
      }
    );
  }

  selectChannel(i) {
    this.selectedChannel = this.channels[i];
    this.selectedItem = undefined;
    this.selectedOutput = undefined;
  }

  selectItem(i) {
    this.selectedItem = this.items[i];
    this.selectedChannel = undefined;
    this.selectedOutput = undefined;
  }

  selectOutput(i) {
    this.selectedOutput = this.outputs[i];
    this.selectedChannel = undefined;
    this.selectedItem = undefined;
  }

  toggleFrozen(e) {
    this.frozen = !this.frozen;

    if (this.frozen) {
      this.items.map((item) => {
        item.draggable.disable();
      });
    } else {
      this.items.map((item) => {
        item.draggable.enable();
      });
    }
  }

  deleteChannel(e) {
    if (this.selectedChannel) {
      this.channels.splice(this.channels.indexOf(this.selectedChannel), 1);
      this.selectedChannel.$el.remove();
      this.selectedChannel = undefined;

      this.drawChannels();
    }
  }

  deleteOutput(e) {
    if (this.selectedOutput) {
      this.outputs.splice(this.outputs.indexOf(this.selectedOutput), 1);
      this.selectedOutput = undefined;
    }
  }

  deleteItem(e) {
    if (this.selectedItem) {
      this.items.splice(this.items.indexOf(this.selectedItem), 1);
      this.selectedItem = undefined;
    }
  }

}
