import Field from 'models/field';
import FieldComponent from 'views/field';
import {render} from 'react-dom';
import React from 'react';
import Hammer from 'hammerjs';
import Event from 'event-dispatcher';

class App {
    keyboardEnabled = true;

    constructor(node, options = {size: 4}) {
        this.field = new Field({size: options.size});

        document.addEventListener('keydown', this.keyboardHandler.bind(this));

        let hammer = new Hammer(document.body);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammer.on('swipeleft swiperight swipeup swipedown', this.swipeHandler.bind(this));

        Event.on('field.animation.begin', this.enableKeyboard);
        Event.on('field.animation.end', this.disableKeyboard);

        this.render(node, {field: this.field});
    }

    keyboardHandler(e) {
        let keyboardArrowMap = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        let direction = keyboardArrowMap[e.keyCode];
        if(direction && this.keyboardEnabled) this.field.move(direction);
    }

    swipeHandler(e) {
        if(this.keyboardEnabled) this.field.move(e.type.replace('swipe', ''));
    }

    enableKeyboard() {
        this.keyboardEnabled = true;
    }

    disableKeyboard() {
        this.keyboardEnabled = false;
    }

    render(node, props) {
        render((<FieldComponent size={this.field.size} {...props} enableKeyboard={this.enableKeyboard.bind(this)} disableKeyboard={this.disableKeyboard.bind(this)}/>), node);
    }

    static init(node, options) {
        new App(node, options);
    }
}

App.init(document.getElementById('field'));

