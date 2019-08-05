import React, { Component } from 'react';

export const withElementWithIdDimensions = (WrappedComponent, id) => {
    return class extends Component {
        state = { width: 0, height: 0 };

        componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener("resize", this.updateWindowDimensions);
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.updateWindowDimensions);
        }

        updateWindowDimensions = () => {
            const obj = document.getElementById(id);
            this.setState({ width: obj.offsetWidth, height: obj.offsetHeight });
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    objWidth={this.state.width}
                    objHeight={this.state.height}
                />
            );
        }
    };
}