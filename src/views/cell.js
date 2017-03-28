import React from 'react';

export default class CellComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            position: [this.props.rowIdx, this.props.cellIdx],
            value: this.props.cell.value,
            raise: false
        }
    }

    get className() {
        let classNames = ['cell', `v${this.state.value}`];

        if(this.state.raise) classNames.push('raise');

        return classNames.join(' ');
    }

    get style() {
        let translateY = this.state.position[0] * 100,
            translateX = this.state.position[1] * 100;

        let transforms = [`translate(${translateX}px, ${translateY}px)`];

        if(this.state.raise) {
            transforms.push('scale(0)');
        } else {
            transforms.push('scale(1)');
        }

        return {
            transform: transforms.join(' ')
        };
    }

    get backgroundStyle() {
        let translateY = this.props.rowIdx * 100,
            translateX = this.props.cellIdx * 100;

        return {transform: [`translate(${translateX}px, ${translateY}px)`]};
    }

    render() {
        return (
            <div>
                <div className="cell-background" style={this.backgroundStyle}></div>
                <div className={this.className} style={this.style}>{this.state.value > 0 ? this.state.value : null}</div>
            </div>
        );
    }

    moveTo(position) {
        return new Promise((resolve, reject) => {
            this.setState({position}, () => {
                setTimeout(resolve, 100);
            });
        });
    }

    raise(value) {
        return new Promise((resolve, reject) => {
            this.setState({raise: true}, () => {
                setTimeout(() => {
                    this.setState({raise: false, value}, () => {
                        setTimeout(resolve, 50);
                    });
                }, 50);
            });
        })
    }

    hide() {
        return new Promise((resolve, reject) => {
            this.setState({value: 0}, resolve);
        });
    }

    merge(value) {
        return new Promise((resolve, reject) => {
            this.setState({value}, resolve);
        });
    }
}
