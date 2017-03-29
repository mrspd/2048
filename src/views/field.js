import React from 'react';
import CellComponent from './cell';
import {CELL_SIZE, CELL_MARGIN} from 'consts';
import Event from 'event-dispatcher';

export default class FieldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: this.props.field,
            scores: this.props.field.scores,
            gameover: this.props.field.gameover,
            win: this.props.field.win
        };
    }

    componentDidMount() {
        Event.on('field.move', this.animation.bind(this));
        Event.on('field.reload', this.reload.bind(this));
    }

    reload(field) {
        field.matrix.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                let cellComponent = this.getCellByKey(cell.key);
                cellComponent.raise(cell.value)
            });
        });

        this.setState({scores: field.scores, gameover: field.gameover, win: field.win});
    }

    animation(field) {
        let raiseAction = null,
            promises = [];

        Event.emit('field.animation.begin');

        if(field.gameover) {
            this.setState({gameover: true});
            return;
        }

        if(field.win) {
            this.setState({win: true});
        }

        field.matrix.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                let cellComponent = this.getCellByKey(cell.key);

                if(cell.isNew) raiseAction = this.createRaiseAction(cellComponent, cell);

                if(cell.position[0] != cell.previousPosition[0] || cell.position[1] != cell.previousPosition[1]) {
                    promises.push(cellComponent.moveTo(cell.position));
                }

                if(cell.mergedTo) {
                    promises.push(cellComponent.moveTo(cell.mergedTo).then(() => {
                        return cellComponent.hide();
                    }).then(() => {
                        return cellComponent.moveTo(cell.position);
                    }));
                }

                if(cell.value > cell.previousValue && !cell.isNew) {
                    promises.push(cellComponent.merge(cell.value));
                }
            });
        });

        Promise.all(promises).then(() => {
            if(raiseAction) {
                raiseAction().then(() => {
                    Event.emit('field.animation.end');
                });
            } else {
                Event.emit('field.animation.end');
            }

            this.setState({
                scores: field.scores
            });
        });
    }

    createRaiseAction(component, cell) {
        return (function() {
            return component.raise(cell.value);
        });
    }

    getCellByKey(key) {
        return this.refs[`cell-${key}`];
    }

    get cells() {
        let cells = [];

        this.state.field.matrix.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                cells.push(<CellComponent rowIdx={rowIdx} cellIdx={cellIdx} cell={cell} key={cell.key} ref={`cell-${cell.key}`}/>);
            })
        });

        return cells;
    }


    get style() {
        return {width: this.width, height: this.width};
    }

    get width() {
        return CELL_SIZE * this.props.field.size - CELL_MARGIN;
    }

    restart() {
        Event.emit('field.restart');
    }

    render() {
        return (
            <div className="field" style={this.style}>
                {this.state.gameover ? <div className="gameover" style={{width: this.width}} onClick={this.restart.bind(this)}>вы проиграли</div> : null}
                {this.state.win ? <div className="gameover" style={{width: this.width}} onClick={this.restart.bind(this)}>вы победили</div> : null}
                <div className="scores" style={{width: this.width}}>{this.props.field.scores}</div>
                {this.cells}
            </div>
        );
    }
}