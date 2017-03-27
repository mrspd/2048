import Field from 'models/field';
import FieldComponent from 'views/field';
import {render} from 'react-dom';
import React from 'react';

let sOptions = Symbol('options'),
    sField = Symbol('field');

class App {
    constructor(node, options) {
        this[sOptions] = options;
        this[sField] = new Field(this[sOptions].size);

        document.addEventListener('keydown', this.keyboardHandler.bind(this));
        this.render(node, {field: this[sField]});
    }

    keyboardHandler(e) {
        let keyboardArrowMap = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        let direction = keyboardArrowMap[e.keyCode];
        if(direction) this[sField].move(direction);
    }

    render(node, props) {
        render((<FieldComponent {...props}/>), node);
    }

    static init(node, options = {size: 4}) {
        new App(node, options);
    }
}

App.init(document.getElementById('field'));

