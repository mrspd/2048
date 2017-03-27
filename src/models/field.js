import Model from 'components/model';
import Cell from 'models/cell';

export default class Field extends Model {
    size;
    matrix = [];
    handler = null;

    constructor(size = 4) {
        super();
        this.size = size;

        // Заполняем поле ячейками
        for(let y = 0; y < size; ++y) {
            let row = [];

            for(let x = 0; x < size; ++x) {
                row.push(new Cell());
            }

            this.matrix.push(row);
        }

        // Берем случайную ячейку и задаем ей значение
        let initialCell = this.randomCell;
        initialCell.value = 2;
    }

    move(direction) {
        this.resetCellsState();
        this.setCellsCoordinates('old');

        let originalDirection = direction;

        if(['up','down'].indexOf(direction) > -1) {
            this.transposeMatrix();
            direction = direction == 'up' ? 'left' : 'right';
        }

        let clearedCells = this.clearedCells;

        switch(direction) {
            case 'left':
                clearedCells.forEach((cells, rowIdx) => {
                    for(let c = 0, n = 1; n < cells.length; ++c, ++n) {
                        if(cells[c].value == cells[n].value && !cells[c].isMerged && !cells[n].isMerged) {
                            cells[c].value = cells[c].value * 2;
                            cells[c].isMerged = true;
                            cells[n].value = 0;
                            cells = Field.normalizeRow(cells);
                        }
                    }

                    this.matrix[rowIdx] = cells.concat(new Array(this.size - cells.length).fill(null).map(() => new Cell()));
                });
                break;

            case 'right':
                clearedCells.forEach((cells, rowIdx) => {
                    for(let c = cells.length - 1, n = cells.length - 2; n >= 0; --c, --n) {
                        if(cells[c].value == cells[n].value && !cells[c].isMerged && !cells[n].isMerged) {
                            cells[c].value = cells[c].value * 2;
                            cells[c].isMerged = true;
                            cells[n].value = 0;
                            cells = Field.normalizeRow(cells);
                        }
                    }

                    this.matrix[rowIdx] = new Array(this.size - cells.length).fill(null).map(() => new Cell()).concat(cells);
                });
                break;
        }

        if(['up','down'].indexOf(originalDirection) > -1) {
            this.transposeMatrix();
        }

        if(this.emptyCellsCount > 0) {
            while(true) {
                let randomCell = this.randomCell;
                if(randomCell.value == 0) {
                    randomCell.value = Math.random() > 0.8 ? 4 : 2;
                    break;
                }
            }
        } else {
            alert('game over');
        }

        this.setCellsCoordinates('new');
        if(this.handler) this.handler(this);
    }

    setCellsCoordinates(to) {
        this.matrix.forEach((cells, rowIdx) => {
            cells.forEach((cell, cellIdx) => {
                cell.setCoordinates(to, [rowIdx, cellIdx]);
            });
        });
    }

    resetCellsState() {
        this.matrix.forEach((cells) => {
            cells.forEach((cell) => cell.reset());
        });
    }

    transposeMatrix() {
        this.matrix = this.matrix[0].map((col, i) => this.matrix.map(row => row[i]));
    }

    get randomCell() {
        let x = Field.random(0, this.size - 1),
            y = Field.random(0, this.size - 1);

        return this.matrix[x][y];
    }

    get clearedCells() {
        return this.matrix.map((cells) => {
            return Field.normalizeRow(cells);
        });
    }

    get emptyCellsCount() {
        let count = 0;
        this.matrix.forEach((cells) => {
            return cells.forEach((cell) => {
                if(cell.value == 0) {
                    count++;
                }
            });
        });

        return count;
    }

    static normalizeRow(cells) {
        return cells.filter((cell) => {
            return cell.value > 0;
        });
    }

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}