import Model from 'components/model';

export default class Cell extends Model {
    _value;
    _previousValue;
    isNew = false;
    isMerged = false;
    mergedTo = null;
    key = null;

    _position = [];
    _previousPosition = [];

    constructor(options = {}) {
        super();

        if(!options.position) throw new Error('Position not passed at options');
        if(!options.key) throw new Error('Unique key not passed at options');

        this.key = options.key;
        this._position = options.position;
        this._value = options.value || 0;
    }

    get value() {
        return this._value;
    }

    get previousValue() {
        return this._previousValue;
    }

    set value(value) {
        this._previousValue = this._value;
        this._value = value;
    }

    reset() {
        this.isNew = false;
        this.isMerged = false;
        this.mergedTo = null;
    }

    get position() {
        return this._position;
    }

    get previousPosition() {
        return this._previousPosition;
    }

    set position(value) {
        this._previousPosition = this._position;
        this._position = value;
    }
}