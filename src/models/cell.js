import Model from 'components/model';

export default class Cell extends Model {
    value;
    isNew = false;
    isMerged = false;

    oldCoordinates = [];
    newCoordinates = [];

    constructor(value = 0, coordinates) {
        super();
        this.value = value;
        this.oldCoordinates = coordinates;
    }

    setNew() {
        this.isNew = true;
    }

    unsetNew() {
        this.isNew = false;
    }

    reset() {
        this.isNew = false;
        this.isMerged = false;
    }

    setCoordinates(to, value) {
        this[`${to}Coordinates`] = value;
    }
}