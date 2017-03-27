import React from 'react';
import ColorHash from 'color-hash';

export default class FieldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: this.props.field
        };
    }

    componentDidMount() {
        this.props.field.handler = this.handler.bind(this);
    }

    handler(field) {
        console.log(this.state.field);
        this.setState({field});
    }

    get cells() {
        let cells = [];

        this.state.field.matrix.forEach((row, rowIdx) => {
            let translateY = rowIdx * 100;

            row.forEach((cell, cellIdx) => {
                let translateX = cellIdx * 100,
                    style = {
                        transform: `translate(${translateX}px, ${translateY}px)`
                    };

                let className = `cell v${cell.value}`;
                cells.push(<div className={className} key={`${rowIdx}-${cellIdx}`} style={style}>{cell.value}</div>);
            })
        });

        return cells;
    }

    render() {
        return (
            <div className="field">{this.cells}</div>
        );
    }
}