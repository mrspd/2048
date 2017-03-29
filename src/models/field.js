import Model from 'components/model';
import Cell from 'models/cell';
import Event from 'event-dispatcher';

export default class Field extends Model {
    size;
    matrix = [];
    scores = 0;
    sound = new Audio('swipe.mp3');
    gameover = false;

    constructor(options) {
        super();
        this.size = options.size;

        this.matrix = [];

        // Заполняем поле ячейками
        for(let y = 0; y < this.size; ++y) {
            let row = [];

            for(let x = 0; x < this.size; ++x) {
                row.push(new Cell({position: [y, x], key: `${y}-${x}`}));
            }

            this.matrix.push(row);
        }

        // Берем случайную ячейку и задаем ей значение
        let initialCell = this.randomCell;
        initialCell.isNew = true;
        initialCell.value = 2;

        Event.on('field.restart', this.reload.bind(this));
    }

    reload() {
        this.scores = 0;
        this.gameover = false;

        this.matrix.forEach((cells) => {
            cells.forEach((cell) => {
                cell.value = 0;
            });
        });

        let initialCell = this.randomCell;
        initialCell.isNew = true;
        initialCell.value = 2;

        Event.emit('field.reload', this);
    }

    move(direction) {
        this.normalize(direction);

        let merged = [];

        this.matrix.forEach((cells, rowIdx) => {
            cells = Field.normalizeRow(cells);

            for(let c = 0, n = 1; n < cells.length; ++c, ++n) {
                if(cells[c].value == cells[n].value && !cells[c].isMerged && !cells[n].isMerged && cells[c].value > 0 && cells[n].value > 0) {
                    cells[c].value = cells[c].value * 2;
                    cells[c].isMerged = true;
                    cells[n].value = 0;

                    merged.push([cells[c], cells[n]]);
                    cells = Field.normalizeRow(cells);
                }
            }

            this.matrix[rowIdx] = cells;
        });

        this.denormalize(direction);

        if(this.setCellPositions()) {
            this.sound.pause();
            this.sound.currentTime = 0;
            setTimeout(() => {
                this.sound.play();
            }, 150);


            if(this.emptyCellsCount > 0) {
                while(true) {
                    let randomCell = this.randomCell;
                    if(randomCell.value == 0) {
                        randomCell.value = Math.random() > 0.8 ? 4 : 2;
                        randomCell.isNew = true;
                        break;
                    }
                }

                merged.forEach(([c1, c2]) => {
                    c2.mergedTo = c1.position;
                    this.scores += c1.value;
                });
            }
        }

        Event.emit('field.move', this);

        if(!this.possibleVariantsExist() && this.emptyCellsCount == 0) {
            this.gameover = true;
        }
    }

    possibleVariantsExist() {
        for(let i = 0; i < this.size; ++i) {
            for(let j = 0; j < this.size; ++j) {
                let c = this.matrix[i][j],
                    c2 = null,
                    c3 = null;

                if(this.matrix[i] && this.matrix[i][j + 1]) c2 = this.matrix[i][j + 1];
                if(this.matrix[i + 1] && this.matrix[i + 1][j]) c3 = this.matrix[i + 1][j];

                if((c.value > 0 && c2 && c.value == c2.value) || (c.value > 0 && c3 && c.value == c3.value)) {
                    return true;
                }
            }
        }

        return false;
    }

    setCellPositions() {
        let changedPositionCount = 0;
        this.matrix.forEach((cells, rowIdx) => {
            cells.forEach((cell, cellIdx) => {
                cell.position = [rowIdx, cellIdx];

                if(cell.position[0] != cell.previousPosition[0] || cell.position[1] != cell.previousPosition[1] || cell.isMerged) changedPositionCount++;
            });
        });

        return !!changedPositionCount;
    }

    resetCellsState() {
        this.matrix.forEach((cells) => {
            cells.forEach((cell) => cell.reset());
        });
    }

    transpose() {
        this.matrix = this.matrix[0].map((col, i) => this.matrix.map(row => row[i]));
    }

    reverse() {
        this.matrix = this.matrix.map((row) => row.reverse());
    }

    normalize(direction) {
        if(['up','down'].indexOf(direction) > -1) this.transpose();
        if(['right', 'down'].indexOf(direction) > -1) this.reverse();

        this.resetCellsState();
    }

    denormalize(direction) {
        if(['right', 'down'].indexOf(direction) > -1) this.reverse();
        if(['up','down'].indexOf(direction) > -1) this.transpose();
    }

    get randomCell() {
        let x = Field.random(0, this.size - 1),
            y = Field.random(0, this.size - 1);

        return this.matrix[x][y];
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
        let emptyCells = [],
            filledCells = [];

        cells.forEach((cell) => {
            cell.value > 0 ? filledCells.push(cell) : emptyCells.push(cell);
        });

        return filledCells.concat(emptyCells);
    }

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}