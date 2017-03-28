import React from 'react';
import CellComponent from './cell';

export default class FieldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: this.props.field,
            scores: this.props.field.scores,
            gameover: this.props.field.gameover
        };
    }

    componentDidMount() {
        this.props.field.handler = this.handler.bind(this);
    }

    handler(field) {
        let raiseAction = null,
            promises = [];

        this.props.disableKeyboard();

        if(field.gameover) {
            this.setState({gameover: true});
            return;
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
                    this.props.enableKeyboard();
                });
            } else {
                this.props.enableKeyboard();
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


    render() {
        return (
            <div className="field">
                {this.state.gameover ? <div className="gameover">вы проиграли</div> : null}
                <div className="scores">{this.props.field.scores}</div>
                {this.cells}
            </div>
        );
    }
}